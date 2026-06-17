-- ============================================================================
-- Lumio analytics computation layer — admin-email-gated RPCs.
--
-- These are the SECURITY DEFINER functions read by the /admin Analytics tab.
-- They are NOT plain views: each one reads ACROSS ALL USERS (retention cohorts,
-- engagement scoring, cert funnels, data-asset health), so they must bypass RLS
-- and be locked behind the admin email guard — exactly the pattern in
-- 20260615120000_admin_rpcs.sql. Every function starts by checking that the
-- caller is the admin; any other caller gets a plain "Forbidden", not data.
--
-- Each returns jsonb, each is granted to `authenticated` (the guard, not the
-- grant, is the security boundary), and each uses coalesce so empty tables
-- return '[]'::jsonb or zeros — never null.
--
-- EXPECTED EMPTINESS: several of these read as empty/zero until real traffic
-- exists. admin_confusion_map() in particular stays empty until the in-app AI
-- tutor ships and starts writing tutor_interactions rows. admin_top_events()
-- and the engagement/retention functions read empty until analytics_events,
-- user_sessions, and user_progress accumulate data. That is by design.
--
-- Reads from: profiles, analytics_events, user_progress, user_sessions,
-- tutor_interactions, user_certs, certs, lessons, modules.
-- Source migrations: 20260528120000_phase2_schema.sql (curriculum/progress/
-- certs), 20260617120000_data_capture.sql (sessions/events/tutor + firmographics).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. admin_retention_cohorts()
-- For each signup week (date_trunc('week', profiles.created_at)): the cohort
-- size, and how many of those users showed ANY activity (an analytics_events
-- row OR a user_progress row) at least 1 / 7 / 30 days after they signed up.
-- "≥ N days after created_at" is read as activity occurring on or after
-- created_at + N days (a user retained at D30 is also counted at D7 and D1 only
-- if they also have qualifying activity in those windows — each bucket is an
-- independent "any activity at or beyond this horizon" test).
-- Returns a jsonb array, most-recent weeks first.
-- ----------------------------------------------------------------------------
create or replace function public.admin_retention_cohorts()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return (
    select coalesce(
      jsonb_agg(row_to_json(r) order by r.cohort_week desc),
      '[]'::jsonb
    )
    from (
      with signups as (
        select
          p.id                                   as user_id,
          p.created_at                           as signed_up_at,
          date_trunc('week', p.created_at)::date as cohort_week
        from public.profiles p
      ),
      -- The latest activity timestamp per user across either signal.
      activity as (
        select user_id, created_at as activity_at
        from public.analytics_events
        union all
        select user_id, completed_at as activity_at
        from public.user_progress
      ),
      per_user as (
        select
          s.user_id,
          s.cohort_week,
          -- did this user have ANY activity at/after each horizon?
          bool_or(a.activity_at >= s.signed_up_at + interval '1 day')  as d1,
          bool_or(a.activity_at >= s.signed_up_at + interval '7 days') as d7,
          bool_or(a.activity_at >= s.signed_up_at + interval '30 days') as d30
        from signups s
        left join activity a on a.user_id = s.user_id
        group by s.user_id, s.cohort_week
      )
      select
        pu.cohort_week,
        count(*)                                              as cohort_size,
        coalesce(count(*) filter (where pu.d1),  0)           as retained_d1,
        coalesce(count(*) filter (where pu.d7),  0)           as retained_d7,
        coalesce(count(*) filter (where pu.d30), 0)           as retained_d30
      from per_user pu
      group by pu.cohort_week
    ) r
  );
end;
$function$;

