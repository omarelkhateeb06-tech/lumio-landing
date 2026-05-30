// Lumio loops-contact-sync Edge Function
//
// Database Webhook receiver. Fires on auth.users INSERT (a new signup) and
// creates the matching contact in Loops so the "Welcome" journey can start.
// This is a machine-to-machine receiver, not a user-facing function: it
// authenticates the caller by a shared secret carried in the x-supabase-signature
// header, not a user JWT. It never touches the database (everything it needs is
// in the webhook payload) and always returns 200 once authenticated, so a Loops
// outage can never block the signup/auth flow.
//
// Deploy: supabase functions deploy loops-contact-sync --no-verify-jwt
// (no-verify-jwt because the webhook calls it without a user session; auth is the
//  x-supabase-signature shared-secret check below)
//
// Secrets required:
//   LOOPS_API_KEY           - from loops.so Settings -> API
//   SUPABASE_WEBHOOK_SECRET - shared secret; also set as the x-supabase-signature
//                             header on the Database Webhook in the dashboard

const LOOPS_CREATE_URL = "https://app.loops.so/api/v1/contacts/create";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Length-independent constant-time string compare, so we never leak how much of
// the secret matched via timing.
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

// Supabase Database Webhook INSERT payload: the new row lives under `record`.
interface WebhookPayload {
  type?: string;
  table?: string;
  record?: { email?: string; created_at?: string };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // 1. Verify the shared secret before doing anything else.
  const secret = Deno.env.get("SUPABASE_WEBHOOK_SECRET") ?? "";
  const signature = req.headers.get("x-supabase-signature") ?? "";
  if (!secret || !signature || !safeEqual(signature, secret)) {
    return jsonResponse({ error: "Invalid or missing signature" }, 401);
  }

  // 2. Parse the webhook payload and pull the new user's identity.
  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = (payload.record?.email ?? "").trim();
  const signedUpAt = payload.record?.created_at ?? new Date().toISOString();
  if (!email) {
    // Nothing to sync (e.g. a passwordless row without an email). Acknowledge so
    // the webhook is not retried, but there is no contact to create.
    return jsonResponse({ ok: true, skipped: "no email in payload" });
  }

  // 3. Create the Loops contact. Any failure here is logged and swallowed: the
  //    function still returns 200 so the auth flow is never blocked.
  const loopsKey = Deno.env.get("LOOPS_API_KEY");
  if (!loopsKey) {
    console.error("LOOPS_API_KEY not set; skipping contact creation");
    return jsonResponse({ ok: true, skipped: "LOOPS_API_KEY not set" });
  }

  try {
    const res = await fetch(LOOPS_CREATE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${loopsKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "lumio_signup",
        signed_up_at: new Date(signedUpAt).toISOString(),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Loops create ${res.status}: ${text.slice(0, 200)}`);
    }
  } catch (e) {
    console.error(`Loops create failed: ${e instanceof Error ? e.message : "unknown"}`);
  }

  return jsonResponse({ ok: true });
});
