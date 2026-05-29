// ─────────────────────────────────────────────────────────────────────────────
// Lesson importer.
//
//   pnpm import-lessons
//
// Reads every content/lessons/**/*.md file, validates it against the content
// registry (content/registry.ts), and emits a single idempotent SQL file at
// supabase/seed/lessons.generated.sql. Paste that into the Supabase SQL editor
// to publish — the same workflow used for the initial schema + seed.
//
// Nothing is written if ANY file fails validation: the importer reports every
// problem and exits non-zero, so a typo can never half-publish the library.
//
// Idempotent: row ids are derived deterministically from slugs (see uuid.ts),
// so re-importing upserts in place rather than duplicating. Editing a lesson and
// re-importing updates it; removing a trailing block deletes it (and its
// progress); a lesson's tags/prerequisites are fully replaced each import.
//
// File format:
//   ---
//   slug: my-lesson            (required, [a-z0-9-], unique across files)
//   module: foundations        (required, must exist in the registry)
//   title: My lesson           (required)
//   level: beginner            (required: beginner | growing | confident)
//   minutes: 5                 (required, positive integer)
//   order: 1                   (optional, within-module sort key)
//   status: published          (optional, default published)
//   hook: ...                  (optional)
//   key_takeaway: ...          (optional)
//   tags: [general, prompting] (optional, each must exist in the registry)
//   prerequisites: [other-slug](optional, each must be another lesson's slug)
//   ---
//
//   ## reading
//   markdown body...
//
//   ## mini_project
//   brief prose...
//   - optional part one
//   - optional part two
//
// Interactive block types (multiple_choice, fill_blank, try_it_live,
// before_after) are authored as a fenced ```json block whose shape matches the
// content interfaces in client/src/lib/curriculum.ts. NOTE: those four types are
// imported and stored but do not RENDER until the Phase 3 reader components ship;
// reading + mini_project render today.
// ─────────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";
import { idFor } from "./uuid.ts";
import { MODULES, MODULE_SLUGS, TAG_BY_SLUG, TAGS } from "../content/registry.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LESSONS_DIR = resolve(ROOT, "content/lessons");
const OUT_PATH = resolve(ROOT, "supabase/seed/lessons.generated.sql");

const LEVELS = new Set(["beginner", "growing", "confident"]);
const STATUSES = new Set(["draft", "published", "archived"]);
const BLOCK_TYPES = new Set([
  "reading",
  "multiple_choice",
  "fill_blank",
  "try_it_live",
  "before_after",
  "mini_project",
]);

// ── Types ───────────────────────────────────────────────────────────────────

interface ParsedBlock {
  type: string;
  content: unknown;
}

interface ParsedLesson {
  file: string;
  slug: string;
  module: string;
  title: string;
  level: string;
  minutes: number;
  order: number | null;
  status: string;
  hook: string | null;
  key_takeaway: string | null;
  tags: string[];
  prerequisites: string[];
  blocks: ParsedBlock[];
}

const errors: string[] = [];
function fail(file: string, msg: string) {
  errors.push(`${file}: ${msg}`);
}

// ── File discovery ────────────────────────────────────────────────────────────

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// ── Frontmatter ────────────────────────────────────────────────────────────--

function splitFrontmatter(text: string): { fm: Record<string, string | string[]>; body: string } | null {
  if (!text.startsWith("---")) return null;
  const rest = text.slice(3).replace(/^\r?\n/, "");
  const end = rest.indexOf("\n---");
  if (end === -1) return null;
  const fmBlock = rest.slice(0, end);
  const body = rest.slice(end + 4).replace(/^\r?\n/, "");

  const fm: Record<string, string | string[]> = {};
  for (const line of fmBlock.split("\n")) {
    const trimmed = line.replace(/\r$/, "");
    if (!trimmed.trim()) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      fm[key] = inner.length ? inner.split(",").map((s) => s.trim()).filter(Boolean) : [];
    } else {
      // Strip a single layer of matching surrounding quotes if present.
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      fm[key] = value;
    }
  }
  return { fm, body };
}

// ── Block parsing ──────────────────────────────────────────────────────────--

function parseRawBlocks(body: string): { type: string; raw: string }[] {
  const lines = body.split("\n");
  const blocks: { type: string; raw: string }[] = [];
  let current: { type: string; lines: string[] } | null = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) blocks.push({ type: current.type, raw: current.lines.join("\n").trim() });
      current = { type: m[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) blocks.push({ type: current.type, raw: current.lines.join("\n").trim() });
  return blocks;
}

