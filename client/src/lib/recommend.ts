// ─────────────────────────────────────────────────────────────────────────────
// rules_v1 — the Lumio recommendation engine (pure logic, no I/O).
//
// Given a learner's profile (skill level + industry + goal) and the published
// curriculum (lessons with their tag slugs), this produces a single ordered
// path plus a small "you might also like" set. It is deterministic: same input
// always yields the same output, which makes it testable and debuggable.
//
// Design (approved before implementation):
//
//   1. SPINE = level band, easy → hard. Every lesson sorts first by its level
//      band (beginner → growing → confident). Personalization NEVER crosses a
//      band: a confident-level lesson can't be pulled ahead of a beginner one.
//      This is the "band-respecting" rule — boosts only reorder within a band.
//
//   2. WITHIN A BAND we sort by an affinity score:
//        + industry match  → a large boost (dominates, but band-local)
//        + goal → module   → a smaller per-module nudge
//      Ties fall back to the curriculum's natural order (module, then lesson).
//
//   3. THREE SEGMENTS:
//        - core      : the Foundations module, in natural order. The shared
//                      spine for newer learners. SKIPPABLE for confident users
//                      (interim rule) — for them it's dropped from the active
//                      path and offered as optional review in `suggestions`.
//        - stretch   : everything else, ordered by the spine + score above.
//        - suggestions: up to 3 high-affinity lessons surfaced as "you might
//                      also like." Derived, NOT persisted as path items.
//
//   4. EXCLUDE SET seam: the active pool is (all lessons) minus
//      (completed ∪ mastered). Today `mastered` is always empty; when mastery
//      checks land, they populate it and the engine needs no other change.
//
// This module imports only the LessonLevel type so it stays a leaf dependency
// (supabase.ts imports from here, not the reverse — no import cycle).
// ─────────────────────────────────────────────────────────────────────────────

import type { LessonLevel } from "./curriculum";

// These mirror the profile column unions in supabase.ts. They're re-declared
// here (rather than imported) to keep this module dependency-free; the string
// unions are identical, so values flow across the boundary without casts.
export type PathSkillLevel = "beginner" | "some_experience" | "confident";
export type PathGoal = "save_time" | "stay_relevant" | "impress_team" | "other";

/** The minimal lesson shape the engine needs. `tags` are tag slugs (industry +
 *  use_case + topic mixed together; the engine only cares about specific ones). */
export interface RecLesson {
  id: string;
  slug: string;
  level: LessonLevel;
  module_slug: string;
  module_order: number;
  order_index: number;
  tags: string[];
}

export interface RecProfile {
  skill_level: PathSkillLevel;
  /** A tags.slug where kind = 'industry'. "general" means no specific industry. */
  industry: string;
  goal: PathGoal;
}

export interface RecInput {
  profile: RecProfile;
  lessons: RecLesson[];
  /** completed ∪ mastered lesson ids. Removed from the active path. */
  exclude?: ReadonlySet<string>;
}

export interface RecPath {
  core: string[]; // ordered foundations lesson ids (empty when confident skips)
  stretch: string[]; // ordered personalized lesson ids
  active: string[]; // core ++ stretch — exactly what gets persisted, in order
  suggestions: string[]; // up to 3 "you might also like" ids (not persisted)
}

// ── Tuning constants ─────────────────────────────────────────────────────────

const FOUNDATIONS_MODULE = "foundations";
const GENERIC_INDUSTRY = "general";

/** Level → band index. The spine sorts ascending on this. */
const BAND: Record<LessonLevel, number> = {
  beginner: 0,
  growing: 1,
  confident: 2,
};

/** An industry-tag match is worth more than any goal nudge, so a learner's
 *  field always floats to the top of its band. Band-local by construction. */
const INDUSTRY_BOOST = 100;

/** goal → which modules to surface earlier (within a band). Higher = earlier.
 *  "other" intentionally adds no nudge, leaving the natural order intact. */
