// Lumio personalize-blocks Edge Function
//
// After onboarding, generates personalized versions of the learner's upcoming
// lesson blocks and caches them in personalized_blocks. Only blocks flagged
// personalizable = true are touched, and only three supplementary fields adapt:
// intro (framing that acknowledges their job), example (industry-specific), and
// exercise (job-specific). The core teaching content is never rewritten.
//
// Auth: requires a valid USER JWT. We read everything through the caller's token
// so RLS scopes profile, path, and personalized_blocks to that user. We never
// trust a passed user_id and never use the service role here.
//
// Deploy: supabase functions deploy personalize-blocks   (verify_jwt = true)
//
// Secrets required:
//   GROQ_API_KEY       - free tier from console.groq.com (already set)
//   SUPABASE_URL       - auto-injected
//   SUPABASE_ANON_KEY  - auto-injected

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const GENERATOR_VERSION = "v1";
const LOOKAHEAD_LESSONS = 10; // path items scanned ahead
const MAX_BLOCKS = 10; // hard cap on blocks generated per call
const ALLOWED_KEYS = ["intro", "example", "exercise"] as const;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are a curriculum personalizer. You receive a lesson block's base content and a learner's profile. Return ONLY a JSON object with these keys (omit any you are not changing): intro, example, exercise. Keep all changes grounded in the learner's actual job context. Do not alter the core concept being taught. Do not add em dashes. Be concise: no more than 2-3 sentences per field. Return raw JSON only, no markdown fences.`;

interface GroqResponse {
  choices: Array<{ message: { content: string } }>;
}

interface ProfileRow {
  job_role: string | null;
  industry: string | null;
  goal: string | null;
  skill_level: string | null;
  ai_usage: string | null;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Canonical profile JSON: fixed key order, missing values normalized to null.
// MUST stay byte-for-byte identical to canonicalProfile in
// client/src/lib/profileHash.ts so cache-freshness checks agree across the stack.
function canonicalProfile(p: ProfileRow): string {
  return JSON.stringify({
    job_role: p.job_role ?? null,
    industry: p.industry ?? null,
    goal: p.goal ?? null,
    skill_level: p.skill_level ?? null,
    ai_usage: p.ai_usage ?? null,
  });
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// A readable rendering of base block content so the model can stay grounded in
// the concept without us inventing intro/example/exercise fields it doesn't have.
function baseContentText(type: string, content: Record<string, unknown>): string {
  if (type === "reading" && typeof content.markdown === "string") return content.markdown;
  if (type === "mini_project") {
    const brief = typeof content.brief === "string" ? content.brief : "";
    const parts = Array.isArray(content.parts)
      ? (content.parts as Array<{ prompt?: string }>).map((p) => `- ${p?.prompt ?? ""}`).join("\n")
      : "";
    return [brief, parts].filter(Boolean).join("\n");
  }
  return JSON.stringify(content);
}

// Keep only the allowed string fields the model returned.
function filterOverride(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (raw && typeof raw === "object") {
    for (const key of ALLOWED_KEYS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim()) out[key] = v.trim();
    }
  }
  return out;
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

  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!groqKey) {
    return jsonResponse({ error: "Server misconfigured: GROQ_API_KEY not set" }, 500);
  }

  // 1. Caller's profile (RLS guarantees this is their own row).
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("job_role, industry, goal, skill_level, ai_usage")
    .eq("id", user.id)
    .maybeSingle();
  if (profErr || !profile) {
    return jsonResponse({ error: "No profile found for caller" }, 404);
  }

  // 2. Profile hash — the cache freshness key.
  const hash = await sha256Hex(canonicalProfile(profile as ProfileRow));

  // 3. Active path → upcoming lessons → personalizable blocks.
  const { data: path } = await supabase
    .from("user_paths")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!path) {
    return jsonResponse({ generated: 0, skipped: 0, errors: [] });
  }

  const { data: items } = await supabase
    .from("user_path_items")
    .select("lesson_id, position")
    .eq("path_id", path.id)
    .order("position", { ascending: true })
    .limit(LOOKAHEAD_LESSONS);
  const lessonOrder = new Map<string, number>();
  (items ?? []).forEach((it) => lessonOrder.set(it.lesson_id as string, it.position as number));
  const lessonIds = [...lessonOrder.keys()];
  if (lessonIds.length === 0) {
    return jsonResponse({ generated: 0, skipped: 0, errors: [] });
  }

  const { data: blocksRaw } = await supabase
    .from("lesson_blocks")
    .select("id, lesson_id, type, content, order_index")
    .in("lesson_id", lessonIds)
    .eq("personalizable", true);
  const blocks = (blocksRaw ?? [])
    .slice()
    .sort((a, b) => {
      const la = lessonOrder.get(a.lesson_id as string) ?? Infinity;
      const lb = lessonOrder.get(b.lesson_id as string) ?? Infinity;
      return la - lb || (a.order_index as number) - (b.order_index as number);
    })
    .slice(0, MAX_BLOCKS);

  // 4. Existing fresh rows for these blocks (one row per block, by unique key).
  const blockIds = blocks.map((b) => b.id as string);
  const { data: existingRows } = await supabase
    .from("personalized_blocks")
    .select("block_id, profile_hash, generator_version")
    .in("block_id", blockIds);
  const freshByBlock = new Set(
    (existingRows ?? [])
      .filter((r) => r.profile_hash === hash && r.generator_version === GENERATOR_VERSION)
      .map((r) => r.block_id as string),
  );

  // 5. Generate sequentially (avoids Groq rate-limit bursts).
  let generated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const block of blocks) {
    const blockId = block.id as string;
    if (freshByBlock.has(blockId)) {
      skipped++;
      continue;
    }

    try {
      const baseText = baseContentText(block.type as string, (block.content ?? {}) as Record<string, unknown>);
      const userPrompt =
        `Learner profile: ${profile.job_role ?? "unspecified role"}, ${profile.industry ?? "general"}, ` +
        `goal: ${profile.goal ?? "unspecified"}, skill level: ${profile.skill_level ?? "unspecified"}, ` +
        `AI usage: ${profile.ai_usage ?? "unspecified"}\n\n` +
        `Block type: ${block.type}\n` +
        `Base content: ${baseText}\n` +
        `Base intro: null\n` +
        `Base example: null\n` +
        `Base exercise: null\n\n` +
        `Return a JSON object overriding only the fields that benefit from personalization.`;

      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      });

      if (!groqRes.ok) {
        const text = await groqRes.text();
        errors.push(`block ${blockId}: groq ${groqRes.status}: ${text.slice(0, 160)}`);
        continue;
      }

      const groqData = (await groqRes.json()) as GroqResponse;
      const rawContent = groqData.choices?.[0]?.message?.content ?? "";
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        errors.push(`block ${blockId}: model returned non-JSON`);
        continue;
      }

      const override = filterOverride(parsed);
      if (Object.keys(override).length === 0) {
        errors.push(`block ${blockId}: model returned no usable fields`);
        continue;
      }

      const { error: upErr } = await supabase.from("personalized_blocks").upsert(
        {
          user_id: user.id,
          block_id: blockId,
          personalized_content: override,
          profile_hash: hash,
          generator_version: GENERATOR_VERSION,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,block_id" },
      );
      if (upErr) {
        errors.push(`block ${blockId}: upsert failed: ${upErr.message}`);
        continue;
      }
      generated++;
    } catch (e) {
      errors.push(`block ${blockId}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }

  return jsonResponse({ generated, skipped, errors });
});
