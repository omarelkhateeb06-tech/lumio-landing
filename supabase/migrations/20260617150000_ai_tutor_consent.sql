-- ============================================================================
-- AI tutor consent flag.
--
-- The in-app AI tutor (ask-tutor Edge Function) only logs a learner's raw query
-- text when profiles.ai_tutor_consent is true. This is separate from
-- profiles.data_consent_at (the general onboarding data-use opt-in) so the tutor
-- has its own explicit, just-in-time consent gate shown before the first query.
--
-- NOTE: the query log itself reuses the existing tutor_interactions table
-- (20260617120000_data_capture.sql) — a superset of the spec'd prompt_runner_
-- queries columns, already wired into admin_confusion_map() — rather than a
-- parallel table. Additive and idempotent; safe on the live DB.
-- ============================================================================
alter table public.profiles
  add column if not exists ai_tutor_consent boolean not null default false;
