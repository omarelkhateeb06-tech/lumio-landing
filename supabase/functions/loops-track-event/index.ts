// Lumio loops-track-event Edge Function
//
// Called from the client to send a named lifecycle event to Loops (lesson
// started, milestone reached). Loops journeys listen for these event names.
//
// Auth: requires a valid USER JWT. The caller is authenticated through their
// token; only an allowlisted set of event names is accepted. The contact email
// is resolved server-side from auth.users keyed by the caller's JWT sub (via the
// service role) so the client can never spoof which contact an event targets.
//
// Deploy: supabase functions deploy loops-track-event   (verify_jwt = true)
//
// Secrets required:
//   LOOPS_API_KEY             - from loops.so Settings -> API
//   SUPABASE_URL              - auto-injected
//   SUPABASE_ANON_KEY         - auto-injected
//   SUPABASE_SERVICE_ROLE_KEY - auto-injected, used only to look up the caller's email

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const LOOPS_EVENT_URL = "https://app.loops.so/api/v1/events/send";

// Only these event names may be sent. Anything else is a 400. Keep in sync with
// the journey triggers configured in the Loops dashboard.
const ALLOWED_EVENTS = new Set([
  "lesson_started",
  "lesson_5_milestone",
  "lesson_15_halfway",
  "lesson_30_complete",
  // Spaced-review nudge. Normally fired server-side by the process-boosters
  // scheduled function (which passes lesson properties); allowlisted here too so
  // the event is sendable through the standard client path if ever needed.
  "booster_ready",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return jsonResponse({ error: "Missing Authorization bearer token" }, 401);
  }

  // Validate the event name first; reject anything off the allowlist. Optional
  // eventProperties (a flat string/number/bool map) ride along to Loops so an
  // event like booster_ready can carry the lesson slug, title, and URL.
  let eventName = "";
  let eventProperties: Record<string, unknown> | undefined;
  try {
    const body = await req.json();
    eventName = (body?.eventName ?? "").toString().trim();
    if (body?.eventProperties && typeof body.eventProperties === "object") {
      eventProperties = body.eventProperties as Record<string, unknown>;
    }
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }
  if (!ALLOWED_EVENTS.has(eventName)) {
    return jsonResponse({ error: `Unknown event name: ${eventName || "(empty)"}` }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  // Authenticate the caller through their own token (no service role here).
  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: userErr,
  } = await authClient.auth.getUser(token);
  if (userErr || !user) {
    return jsonResponse({ error: "Invalid or expired session" }, 401);
  }

  const loopsKey = Deno.env.get("LOOPS_API_KEY");
  if (!loopsKey) {
    return jsonResponse({ error: "Server misconfigured: LOOPS_API_KEY not set" }, 500);
  }

  // Resolve the email server-side from the caller's id (service role, this lookup
  // only) so the targeted contact is never client-controlled.
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: lookup, error: lookupErr } = await admin.auth.admin.getUserById(user.id);
  const email = lookup?.user?.email ?? user.email;
  if (lookupErr || !email) {
    return jsonResponse({ error: "Could not resolve caller email" }, 404);
  }

  try {
    const res = await fetch(LOOPS_EVENT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${loopsKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(eventProperties ? { email, eventName, eventProperties } : { email, eventName }),
    });
    if (!res.ok) {
      const text = await res.text();
      return jsonResponse({ error: `Loops event ${res.status}: ${text.slice(0, 200)}` }, 502);
    }
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : "Loops unreachable" }, 502);
  }

  return jsonResponse({ ok: true });
});
