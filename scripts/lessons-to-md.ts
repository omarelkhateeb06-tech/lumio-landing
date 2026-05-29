// One-off: convert the legacy static lessons (client/src/lib/lessons.ts) into
// markdown lesson files under content/lessons/<module>/<slug>.md, so the md files
// become the single source of truth that the importer consumes.
//
// Run once:  pnpm tsx scripts/lessons-to-md.ts
// Safe to re-run: it overwrites the generated files deterministically.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { LESSONS, MODULES } from "../client/src/lib/lessons.ts";
import { slugify } from "./uuid.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, "../content/lessons");

// Map the legacy MODULES strings to the registry module slugs.
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

// Light topic inference from the legacy module so the seeded lessons carry at
// least one meaningful topic tag. Industry defaults to `general` (shown to all);
// Omar refines tags per lesson over time.
const MODULE_TOPIC: Record<string, string> = {
  foundations: "fundamentals",
  "everyday-work": "workflows",
  creation: "writing",
  "business-workflows": "workflows",
  "industry-deep-dives": "workflows",
  "building-with-ai": "automation",
};

const seenSlugs = new Set<string>();
const modulePositions: Record<string, number> = {};
let written = 0;

for (const lesson of LESSONS) {
  const moduleSlug = MODULE_SLUGS[lesson.module];
  if (!moduleSlug) throw new Error(`No module slug for "${lesson.module}"`);

  let slug = slugify(lesson.title);
  if (seenSlugs.has(slug)) slug = `${slug}-${lesson.id}`;
  seenSlugs.add(slug);

  const order = (modulePositions[moduleSlug] ?? 0) + 1;
  modulePositions[moduleSlug] = order;

  const level = LEVEL_MAP[lesson.level];
  const tags = ["general", MODULE_TOPIC[moduleSlug]].filter(Boolean);

  const frontmatter = [
    "---",
    `slug: ${slug}`,
    `module: ${moduleSlug}`,
    `title: ${lesson.title}`,
    `level: ${level}`,
    `minutes: ${lesson.minutes}`,
    `order: ${order}`,
    `hook: ${lesson.hook}`,
    `key_takeaway: ${lesson.keyTakeaway}`,
    `tags: [${tags.join(", ")}]`,
    "---",
  ].join("\n");

  const body = [
    frontmatter,
    "",
    "## reading",
    "",
    lesson.body,
    "",
    "## mini_project",
    "",
    lesson.exercise,
    "",
  ].join("\n");

  const dir = resolve(CONTENT_DIR, moduleSlug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${slug}.md`), body, "utf8");
  written++;
}

console.log(`Wrote ${written} lesson files under ${CONTENT_DIR}`);