-- ----------------------------------------------------------------------------
-- 2. admin_engagement_distribution()
-- A 0–10 engagement score per user over the LAST 14 DAYS, bucketed into
-- at-risk (0–3), active (4–6), and power (7–10).
--
-- Rubric (max 10):
--   sessions count:        0 -> 0,  1 -> 1,  2–3 -> 2,  4+ -> 3
--   avg session duration:  <5min -> 0,  5–15 -> 1,  15–30 -> 2,  30+ -> 3
--   lessons completed:     0 -> 0,  1–2 -> 1,  3–5 -> 2,  6+ -> 3
--   any tutor interaction: -> 1
--
-- Only users with profiles are scored; a user with no activity scores 0 and
-- lands in the at-risk bucket. Returns a jsonb OBJECT with the three counts.
-- ----------------------------------------------------------------------------
create or replace function public.admin_engagement_distribution()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_window_start timestamptz := now() - interval '14 days';
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return (
    with scored as (
      select
        p.id as user_id,
        -- sessions in window
        (select count(*)
           from public.user_sessions s
          where s.user_id = p.id and s.started_at >= v_window_start) as sessions_n,
        -- avg session duration (minutes) in window
        (select avg(s.duration_seconds) / 60.0
           from public.user_sessions s
          where s.user_id = p.id and s.started_at >= v_window_start) as avg_min,
        -- lessons completed in window
        (select count(*)
           from public.user_progress up
          where up.user_id = p.id and up.completed_at >= v_window_start) as lessons_n,
        -- any tutor interaction in window
        exists (select 1
                  from public.tutor_interactions t
                 where t.user_id = p.id and t.created_at >= v_window_start) as had_tutor
      from public.profiles p
    ),
    points as (
      select
        user_id,
        ( case when sessions_n >= 4 then 3
               when sessions_n in (2, 3) then 2
               when sessions_n = 1 then 1
               else 0 end
        + case when avg_min is null then 0
               when avg_min >= 30 then 3
               when avg_min >= 15 then 2
               when avg_min >= 5  then 1
               else 0 end
        + case when lessons_n >= 6 then 3
               when lessons_n between 3 and 5 then 2
               when lessons_n between 1 and 2 then 1
               else 0 end
        + case when had_tutor then 1 else 0 end
        ) as score
      from scored
    )
    select jsonb_build_object(
      'at_risk', coalesce(count(*) filter (where score between 0 and 3), 0),
      'active',  coalesce(count(*) filter (where score between 4 and 6), 0),
      'power',   coalesce(count(*) filter (where score between 7 and 10), 0),
      'total',   coalesce(count(*), 0)
    )
    from points
  );
end;
$function$;

-- ----------------------------------------------------------------------------
-- 3. admin_cert_funnel()
-- Per cert: enrolled count, paid count (paid_at not null), completed count
-- (completed_at not null), and average days from enrolled_at to completed_at
-- (only over completed enrollments). Joined to certs for the display name.
-- Returns a jsonb array. Certs with zero enrollments still appear (left join).
-- ----------------------------------------------------------------------------
create or replace function public.admin_cert_funnel()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return (
    select coalesce(
      jsonb_agg(row_to_json(r) order by r.enrolled desc, r.cert_name asc),
      '[]'::jsonb
    )
    from (
      select
        c.id                                       as cert_id,
        c.slug                                     as cert_slug,
        c.name                                     as cert_name,
        coalesce(count(uc.id), 0)                  as enrolled,
        coalesce(count(uc.paid_at), 0)             as paid,
        coalesce(count(uc.completed_at), 0)        as completed,
        coalesce(
          round(
            avg(extract(epoch from (uc.completed_at - uc.enrolled_at)) / 86400.0)
              filter (where uc.completed_at is not null)
          , 1),
          0
        )                                          as avg_days_to_complete
      from public.certs c
      left join public.user_certs uc on uc.cert_id = c.id
      group by c.id, c.slug, c.name
    ) r
  );
end;
$function$;

