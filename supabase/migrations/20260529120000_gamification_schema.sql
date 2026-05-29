-- ============================================================================
-- Lumio Phase B/C schema
-- Mastery / placement checks + points + badges (the gamification tiers that sit
-- BELOW the existing paid cert credential).
--
-- Project: gqdazzlqayejqatwxhlz  (apply in the Supabase SQL editor).
-- Run AFTER 20260528120000_phase2_schema.sql.
--
-- Design notes:
--   * Integrity lives in the database. Answer keys, point grants, mastery
--     records, and badge awards are written only through SECURITY DEFINER
--     functions + triggers (the same pattern as verify_credential and the
--     service-role cert issuance). Clients read their own rows and call RPCs;
--     they cannot self-grant points/badges or read answer keys.
--   * One funnel for completion: whether a lesson is finished normally or cleared
--     via a check, it lands as a single user_progress row, and the AFTER INSERT
--     trigger there is the single place lesson points + badges fire. That is the
--     no-double-count guarantee (points key on lesson id, inserted once).
--
-- Conventions (inherited from phase 2):
--   * Primary keys are uuid (gen_random_uuid()); content ids are deterministic
--     uuid v5 derived in scripts/ so seeds upsert cleanly.
--   * "Enum" columns are text + CHECK.
--   * RLS: public read for published content, own-row for user data, privileged
--     functions for anything that issues value.
--   * No em dashes in user-facing copy.
-- ============================================================================

-- set_updated_at() already exists from the phase 2 migration; re-declared here
-- so this file is safe to run on its own.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Idempotent re-run support: drop functions/tables this migration owns, child
-- first. Content tables and user tables are all recreated below.
drop function if exists public.submit_mastery_check(uuid, jsonb)        cascade;
drop function if exists public.get_mastery_check(uuid)                  cascade;
drop function if exists public.user_mastered_lessons(uuid)             cascade;
drop function if exists public.evaluate_badges(uuid)                    cascade;
drop function if exists public.record_activity()                       cascade;
drop function if exists public.get_leaderboard(int)                     cascade;
drop function if exists public.award_lesson_points()                    cascade;
drop function if exists public.apply_points_to_stats()                  cascade;

drop trigger if exists user_progress_award_points on public.user_progress;

drop table if exists public.user_badges            cascade;
drop table if exists public.badge_definitions      cascade;
drop table if exists public.user_stats             cascade;
drop table if exists public.points_ledger          cascade;
drop table if exists public.user_mastery           cascade;
drop table if exists public.mastery_check_questions cascade;
drop table if exists public.mastery_checks         cascade;

-- ============================================================================
-- GROUP A — MASTERY CHECK CONTENT (authored, public-readable metadata)
-- ============================================================================

