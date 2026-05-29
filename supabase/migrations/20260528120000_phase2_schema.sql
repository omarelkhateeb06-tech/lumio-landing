-- ============================================================================
-- Lumio Phase 2 schema
-- Curriculum (block model), onboarding, recommendation engine, certification.
--
-- Project: gqdazzlqayejqatwxhlz  (apply in the Supabase SQL editor).
--
-- SUPERSEDES 001_user_progress.sql. This migration DROPS and recreates the
-- curriculum + progress layer. Cleared because the project is pre-launch with
-- zero real users. waitlist_signups and prompt_runner_logs are left untouched.
--
-- Conventions:
--   * Primary keys are uuid (gen_random_uuid()).
--   * Stable identifiers use slugs; nothing assumes a fixed lesson count.
--   * "Enum" columns are text + CHECK so new lesson/block/status values can be
--     added later without an ALTER TYPE dance.
--   * RLS posture: public read for published content, own-row for user data,
--     service role for review/admin and credential issuance.
-- ============================================================================

-- ---------- shared updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- drop superseded / recreated tables (child-first) ----------
drop table if exists public.capstone_submissions cascade;
drop table if exists public.user_certs            cascade;
drop table if exists public.cert_lessons          cascade;
drop table if exists public.certs                 cascade;
drop table if exists public.personalized_blocks   cascade;
drop table if exists public.user_block_progress   cascade;
drop table if exists public.user_progress         cascade;  -- old integer version
drop table if exists public.user_path_items       cascade;
drop table if exists public.user_paths            cascade;
drop table if exists public.lesson_prerequisites  cascade;
drop table if exists public.lesson_tags           cascade;
drop table if exists public.tags                  cascade;
drop table if exists public.lesson_blocks         cascade;
drop table if exists public.lessons               cascade;
drop table if exists public.modules               cascade;
drop table if exists public.profiles              cascade;

-- ============================================================================
-- GROUP A — CURRICULUM CONTENT
-- ============================================================================

