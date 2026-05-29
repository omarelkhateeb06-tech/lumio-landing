// ─────────────────────────────────────────────────────────────────────────────
// Seed generator: reads the legacy static lessons (client/src/lib/lessons.ts) and
// emits a paste-ready, dollar-quoted SQL file that populates modules / lessons /
// lesson_blocks for the Phase 2 schema.
//
// Run:  pnpm tsx scripts/generate-seed.ts
// Out:  supabase/migrations/20260528120001_seed_lessons.sql
//
// UUIDs are derived deterministically (uuid v5) from stable slugs, so the seed is
// idempotent: re-running produces the same ids and the generated SQL upserts.
// This is a *content* seed only — it never touches user tables.
//
// NOTE: the 30 lessons here are only the initial seed. The schema and this script
// assume nothing about the lesson count; the real curriculum will be much larger.
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { LESSONS, MODULES } from "../client/src/lib/lessons.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Stable Lumio namespace for deterministic uuid v5 derivation.
const NAMESPACE = "0d3f6a2c-8b1e-4c7a-9f5d-2e6b1a4c8d90";

function uuidv5(name: string, namespace = NAMESPACE): string {
  const nsHex = namespace.replace(/-/g, "");
  const buf = Buffer.concat([Buffer.from(nsHex, "hex"), Buffer.from(name, "utf8")]);
  const hash = createHash("sha1").update(buf).digest();
  const bytes = hash.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Module slug map keyed by the exact MODULES string.
const MODULE_SLUGS: Record<string, string> = {
  "I. Foundations": "foundations",
  "II. Everyday work": "everyday-work",
  "III. Creation": "creation",
  "IV. Business workflows": "business-workflows",
  "V. Industry deep dives": "industry-deep-dives",
  "VI. Building with AI": "building-with-ai",
};

const LEVEL_MAP: Record<string, "beginner" | "growing" | "confident"> = {
  BEG: "beginner",
  INT: "growing",
  ADV: "confident",
};

// ── Dollar-quoting helpers ────────────────────────────────────────────────────
// A tag unlikely to ever appear in lesson prose / JSON content.
const TAG = "lum";
function dq(value: string): string {
  return `$${TAG}$${value}$${TAG}$`;
}
function jsonbLit(value: unknown): string {
  return `${dq(JSON.stringify(value))}::jsonb`;
}

// ── Build rows ────────────────────────────────────────────────────────────────

type Row = { sql: string };

const moduleRows: string[] = [];
const lessonRows: string[] = [];
const blockRows: string[] = [];

MODULES.forEach((moduleTitle, moduleIndex) => {
  const slug = MODULE_SLUGS[moduleTitle];
  if (!slug) throw new Error(`No slug mapping for module "${moduleTitle}"`);
  const id = uuidv5(`module:${slug}`);
  moduleRows.push(
    `  (${dq(id)}::uuid, ${dq(slug)}, ${dq(moduleTitle)}, NULL, ${moduleIndex})`,
  );
});

const seenLessonSlugs = new Set<string>();
// Track per-module position for lessons.order_index.
const modulePositions: Record<string, number> = {};

for (const lesson of LESSONS) {
  const moduleSlug = MODULE_SLUGS[lesson.module];
  if (!moduleSlug) throw new Error(`No slug mapping for module "${lesson.module}"`);
  const moduleId = uuidv5(`module:${moduleSlug}`);

  let slug = slugify(lesson.title);
  if (seenLessonSlugs.has(slug)) slug = `${slug}-${lesson.id}`;
  seenLessonSlugs.add(slug);

  const lessonId = uuidv5(`lesson:${slug}`);
  const level = LEVEL_MAP[lesson.level];
  if (!level) throw new Error(`Unknown level "${lesson.level}" for lesson ${lesson.id}`);

  const orderIndex = modulePositions[moduleSlug] ?? 0;
  modulePositions[moduleSlug] = orderIndex + 1;

  lessonRows.push(
    `  (${dq(lessonId)}::uuid, ${dq(slug)}, ${dq(moduleId)}::uuid, ${dq(lesson.title)}, ` +
      `${dq(lesson.hook)}, ${dq(lesson.keyTakeaway)}, ${dq(level)}, ${lesson.minutes}, ${orderIndex}, 'published')`,
  );

  // Block 0 — the lesson reading (the legacy `body`).
  const readingId = uuidv5(`block:${slug}:0`);
  blockRows.push(
    `  (${dq(readingId)}::uuid, ${dq(lessonId)}::uuid, 0, 'reading', ${jsonbLit({ markdown: lesson.body })}, false)`,
  );

  // Block 1 — the practice exercise as a single-task mini_project.
  const exerciseId = uuidv5(`block:${slug}:1`);
  blockRows.push(
    `  (${dq(exerciseId)}::uuid, ${dq(lessonId)}::uuid, 1, 'mini_project', ${jsonbLit({
      brief: lesson.exercise,
      parts: [],
    })}, false)`,
  );
}

// ── Assemble SQL ──────────────────────────────────────────────────────────────

const sql = `-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: initial lessons (generated by scripts/generate-seed.ts — do not edit by hand).
-- Run AFTER 20260528120000_phase2_schema.sql. Idempotent: deterministic uuid v5 ids
-- + ON CONFLICT upserts. Content only; never touches user tables.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

insert into modules (id, slug, title, description, order_index) values
${moduleRows.join(",\n")}
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index;

insert into lessons
  (id, slug, module_id, title, hook, key_takeaway, level, estimated_minutes, order_index, status) values
${lessonRows.join(",\n")}
on conflict (slug) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  hook = excluded.hook,
  key_takeaway = excluded.key_takeaway,
  level = excluded.level,
  estimated_minutes = excluded.estimated_minutes,
  order_index = excluded.order_index,
  status = excluded.status;

insert into lesson_blocks (id, lesson_id, order_index, type, content, personalizable) values
${blockRows.join(",\n")}
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  order_index = excluded.order_index,
  type = excluded.type,
  content = excluded.content,
  personalizable = excluded.personalizable;

commit;
`;

const outPath = resolve(__dirname, "../supabase/migrations/20260528120001_seed_lessons.sql");
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  modules: ${moduleRows.length}`);
console.log(`  lessons: ${lessonRows.length}`);
console.log(`  blocks:  ${blockRows.length}`);