-- A check tests OUT of a lesson, a module, or a difficulty level. Passing marks
-- the covered content mastered: it leaves the active path, counts as complete,
-- and earns the full lesson points.
create table public.mastery_checks (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  scope          text not null check (scope in ('lesson','module','level')),
  lesson_id      uuid references public.lessons(id) on delete cascade,
  module_id      uuid references public.modules(id) on delete cascade,
  level          text check (level in ('beginner','growing','confident')),
  title          text not null,
  description    text,
  question_count int  not null default 5,
  pass_threshold numeric not null default 0.8 check (pass_threshold > 0 and pass_threshold <= 1),
  cooldown_hours int  not null default 24,
  status         text not null default 'draft'
                   check (status in ('draft','published','archived')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- exactly one target, matching the scope
  check (
    (scope = 'lesson' and lesson_id is not null and module_id is null and level is null) or
    (scope = 'module' and module_id is not null and lesson_id is null and level is null) or
    (scope = 'level'  and level     is not null and lesson_id is null and module_id is null)
  )
);

create index mastery_checks_status_idx on public.mastery_checks (status);
create index mastery_checks_module_idx on public.mastery_checks (module_id);

create trigger mastery_checks_set_updated_at
  before update on public.mastery_checks
  for each row execute function public.set_updated_at();

-- Questions carry the answer key in `content`. This table is NOT client-readable
-- (no select policy); questions reach the client only through get_mastery_check,
-- which strips the key. Same shapes as lesson_blocks multiple_choice/fill_blank.
create table public.mastery_check_questions (
  id              uuid primary key default gen_random_uuid(),
  check_id        uuid not null references public.mastery_checks(id) on delete cascade,
  order_index     int  not null default 0,
  type            text not null check (type in ('multiple_choice','fill_blank')),
  content         jsonb not null,
  source_block_id uuid references public.lesson_blocks(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index mastery_check_questions_check_order_idx
  on public.mastery_check_questions (check_id, order_index);

create trigger mastery_check_questions_set_updated_at
  before update on public.mastery_check_questions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- GROUP B — MASTERY RECORDS (one row per user per check)
-- ============================================================================

create table public.user_mastery (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  check_id        uuid not null references public.mastery_checks(id) on delete cascade,
  -- denormalized target so user_mastered_lessons() resolves without re-joining
  scope           text not null check (scope in ('lesson','module','level')),
  lesson_id       uuid references public.lessons(id) on delete cascade,
  module_id       uuid references public.modules(id) on delete cascade,
  level           text check (level in ('beginner','growing','confident')),
  attempts        int  not null default 0,
  best_score      numeric not null default 0,
  passed          boolean not null default false,
  passed_at       timestamptz,
  last_attempt_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, check_id)
);

create index user_mastery_user_idx        on public.user_mastery (user_id);
create index user_mastery_user_passed_idx on public.user_mastery (user_id, passed);

create trigger user_mastery_set_updated_at
  before update on public.user_mastery
  for each row execute function public.set_updated_at();

-- ============================================================================
-- GROUP C — POINTS (append-only ledger = truth; user_stats = fast counter)
-- ============================================================================

create table public.points_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  delta      int  not null,
  reason     text not null check (reason in
               ('lesson_complete','mastery_ace_bonus','streak_milestone',
                'badge_award','daily_active')),
  -- idempotency anchor, e.g. 'lesson_complete:<lesson_uuid>',
  -- 'mastery_ace_bonus:<check_uuid>', 'daily_active:2026-05-29',
  -- 'badge_award:<badge_uuid>'. Re-completing the same content inserts nothing.
  dedupe_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);

create index points_ledger_user_idx on public.points_ledger (user_id);

create table public.user_stats (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  total_points        int  not null default 0,
  current_streak_days int  not null default 0,
  longest_streak_days int  not null default 0,
  last_activity_date  date,
  updated_at          timestamptz not null default now()
);

create trigger user_stats_set_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

-- ============================================================================
-- GROUP D — BADGES (definitions = content; user_badges = awards)
-- ============================================================================

create table public.badge_definitions (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  description    text not null,
  icon           text not null default 'award',  -- lucide icon name
  tier           text check (tier in ('bronze','silver','gold')),
  criteria_type  text not null check (criteria_type in
                   ('lessons_completed_total','module_completed',
                    'module_mastered_via_check','check_aced','streak_days',
                    'lessons_completed_in_day','lessons_in_distinct_modules',
                    'total_points','cert_earned')),
  criteria_config jsonb not null default '{}'::jsonb,
  points_reward  int  not null default 0,
  sort_order     int  not null default 0,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index badge_definitions_published_idx on public.badge_definitions (is_published, sort_order);

create trigger badge_definitions_set_updated_at
  before update on public.badge_definitions
  for each row execute function public.set_updated_at();

create table public.user_badges (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  badge_id   uuid not null references public.badge_definitions(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  context    jsonb,
  unique (user_id, badge_id)
);

create index user_badges_user_idx on public.user_badges (user_id);

-- ============================================================================
-- GROUP E — POINTS PLUMBING (triggers, both SECURITY DEFINER)
-- ============================================================================

-- Keep the denormalized counter in sync with the ledger. Definer so the ledger's
-- own insert path (which runs in various contexts) can always touch user_stats.
create or replace function public.apply_points_to_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_stats (user_id, total_points)
  values (new.user_id, new.delta)
  on conflict (user_id) do update
    set total_points = public.user_stats.total_points + new.delta,
        updated_at   = now();
  return new;
end;
$$;

create trigger points_ledger_apply_to_stats
  after insert on public.points_ledger
  for each row execute function public.apply_points_to_stats();

-- The single place lesson points + badges fire. Fires for BOTH a normal client
-- completion (own-row insert allowed by RLS) and a mastery-driven insert, so a
-- lesson is worth its 100 points exactly once (deduped on the lesson id).
-- Definer so it can write points_ledger / user_badges, which deny client writes.
create or replace function public.award_lesson_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.completed then
    insert into public.points_ledger (user_id, delta, reason, dedupe_key)
    values (new.user_id, 100, 'lesson_complete', 'lesson_complete:' || new.lesson_id)
    on conflict (user_id, dedupe_key) do nothing;

    perform public.evaluate_badges(new.user_id);
  end if;
  return new;
end;
$$;

create trigger user_progress_award_points
  after insert on public.user_progress
  for each row execute function public.award_lesson_points();

-- ============================================================================
-- GROUP F — BADGE EVALUATION (idempotent, returns newly awarded slugs)
-- ============================================================================

create or replace function public.evaluate_badges(p_user uuid)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  rec     record;
  v_cfg   jsonb;
  v_earned boolean;
  v_new   text[] := '{}';
begin
  for rec in
    select * from public.badge_definitions
    where is_published
    -- points-threshold badges last, so a badge_award in this same pass can count
    order by case when criteria_type = 'total_points' then 1 else 0 end, sort_order
  loop
    if exists (select 1 from public.user_badges ub
               where ub.user_id = p_user and ub.badge_id = rec.id) then
      continue;
    end if;

    v_cfg    := rec.criteria_config;
    v_earned := false;

    if rec.criteria_type = 'lessons_completed_total' then
      v_earned := (select count(*) from public.user_progress
                   where user_id = p_user and completed)
                  >= coalesce((v_cfg->>'count')::int, 1);

    elsif rec.criteria_type = 'module_completed' then
      v_earned :=
        exists (select 1 from public.lessons l
                join public.modules m on m.id = l.module_id
                where m.slug = v_cfg->>'module_slug' and l.status = 'published')
        and not exists (
          select 1 from public.lessons l
          join public.modules m on m.id = l.module_id
          where m.slug = v_cfg->>'module_slug' and l.status = 'published'
            and not exists (
              select 1 from public.user_progress up
              where up.user_id = p_user and up.lesson_id = l.id and up.completed));

    elsif rec.criteria_type = 'module_mastered_via_check' then
      v_earned := exists (select 1 from public.user_mastery um
                          where um.user_id = p_user and um.passed and um.scope = 'module');

    elsif rec.criteria_type = 'check_aced' then
      v_earned := exists (select 1 from public.user_mastery um
                          where um.user_id = p_user and um.passed and um.best_score >= 1.0);

    elsif rec.criteria_type = 'streak_days' then
      v_earned := coalesce(
                    (select greatest(current_streak_days, longest_streak_days)
                     from public.user_stats where user_id = p_user), 0)
                  >= coalesce((v_cfg->>'days')::int, 1);

    elsif rec.criteria_type = 'lessons_completed_in_day' then
      v_earned := exists (
        select 1 from public.user_progress
        where user_id = p_user and completed
        group by (completed_at at time zone 'UTC')::date
        having count(*) >= coalesce((v_cfg->>'count')::int, 1));

    elsif rec.criteria_type = 'lessons_in_distinct_modules' then
      v_earned := (select count(distinct l.module_id)
                   from public.user_progress up
                   join public.lessons l on l.id = up.lesson_id
                   where up.user_id = p_user and up.completed)
                  >= coalesce((v_cfg->>'count')::int, 1);

    elsif rec.criteria_type = 'total_points' then
      v_earned := coalesce((select total_points from public.user_stats
                            where user_id = p_user), 0)
                  >= coalesce((v_cfg->>'points')::int, 1);

    elsif rec.criteria_type = 'cert_earned' then
      v_earned := exists (select 1 from public.user_certs uc
                          where uc.user_id = p_user and uc.completed_at is not null);
    end if;

    if v_earned then
      insert into public.user_badges (user_id, badge_id)
      values (p_user, rec.id)
      on conflict (user_id, badge_id) do nothing;

      if rec.points_reward > 0 then
        insert into public.points_ledger (user_id, delta, reason, dedupe_key)
        values (p_user, rec.points_reward, 'badge_award', 'badge_award:' || rec.id)
        on conflict (user_id, dedupe_key) do nothing;
      end if;

      v_new := array_append(v_new, rec.slug);
    end if;
  end loop;

  return v_new;
end;
$$;

grant execute on function public.evaluate_badges(uuid) to authenticated;

-- ============================================================================
-- GROUP G — STREAK / ACTIVITY (called on lesson open or complete)
-- ============================================================================

-- Scoped to auth.uid() (never a client-supplied id) so a streak cannot be
-- spoofed. Awards a small daily-active drip and re-evaluates badges.
create or replace function public.record_activity()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_today date := (now() at time zone 'UTC')::date;
  v_last  date;
  v_cur   int;
  v_long  int;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_stats (user_id, current_streak_days, longest_streak_days, last_activity_date)
  values (v_uid, 1, 1, v_today)
  on conflict (user_id) do nothing;

  select last_activity_date, current_streak_days, longest_streak_days
    into v_last, v_cur, v_long
  from public.user_stats where user_id = v_uid;

  if v_last is null then
    v_cur := 1;
  elsif v_last = v_today then
    null;                       -- already counted today
  elsif v_last = v_today - 1 then
    v_cur := v_cur + 1;         -- consecutive day
  else
    v_cur := 1;                 -- streak broken
  end if;

  v_long := greatest(coalesce(v_long, 0), v_cur);

  update public.user_stats
     set current_streak_days = v_cur,
         longest_streak_days  = v_long,
         last_activity_date   = v_today,
         updated_at           = now()
   where user_id = v_uid;

  -- daily-active drip, idempotent per calendar day
  insert into public.points_ledger (user_id, delta, reason, dedupe_key)
  values (v_uid, 10, 'daily_active', 'daily_active:' || v_today)
  on conflict (user_id, dedupe_key) do nothing;

  perform public.evaluate_badges(v_uid);

  return jsonb_build_object('current_streak_days', v_cur, 'longest_streak_days', v_long);
end;
$$;

grant execute on function public.record_activity() to authenticated;

-- ============================================================================
-- GROUP H — RULES_V1 SEAM: resolve the mastered lesson-id set
-- ============================================================================

-- Dynamic resolver (per the approved decision): module/level mastery expands to
-- whatever published lessons currently belong to that module/level, so lessons
-- added later are covered without a backfill. rules_v1 unions this with
-- user_progress to build: active = pool minus (completed union mastered).
--
-- Guard: service role (auth.uid() is null) may resolve any user; an
-- authenticated caller may resolve only their own id.
create or replace function public.user_mastered_lessons(p_user uuid)
returns table (lesson_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select distinct l.id
  from public.user_mastery um
  join public.lessons l on (
        (um.scope = 'lesson' and l.id        = um.lesson_id) or
        (um.scope = 'module' and l.module_id = um.module_id and l.status = 'published') or
        (um.scope = 'level'  and l.level     = um.level     and l.status = 'published')
  )
  where um.user_id = p_user
    and um.passed
    and (auth.uid() is null or auth.uid() = p_user);
$$;

grant execute on function public.user_mastered_lessons(uuid) to authenticated, service_role;

-- ============================================================================
-- GROUP I — SERVE A CHECK WITHOUT LEAKING THE ANSWER KEY
-- ============================================================================

create or replace function public.get_mastery_check(p_check_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_check public.mastery_checks%rowtype;
  v_questions jsonb;
  v_passed boolean := false;
  v_attempts int := 0;
  v_locked timestamptz := null;
  v_last timestamptz;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_check from public.mastery_checks
  where id = p_check_id and status = 'published';
  if not found then
    return null;
  end if;

  -- questions with the answer key stripped
  select jsonb_agg(q order by q_order) into v_questions
  from (
    select
      mcq.order_index as q_order,
      jsonb_build_object(
        'id', mcq.id,
        'type', mcq.type,
        'content',
        case mcq.type
          when 'multiple_choice' then jsonb_build_object(
            'stem', mcq.content->'stem',
            'options', (
              select jsonb_agg(jsonb_build_object('id', o->'id', 'label', o->'label')
                               order by ord)
              from jsonb_array_elements(mcq.content->'options') with ordinality as t(o, ord)))
          when 'fill_blank' then jsonb_build_object(
            'template', mcq.content->'template',
            'blanks', (
              select jsonb_agg(jsonb_build_object('id', b->'id') order by ord)
              from jsonb_array_elements(mcq.content->'blanks') with ordinality as t(b, ord)))
          else '{}'::jsonb
        end
      ) as q
    from public.mastery_check_questions mcq
    where mcq.check_id = p_check_id
  ) sub;

  select um.passed, um.attempts, um.last_attempt_at
    into v_passed, v_attempts, v_last
  from public.user_mastery um
  where um.user_id = v_uid and um.check_id = p_check_id;

  if v_last is not null and not coalesce(v_passed, false) then
    v_locked := v_last + (v_check.cooldown_hours || ' hours')::interval;
    if v_locked <= now() then v_locked := null; end if;
  end if;

  return jsonb_build_object(
    'check', jsonb_build_object(
      'id', v_check.id,
      'slug', v_check.slug,
      'scope', v_check.scope,
      'title', v_check.title,
      'description', v_check.description,
      'pass_threshold', v_check.pass_threshold,
      'question_count', v_check.question_count
    ),
    'questions', coalesce(v_questions, '[]'::jsonb),
    'status', jsonb_build_object(
      'already_passed', coalesce(v_passed, false),
      'attempts', coalesce(v_attempts, 0),
      'locked_until', v_locked
    )
  );
end;
$$;

grant execute on function public.get_mastery_check(uuid) to authenticated;

-- ============================================================================
-- GROUP J — GRADE + WRITE MASTERY (the only way to pass)
-- ============================================================================

-- Response contract (p_responses keyed by question id as text):
--   multiple_choice -> "<option_id>"                (a JSON string)
--   fill_blank      -> { "<blank_id>": "user text" } (a JSON object)
-- Grading: MCQ correct when the chosen option has is_correct = true; fill_blank
-- correct when every blank contains (case-insensitive) one of its accept terms.
create or replace function public.submit_mastery_check(p_check_id uuid, p_responses jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_check   public.mastery_checks%rowtype;
  v_m       public.user_mastery%rowtype;
  q         record;
  v_total   int := 0;
  v_correct int := 0;
  v_ans     jsonb;
  v_sel     text;
  v_blank   jsonb;
  v_user_txt text;
  v_acc     jsonb;
  v_blank_ok boolean;
  v_q_ok    boolean;
  v_score   numeric;
  v_passed  boolean;
  v_cleared int := 0;
  v_badges  text[] := '{}';
  v_locked  timestamptz;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_check from public.mastery_checks
  where id = p_check_id and status = 'published';
  if not found then
    raise exception 'check not found or not published';
  end if;

  select * into v_m from public.user_mastery
  where user_id = v_uid and check_id = p_check_id;

  if found and v_m.passed then
    return jsonb_build_object('passed', true, 'already_passed', true,
                              'score', v_m.best_score);
  end if;

  -- cooldown
  if found and v_m.last_attempt_at is not null then
    v_locked := v_m.last_attempt_at + (v_check.cooldown_hours || ' hours')::interval;
    if v_locked > now() then
      return jsonb_build_object('passed', false, 'locked', true, 'locked_until', v_locked);
    end if;
  end if;

  -- grade
  for q in
    select id, type, content from public.mastery_check_questions
    where check_id = p_check_id
  loop
    v_total := v_total + 1;
    v_ans := p_responses -> (q.id::text);

    if q.type = 'multiple_choice' then
      v_sel := v_ans #>> '{}';   -- unwrap the JSON string into text
      if v_sel is not null and exists (
        select 1 from jsonb_array_elements(q.content->'options') o
        where (o->>'id') = v_sel and coalesce((o->>'is_correct')::boolean, false)
      ) then
        v_correct := v_correct + 1;
      end if;

    elsif q.type = 'fill_blank' then
      v_q_ok := true;
      for v_blank in select * from jsonb_array_elements(q.content->'blanks')
      loop
        v_user_txt := coalesce(v_ans ->> (v_blank->>'id'), '');
        v_blank_ok := false;
        for v_acc in select * from jsonb_array_elements(v_blank->'accept')
        loop
          if length(trim(both '"' from v_acc::text)) > 0
             and position(lower(v_acc #>> '{}') in lower(v_user_txt)) > 0 then
            v_blank_ok := true;
            exit;
          end if;
        end loop;
        if not v_blank_ok then
          v_q_ok := false;
          exit;
        end if;
      end loop;
      if v_q_ok then
        v_correct := v_correct + 1;
      end if;
    end if;
  end loop;

  if v_total = 0 then
    raise exception 'check has no questions';
  end if;

  v_score  := round(v_correct::numeric / v_total, 4);
  v_passed := v_score >= v_check.pass_threshold;

  -- upsert the mastery record
  insert into public.user_mastery
    (user_id, check_id, scope, lesson_id, module_id, level,
     attempts, best_score, passed, passed_at, last_attempt_at)
  values
    (v_uid, p_check_id, v_check.scope, v_check.lesson_id, v_check.module_id, v_check.level,
     1, v_score, v_passed, case when v_passed then now() end, now())
  on conflict (user_id, check_id) do update set
    attempts        = public.user_mastery.attempts + 1,
    best_score      = greatest(public.user_mastery.best_score, excluded.best_score),
    passed          = public.user_mastery.passed or excluded.passed,
    passed_at       = coalesce(public.user_mastery.passed_at, case when excluded.passed then now() end),
    last_attempt_at = now();

  if v_passed then
    -- completion credit for every covered lesson; the user_progress AFTER INSERT
    -- trigger awards the 100 lesson points each (deduped) and evaluates badges.
    insert into public.user_progress (user_id, lesson_id)
    select v_uid, l.id from public.lessons l
    where (v_check.scope = 'lesson' and l.id = v_check.lesson_id)
       or (v_check.scope = 'module' and l.module_id = v_check.module_id and l.status = 'published')
       or (v_check.scope = 'level'  and l.level     = v_check.level     and l.status = 'published')
    on conflict (user_id, lesson_id) do nothing;
    get diagnostics v_cleared = row_count;

    -- ace bonus: full marks earns the skip with extra status
    if v_score >= 1.0 then
      insert into public.points_ledger (user_id, delta, reason, dedupe_key)
      values (v_uid, 50, 'mastery_ace_bonus', 'mastery_ace_bonus:' || p_check_id)
      on conflict (user_id, dedupe_key) do nothing;
    end if;

    v_badges := public.evaluate_badges(v_uid);
  end if;

  return jsonb_build_object(
    'passed', v_passed,
    'already_passed', false,
    'score', v_score,
    'correct', v_correct,
    'total', v_total,
    'lessons_cleared', v_cleared,
    'points_awarded', (v_cleared * 100) + case when v_passed and v_score >= 1.0 then 50 else 0 end,
    'badges_unlocked', to_jsonb(v_badges)
  );
end;
$$;

grant execute on function public.submit_mastery_check(uuid, jsonb) to authenticated;

-- ============================================================================
-- GROUP K — LEADERBOARD (RPC only; no UI yet, per the build plan)
-- ============================================================================

-- Cross-user read needs a privileged function (RLS scopes user_stats to own
-- row). Honors profiles.display_anonymous exactly like verify_credential.
create or replace function public.get_leaderboard(p_limit int default 20)
returns table (display_name text, total_points int, rank bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    case when p.display_anonymous then 'Anonymous'
         else coalesce(nullif(trim(p.full_name), ''), 'Learner') end as display_name,
    us.total_points,
    rank() over (order by us.total_points desc) as rank
  from public.user_stats us
  join public.profiles p on p.id = us.user_id
  where us.total_points > 0
  order by us.total_points desc
  limit greatest(1, least(p_limit, 100));
$$;

grant execute on function public.get_leaderboard(int) to authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.mastery_checks          enable row level security;
alter table public.mastery_check_questions enable row level security;
alter table public.user_mastery            enable row level security;
alter table public.points_ledger           enable row level security;
alter table public.user_stats              enable row level security;
alter table public.badge_definitions       enable row level security;
alter table public.user_badges             enable row level security;

-- ---------- public-readable published content ----------
create policy "published checks are public"
  on public.mastery_checks for select to anon, authenticated
  using (status = 'published');

create policy "published badges are public"
  on public.badge_definitions for select to anon, authenticated
  using (is_published = true);

-- mastery_check_questions: intentionally NO select policy. RLS cannot restrict
-- columns, and these rows carry the answer key, so they are reachable only
-- through get_mastery_check (which strips the key) and submit_mastery_check.

-- ---------- own-row user data (read only; all writes via SECURITY DEFINER) ----
create policy "read own mastery"
  on public.user_mastery for select to authenticated using (auth.uid() = user_id);

create policy "read own points"
  on public.points_ledger for select to authenticated using (auth.uid() = user_id);

create policy "read own stats"
  on public.user_stats for select to authenticated using (auth.uid() = user_id);

create policy "read own badges"
  on public.user_badges for select to authenticated using (auth.uid() = user_id);

-- (No authenticated insert/update/delete on user_mastery, points_ledger,
--  user_stats, or user_badges: mastery, points, streaks, and badges are issued
--  by submit_mastery_check / record_activity / the user_progress trigger, all
--  SECURITY DEFINER. This mirrors the cert tier, where value-bearing writes are
--  privileged operations rather than client self-claims.)