-- ---------- modules ----------
create table public.modules (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text,
  order_index int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index modules_order_idx on public.modules (order_index);

create trigger modules_set_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

-- ---------- lessons ----------
create table public.lessons (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  module_id         uuid not null references public.modules(id) on delete restrict,
  title             text not null,
  hook              text,
  key_takeaway      text,
  level             text not null default 'beginner'
                      check (level in ('beginner','growing','confident')),
  estimated_minutes int  not null default 5,
  order_index       int  not null default 0,
  status            text not null default 'draft'
                      check (status in ('draft','published','archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index lessons_module_order_idx on public.lessons (module_id, order_index);
create index lessons_status_idx       on public.lessons (status);

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- ---------- lesson_blocks ----------
-- The 6 lesson types live here as an ordered sequence per lesson.
-- `content` jsonb shape per `type` (validated app-side via a discriminated union):
--   reading         { markdown, key_takeaway? }
--   multiple_choice { stem, options: [{ id, label, is_correct, explanation }] }
--   fill_blank      { template, blanks: [{ id, accept: [..], ideal }], explanation }
--   try_it_live     { instructions, system_prompt, ideal_output, input_placeholder }
--   before_after    { before_prompt, after_prompt, changes: [..], question }
--   mini_project    { brief, parts: [{ id, prompt }], grading_rubric }
create table public.lesson_blocks (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  order_index   int  not null default 0,
  type          text not null
                  check (type in ('reading','multiple_choice','fill_blank',
                                  'try_it_live','before_after','mini_project')),
  content       jsonb not null default '{}'::jsonb,
  personalizable boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index lesson_blocks_lesson_order_idx on public.lesson_blocks (lesson_id, order_index);

create trigger lesson_blocks_set_updated_at
  before update on public.lesson_blocks
  for each row execute function public.set_updated_at();

-- ---------- tags (controlled vocabulary) ----------
create table public.tags (
  id    uuid primary key default gen_random_uuid(),
  slug  text not null unique,
  label text not null,
  kind  text not null
          check (kind in ('topic','industry','use_case','job_category')),
  created_at timestamptz not null default now()
);

create index tags_kind_idx on public.tags (kind);

-- ---------- lesson_tags (join) ----------
create table public.lesson_tags (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  tag_id    uuid not null references public.tags(id)    on delete cascade,
  primary key (lesson_id, tag_id)
);

create index lesson_tags_tag_idx on public.lesson_tags (tag_id);

-- ---------- lesson_prerequisites (self-referential join) ----------
create table public.lesson_prerequisites (
  lesson_id              uuid not null references public.lessons(id) on delete cascade,
  prerequisite_lesson_id uuid not null references public.lessons(id) on delete cascade,
  primary key (lesson_id, prerequisite_lesson_id),
  check (lesson_id <> prerequisite_lesson_id)
);

-- ============================================================================
-- GROUP B — USER IDENTITY + ONBOARDING (merged into one row per user)
-- ============================================================================

create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  full_name              text,
  display_anonymous      boolean not null default false,
  job_role               text,
  industry               text,  -- maps to a tags.slug where kind = 'industry'
  ai_usage               text check (ai_usage in ('not_at_all','occasionally','regularly')),
  goal                   text check (goal in ('save_time','stay_relevant','impress_team','other')),
  goal_other             text,
  skill_level            text check (skill_level in ('beginner','some_experience','confident')),
  onboarding_completed_at timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- GROUP C — RECOMMENDATION ENGINE
-- ============================================================================

create table public.user_paths (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  generator_version text not null default 'rules_v1',
  is_active         boolean not null default true,
  generated_at      timestamptz not null default now()
);

create index user_paths_user_active_idx on public.user_paths (user_id, is_active);

create table public.user_path_items (
  id        uuid primary key default gen_random_uuid(),
  path_id   uuid not null references public.user_paths(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id)    on delete cascade,
  position  int  not null default 0,
  unique (path_id, lesson_id)
);

create index user_path_items_path_pos_idx on public.user_path_items (path_id, position);

-- ============================================================================
-- GROUP D — PROGRESS
-- ============================================================================

-- Lesson-level completion (rebuilt with uuid lesson_id; no 1..30 check).
create table public.user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id)   on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  completed    boolean not null default true,
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index user_progress_user_idx on public.user_progress (user_id);

-- Interaction-level completion (richer telemetry per block).
create table public.user_block_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id)        on delete cascade,
  block_id     uuid not null references public.lesson_blocks(id) on delete cascade,
  status       text not null default 'viewed'
                 check (status in ('viewed','attempted','passed','completed')),
  response     jsonb,
  attempts     int not null default 0,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, block_id)
);

create index user_block_progress_user_idx on public.user_block_progress (user_id);

create trigger user_block_progress_set_updated_at
  before update on public.user_block_progress
  for each row execute function public.set_updated_at();

-- ============================================================================
-- GROUP E — PERSONALIZATION (block grain; only personalizable blocks get rows)
-- ============================================================================

create table public.personalized_blocks (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id)         on delete cascade,
  block_id            uuid not null references public.lesson_blocks(id) on delete cascade,
  personalized_content jsonb not null,
  profile_hash        text,            -- invalidate + regenerate when profile changes
  generator_version   text not null default 'groq_v1',
  generated_at        timestamptz not null default now(),
  unique (user_id, block_id)
);

create index personalized_blocks_user_idx on public.personalized_blocks (user_id);

-- ============================================================================
-- GROUP F — CERTIFICATION
-- ============================================================================

