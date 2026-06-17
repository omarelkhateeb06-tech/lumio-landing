// Lumio ask-tutor Edge Function
//
// Powers the interactive in-app AI tutor (the try_it_live block). Takes the
// learner's message plus the lesson's own system_prompt, calls Groq with
// streaming, and streams the answer back as plain text. When the learner has
// opted in (profiles.ai_tutor_consent = true), it logs the exchange to
// tutor_interactions (the confusion-map data asset) — consent-gated and
// best-effort, never blocking the stream.
//
// Auth: requires a valid USER JWT. Everything runs through the caller's token so
// RLS scopes the profile read and the tutor_interactions writes to that user.
// We never use the service role here and never trust a passed user_id.
//
// Deploy: supabase functions deploy ask-tutor   (verify_jwt = true, the default)
//
// Secrets required:
//   GROQ_API_KEY       - free tier from console.groq.com (already set)
//   SUPABASE_URL       - auto-injected
//   SUPABASE_ANON_KEY  - auto-injected

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 12; // prior turns kept (keeps the prompt bounded)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  // Let browser JS read the interaction id we set, for exit tracking.
  "Access-Control-Expose-Headers": "x-interaction-id",
};

function errResponse(msg: string, status: number): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return errResponse("Method not allowed", 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return errResponse("Missing Authorization bearer token", 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errResponse("Invalid JSON body", 400);
  }

  const message = (body?.message ?? "").toString().trim();
  const systemPrompt = (body?.system_prompt ?? "").toString();
  const historyRaw = Array.isArray(body?.conversation_history) ? body.conversation_history : [];
  const lessonId = body?.lesson_id ? String(body.lesson_id) : null;
  const blockId = body?.block_id ? String(body.block_id) : null;
  const iterationCount =
    typeof body?.iteration_count === "number" && Number.isFinite(body.iteration_count)
      ? Math.max(1, Math.floor(body.iteration_count))
      : 1;

  if (!message) return errResponse("Missing 'message'", 400);
  if (message.length > MAX_MESSAGE_CHARS) {
    return errResponse(`Message too long (max ${MAX_MESSAGE_CHARS} chars)`, 400);
  }
  if (!systemPrompt.trim()) return errResponse("Missing 'system_prompt'", 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  // RLS-scoped client: runs as the caller, enforcing own-row access on every read/write.
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser(token);
  if (userErr || !user) return errResponse("Invalid or expired session", 401);

  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!groqKey) return errResponse("Server misconfigured: GROQ_API_KEY not set", 500);

  // Consent gate: only log raw query text when the learner has opted in.
  const { data: profile } = await supabase
    .from("profiles")
    .select("ai_tutor_consent")
    .eq("id", user.id)
    .maybeSingle();
  const consented = (profile as { ai_tutor_consent?: boolean } | null)?.ai_tutor_consent === true;

  // Messages: the lesson's system_prompt verbatim (no wrapper), then prior turns,
  // then the new user message.
  const history: HistoryTurn[] = historyRaw
    .filter(
      (m: unknown): m is HistoryTurn =>
        !!m &&
        typeof m === "object" &&
        ((m as HistoryTurn).role === "user" || (m as HistoryTurn).role === "assistant") &&
        typeof (m as HistoryTurn).content === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_MESSAGE_CHARS) }));

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  // If consented, insert the query row up front (response_text filled in after the
  // stream) so we have an id to hand back via header for the client's exit patch.
  let interactionId: string | null = null;
  if (consented) {
    let moduleId: string | null = null;
    if (lessonId) {
      const { data: lrow } = await supabase
        .from("lessons")
        .select("module_id")
        .eq("id", lessonId)
        .maybeSingle();
      moduleId = (lrow as { module_id?: string } | null)?.module_id ?? null;
    }
    const { data: inserted } = await supabase
      .from("tutor_interactions")
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        module_id: moduleId,
        block_id: blockId,
        query_text: message,
        iteration_count: iterationCount,
      })
      .select("id")
      .single();
    interactionId = (inserted as { id?: string } | null)?.id ?? null;
  }

  // Call Groq with streaming.
  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 800,
        stream: true,
      }),
    });
  } catch {
    return errResponse("AI service unreachable. Try again in a moment.", 502);
  }
  if (!groqRes.ok || !groqRes.body) {
    return errResponse(`AI service error (${groqRes.status})`, 502);
  }

  const startMs = Date.now();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqRes.body.getReader();
  let full = "";
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        // Finalize the logged row with the full answer + latency (best-effort).
        if (consented && interactionId) {
          try {
            await supabase
              .from("tutor_interactions")
              .update({ response_text: full, duration_ms: Date.now() - startMs })
              .eq("id", interactionId);
          } catch {
            /* best-effort */
          }
        }
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // keep the trailing partial line
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          /* ignore keepalive / non-JSON lines */
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  const headers: Record<string, string> = {
    ...CORS_HEADERS,
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
  };
  if (interactionId) headers["X-Interaction-Id"] = interactionId;

  return new Response(stream, { headers });
});