-- ----------------------------------------------------------------------------
-- 4. admin_data_asset_health()
-- The "are we sellable yet" panel: one jsonb object of the data-asset metrics
-- that matter for the eventual B2B/data play, each paired with its target.
--
--   total_identified_users : profiles with company_name OR industry not null
--   users_per_industry     : jsonb object  industry -> count  (non-null only)
--   consented_users        : profiles with data_consent_at not null
--   tutor_queries_logged   : count of tutor_interactions
--   avg_session_minutes    : avg(duration_seconds)/60 over user_sessions
--
-- Targets: identified 2000, per-industry 200, tutor_queries 5000, avg_session 12.
-- ----------------------------------------------------------------------------
create or replace function public.admin_data_asset_health()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_identified  integer;
  v_consented   integer;
  v_tutor       integer;
  v_avg_session numeric;
  v_per_industry jsonb;
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  select coalesce(count(*) filter (where company_name is not null or industry is not null), 0),
         coalesce(count(*) filter (where data_consent_at is not null), 0)
    into v_identified, v_consented
    from public.profiles;

  select coalesce(count(*), 0) into v_tutor from public.tutor_interactions;

  select coalesce(round(avg(duration_seconds) / 60.0, 1), 0)
    into v_avg_session
    from public.user_sessions;

  -- industry -> count, skipping null/blank industries; '{}' when none.
  select coalesce(jsonb_object_agg(industry, cnt), '{}'::jsonb)
    into v_per_industry
    from (
      select industry, count(*) as cnt
      from public.profiles
      where industry is not null and industry <> ''
      group by industry
    ) g;

  return jsonb_build_object(
    'total_identified_users', v_identified,
    'users_per_industry',     v_per_industry,
    'consented_users',        v_consented,
    'tutor_queries_logged',   v_tutor,
    'avg_session_minutes',    v_avg_session,
    'targets', jsonb_build_object(
      'total_identified_users', 2000,
      'users_per_industry',     200,
      'tutor_queries_logged',   5000,
      'avg_session_minutes',    12
    )
  );
end;
$function$;

-- ----------------------------------------------------------------------------
-- 5. admin_confusion_map()
-- Top lessons by tutor-interaction volume + avg iteration_count, joined to the
-- lesson title and its module title. This is the "where do learners get stuck"
-- map. EXPECTED EMPTY until the in-app AI tutor ships and writes
-- tutor_interactions rows — that is fine, it still returns '[]'::jsonb.
-- ----------------------------------------------------------------------------
create or replace function public.admin_confusion_map()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return (
    select coalesce(
      jsonb_agg(row_to_json(r) order by r.interactions desc, r.avg_iterations desc),
      '[]'::jsonb
    )
    from (
      select
        l.id                                   as lesson_id,
        l.title                                as lesson_title,
        m.id                                   as module_id,
        m.title                                as module_title,
        count(t.id)                            as interactions,
        coalesce(round(avg(t.iteration_count), 2), 0) as avg_iterations
      from public.tutor_interactions t
      join public.lessons l on l.id = t.lesson_id
      join public.modules m on m.id = l.module_id
      group by l.id, l.title, m.id, m.title
    ) r
  );
end;
$function$;

-- ----------------------------------------------------------------------------
-- 6. admin_top_events()
-- analytics_events counts grouped by event_type over the last 30 days,
-- busiest first. Returns a jsonb array.
-- ----------------------------------------------------------------------------
create or replace function public.admin_top_events()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return (
    select coalesce(
      jsonb_agg(row_to_json(r) order by r.event_count desc, r.event_type asc),
      '[]'::jsonb
    )
    from (
      select
        e.event_type,
        count(*) as event_count
      from public.analytics_events e
      where e.created_at >= now() - interval '30 days'
      group by e.event_type
    ) r
  );
end;
$function$;

-- ============================================================================
-- GRANTS — execute to authenticated. The admin-email guard inside each function
-- is the real boundary; the grant only lets a logged-in session reach the guard.
-- ============================================================================
grant execute on function public.admin_retention_cohorts()      to authenticated;
grant execute on function public.admin_engagement_distribution() to authenticated;
grant execute on function public.admin_cert_funnel()            to authenticated;
grant execute on function public.admin_data_asset_health()      to authenticated;
grant execute on function public.admin_confusion_map()          to authenticated;
grant execute on function public.admin_top_events()             to authenticated;