const GOAL_MODULE_WEIGHT: Record<PathGoal, Record<string, number>> = {
  save_time: { "everyday-work": 30, "business-workflows": 20, creation: 10 },
  stay_relevant: { "building-with-ai": 30, "industry-deep-dives": 20, creation: 10 },
  impress_team: { creation: 30, "industry-deep-dives": 20, "business-workflows": 10 },
  other: {},
};

const MAX_SUGGESTIONS = 3;
/** Don't echo the immediate next-ups (which the UI already spotlights as
 *  "Today's lesson") inside "you might also like". */
const SUGGESTION_SKIP_FRONT = 3;

// ── Scoring ────────────────────────────────────────────────────────────────--

function scoreLesson(l: RecLesson, profile: RecProfile): number {
  let score = 0;
  if (
    profile.industry &&
    profile.industry !== GENERIC_INDUSTRY &&
    l.tags.includes(profile.industry)
  ) {
    score += INDUSTRY_BOOST;
  }
  score += GOAL_MODULE_WEIGHT[profile.goal]?.[l.module_slug] ?? 0;
  return score;
}

/** Comparator implementing the band-respecting spine:
 *  band asc → score desc → module order asc → lesson order asc. */
function makeComparator(profile: RecProfile) {
  return (a: RecLesson, b: RecLesson): number => {
    if (BAND[a.level] !== BAND[b.level]) return BAND[a.level] - BAND[b.level];
    const sa = scoreLesson(a, profile);
    const sb = scoreLesson(b, profile);
    if (sa !== sb) return sb - sa;
    if (a.module_order !== b.module_order) return a.module_order - b.module_order;
    return a.order_index - b.order_index;
  };
}

// ── Engine ─────────────────────────────────────────────────────────────────--

export function buildPathV1(input: RecInput): RecPath {
  const exclude = input.exclude ?? new Set<string>();
  const profile = input.profile;
  const pool = input.lessons.filter((l) => !exclude.has(l.id));
  const isConfident = profile.skill_level === "confident";

  const foundations = pool
    .filter((l) => l.module_slug === FOUNDATIONS_MODULE)
    .sort((a, b) => a.order_index - b.order_index);
  const rest = pool.filter((l) => l.module_slug !== FOUNDATIONS_MODULE);

  const cmp = makeComparator(profile);

  // Core: Foundations in natural order. Confident users skip it (it moves to
  // suggestions as optional review), so their path starts at the growing band.
  const core = isConfident ? [] : foundations.map((l) => l.id);

  // Stretch: everything outside Foundations, ordered by the spine + score.
  const stretch = rest.slice().sort(cmp).map((l) => l.id);

  const active = [...core, ...stretch];

  const suggestions = computeSuggestions(pool, profile, active, isConfident, foundations);

  return { core, stretch, active, suggestions };
}

function computeSuggestions(
  pool: RecLesson[],
  profile: RecProfile,
  active: string[],
  isConfident: boolean,
  foundations: RecLesson[],
): string[] {
  const skipFront = new Set(active.slice(0, SUGGESTION_SKIP_FRONT));

  const scored = pool
    .map((l) => ({ l, s: scoreLesson(l, profile) }))
    .filter((x) => x.s > 0 && !skipFront.has(x.l.id))
    .sort(
      (a, b) =>
        b.s - a.s ||
        BAND[a.l.level] - BAND[b.l.level] ||
        a.l.module_order - b.l.module_order ||
        a.l.order_index - b.l.order_index,
    )
    .map((x) => x.l.id);

  const out: string[] = [];
  // Confident learners get one "revisit the basics" nudge first, since their
  // active path skips Foundations entirely.
  if (isConfident && foundations.length > 0) out.push(foundations[0].id);
  for (const id of scored) {
    if (out.length >= MAX_SUGGESTIONS) break;
    if (!out.includes(id)) out.push(id);
  }
  return out.slice(0, MAX_SUGGESTIONS);
}
