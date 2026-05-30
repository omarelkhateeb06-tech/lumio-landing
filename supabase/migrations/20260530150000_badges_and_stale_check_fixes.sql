-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 5 + cleanup: badge fixes and one stale mastery-check question.
--
--  1. Add `first-steps-cleared`, mirroring `foundations-cleared` exactly
--     (tier silver, module_completed, icon flag, 100 pts), scoped to the
--     first-steps module. Deterministic uuid v5 id = uuidv5("badge:first-steps-cleared").
--  2. Fix `polymath` copy: the platform now has 9 modules, so "all six modules"
--     was stale. Keep it as a breadth badge (count stays 6), reword the copy so
--     it no longer claims completeness.
--  3. Reorder sort_order so the two module-clear badges sit at the front of the
--     ladder in learning-path order (first-steps before foundations).
--  4. Re-author the one beginner-level-check question that referenced the now-cut
--     `calendar-audits-where-did-your-week-go` lesson. Replaced with a still-valid
--     beginner concept (paste the real material).
--
-- Idempotent: badge upsert on slug, sort_order set absolutely, question update by id.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- 1. Add first-steps-cleared (mirror foundations-cleared).
insert into badge_definitions
  (id, slug, name, description, icon, tier, criteria_type, criteria_config, points_reward, sort_order, is_published) values
  ($lum$d01e3aa7-075f-5f65-8662-293ec2137faf$lum$::uuid, $lum$first-steps-cleared$lum$, $lum$First Steps Cleared$lum$, $lum$Every lesson in First Steps, done. You are off the ground and ready for the rest.$lum$, $lum$flag$lum$, $lum$silver$lum$, $lum$module_completed$lum$, $lum${"module_slug":"first-steps"}$lum$::jsonb, 100, 1, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  tier = excluded.tier,
  criteria_type = excluded.criteria_type,
  criteria_config = excluded.criteria_config,
  points_reward = excluded.points_reward,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

-- 2. Fix polymath copy (keep count = 6 as a breadth threshold, drop "all").
update badge_definitions
set description = $lum$You completed lessons across six different modules. A genuinely broad foundation.$lum$,
    criteria_config = $lum${"count":6}$lum$::jsonb
where slug = $lum$polymath$lum$;

-- 3. Reorder the ladder so first-steps-cleared (1) precedes foundations-cleared (2),
--    pushing the rest down by one. sort_order has no unique constraint.
update badge_definitions set sort_order = case slug
  when $lum$first-steps$lum$        then 0
  when $lum$first-steps-cleared$lum$ then 1
  when $lum$foundations-cleared$lum$ then 2
  when $lum$module-master$lum$       then 3
  when $lum$test-out-ace$lum$        then 4
  when $lum$week-one$lum$            then 5
  when $lum$consistent$lum$          then 6
  when $lum$quick-study$lum$         then 7
  when $lum$polymath$lum$            then 8
  when $lum$centurion$lum$           then 9
  when $lum$credentialed$lum$        then 10
  else sort_order end
where slug in (
  $lum$first-steps$lum$, $lum$first-steps-cleared$lum$, $lum$foundations-cleared$lum$,
  $lum$module-master$lum$, $lum$test-out-ace$lum$, $lum$week-one$lum$, $lum$consistent$lum$,
  $lum$quick-study$lum$, $lum$polymath$lum$, $lum$centurion$lum$, $lum$credentialed$lum$
);

-- 4. Re-author the stale beginner-level-check question (was about the cut
--    calendar-audits lesson). Same id/order, new still-valid beginner content.
update mastery_check_questions
set type = $lum$fill_blank$lum$,
    content = $lum${"template":"The single biggest upgrade to your AI results is to {{1}} the actual material instead of describing it.","blanks":[{"id":"1","accept":["paste"],"ideal":"paste"}],"explanation":"Real text in means specific, grounded answers out, so paste the document rather than summarizing it from memory."}$lum$::jsonb
where id = $lum$189ed31a-bb8c-5d85-9bbe-db7a1f486b2f$lum$::uuid;

commit;
