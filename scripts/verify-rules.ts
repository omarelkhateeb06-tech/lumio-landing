// ─────────────────────────────────────────────────────────────────────────────
// rules_v1 verification — exercises the recommendation engine (buildPathV1)
// against the live, freshly-seeded curriculum (101 lessons across 9 modules).
//
//   pnpm exec tsx scripts/verify-rules.ts
//   (or)  node --import tsx scripts/verify-rules.ts
//
// Pulls the published lessons (with module + tag slugs) from the DB via the
// Management API, then runs the engine through representative personas and
// asserts its documented invariants. Prints each persona's path so the output
// can be eyeballed for quality, then a pass/fail summary. Exits non-zero on any
// failed invariant. Requires SUPABASE_ACCESS_TOKEN (read from .env.local).
// ─────────────────────────────────────────────────────────────────────────────

import { runSql } from "./db.mjs";
import { buildPathV1, type RecLesson, type RecProfile } from "../client/src/lib/recommend";
import type { LessonLevel } from "../client/src/lib/curriculum";

const BAND: Record<LessonLevel, number> = { beginner: 0, growing: 1, confident: 2 };
// The core of the beginner spine — must mirror CORE_MODULES in recommend.ts.
const CORE_MODULES: ReadonlySet<string> = new Set(["foundations", "first-steps"]);
const isCore = (moduleSlug: string) => CORE_MODULES.has(moduleSlug);

// ── Load the published curriculum from the DB ────────────────────────────────

const LESSONS_SQL = `
  select l.id, l.slug, l.level, l.order_index,
         m.slug as module_slug, m.order_index as module_order,
         coalesce(array_agg(t.slug) filter (where t.slug is not null), '{}') as tags
  from lessons l
  join modules m on m.id = l.module_id
  left join lesson_tags lt on lt.lesson_id = l.id
  left join tags t on t.id = lt.tag_id
  where l.status = 'published'
  group by l.id, l.slug, l.level, l.order_index, m.slug, m.order_index
  order by m.order_index, l.order_index;
`;

// The Management API may return a postgres text[] either as a JS array or as the
// "{a,b,c}" text form depending on the column type inference — normalize both.
function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    const inner = raw.replace(/^\{|\}$/g, "").trim();
    if (!inner) return [];
    return inner.split(",").map((s) => s.replace(/^"|"$/g, ""));
  }
  return [];
}

async function loadLessons(): Promise<RecLesson[]> {
  const rows = (await runSql(LESSONS_SQL)) as Array<Record<string, unknown>>;
  if (!Array.isArray(rows)) throw new Error(`Unexpected query result: ${JSON.stringify(rows)}`);
  return rows.map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    level: r.level as LessonLevel,
    module_slug: String(r.module_slug),
    module_order: Number(r.module_order),
    order_index: Number(r.order_index),
    tags: normalizeTags(r.tags),
  }));
}

// ── Tiny assertion harness ───────────────────────────────────────────────────

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (cond) {
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
  } else {
    failures++;
    console.log(`  \x1b[31m✗ ${label}\x1b[0m${detail ? ` — ${detail}` : ""}`);
  }
}

// ── Per-persona invariant checks ─────────────────────────────────────────────

