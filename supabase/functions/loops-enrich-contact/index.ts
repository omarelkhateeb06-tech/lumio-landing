// Lumio loops-enrich-contact Edge Function
//
// Called from the client right after onboarding writes the profiles row. Reads
// the caller's profile (RLS-scoped, own row only) and pushes the personalization
// fields onto their Loops contact so journeys can segment on job_role / industry
// / goal / skill_level / ai_usage.
//
// Auth: requires a valid USER JWT. We read everything through the caller's token
// so RLS scopes the profile to that user. We never trust a passed user_id and
// never use the service role here.
//
// Deploy: supabase functions deploy loops-enrich-contact   (verify_jwt = true)
//
// Secrets required:
//   LOOPS_API_KEY      - from loops.so Settings -> API
//   SUPABASE_URL       - auto-injected
//   SUPABASE_ANON_KEY  - auto-injected

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const LOOPS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  // RLS-scoped client: every query runs as the caller, enforcing own-row access.
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser(token);
  if (userErr || !user) {
    return jsonResponse({ error: "Invalid or expired session" }, 401);
  }

  const loopsKey = Deno.env.get("LOOPS_API_KEY");
  if (!loopsKey) {
    return jsonResponse({ error: "Server misconfigured: LOOPS_API_KEY not set" }, 500);
  }

  // Caller's profile (RLS guarantees this is their own row).
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("job_role, industry, goal, skill_level, ai_usage")
    .eq("id", user.id)
    .maybeSingle();
  if (profErr || !profile) {
    return jsonResponse({ error: "No profile found for caller" }, 404);
  }

  // The contact is keyed by email; updateable contact properties carry the
  // profile signals. Loops upserts on update, so a missing contact is created.
  try {
    const res = await fetch(LOOPS_UPDATE_URL, {
      method: "PUT",
      headers: { Authorization: `Bearer ${loopsKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        job_role: profile.job_role ?? null,
        industry: profile.industry ?? null,
        goal: profile.goal ?? null,
        skill_level: profile.skill_level ?? null,
        ai_usage: profile.ai_usage ?? null,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return jsonResponse({ error: `Loops update ${res.status}: ${text.slice(0, 200)}` }, 502);
    }
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : "Loops unreachable" }, 502);
  }

  return jsonResponse({ ok: true });
});
