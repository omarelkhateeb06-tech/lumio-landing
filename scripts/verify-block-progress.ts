// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 block-progress persistence check.
//
//   pnpm exec tsx scripts/verify-block-progress.ts
//
// Proves the RLS contract the lesson-reader block components depend on: an
// authenticated user can upsert and read back their own row in
// user_block_progress, and cannot see other users' rows. We impersonate a real
// user by setting role + request.jwt.claims inside a transaction (the same
// context PostgREST establishes for the JS client), run the exact upsert shape
// saveBlockProgress() emits, then read it back under RLS. Cleanup runs as owner
// because the table intentionally has no delete policy. Requires
// SUPABASE_ACCESS_TOKEN (read from .env.local).
// ─────────────────────────────────────────────────────────────────────────────

import { runSql } from "./db.mjs";

const PROBE_EMAIL = "test-probe@example.com";

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

// Run SQL as the given user, inside a transaction with RLS enforced (role
// authenticated + jwt claims), then commit. Returns the rows of the last select.
async function asUser(userId: string, sql: string): Promise<unknown> {
  const claims = JSON.stringify({ sub: userId, role: "authenticated" });
  return runSql(
    `begin;
     set local role authenticated;
     set local request.jwt.claims = ${lit(claims)};
     ${sql}
     commit;`,
  );
}

async function main() {
  // Resolve the probe user and a real interactive block to write against.
  const users = (await runSql(
    `select id from auth.users where email = ${lit(PROBE_EMAIL)} limit 1;`,
  )) as Array<{ id: string }>;
  if (!Array.isArray(users) || users.length === 0) {
    console.error(`No user with email ${PROBE_EMAIL}; cannot run the impersonation check.`);
    process.exitCode = 1;
    return;
  }
  const userId = users[0].id;

  const blocks = (await runSql(
    `select lb.id, lb.type from lesson_blocks lb
       join lessons l on l.id = lb.lesson_id
      where l.slug = 'the-3-step-framing-technique'
        and lb.type = 'multiple_choice' limit 1;`,
  )) as Array<{ id: string; type: string }>;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    console.error("No multiple_choice block found on the test lesson; run import + apply first.");
    process.exitCode = 1;
    return;
  }
  const blockId = blocks[0].id;
  console.log(`Impersonating ${PROBE_EMAIL} (${userId}) against block ${blockId}\n`);

  // Start clean (owner-level) so the run is repeatable.
  await runSql(
    `delete from user_block_progress where user_id = ${lit(userId)} and block_id = ${lit(blockId)};`,
  );

  // 1. First attempt (wrong answer): status 'attempted', no completed_at. This is
  //    exactly the payload saveBlockProgress emits for a non-terminal status.
  await asUser(
    userId,
    `insert into user_block_progress (user_id, block_id, status, response, attempts, completed_at)
     values (${lit(userId)}, ${lit(blockId)}, 'attempted', '{"selected":"a"}'::jsonb, 1, null)
     on conflict (user_id, block_id) do update set
       status = excluded.status, response = excluded.response,
       attempts = excluded.attempts, completed_at = excluded.completed_at;`,
  );

  const afterFirst = (await asUser(
    userId,
    `select status, attempts, completed_at, response from user_block_progress
       where user_id = ${lit(userId)} and block_id = ${lit(blockId)};`,
  )) as Array<Record<string, unknown>>;
  check("user can insert and read back own row under RLS", afterFirst.length === 1);
  check("first attempt persisted as 'attempted'", afterFirst[0]?.status === "attempted");
  check("attempts = 1 after first try", Number(afterFirst[0]?.attempts) === 1);
  check("no completed_at for non-terminal status", afterFirst[0]?.completed_at === null);

  // 2. Second attempt (correct): upsert to 'passed' with completed_at set. The
  //    on-conflict path mirrors a learner getting it right on the retry.
  await asUser(
    userId,
    `insert into user_block_progress (user_id, block_id, status, response, attempts, completed_at)
     values (${lit(userId)}, ${lit(blockId)}, 'passed', '{"selected":"c"}'::jsonb, 2, now())
     on conflict (user_id, block_id) do update set
       status = excluded.status, response = excluded.response,
       attempts = excluded.attempts, completed_at = excluded.completed_at;`,
  );

  const afterSecond = (await asUser(
    userId,
    `select status, attempts, completed_at, response from user_block_progress
       where user_id = ${lit(userId)} and block_id = ${lit(blockId)};`,
  )) as Array<Record<string, unknown>>;
  check("upsert updates the same row (no duplicate)", afterSecond.length === 1);
  check("status upgraded to 'passed'", afterSecond[0]?.status === "passed");
  check("attempts incremented to 2", Number(afterSecond[0]?.attempts) === 2);
  check("completed_at set for terminal status", afterSecond[0]?.completed_at != null);
  check(
    "response jsonb round-trips the latest selection",
    JSON.stringify(afterSecond[0]?.response) === JSON.stringify({ selected: "c" }),
  );

  // 3. RLS isolation: a different (random) user must not see this row.
  const otherId = "00000000-0000-0000-0000-000000000000";
  const otherView = (await asUser(
    otherId,
    `select count(*)::int as n from user_block_progress where block_id = ${lit(blockId)};`,
  )) as Array<{ n: number }>;
  check("RLS hides the row from a different user", Number(otherView[0]?.n) === 0);

  // Cleanup (owner): the table has no delete policy, so this cannot run as the user.
  await runSql(
    `delete from user_block_progress where user_id = ${lit(userId)} and block_id = ${lit(blockId)};`,
  );

  console.log(
    failures === 0
      ? `\n\x1b[32m✓ block-progress persistence + RLS verified\x1b[0m`
      : `\n\x1b[31m✗ ${failures} check(s) failed\x1b[0m`,
  );
  process.exitCode = failures === 0 ? 0 : 1;
}

await main();
