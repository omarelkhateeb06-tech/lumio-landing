-- Booster queue: spaced-review nudges.
--
-- When a learner completes a lesson for the first time, the client enqueues one
-- booster row scheduled a few days out. A scheduled Edge Function
-- (process-boosters) later reads the due rows and fires a 'booster_ready' Loops
-- event so the learner gets a gentle "quick memory check" email. The learner
-- completes the booster in-app (a 3-question review drawn from the lesson), and
-- the row's completed_at is stamped at that point.

CREATE TABLE IF NOT EXISTS booster_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  lesson_title text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booster_queue_user ON booster_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_booster_queue_scheduled ON booster_queue(scheduled_for)
  WHERE completed_at IS NULL;

ALTER TABLE booster_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own boosters"
  ON booster_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own boosters"
  ON booster_queue FOR UPDATE
  USING (auth.uid() = user_id);

-- INSERT policy added beyond the original spec: Part 2B enqueues boosters from
-- the client (the authenticated learner) right after a first lesson completion.
-- With RLS enabled and no INSERT policy, that client insert would be denied, so
-- the feature cannot work without this. WITH CHECK pins the row to the caller's
-- own id so a learner can only ever queue boosters for themselves.
CREATE POLICY "Users can insert own boosters"
  ON booster_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);