function parseMiniProject(raw: string): { brief: string; parts: { id: string; prompt: string }[] } {
  const lines = raw.split("\n");
  const listRe = /^\s*(?:[-*]\s+|\d+[.)]\s+)(.*)$/;
  const firstList = lines.findIndex((l) => listRe.test(l));
  if (firstList === -1) return { brief: raw.trim(), parts: [] };
  const brief = lines.slice(0, firstList).join("\n").trim();
  const parts = lines
    .slice(firstList)
    .map((l) => l.match(listRe))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m, i) => ({ id: String(i + 1), prompt: m[1].trim() }));
  return { brief, parts };
}

function extractJson(raw: string): unknown | undefined {
  const m = raw.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  const jsonText = m ? m[1] : raw;
  try {
    return JSON.parse(jsonText);
  } catch {
    return undefined;
  }
}

// Minimal shape checks for the structured (Phase 3) block types.
function validateStructured(type: string, content: any): string | null {
  switch (type) {
    case "multiple_choice":
      if (typeof content?.stem !== "string" || !Array.isArray(content?.options) || content.options.length < 2)
        return "multiple_choice needs { stem, options: [>=2] }";
      if (!content.options.some((o: any) => o?.is_correct)) return "multiple_choice needs at least one correct option";
      return null;
    case "fill_blank":
      if (typeof content?.template !== "string" || !Array.isArray(content?.blanks))
        return "fill_blank needs { template, blanks: [...] }";
      return null;
    case "try_it_live":
      if (typeof content?.instructions !== "string" || typeof content?.system_prompt !== "string")
        return "try_it_live needs { instructions, system_prompt, ideal_output }";
      return null;
    case "before_after":
      if (typeof content?.before_prompt !== "string" || typeof content?.after_prompt !== "string")
        return "before_after needs { before_prompt, after_prompt, changes }";
      return null;
    default:
      return null;
  }
}

// ── Parse + validate one file ──────────────────────────────────────────────--

function parseLesson(file: string, rel: string): ParsedLesson | null {
  const text = readFileSync(file, "utf8");
  const split = splitFrontmatter(text);
  if (!split) {
    fail(rel, "missing or malformed frontmatter (--- block)");
    return null;
  }
  const { fm, body } = split;

  const str = (k: string): string | null => (typeof fm[k] === "string" ? (fm[k] as string) : null);
  const arr = (k: string): string[] => (Array.isArray(fm[k]) ? (fm[k] as string[]) : []);

  const slug = str("slug");
  const module = str("module");
  const title = str("title");
  const level = str("level");
  const minutesStr = str("minutes");
  const orderStr = str("order");
  const status = str("status") ?? "published";

  let ok = true;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    fail(rel, `invalid or missing slug "${slug ?? ""}" (expect [a-z0-9-])`);
    ok = false;
  }
  if (!module || !MODULE_SLUGS.has(module)) {
    fail(rel, `module "${module ?? ""}" is not in the registry`);
    ok = false;
  }
  if (!title) {
    fail(rel, "missing title");
    ok = false;
  }
  if (!level || !LEVELS.has(level)) {
    fail(rel, `level "${level ?? ""}" must be beginner | growing | confident`);
    ok = false;
  }
  const minutes = Number(minutesStr);
  if (!minutesStr || !Number.isInteger(minutes) || minutes <= 0) {
    fail(rel, `minutes "${minutesStr ?? ""}" must be a positive integer`);
    ok = false;
  }
  let order: number | null = null;
  if (orderStr != null && orderStr !== "") {
    order = Number(orderStr);
    if (!Number.isInteger(order)) {
      fail(rel, `order "${orderStr}" must be an integer`);
      ok = false;
    }
  }
  if (!STATUSES.has(status)) {
    fail(rel, `status "${status}" must be draft | published | archived`);
    ok = false;
  }

  const tags = arr("tags");
  for (const t of tags) {
    if (!TAG_BY_SLUG.has(t)) {
      fail(rel, `tag "${t}" is not in the registry`);
      ok = false;
    }
  }

  const prerequisites = arr("prerequisites");
  if (slug && prerequisites.includes(slug)) {
    fail(rel, "a lesson cannot be its own prerequisite");
    ok = false;
  }

  // Blocks
  const rawBlocks = parseRawBlocks(body);
  if (rawBlocks.length === 0) {
    fail(rel, "no content blocks (expected at least one ## <type> section)");
    ok = false;
  }
  const blocks: ParsedBlock[] = [];
  for (const rb of rawBlocks) {
    if (!BLOCK_TYPES.has(rb.type)) {
      fail(rel, `unknown block type "## ${rb.type}"`);
      ok = false;
      continue;
    }
    if (rb.type === "reading") {
      if (!rb.raw) {
        fail(rel, "reading block is empty");
        ok = false;
      }
      blocks.push({ type: "reading", content: { markdown: rb.raw } });
    } else if (rb.type === "mini_project") {
      const mp = parseMiniProject(rb.raw);
      if (!mp.brief) {
        fail(rel, "mini_project block has no brief text");
        ok = false;
      }
      blocks.push({ type: "mini_project", content: mp });
    } else {
      const content = extractJson(rb.raw);
      if (content === undefined) {
        fail(rel, `${rb.type} block: could not parse JSON content`);
        ok = false;
        continue;
      }
      const shapeErr = validateStructured(rb.type, content);
      if (shapeErr) {
        fail(rel, shapeErr);
        ok = false;
      }
      blocks.push({ type: rb.type, content });
    }
  }

  if (!ok) return null;

  return {
    file: rel,
    slug: slug!,
    module: module!,
    title: title!,
    level: level!,
    minutes,
    order,
    status,
    hook: str("hook"),
    key_takeaway: str("key_takeaway"),
    tags,
    prerequisites,
    blocks,
  };
}

