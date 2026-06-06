# process-boosters

Scheduled Edge Function that fires the spaced-review nudges. It reads every due
booster (`scheduled_for <= now()` and `completed_at IS NULL`) from
`booster_queue` and sends a `booster_ready` event to Loops for each, carrying
`lesson_slug`, `lesson_title`, and `booster_url`. It never stamps
`completed_at` — that happens when the learner finishes the booster in-app.

## Secrets to set (Supabase dashboard → Edge Functions → Secrets)

- `LOOPS_API_KEY` — from loops.so → Settings → API
- `SITE_URL` — public origin for booster links, e.g. `https://lumio.so` (no trailing slash)
- `CRON_SECRET` — a random string; the scheduler must send it as `x-cron-secret`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auto-injected

## Deploy (requires the Supabase CLI, not installed in this environment)

```
supabase functions deploy process-boosters   # config.toml sets verify_jwt = false
```

## Schedule it — daily at 09:00 UTC (v1)

Supabase `config.toml` does not express a per-function cron, so wire it once via
pg_cron + pg_net in the database (or the dashboard's scheduled-functions UI):

```sql
-- one-time, in the Supabase SQL editor
select cron.schedule(
  'process-boosters-daily',
  '0 9 * * *',
  $$
  select net.http_post(
    url     := 'https://<project-ref>.supabase.co/functions/v1/process-boosters',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>')
  );
  $$
);
```

## Loops journey (Omar sets this up manually in Loops)

- **Trigger:** event `booster_ready`
- **Email subject:** `Quick check: does [lesson_title] still click?`
- **Email body:** warm, 3-sentence nudge explaining the booster idea (a 2-minute
  review a few days later is what makes a lesson stick), with a single CTA button
  linking to `booster_url`.
- **Send once per booster, not repeating.**

Event properties available in the template: `lesson_title`, `lesson_slug`,
`booster_url`. The `booster_ready` event name is allowlisted in
`loops-track-event` too (it forwards `eventProperties`), so the event is also
sendable through the standard client path if ever needed.
