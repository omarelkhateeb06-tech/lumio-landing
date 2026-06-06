// Lumio process-boosters Edge Function
//
// Runs on a schedule (daily) and may also be invoked manually for testing. It
// reads every booster that is due (scheduled_for <= now and not yet completed)
// and fires a 'booster_ready' Loops event for each, carrying the lesson slug,
// title, and the in-app booster URL. It does NOT mark the booster complete:
// completed_at is stamped only when the learner finishes the review in-app.
//
// Deploy:  supabase functions deploy process-boosters   (verify_jwt = false)
//
// Scheduling (v1): once daily at 09:00 UTC. Supabase config.toml does not yet
// express a per-function cron, so the schedule is wired with pg_cron + pg_net in
// the database (see the README note this build appends), or via the Supabase
// dashboard's scheduled-functions UI. Both call this function with the
// x-cron-secret header.
//
// Secrets required:
//   LOOPS_API_KEY             - from loops.so Settings -> API
//   SUPABASE_URL              - auto-injected
//   SUPABASE_SERVICE_ROLE_KEY - auto-injected; reads the queue + resolves emails
//   SITE_URL                  - public origin for booster links, e.g. https://lumio.so
//   CRON_SECRET               - optional shared secret; when set, callers must
//                               send it as the x-cron-secret header

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const LOOPS_EVENT_URL = "https://app.loops.so/api/v1/events/send";
const BOOSTER_EVENT = "booster_ready";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

interface BoosterRow {
  id: string;
  user_id: string;
  lesson_slug: string;
  lesson_title: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Optional shared-secret gate. When CRON_SECRET is configured, every caller
  // (the cron job, a manual curl) must present it; otherwise the function is open
  // for local/dev testing. Set CRON_SECRET in production to lock it down.
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret && req.headers.get("x-cron-secret") !== cronSecret) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const loopsKey = Deno.env.get("LOOPS_API_KEY");
  const siteUrl = (Deno.env.get("SITE_URL") ?? "").replace(/\/+$/, "");
  if (!loopsKey) {
    return jsonResponse({ error: "Server misconfigured: LOOPS_API_KEY not set" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Due = scheduled in the past (or now) and not yet completed.
  const nowIso = new Date().toISOString();
  const { data: due, error: queryErr } = await admin
    .from("booster_queue")
    .select("id, user_id, lesson_slug, lesson_title")
    .is("completed_at", null)
    .lte("scheduled_for", nowIso)
    .order("scheduled_for", { ascending: true });

  if (queryErr) {
    return jsonResponse({ error: `Queue read failed: ${queryErr.message}` }, 500);
  }

  const rows = (due ?? []) as BoosterRow[];
  let processed = 0;
  const errors: string[] = [];

  // Cache email lookups so multiple due boosters for one learner cost one lookup.
  const emailCache = new Map<string, string | null>();
  async function emailFor(userId: string): Promise<string | null> {
    if (emailCache.has(userId)) return emailCache.get(userId) ?? null;
    const { data } = await admin.auth.admin.getUserById(userId);
    const email = data?.user?.email ?? null;
    emailCache.set(userId, email);
    return email;
  }

  for (const row of rows) {
    const email = await emailFor(row.user_id);
    if (!email) {
      errors.push(`no email for user ${row.user_id}`);
      continue;
    }
    const boosterUrl = `${siteUrl}/app/booster/${row.lesson_slug}`;
    try {
      const res = await fetch(LOOPS_EVENT_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${loopsKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          eventName: BOOSTER_EVENT,
          eventProperties: {
            lesson_slug: row.lesson_slug,
            lesson_title: row.lesson_title,
            booster_url: boosterUrl,
          },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        errors.push(`loops ${res.status} for ${row.id}: ${text.slice(0, 120)}`);
        continue;
      }
      // Intentionally NOT stamping completed_at: that happens when the learner
      // finishes the booster in-app. This function only sends the nudge.
      processed++;
    } catch (e) {
      errors.push(`loops unreachable for ${row.id}: ${e instanceof Error ? e.message : "error"}`);
    }
  }

  return jsonResponse({ ok: true, processed, total: rows.length, errors });
});