// ── SQL emission ───────────────────────────────────────────────────────────--

const TAG = "lum";
const dq = (v: string) => `$${TAG}$${v}$${TAG}$`;
const jsonbLit = (v: unknown) => `${dq(JSON.stringify(v))}::jsonb`;
const u = (v: string) => `${dq(v)}::uuid`;
const nullable = (v: string | null) => (v == null ? "NULL" : dq(v));

function buildSql(lessons: ParsedLesson[]): string {
  // Module upserts (from registry; array position = order_index).
  const moduleRows = MODULES.map(
    (m, i) => `  (${u(idFor.module(m.slug))}, ${dq(m.slug)}, ${dq(m.title)}, NULL, ${i})`,
  );

  // Tag upserts (from registry).
  const tagRows = TAGS.map(
    (t) => `  (${u(idFor.tag(t.slug))}, ${dq(t.slug)}, ${dq(t.label)}, ${dq(t.kind)})`,
  );

  // Assign within-module order_index: sort by (order ?? Infinity, title).
  const byModule = new Map<string, ParsedLesson[]>();
  for (const l of lessons) {
    const list = byModule.get(l.module) ?? [];
    list.push(l);
    byModule.set(l.module, list);
  }
  const orderIndex = new Map<string, number>();
  for (const list of byModule.values()) {
    list
      .slice()
      .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.title.localeCompare(b.title))
      .forEach((l, i) => orderIndex.set(l.slug, i));
  }

  const lessonRows: string[] = [];
  const blockRows: string[] = [];
  const blockTrim: string[] = [];
  const tagDeletes: string[] = [];
  const tagInserts: string[] = [];
  const prereqDeletes: string[] = [];
  const prereqInserts: string[] = [];

  for (const l of lessons) {
    const lessonId = idFor.lesson(l.slug);
    const moduleId = idFor.module(l.module);
    lessonRows.push(
      `  (${u(lessonId)}, ${dq(l.slug)}, ${u(moduleId)}, ${dq(l.title)}, ${nullable(l.hook)}, ` +
        `${nullable(l.key_takeaway)}, ${dq(l.level)}, ${l.minutes}, ${orderIndex.get(l.slug)}, ${dq(l.status)})`,
    );

    l.blocks.forEach((b, i) => {
      blockRows.push(
        `  (${u(idFor.block(l.slug, i))}, ${u(lessonId)}, ${i}, ${dq(b.type)}, ${jsonbLit(b.content)}, false)`,
      );
    });
    // Remove any blocks beyond the current count (e.g. a block was deleted).
    blockTrim.push(`delete from lesson_blocks where lesson_id = ${u(lessonId)} and order_index >= ${l.blocks.length};`);

    // Tags + prerequisites are fully replaced per lesson.
    tagDeletes.push(`delete from lesson_tags where lesson_id = ${u(lessonId)};`);
    for (const t of l.tags) {
      tagInserts.push(`  (${u(lessonId)}, ${u(idFor.tag(t))})`);
    }
    prereqDeletes.push(`delete from lesson_prerequisites where lesson_id = ${u(lessonId)};`);
    for (const p of l.prerequisites) {
      prereqInserts.push(`  (${u(lessonId)}, ${u(idFor.lesson(p))})`);
    }
  }

  const parts: string[] = [];
  parts.push(`-- Generated by scripts/import-lessons.ts — do not edit by hand.`);
  parts.push(`-- ${lessons.length} lessons, ${blockRows.length} blocks. Paste into the Supabase SQL editor.`);
  parts.push("");
  parts.push("begin;");
  parts.push("");

  parts.push("insert into modules (id, slug, title, description, order_index) values");
  parts.push(moduleRows.join(",\n") + "");
  parts.push("on conflict (slug) do update set title = excluded.title, order_index = excluded.order_index;");
  parts.push("");

  parts.push("insert into tags (id, slug, label, kind) values");
  parts.push(tagRows.join(",\n"));
  parts.push("on conflict (slug) do update set label = excluded.label, kind = excluded.kind;");
  parts.push("");

  parts.push(
    "insert into lessons (id, slug, module_id, title, hook, key_takeaway, level, estimated_minutes, order_index, status) values",
  );
  parts.push(lessonRows.join(",\n"));
  parts.push(
    "on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, " +
      "hook = excluded.hook, key_takeaway = excluded.key_takeaway, level = excluded.level, " +
      "estimated_minutes = excluded.estimated_minutes, order_index = excluded.order_index, status = excluded.status;",
  );
  parts.push("");

  parts.push("insert into lesson_blocks (id, lesson_id, order_index, type, content, personalizable) values");
  parts.push(blockRows.join(",\n"));
  parts.push(
    "on conflict (id) do update set lesson_id = excluded.lesson_id, order_index = excluded.order_index, " +
      "type = excluded.type, content = excluded.content, personalizable = excluded.personalizable;",
  );
  parts.push("");
  parts.push("-- Drop blocks removed from a lesson since the last import.");
  parts.push(blockTrim.join("\n"));
  parts.push("");

  parts.push("-- Replace lesson tags.");
  parts.push(tagDeletes.join("\n"));
  if (tagInserts.length) {
    parts.push("insert into lesson_tags (lesson_id, tag_id) values");
    parts.push(tagInserts.join(",\n"));
    parts.push("on conflict (lesson_id, tag_id) do nothing;");
  }
  parts.push("");

  parts.push("-- Replace lesson prerequisites.");
  parts.push(prereqDeletes.join("\n"));
  if (prereqInserts.length) {
    parts.push("insert into lesson_prerequisites (lesson_id, prerequisite_lesson_id) values");
    parts.push(prereqInserts.join(",\n"));
    parts.push("on conflict (lesson_id, prerequisite_lesson_id) do nothing;");
  }
  parts.push("");

  parts.push("commit;");
  parts.push("");
  return parts.join("\n");
}

