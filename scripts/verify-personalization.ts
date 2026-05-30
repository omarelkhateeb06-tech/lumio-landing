// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 personalization-layer end-to-end check.
//
//   pnpm exec tsx scripts/verify-personalization.ts
//
// Exercises the real path the app uses: a signed-in user calls the
// personalize-blocks Edge Function, which reads their profile + active path via
// RLS, generates personalized supplementary fields with Groq, and caches them in
// personalized_blocks. We mint a genuine user JWT (admin password reset + password
// grant) because the function runs as the caller, not the service role.
//
// Setup and cleanup run as owner through the Management API (the table has no
// delete policy, and we need a complete profile + active path to give the
// function something to do). Requires SUPABASE_ACCESS_TOKEN, VITE_SUPABASE_URL,
// and VITE_SUPABASE_ANON_KEY (all read from .env / .env.local by db.mjs).
// ─────────────────────────────────────────────────────────────────────────────

import { runSql, projectRef } from "./db.mjs";
import {
  profileHash,
  GENERATOR_VERSION,
  type PersonalizationProfile,
} from "../client/src/lib/profileHash";

const PROBE_EMAIL = "test-probe@example.com";
const PROBE_PASSWORD = "Probe-Verify-2026!";
const LESSON_SLUG = "the-3-step-framing-technique";
const ALLOWED_KEYS = new Set(["intro", "example", "exercise"]);

// The profile the function will personalize against. All five fields the hash
// covers are set so the row is "complete" and the cache key is stable.
const PROBE_PROFILE: PersonalizationProfile = {
  job_role: "Marketing Manager",
  industry: "B2B SaaS",
  goal: "save_time",
  skill_level: "beginner",
  ai_usage: "occasionally",
};

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (cond) {
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
  } else {
    failures++;
    console.log(`  \x1b[31m✗ ${label}\x1b[0m${detail ? ` — ${detail}` : ""}`);
  }
}

function lit(v: string): string {
  return `'${v.replace(/'/g, "''")}'`;
}

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN ?? "";

// Reveal the service_role key (needed only to reset the probe's password through
// the GoTrue admin API). Never logged.
async function serviceRoleKey(): Promise<string> {
  const ref = projectRef();
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/api-keys?reveal=true`,
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } },
  );
  if (!res.ok) throw new Error(`api-keys ${res.status}: ${await res.text()}`);
  const keys = (await res.json()) as Array<{ name?: string; api_key?: string }>;
  const svc = keys.find((k) => k.name === "service_role");
  if (!svc?.api_key) throw new Error("service_role key not found in api-keys reveal");
  return svc.api_key;
}

// Real user access token via admin password reset → password grant.
async function mintUserToken(userId: string): Promise<string> {
  const svc = await serviceRoleKey();

  const reset = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    headers: { apikey: svc, Authorization: `Bearer ${svc}`, "Content-Type": "application/json" },
    body: JSON.stringify({ password: PROBE_PASSWORD, email_confirm: true }),
  });
  if (!reset.ok) throw new Error(`admin password reset ${reset.status}: ${await reset.text()}`);

  const signin = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: PROBE_EMAIL, password: PROBE_PASSWORD }),
  });
  if (!signin.ok) throw new Error(`password grant ${signin.status}: ${await signin.text()}`);
  const { access_token } = (await signin.json()) as { access_token?: string };
  if (!access_token) throw new Error("no access_token from password grant");
  return access_token;
}

interface InvokeResult {
  status: number;
  body: { generated?: number; skipped?: number; errors?: string[] } & Record<string, unknown>;
}

async function invoke(accessToken: string): Promise<InvokeResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/personalize-blocks`, {
    method: "POST",
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: "{}",
  });
  let body: InvokeResult["body"] = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  return { status: res.status, body };
}

