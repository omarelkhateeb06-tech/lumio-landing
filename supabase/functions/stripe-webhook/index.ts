// Lumio stripe-webhook Edge Function
//
// Receives Stripe checkout.session.completed events and stamps paid_at on the
// learner's user_certs row so the cert track unlocks.
//
// Secrets required:
//   STRIPE_WEBHOOK_SECRET     - whsec_... from Stripe Dashboard → Webhooks
//   SUPABASE_URL              - auto-injected
//   SUPABASE_SERVICE_ROLE_KEY - auto-injected
//
// To add a new cert: add its payment link ID → cert_slug entry to CERT_SLUG_BY_PAYMENT_LINK.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Maps Stripe payment link IDs → cert slugs. Update when adding new certs.
const CERT_SLUG_BY_PAYMENT_LINK: Record<string, string> = {
  "plink_1Tj5x91jvSYizhkjBy7fara1": "beginner-ai-practitioner",
  "plink_1Tj5xA1jvSYizhkj4z184dbZ": "customer-service-ai-practitioner",
  "plink_1Tj5xB1jvSYizhkj2V8lIoUf": "education-ai-practitioner",
  "plink_1Tj5xC1jvSYizhkjYEfWiH34": "finance-ai-practitioner",
  "plink_1Tj5xD1jvSYizhkjp21vrusz": "healthcare-ai-practitioner",
  "plink_1Tj5xE1jvSYizhkjhpiZgAX4": "hr-ai-practitioner",
  "plink_1Tj5xE1jvSYizhkjLRQfEV5i": "legal-ai-practitioner",
};

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  const parts: Record<string, string> = {};
  for (const part of sigHeader.split(",")) {
    const idx = part.indexOf("=");
    if (idx > 0) parts[part.slice(0, idx)] = part.slice(idx + 1);
  }
  const { t: timestamp, v1 } = parts;
  if (!timestamp || !v1) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${timestamp}.${payload}`),
  );
  const computed = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (computed.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  if (!webhookSecret) return json({ error: "STRIPE_WEBHOOK_SECRET not set" }, 500);

  const sigHeader = req.headers.get("stripe-signature") ?? "";
  const rawBody = await req.text();

  if (!(await verifyStripeSignature(rawBody, sigHeader, webhookSecret))) {
    return json({ error: "Invalid signature" }, 400);
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (event.type !== "checkout.session.completed") {
    return json({ ok: true, skipped: event.type });
  }

  const session = event.data.object;
  const customerDetails = session.customer_details as { email?: string } | null;
  const email = customerDetails?.email;
  const paymentLinkId = session.payment_link as string | null;

  if (!email) return json({ error: "No customer email in session" }, 400);
  if (!paymentLinkId) return json({ error: "No payment_link on session" }, 400);

  const certSlug = CERT_SLUG_BY_PAYMENT_LINK[paymentLinkId];
  if (!certSlug) return json({ error: `Unknown payment link: ${paymentLinkId}` }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Look up user by email via GoTrue admin API
  const authRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
  );
  const authData = (await authRes.json()) as { users?: { id: string }[] };
  const userId = authData.users?.[0]?.id;
  if (!userId) return json({ error: `No Lumio account for: ${email}` }, 404);

  // Look up cert
  const { data: cert, error: certErr } = await admin
    .from("certs")
    .select("id")
    .eq("slug", certSlug)
    .single();
  if (certErr || !cert) return json({ error: `Cert not found: ${certSlug}` }, 404);

  // Stamp paid_at (only if not already paid — idempotent)
  const { error: updateErr } = await admin
    .from("user_certs")
    .update({ paid_at: new Date().toISOString() })
    .eq("cert_id", (cert as { id: string }).id)
    .eq("user_id", userId)
    .is("paid_at", null);

  if (updateErr) return json({ error: `DB update failed: ${updateErr.message}` }, 500);

  return json({ ok: true, email, cert_slug: certSlug });
});