function verifyPersona(name: string, profile: RecProfile, lessons: RecLesson[], exclude?: Set<string>) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const path = buildPathV1({ profile, lessons, exclude });
  const { core, stretch, active, suggestions } = path;

  console.log(`\n\x1b[1m${name}\x1b[0m  (${profile.skill_level} / ${profile.industry} / ${profile.goal})`);
  const slug = (id: string) => byId.get(id)?.slug ?? id;
  console.log(`  active (${active.length}): ${active.map(slug).join(" → ")}`);
  console.log(`  suggestions: ${suggestions.map(slug).join(", ") || "(none)"}`);

  // 1. active === core ++ stretch
  check(
    "active = core ++ stretch",
    active.length === core.length + stretch.length &&
      active.every((id, i) => id === [...core, ...stretch][i]),
  );

  // 2. no duplicates
  check("no duplicate lessons in active", new Set(active).size === active.length);

  // 3. excluded absent
  if (exclude && exclude.size) {
    check("excluded lessons absent from active", active.every((id) => !exclude.has(id)));
  }

  // 4. all active ids are real published lessons
  check("every active id is a published lesson", active.every((id) => byId.has(id)));

  // 5. band-respecting: band index non-decreasing along active
  let bandOk = true;
  for (let i = 1; i < active.length; i++) {
    if (BAND[byId.get(active[i])!.level] < BAND[byId.get(active[i - 1])!.level]) {
      bandOk = false;
      break;
    }
  }
  check("band-respecting (level never decreases along the path)", bandOk);

  // 6. core-module handling per skill level. The core spine is the CORE_MODULES
  // (foundations → first-steps) in module order, then lesson order.
  const coreLessons = lessons
    .filter((l) => isCore(l.module_slug) && !(exclude?.has(l.id)))
    .sort((a, b) => a.module_order - b.module_order || a.order_index - b.order_index);
  if (profile.skill_level === "confident") {
    check("confident path skips core modules (core empty)", core.length === 0);
    if (coreLessons.length > 0) {
      check(
        "confident gets a core-review nudge in suggestions",
        suggestions[0] === coreLessons[0].id,
        `suggestions[0]=${slug(suggestions[0] ?? "")} expected ${coreLessons[0].slug}`,
      );
    }
  } else {
    check(
      "non-confident core = core modules in natural order (foundations → first-steps)",
      core.length === coreLessons.length && core.every((id, i) => id === coreLessons[i].id),
    );
  }

  // 7. industry lessons (when a real industry is set) float within their band:
  // no same-band lesson lacking the industry tag precedes one that has it.
  if (profile.industry !== "general") {
    let industryOk = true;
    let detail = "";
    for (let i = 1; i < active.length; i++) {
      const cur = byId.get(active[i])!;
      const prev = byId.get(active[i - 1])!;
      if (BAND[cur.level] !== BAND[prev.level]) continue;
      const curHas = cur.tags.includes(profile.industry);
      const prevHas = prev.tags.includes(profile.industry);
      // Core modules are fixed natural order and exempt from the industry boost.
      if (isCore(cur.module_slug) || isCore(prev.module_slug)) continue;
      if (curHas && !prevHas) {
        industryOk = false;
        detail = `${prev.slug} (no ${profile.industry}) precedes ${cur.slug} (has it) in same band`;
        break;
      }
    }
    check(`industry "${profile.industry}" lessons float to front of their band`, industryOk, detail);
  }

  // 8. determinism
  const again = buildPathV1({ profile, lessons, exclude });
  check(
    "deterministic (same input → identical output)",
    JSON.stringify(again) === JSON.stringify(path),
  );

  return path;
}

// ── Run ──────────────────────────────────────────────────────────────────────

const lessons = await loadLessons();
console.log(`Loaded ${lessons.length} published lessons from the DB.`);
if (lessons.length !== 101) {
  console.log(`\x1b[33m⚠ expected 101 published lessons, got ${lessons.length} — seed may not be fully applied.\x1b[0m`);
}

const personas: Array<{ name: string; profile: RecProfile; exclude?: Set<string> }> = [
  { name: "Newcomer", profile: { skill_level: "beginner", industry: "general", goal: "save_time" } },
  { name: "Clinician", profile: { skill_level: "beginner", industry: "healthcare", goal: "stay_relevant" } },
  { name: "Finance IC", profile: { skill_level: "some_experience", industry: "finance", goal: "impress_team" } },
  { name: "Confident lawyer", profile: { skill_level: "confident", industry: "legal", goal: "save_time" } },
  { name: "No-nudge", profile: { skill_level: "beginner", industry: "general", goal: "other" } },
];

for (const p of personas) verifyPersona(p.name, p.profile, lessons, p.exclude);

// Exclude-seam check: complete the first two active lessons for the Newcomer and
// confirm they vanish from a freshly generated path.
const base = buildPathV1({
  profile: { skill_level: "beginner", industry: "general", goal: "save_time" },
  lessons,
});
const exclude = new Set(base.active.slice(0, 2));
verifyPersona("Newcomer (2 lessons completed)", { skill_level: "beginner", industry: "general", goal: "save_time" }, lessons, exclude);

console.log(
  failures === 0
    ? `\n\x1b[32m✓ all invariants held across ${personas.length + 1} personas\x1b[0m`
    : `\n\x1b[31m✗ ${failures} invariant check(s) failed\x1b[0m`,
);
// Set the code and let Node drain naturally. Calling process.exit() here races
// tsx's esbuild worker teardown and trips a libuv assertion on Windows.
process.exitCode = failures === 0 ? 0 : 1;
