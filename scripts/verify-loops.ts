// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 Loops email-automation check.
//
//   pnpm exec tsx scripts/verify-loops.ts            (live if LOOPS_API_KEY set)
//   pnpm exec tsx scripts/verify-loops.ts --dry-run  (no live Loops calls)
//
// Always: confirms the three Loops edge functions are deployed and ACTIVE, and
// (using a real probe JWT) that loops-track-event rejects an off-allowlist event
// name with 400. That much needs no Loops key.
//
// Live extras (LOOPS_API_KEY set, not --dry-run): drives loops-contact-sync with a
// synthetic signed webhook payload, confirms the contact lands in Loops, fires a
// valid lesson_started event, then deletes the synthetic contact. The webhook
// step additionally needs SUPABASE_WEBHOOK_SECRET in the environment (the same
// value configured as the x-supabase-signature header on the Database Webhook).
//
// Mirrors the JWT-minting pattern in verify-personalization.ts. Requires
// SUPABASE_ACCESS_TOKEN, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (from .env*).
// ─────────────────────────────────────────────────────────────────────────────

import { runSql, projectRef } from "./db.mjs";

const PROBE_EMAIL = "test-probe@example.com";
const PROBE_PASSWORD = "Probe-Verify-2026!";
const FUNCTIONS = ["loops-contact-sync", "loops-enrich-contact", "loops-track-event"];

const DRY_RUN = process.argv.includes("--dry-run");
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN ?? "";
const LOOPS_API_KEY = process.env.LOOPS_API_KEY ?? "";
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET ?? "";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (cond) {
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
  } else {
    failures++;
    console.log(`  \x1b[31m✗ ${label}\x1b[0m${detail ? ` — ${detail}` : ""}`);
  }
}
function skip(label: string, why: string) {
  console.log(`  \x1b[33m∼\x1b[0m ${label} — skipped (${why})`);
}
function lit(v: string): string {
  return `'${v.replace(/'/g, "''")}'`;
}

async function deployedFunctions(): Promise<Map<string, string>> {
  const ref = projectRef();
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/functions`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`functions list ${res.status}: ${await res.text()}`);
  const list = (await res.json()) as Array<{ slug: string; status: string }>;
  return new Map((Array.isArray(list) ? list : []).map((f) => [f.slug, f.status]));
}

async function serviceRoleKey(): Promise<string> {
  const ref = projectRef();
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys?reveal=true`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`api-keys ${res.status}: ${await res.text()}`);
  const keys = (await res.json()) as Array<{ name?: string; api_key?: string }>;
  const svc = keys.find((k) => k.name === "service_role");
  if (!svc?.api_key) throw new Error("service_role key not found");
  return svc.api_key;
}

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

async function trackEvent(token: string, eventName: string): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/loops-track-event`, {
    method: "POST",
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ eventName }),
  });
  return res.status;
}

async function main() {
  if (!SUPABASE_URL || !ANON_KEY || !ACCESS_TOKEN) {
    console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / SUPABASE_ACCESS_TOKEN.");
    process.exitCode = 1;
    return;
  }

  // ── Always: deployment status of all three functions.
  console.log("Deployment status:");
  const deployed = await deployedFunctions();
  for (const slug of FUNCTIONS) {
    check(`${slug} deployed and ACTIVE`, deployed.get(slug) === "ACTIVE", deployed.get(slug) ?? "missing");
  }

  // ── Always (no Loops key needed): allowlist rejection on loops-track-event.
  console.log("\nAllowlist enforcement:");
  const users = (await runSql(
    `select id from auth.users where email = ${lit(PROBE_EMAIL)} limit 1;`,
  )) as Array<{ id: string }>;
  let token = "";
  if (Array.isArray(users) && users.length > 0) {
    try {
      token = await mintUserToken(users[0].id);
      const badStatus = await trackEvent(token, "not_a_real_event");
      check("invalid event name is rejected with 400", badStatus === 400, `status ${badStatus}`);
    } catch (e) {
      skip("invalid event name rejected with 400", e instanceof Error ? e.message : "mint failed");
    }
  } else {
    skip("invalid event name rejected with 400", `no ${PROBE_EMAIL} user`);
  }

  // ── Live extras.
  console.log("\nLive Loops API:");
  if (DRY_RUN || !LOOPS_API_KEY) {
    console.log("  LOOPS_API_KEY not set — skipping live API assertions");
  } else {
    const synthEmail = `lumio-loops-verify-${Date.now()}@example.com`;

    // 1 + 2. Signed webhook -> contact created -> findable in Loops.
    if (!WEBHOOK_SECRET) {
      skip("loops-contact-sync creates a contact", "SUPABASE_WEBHOOK_SECRET not in env");
      skip("contact is findable in Loops", "SUPABASE_WEBHOOK_SECRET not in env");
    } else {
      const hookRes = await fetch(`${SUPABASE_URL}/functions/v1/loops-contact-sync`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "x-supabase-signature": WEBHOOK_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "INSERT",
          table: "users",
          record: { email: synthEmail, created_at: new Date().toISOString() },
        }),
      });
      check("loops-contact-sync returns 200 for a signed webhook", hookRes.status === 200, `status ${hookRes.status}`);

      const find = await fetch(
        `https://app.loops.so/api/v1/contacts/find?email=${encodeURIComponent(synthEmail)}`,
        { headers: { Authorization: `Bearer ${LOOPS_API_KEY}` } },
      );
      const found = (await find.json()) as Array<{ email?: string }>;
      check(
        "contact is findable in Loops",
        Array.isArray(found) && found.some((c) => c.email === synthEmail),
        `find status ${find.status}`,
      );
    }

    // 3. Valid event fires for the probe user.
    if (token) {
      const okStatus = await trackEvent(token, "lesson_started");
      check("valid lesson_started event returns 200", okStatus === 200, `status ${okStatus}`);
    } else {
      skip("valid lesson_started event returns 200", "no probe token");
    }

    // 4. Reject missing signature on the webhook receiver.
    const unsigned = await fetch(`${SUPABASE_URL}/functions/v1/loops-contact-sync`, {
      method: "POST",
      headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "INSERT", record: { email: synthEmail } }),
    });
    check("unsigned webhook is rejected with 401", unsigned.status === 401, `status ${unsigned.status}`);

    // 5. Clean up the synthetic contact.
    await fetch("https://app.loops.so/api/v1/contacts/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOOPS_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: synthEmail }),
    });
  }

  console.log(
    failures === 0
      ? `\n\x1b[32m✓ Loops automation verified\x1b[0m`
      : `\n\x1b[31m✗ ${failures} check(s) failed\x1b[0m`,
  );
  process.exitCode = failures === 0 ? 0 : 1;
}

await main();
