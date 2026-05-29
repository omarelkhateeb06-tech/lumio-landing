-- Lumio landing page waitlist + prompt-runner support
-- Run this in the Supabase project `gqdazzlqayejqatwxhlz` (same project as lumio-app).
--
-- What this does:
--   1. Creates `waitlist_signups` table for the landing-page email capture.
--   2. RLS: allow anonymous inserts (the landing page is public, uses anon key).
--   3. RLS: anonymous users CANNOT read the table back (admin-only via service role).
--   4. Creates `prompt_runner_logs` table to track usage and detect abuse on the
--      Edge Function. Same RLS posture: anon insert, no anon read.

-- ---------- waitlist_signups ----------
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  source        text NOT NULL DEFAULT 'landing_hero',
  user_agent    text,
  ip_hash       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_signups_email_check
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE INDEX IF NOT EXISTS waitlist_signups_email_idx
  ON public.waitlist_signups (email);

CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
  ON public.waitlist_signups (created_at DESC);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (anon role) inserts only. No reads.
DROP POLICY IF EXISTS "anon can insert signups" ON public.waitlist_signups;
CREATE POLICY "anon can insert signups"
  ON public.waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Optional: dedupe at the app layer or with a partial unique index if you don't
-- want the same email more than once. Disabled by default; turn on if desired:
-- CREATE UNIQUE INDEX waitlist_signups_email_unique ON public.waitlist_signups (lower(email));


-- ---------- prompt_runner_logs ----------
-- Used by the Edge Function to track and rate-limit interactive prompt runs.
CREATE TABLE IF NOT EXISTS public.prompt_runner_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash         text,
  user_prompt     text NOT NULL,
  improved_prompt text,
  why_better      text,
  model           text,
  tokens_in       int,
  tokens_out      int,
  duration_ms     int,
  status          text NOT NULL DEFAULT 'ok', -- 'ok' | 'rate_limited' | 'error' | 'rejected'
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prompt_runner_logs_ip_created_idx
  ON public.prompt_runner_logs (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS prompt_runner_logs_status_idx
  ON public.prompt_runner_logs (status, created_at DESC);

ALTER TABLE public.prompt_runner_logs ENABLE ROW LEVEL SECURITY;

-- No anon access at all. Only the Edge Function (which uses service role) writes here.
-- (No policies = no access for anon/authenticated, which is what we want.)
