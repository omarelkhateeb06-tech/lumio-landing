// ─────────────────────────────────────────────────────────────────────────────
// One-time waitlist -> Loops backfill.
//
//   pnpm exec tsx scripts/migrate-waitlist-to-loops.ts --dry-run
//   pnpm exec tsx scripts/migrate-waitlist-to-loops.ts
//
// Reads every row from waitlist_signups (via the Management API, owner-level) and
// creates the matching Loops contact with source "lumio_waitlist". Requests are
// sent sequentially with a 200ms gap to stay under Loops' rate limit. Run once at
// launch; it is not automated. Pass --dry-run to print what would be sent without
// calling Loops (and without needing LOOPS_API_KEY).
//
// Requires SUPABASE_ACCESS_TOKEN (read from .env.local by db.mjs) and, for a real
// run, LOOPS_API_KEY in the environment.
// ─────────────────────────────────────────────────────────────────────────────

import { runSql } from "./db.mjs";

const LOOPS_CREATE_URL = "https://app.loops.so/api/v1/contacts/create";
const DELAY_MS = 200;
const DRY_RUN = process.argv.includes("--dry-run");

interface WaitlistRow {
  email: string;
  created_at: string | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createContact(key: string, row: WaitlistRow): Promise<void> {
  const res = await fetch(LOOPS_CREATE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: row.email,
      source: "lumio_waitlist",
      ...(row.created_at ? { signed_up_at: new Date(row.created_at).toISOString() } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Loops ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
}

async function main() {
  const rows = (await runSql(
    `select email, created_at from waitlist_signups where email is not null order by created_at asc nulls last;`,
  )) as WaitlistRow[];
  const total = Array.isArray(rows) ? rows.length : 0;
  console.log(`Found ${total} waitlist signup(s).`);
  if (total === 0) return;

  const key = process.env.LOOPS_API_KEY;
  if (DRY_RUN || !key) {
    if (!DRY_RUN && !key) {
      console.log("LOOPS_API_KEY not set — running as a dry run (no contacts created).");
    } else {
      console.log("Dry run — no contacts will be created.");
    }
    for (const row of rows) {
      console.log(`  would create: ${row.email} (source lumio_waitlist, signed_up_at ${row.created_at ?? "n/a"})`);
    }
    console.log(`\nDry run complete: ${total} contact(s) would be synced.`);
    return;
  }

  let synced = 0;
  const failed: string[] = [];
  for (const row of rows) {
    try {
      await createContact(key, row);
      synced++;
    } catch (e) {
      failed.push(`${row.email}: ${e instanceof Error ? e.message : "unknown"}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nTotal found:        ${total}`);
  console.log(`Successfully synced: ${synced}`);
  console.log(`Failed:              ${failed.length}`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`  ${f}`);
    process.exitCode = 1;
  }
}

await main();