async function main() {
  if (!SUPABASE_URL || !ANON_KEY || !ACCESS_TOKEN) {
    console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / SUPABASE_ACCESS_TOKEN.");
    process.exitCode = 1;
    return;
  }

  const users = (await runSql(
    `select id from auth.users where email = ${lit(PROBE_EMAIL)} limit 1;`,
  )) as Array<{ id: string }>;
  if (!Array.isArray(users) || users.length === 0) {
    console.error(`No user with email ${PROBE_EMAIL}; cannot run the personalization check.`);
    process.exitCode = 1;
    return;
  }
  const userId = users[0].id;
  console.log(`Verifying personalize-blocks as ${PROBE_EMAIL} (${userId})\n`);

  // ── Setup (owner): complete profile + a fresh active path containing the
  //    framing lesson, and a clean personalized_blocks slate for repeatability.
  await runSql(
    `insert into profiles (id, job_role, industry, goal, skill_level, ai_usage, onboarding_completed_at)
     values (${lit(userId)}, ${lit(PROBE_PROFILE.job_role!)}, ${lit(PROBE_PROFILE.industry!)},
             ${lit(PROBE_PROFILE.goal!)}, ${lit(PROBE_PROFILE.skill_level!)}, ${lit(PROBE_PROFILE.ai_usage!)}, now())
     on conflict (id) do update set
       job_role = excluded.job_role, industry = excluded.industry, goal = excluded.goal,
       skill_level = excluded.skill_level, ai_usage = excluded.ai_usage,
       onboarding_completed_at = excluded.onboarding_completed_at;`,
  );

  await runSql(
    `with del_items as (
       delete from user_path_items where path_id in (select id from user_paths where user_id = ${lit(userId)})
     ),
     del_paths as (
       delete from user_paths where user_id = ${lit(userId)}
     ),
     newp as (
       insert into user_paths (user_id, is_active) values (${lit(userId)}, true) returning id
     )
     insert into user_path_items (path_id, lesson_id, position)
     select newp.id, l.id, 0 from newp, lessons l where l.slug = ${lit(LESSON_SLUG)};`,
  );

  await runSql(`delete from personalized_blocks where user_id = ${lit(userId)};`);

  // How many personalizable blocks the function should see ahead.
  const blockRows = (await runSql(
    `select lb.id from lesson_blocks lb
       join lessons l on l.id = lb.lesson_id
      where l.slug = ${lit(LESSON_SLUG)} and lb.personalizable = true;`,
  )) as Array<{ id: string }>;
  const totalBlocks = blockRows.length;
  check("test lesson has at least one personalizable block", totalBlocks >= 1, `found ${totalBlocks}`);

  // ── First invocation: should generate.
  const token = await mintUserToken(userId);
  const first = await invoke(token);
  check("function returns 200 to a signed-in caller", first.status === 200, `status ${first.status}`);
  if (first.body.errors && first.body.errors.length) {
    console.log(`  \x1b[33m! generation errors:\x1b[0m ${first.body.errors.join(" | ")}`);
  }
  check(
    "first invocation generated at least one block",
    (first.body.generated ?? 0) >= 1,
    `generated ${first.body.generated}`,
  );

  // ── Inspect what got cached.
  const expectedHash = await profileHash(PROBE_PROFILE);
  const rows = (await runSql(
    `select block_id, profile_hash, generator_version, personalized_content
       from personalized_blocks where user_id = ${lit(userId)};`,
  )) as Array<{
    block_id: string;
    profile_hash: string;
    generator_version: string;
    personalized_content: Record<string, unknown>;
  }>;

  check("at least one personalized_blocks row created", rows.length >= 1, `rows ${rows.length}`);
  check(
    "every row's generator_version is the current version",
    rows.every((r) => r.generator_version === GENERATOR_VERSION),
    rows.map((r) => r.generator_version).join(","),
  );
  check(
    "every row's profile_hash matches the client-computed hash",
    rows.every((r) => r.profile_hash === expectedHash),
    `expected ${expectedHash.slice(0, 12)}…`,
  );
  check(
    "personalized_content holds only allowed keys (intro/example/exercise)",
    rows.every(
      (r) =>
        r.personalized_content &&
        typeof r.personalized_content === "object" &&
        Object.keys(r.personalized_content).length > 0 &&
        Object.keys(r.personalized_content).every((k) => ALLOWED_KEYS.has(k)),
    ),
  );
  check(
    "every personalized field is a non-empty string",
    rows.every((r) =>
      Object.values(r.personalized_content).every((v) => typeof v === "string" && v.trim().length > 0),
    ),
  );

  // ── Second invocation: everything fresh, so it must skip and generate nothing.
  const second = await invoke(token);
  check("second invocation returns 200", second.status === 200, `status ${second.status}`);
  check(
    "second invocation generates nothing (cache hit)",
    (second.body.generated ?? -1) === 0,
    `generated ${second.body.generated}`,
  );
  check(
    "second invocation skips all blocks",
    (second.body.skipped ?? 0) === totalBlocks,
    `skipped ${second.body.skipped} of ${totalBlocks}`,
  );

  // ── Cleanup (owner): remove the cached rows this run created.
  await runSql(`delete from personalized_blocks where user_id = ${lit(userId)};`);

  console.log(
    failures === 0
      ? `\n\x1b[32m✓ personalization layer verified end-to-end\x1b[0m`
      : `\n\x1b[31m✗ ${failures} check(s) failed\x1b[0m`,
  );
  process.exitCode = failures === 0 ? 0 : 1;
}

await main();
