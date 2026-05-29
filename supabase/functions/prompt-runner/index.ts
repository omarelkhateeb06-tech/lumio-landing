// Lumio prompt-runner Edge Function
//
// Takes a user-typed prompt and returns a Lumio-improved version + a one-line
// explanation of why it's better. Uses Groq (free tier, fast).
//
// Deploy: supabase functions deploy prompt-runner --no-verify-jwt
// (no-verify-jwt because the landing page calls this with the anon key, not a
//  user session — we do our own auth via the apikey header)
//
// Secrets required:
//   GROQ_API_KEY                 - free tier from console.groq.com
//   SUPABASE_URL                 - auto-injected
//   SUPABASE_SERVICE_ROLE_KEY    - auto-injected, used for logging table writes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // free tier, 14,400 req/day
const MAX_PROMPT_CHARS = 600;
const RATE_LIMIT_PER_HOUR = 5; // per IP
const RATE_LIMIT_PER_DAY = 20;

// CORS — landing page may be on a different origin (Vercel preview, prod, localhost)
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Lumio, an AI literacy coach for knowledge workers. The user pasted a prompt they'd send to ChatGPT or Claude. Your job is to rewrite it so it actually produces a useful answer.

A good prompt has:
1. ROLE: who the AI should act as ("act as a marketing director")
2. CONTEXT: situation, audience, constraints (industry, tone, length, deadline)
3. SPECIFICS: concrete numbers, names, examples instead of vague terms
4. SUCCESS CRITERIA: what a good answer looks like (format, sections, length)

Return ONLY valid JSON in this exact shape, no markdown, no preamble:
{
  "improved_prompt": "the rewritten prompt, ready to paste into ChatGPT or Claude",
  "why_better": "one sentence (max 20 words) naming the single biggest change you made and why it matters"
}

Rules:
- Keep the user's original intent. Don't invent topics or change the goal.
- If the original is already excellent (rare), still return an improved version with stronger specifics.
- Never refuse. Never lecture. Never use the words "prompt engineering."
- improved_prompt: 40-200 words. Concrete. No filler.
- why_better: short and human. No jargon. Example: "Added a role and a specific success metric so the AI stops guessing."`;

interface GroqResponse {
  choices: Array<{ message: { content: string } }>;
  usage?: { prompt_tokens: number; completion_tokens: number };
}

// ---- helpers ----

async function hashIp(ip: string): Promise<string> {
  // Privacy: store only a salted hash, never the raw IP. Salt is per-deploy.
  const salt = Deno.env.get("IP_HASH_SALT") ?? "lumio-default-salt";
  const data = new TextEncoder().encode(salt + ip);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function looksLikeJailbreak(prompt: string): boolean {
  const p = prompt.toLowerCase();
  return (
    p.includes("ignore previous") ||
    p.includes("ignore all previous") ||
    p.includes("you are now") ||
    p.includes("system prompt") ||
    p.includes("jailbreak") ||
    p.includes("dan mode") ||
    /\bdisregard\b.{0,30}\binstructions\b/.test(p)
  );
}

// ---- main handler ----

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const startTime = Date.now();

  // 1. Parse + validate body
  let userPrompt = "";
  try {
    const body = await req.json();
    userPrompt = (body?.prompt ?? "").toString().trim();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!userPrompt) {
    return jsonResponse({ error: "Missing 'prompt' in request body" }, 400);
  }
  if (userPrompt.length < 5) {
    return jsonResponse({ error: "Prompt is too short — try at least one full sentence." }, 400);
  }
  if (userPrompt.length > MAX_PROMPT_CHARS) {
    return jsonResponse(
      { error: `Prompt is too long (max ${MAX_PROMPT_CHARS} chars). Trim it down.` },
      400
    );
  }

  // 2. Cheap jailbreak/abuse filter
  if (looksLikeJailbreak(userPrompt)) {
    return jsonResponse(
      { error: "That doesn't look like a real work prompt. Try something you'd actually paste into ChatGPT for a project at work." },
      400
    );
  }

  // 3. Rate-limit by IP via prompt_runner_logs
  const ip = getClientIp(req);
  const ipHash = await hashIp(ip);

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: hourCount } = await supabaseAdmin
    .from("prompt_runner_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneHourAgo);

  const { count: dayCount } = await supabaseAdmin
    .from("prompt_runner_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneDayAgo);

  if ((hourCount ?? 0) >= RATE_LIMIT_PER_HOUR || (dayCount ?? 0) >= RATE_LIMIT_PER_DAY) {
    await supabaseAdmin.from("prompt_runner_logs").insert({
      ip_hash: ipHash,
      user_prompt: userPrompt.slice(0, 200),
      status: "rate_limited",
    });
    return jsonResponse(
      {
        error:
          "You've tried a few prompts already. Come back in an hour, or sign up to keep practicing.",
      },
      429
    );
  }

  // 4. Call Groq
  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!groqKey) {
    return jsonResponse(
      { error: "Server misconfigured: GROQ_API_KEY not set. Contact admin." },
      500
    );
  }

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });
  } catch (e) {
    await supabaseAdmin.from("prompt_runner_logs").insert({
      ip_hash: ipHash,
      user_prompt: userPrompt,
      status: "error",
      error_message: e instanceof Error ? e.message : "network",
      model: MODEL,
    });
    return jsonResponse({ error: "AI service unreachable. Try again in a moment." }, 502);
  }

  if (!groqRes.ok) {
    const text = await groqRes.text();
    await supabaseAdmin.from("prompt_runner_logs").insert({
      ip_hash: ipHash,
      user_prompt: userPrompt,
      status: "error",
      error_message: `groq ${groqRes.status}: ${text.slice(0, 300)}`,
      model: MODEL,
    });
    return jsonResponse(
      { error: "AI service had a problem. Try a different prompt or come back shortly." },
      502
    );
  }

  const groqData = (await groqRes.json()) as GroqResponse;
  const raw = groqData.choices?.[0]?.message?.content ?? "";

  let parsed: { improved_prompt?: string; why_better?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    await supabaseAdmin.from("prompt_runner_logs").insert({
      ip_hash: ipHash,
      user_prompt: userPrompt,
      status: "error",
      error_message: "non-JSON response from model",
      model: MODEL,
    });
    return jsonResponse({ error: "Got a malformed answer. Try once more." }, 502);
  }

  const improved = (parsed.improved_prompt ?? "").trim();
  const why = (parsed.why_better ?? "").trim();
  if (!improved) {
    return jsonResponse({ error: "Got an empty answer. Try once more." }, 502);
  }

  // 5. Log success
  const durationMs = Date.now() - startTime;
  await supabaseAdmin.from("prompt_runner_logs").insert({
    ip_hash: ipHash,
    user_prompt: userPrompt,
    improved_prompt: improved,
    why_better: why,
    model: MODEL,
    tokens_in: groqData.usage?.prompt_tokens ?? null,
    tokens_out: groqData.usage?.completion_tokens ?? null,
    duration_ms: durationMs,
    status: "ok",
  });

  return jsonResponse({ improved_prompt: improved, why_better: why });
});
