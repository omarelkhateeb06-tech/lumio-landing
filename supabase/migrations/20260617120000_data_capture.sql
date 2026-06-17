-- ============================================================================
-- Lumio data-capture layer — day-1 collection infrastructure.
--
-- Adds the identity, behavioral, AI-query, and consent capture that CANNOT be
-- backfilled later. Analytics + scoring read this through the service role (and
-- the views in the companion migration). Additive only — safe on the live DB.
--
-- Conventions follow 20260528120000_phase2_schema.sql: uuid PKs, text + CHECK
-- "enums", own-row RLS for user data (the service role bypasses RLS for
-- analytics reads), shared set_updated_at trigger.
-- ============================================================================

-- ---------- GROUP A — identity + consent (profiles columns) ----------
-- These are the can't-backfill signup fields. ai_usage/skill_level already exist
-- and cover the AI-familiarity baseline; this adds company/firmographics,
-- attribution, referral linkage, and the data-use consent stamp.
alter table public.profiles
  add column if not exists company_name         text,
  add column if not exists company_size         text
    check (company_size is null or company_size in ('1-10','11-50','51-200','201-1000','1000+')),
  add column if not exists years_experience     text
    check (years_experience is null or years_experience in ('0-2','3-7','8-15','15+')),
  add column if not exists found_via            text
    check (found_via is null or found_via in
      ('youtube','linkedin','reddit','twitter','search','friend','referral','other')),
  add column if not exists referral_code        text unique,
  add column if not exists referred_by_code     text,
  add column if not exists data_consent_at      timestamptz,
  add column if not exists data_consent_version text;

create index if not exists profiles_industry_idx    on public.profiles (industry);
create index if not exists profiles_found_via_idx    on public.profiles (found_via);
create index if not exists profiles_referred_by_idx  on public.profiles (referred_by_code);

-- ---------- GROUP B — sessions (Layer 2) ----------
create table if not exists public.user_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  duration_seconds int,
  source           text,   -- email | direct | notification | referral | ...
  entry_path       text,
  user_agent       text,
  created_at       timestamptz not null default now()
);

create index if not exists user_sessions_user_idx on public.user_sessions (user_id, started_at desc);

-- ---------- GROUP C — generic behavioral event log (Layers 2 / 4 / 5) ----------
-- One flexible table instead of a table per metric. event_type drives meaning:
--   module_entered, module_exit, module_replayed, lesson_completed,
--   cert_started, cert_completed, prompt_runner_used, invite_shared, ...
-- metadata carries the per-event extras (e.g. {"percent_through": 40}).
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  session_id  uuid references public.user_sessions(id) on delete set null,
  event_type  text not null,
  lesson_id   uuid references public.lessons(id) on delete set null,
  module_id   uuid references public.modules(id) on delete set null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists analytics_events_user_idx   on public.analytics_events (user_id, created_at desc);
create index if not exists analytics_events_type_idx   on public.analytics_events (event_type, created_at desc);
create index if not exists analytics_events_lesson_idx on public.analytics_events (lesson_id);

-- ---------- GROUP D — in-app AI tutor query log (Layer 3, the crown jewel) ----------
-- Per-user, per-module record of what learners type into the in-app AI when
-- they're confused. This is the defensible data asset — distinct from the
-- anonymous landing prompt_runner_logs (which is IP-hashed, no user, no module).
create table if not exists public.tutor_interactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  lesson_id       uuid references public.lessons(id) on delete set null,
  module_id       uuid references public.modules(id) on delete set null,
  block_id        uuid references public.lesson_blocks(id) on delete set null,
  query_text      text not null,
  response_text   text,
  iteration_count int  not null default 1,
  duration_ms     int,
  replayed_after  boolean,   -- set later: did they replay the lesson after this?
  exited_after    boolean,   -- set later: did they leave the session right after?
  created_at      timestamptz not null default now()
);

create index if not exists tutor_interactions_user_idx   on public.tutor_interactions (user_id, created_at desc);
create index if not exists tutor_interactions_lesson_idx on public.tutor_interactions (lesson_id);
create index if not exists tutor_interactions_module_idx on public.tutor_interactions (module_id);

-- ============================================================================
-- ROW LEVEL SECURITY — own-row for user data; the analytics service role
-- bypasses RLS, so no separate admin policy is needed for reporting.
-- ============================================================================
alter table public.user_sessions      enable row level security;
alter table public.analytics_events   enable row level security;
alter table public.tutor_interactions enable row level security;

-- user_sessions
create policy "read own sessions"
  on public.user_sessions for select to authenticated using (auth.uid() = user_id);
create policy "insert own sessions"
  on public.user_sessions for insert to authenticated with check (auth.uid() = user_id);
create policy "update own sessions"
  on public.user_sessions for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- analytics_events (insert-only from the client; no update/delete)
create policy "read own events"
  on public.analytics_events for select to authenticated using (auth.uid() = user_id);
create policy "insert own events"
  on public.analytics_events for insert to authenticated with check (auth.uid() = user_id);

-- tutor_interactions
create policy "read own tutor interactions"
  on public.tutor_interactions for select to authenticated using (auth.uid() = user_id);
create policy "insert own tutor interactions"
  on public.tutor_interactions for insert to authenticated with check (auth.uid() = user_id);
create policy "update own tutor interactions"
  on public.tutor_interactions for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