// ── Run ────────────────────────────────────────────────────────────────────--

function main() {
  let files: string[];
  try {
    files = walk(LESSONS_DIR);
  } catch {
    console.error(`No lessons directory at ${LESSONS_DIR}`);
    process.exit(1);
  }

  const lessons: ParsedLesson[] = [];
  const slugToFile = new Map<string, string>();

  for (const file of files) {
    const rel = relative(ROOT, file);
    const parsed = parseLesson(file, rel);
    if (!parsed) continue;
    if (slugToFile.has(parsed.slug)) {
      fail(rel, `duplicate slug "${parsed.slug}" (also in ${slugToFile.get(parsed.slug)})`);
      continue;
    }
    slugToFile.set(parsed.slug, rel);
    lessons.push(parsed);
  }

  // Prerequisite slugs must reference a known lesson.
  for (const l of lessons) {
    for (const p of l.prerequisites) {
      if (!slugToFile.has(p)) fail(l.file, `prerequisite "${p}" is not a known lesson slug`);
    }
  }

  if (errors.length) {
    console.error(`\n${errors.length} validation error(s) — nothing written:\n`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  if (lessons.length === 0) {
    console.error("No lessons found to import.");
    process.exit(1);
  }

  const sql = buildSql(lessons);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, sql, "utf8");

  const blockCount = lessons.reduce((n, l) => n + l.blocks.length, 0);
  console.log(`Validated ${lessons.length} lessons (${blockCount} blocks) across ${MODULES.length} modules.`);
  console.log(`Wrote ${relative(ROOT, OUT_PATH)}`);
  console.log(`Apply it in the Supabase SQL editor to publish.`);
}

main();
