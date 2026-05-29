// ─────────────────────────────────────────────────────────────────────────────
// Supabase Management API harness (zero-dependency, Node 18+ global fetch).
//
//   node scripts/db.mjs apply <path/to/file.sql>     run a SQL file via the API
//   node scripts/db.mjs query "<sql>"                run an ad-hoc SQL string
//   node scripts/db.mjs verify-tags                  diff live lesson_tags vs seed
//
// Requires SUPABASE_ACCESS_TOKEN in the environment (a personal/management-API
// token, NOT the anon or service-role key). The project ref is read from
// VITE_SUPABASE_URL in .env, overridable via SUPABASE_PROJECT_REF.
//
// The /database/query endpoint executes arbitrary SQL with owner privileges, so
// it can run the dollar-quoted, begin/commit-wrapped seed as a single batch.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SEED_PATH = "supabase/seed/lessons.generated.sql";

// Node does not auto-load .env files. Load .env.local then .env (without
// overwriting anything already in the real environment) so a token kept in the
// gitignored .env.local is picked up automatically.
function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(file);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvFiles();

function fail(msg) {
  console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
  process.exit(1);
}

export function projectRef() {
  if (process.env.SUPABASE_PROJECT_REF) return process.env.SUPABASE_PROJECT_REF;
  let env = "";
  try {
    env = readFileSync(resolve(".env"), "utf8");
  } catch {
    fail("No .env and no SUPABASE_PROJECT_REF set — cannot resolve project ref.");
  }
  const m = env.match(/VITE_SUPABASE_URL\s*=\s*https:\/\/([a-z0-9]+)\.supabase\.co/i);
  if (!m) fail("Could not parse project ref from VITE_SUPABASE_URL in .env.");
  return m[1];
}

function token() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;
  if (!t) {
    fail(
      "SUPABASE_ACCESS_TOKEN is not set in this process's environment.\n" +
        "  Provide it inline, e.g.:  SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/db.mjs apply " +
        SEED_PATH,
    );
  }
  return t;
}

// Run a SQL string through the Management API. Returns the parsed rows (array)
// for selects, or whatever the API returns for DDL/DML.
export async function runSql(sql) {
  const ref = projectRef();
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    fail(`Management API ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ── Seed parsing (source of truth for the expected DB state) ──────────────────

// Pull every $lum$...$lum$ token from a line of the generated seed.
function lumTokens(line) {
  return [...line.matchAll(/\$lum\$(.*?)\$lum\$/g)].map((m) => m[1]);
}

// Parse the generated seed into id→slug maps and the expected lesson_tags pairs.
function parseSeed() {
  const sql = readFileSync(resolve(SEED_PATH), "utf8");
  const lines = sql.split("\n");

  const tagSlugById = new Map(); // tag uuid → slug
  const lessonSlugById = new Map(); // lesson uuid → slug
  const expected = new Map(); // lesson uuid → Set<tag uuid>

  let section = null; // 'tags' | 'lessons' | 'lesson_tags' | null
  for (const line of lines) {
    if (/^insert into tags\b/.test(line)) { section = "tags"; continue; }
    if (/^insert into lessons\b/.test(line)) { section = "lessons"; continue; }
    if (/^insert into lesson_tags\b/.test(line)) { section = "lesson_tags"; continue; }
    if (/^insert into /.test(line) || /^on conflict/.test(line) || /^delete from/.test(line)) {
      section = null;
      continue;
    }
    if (!section) continue;

    const toks = lumTokens(line);
    if (section === "tags" && toks.length >= 2) {
      tagSlugById.set(toks[0], toks[1]); // (id, slug, ...)
    } else if (section === "lessons" && toks.length >= 2) {
      lessonSlugById.set(toks[0], toks[1]); // (id, slug, ...)
    } else if (section === "lesson_tags" && toks.length >= 2) {
      const [lessonId, tagId] = toks; // (lesson_id, tag_id)
      if (!expected.has(lessonId)) expected.set(lessonId, new Set());
      expected.get(lessonId).add(tagId);
    }
  }
  return { tagSlugById, lessonSlugById, expected };
}

function setEq(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

// ── Commands ─────────────────────────────────────────────────────────────────

async function cmdApply(file) {
  if (!file) fail("usage: node scripts/db.mjs apply <file.sql>");
  const sql = readFileSync(resolve(file), "utf8");
  console.log(`Applying ${file} to project ${projectRef()} …`);
  const out = await runSql(sql);
  console.log("\x1b[32m✓ applied\x1b[0m", typeof out === "string" ? out : JSON.stringify(out));
}

async function cmdQuery(sql) {
  if (!sql) fail('usage: node scripts/db.mjs query "<sql>"');
  const out = await runSql(sql);
  console.log(JSON.stringify(out, null, 2));
}

async function cmdVerifyTags() {
  const { tagSlugById, lessonSlugById, expected } = parseSeed();
  const expectedLessons = expected.size;
  console.log(`Seed defines tags for ${expectedLessons} lessons.`);

  const rows = await runSql("select lesson_id, tag_id from lesson_tags;");
  if (!Array.isArray(rows)) fail(`Unexpected query result: ${JSON.stringify(rows)}`);

  const actual = new Map(); // lesson uuid → Set<tag uuid>
  for (const r of rows) {
    const lid = r.lesson_id;
    const tid = r.tag_id;
    if (!actual.has(lid)) actual.set(lid, new Set());
    actual.get(lid).add(tid);
  }

  let matched = 0;
  const problems = [];
  for (const [lessonId, expectedTags] of expected) {
    const actualTags = actual.get(lessonId) ?? new Set();
    const slug = lessonSlugById.get(lessonId) ?? lessonId;
    if (setEq(expectedTags, actualTags)) {
      matched++;
    } else {
      const exp = [...expectedTags].map((t) => tagSlugById.get(t) ?? t).sort();
      const act = [...actualTags].map((t) => tagSlugById.get(t) ?? t).sort();
      const missing = exp.filter((t) => !act.includes(t));
      const extra = act.filter((t) => !exp.includes(t));
      problems.push(
        `  ${slug}: missing [${missing.join(", ")}] extra [${extra.join(", ")}]`,
      );
    }
  }

  console.log(`\nTag match: ${matched}/${expectedLessons}`);
  if (problems.length) {
    console.log("\x1b[31mMismatches:\x1b[0m");
    console.log(problems.join("\n"));
    process.exit(1);
  }
  console.log(`\x1b[32m✓ ${matched}/${expectedLessons} lessons match their expected tags\x1b[0m`);
}

// Only dispatch the CLI when run directly (so this module can be imported by
// other scripts — e.g. verify-rules — without triggering the usage output).
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case "apply":
      await cmdApply(rest[0]);
      break;
    case "query":
      await cmdQuery(rest[0]);
      break;
    case "verify-tags":
      await cmdVerifyTags();
      break;
    default:
      console.log(
        "usage:\n  node scripts/db.mjs apply <file.sql>\n  node scripts/db.mjs query \"<sql>\"\n  node scripts/db.mjs verify-tags",
      );
      process.exit(cmd ? 1 : 0);
  }
}