-- A base cert owns the lesson set + generic capstone. An industry track is a
-- certs row with base_cert_id set + its own capstone_spec; it inherits the base
-- lesson set and relies on per-user industry personalization.
create table public.certs (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  level             text,
  description       text,
  price_cents       int not null default 4900,
  stripe_product_id text,
  stripe_price_id   text,
  base_cert_id      uuid references public.certs(id) on delete set null,
  industry          text,  -- set only on industry-overlay certs
  capstone_spec     jsonb not null default '{}'::jsonb,
  is_published      boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index certs_base_idx on public.certs (base_cert_id);

create trigger certs_set_updated_at
  before update on public.certs
  for each row execute function public.set_updated_at();

-- Ordered lesson set for a cert (populated on base certs; overlays inherit).
create table public.cert_lessons (
  id          uuid primary key default gen_random_uuid(),
  cert_id     uuid not null references public.certs(id)   on delete cascade,
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  position    int  not null default 0,
  is_required boolean not null default true,
  unique (cert_id, lesson_id)
);

create index cert_lessons_cert_pos_idx on public.cert_lessons (cert_id, position);

-- One enrollment per user per cert. Payment Option B:
--   enrolled_at = free start; paid_at ($49) gates capstone submission +
--   credential issuance; completed_at set when capstone approved.
create table public.user_certs (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  cert_id                  uuid not null references public.certs(id) on delete restrict,
  enrolled_at              timestamptz not null default now(),
  paid_at                  timestamptz,
  stripe_payment_intent_id text,
  completed_at             timestamptz,
  badge_url                text,
  verify_token             uuid not null default gen_random_uuid() unique,
  holder_name_snapshot     text,    -- frozen at issuance
  is_anonymous             boolean not null default false,
  created_at               timestamptz not null default now(),
  unique (user_id, cert_id)
);

create index user_certs_user_idx on public.user_certs (user_id);

-- Structured, multi-part submissions; unlimited resubmissions on needs_revision.
create table public.capstone_submissions (
  id                 uuid primary key default gen_random_uuid(),
  user_cert_id       uuid not null references public.user_certs(id) on delete cascade,
  attempt_number     int  not null default 1,
  submission_content jsonb not null,   -- [{ part_id, prompt, response }, ...]
  status             text not null default 'submitted'
                       check (status in ('submitted','under_review','approved',
                                         'needs_revision','rejected')),
  reviewer_notes     text,
  submitted_at       timestamptz not null default now(),
  reviewed_at        timestamptz
);

create index capstone_submissions_usercert_idx on public.capstone_submissions (user_cert_id);
create index capstone_submissions_status_idx   on public.capstone_submissions (status);

-- ============================================================================
-- PUBLIC CREDENTIAL VERIFICATION
-- RLS cannot restrict columns, so the public verify page reads through this
-- SECURITY DEFINER function, which exposes only safe fields for issued certs.
-- ============================================================================
create or replace function public.verify_credential(token uuid)
returns table (
  cert_name     text,
  cert_level    text,
  holder_name   text,
  issued_at     timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    c.name,
    c.level,
    case when uc.is_anonymous then 'Anonymous' else uc.holder_name_snapshot end,
    uc.completed_at
  from public.user_certs uc
  join public.certs c on c.id = uc.cert_id
  where uc.verify_token = token
    and uc.completed_at is not null;
$$;

grant execute on function public.verify_credential(uuid) to anon, authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- ---------- public-readable published content ----------
alter table public.modules     enable row level security;
alter table public.lessons     enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.tags        enable row level security;
alter table public.lesson_tags enable row level security;
alter table public.lesson_prerequisites enable row level security;
alter table public.certs       enable row level security;
alter table public.cert_lessons enable row level security;

create policy "modules are public"
  on public.modules for select to anon, authenticated using (true);

create policy "published lessons are public"
  on public.lessons for select to anon, authenticated
  using (status = 'published');

create policy "blocks of published lessons are public"
  on public.lesson_blocks for select to anon, authenticated
  using (exists (
    select 1 from public.lessons l
    where l.id = lesson_id and l.status = 'published'
  ));

create policy "tags are public"
  on public.tags for select to anon, authenticated using (true);

create policy "lesson_tags are public"
  on public.lesson_tags for select to anon, authenticated using (true);

create policy "lesson_prerequisites are public"
  on public.lesson_prerequisites for select to anon, authenticated using (true);

create policy "published certs are public"
  on public.certs for select to anon, authenticated
  using (is_published = true);

create policy "cert_lessons of published certs are public"
  on public.cert_lessons for select to anon, authenticated
  using (exists (
    select 1 from public.certs c
    where c.id = cert_id and c.is_published = true
  ));

-- ---------- own-row user data ----------
alter table public.profiles            enable row level security;
alter table public.user_paths          enable row level security;
alter table public.user_path_items     enable row level security;
alter table public.user_progress       enable row level security;
alter table public.user_block_progress enable row level security;
alter table public.personalized_blocks enable row level security;
alter table public.user_certs          enable row level security;
alter table public.capstone_submissions enable row level security;

-- profiles
create policy "read own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
create policy "insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- user_paths
create policy "read own paths"
  on public.user_paths for select to authenticated using (auth.uid() = user_id);
create policy "insert own paths"
  on public.user_paths for insert to authenticated with check (auth.uid() = user_id);
create policy "update own paths"
  on public.user_paths for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own paths"
  on public.user_paths for delete to authenticated using (auth.uid() = user_id);

-- user_path_items (scoped through the parent path)
create policy "read own path items"
  on public.user_path_items for select to authenticated
  using (exists (select 1 from public.user_paths p
                 where p.id = path_id and p.user_id = auth.uid()));
create policy "insert own path items"
  on public.user_path_items for insert to authenticated
  with check (exists (select 1 from public.user_paths p
                      where p.id = path_id and p.user_id = auth.uid()));
create policy "delete own path items"
  on public.user_path_items for delete to authenticated
  using (exists (select 1 from public.user_paths p
                 where p.id = path_id and p.user_id = auth.uid()));

-- user_progress
create policy "read own progress"
  on public.user_progress for select to authenticated using (auth.uid() = user_id);
create policy "insert own progress"
  on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "update own progress"
  on public.user_progress for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own progress"
  on public.user_progress for delete to authenticated using (auth.uid() = user_id);

-- user_block_progress
create policy "read own block progress"
  on public.user_block_progress for select to authenticated using (auth.uid() = user_id);
create policy "insert own block progress"
  on public.user_block_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "update own block progress"
  on public.user_block_progress for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- personalized_blocks
create policy "read own personalized blocks"
  on public.personalized_blocks for select to authenticated using (auth.uid() = user_id);
create policy "insert own personalized blocks"
  on public.personalized_blocks for insert to authenticated with check (auth.uid() = user_id);
create policy "update own personalized blocks"
  on public.personalized_blocks for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_certs: self-enroll only (free). paid_at / completed_at / badge_url are
-- written by the Stripe webhook + review process via the service role, which
-- bypasses RLS. No public select (verification goes through verify_credential).
create policy "read own certs"
  on public.user_certs for select to authenticated using (auth.uid() = user_id);
create policy "enroll self in cert"
  on public.user_certs for insert to authenticated
  with check (auth.uid() = user_id and paid_at is null and completed_at is null);

-- capstone_submissions: insert allowed only when the parent enrollment is PAID.
create policy "read own submissions"
  on public.capstone_submissions for select to authenticated
  using (exists (select 1 from public.user_certs uc
                 where uc.id = user_cert_id and uc.user_id = auth.uid()));
create policy "submit capstone for paid cert"
  on public.capstone_submissions for insert to authenticated
  with check (exists (select 1 from public.user_certs uc
                      where uc.id = user_cert_id
                        and uc.user_id = auth.uid()
                        and uc.paid_at is not null));

-- (No authenticated update/delete on user_certs or capstone_submissions:
--  payment, issuance, and review are service-role operations.)
