// ─────────────────────────────────────────────────────────────────────────────
// Lumio client-side data capture — sessions, behavioral events, and the in-app
// AI tutor query log. Every write here is BEST-EFFORT and fire-and-forget: a
// logging failure must never disrupt the learning UX. RLS pins each row to the
// signed-in caller, so these only work for authenticated users (anonymous
// landing telemetry lives elsewhere: waitlist_signups + prompt_runner_logs).
//
// Event vocabulary (analytics_events.event_type) — keep these stable so the
// reporting views can rely on them:
//   session_start, module_entered, module_exit, module_replayed,
//   lesson_started, lesson_completed, block_viewed, cert_started,
//   cert_paid, cert_completed, prompt_runner_used, invite_shared
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "./supabase";

// Read the user id from the LOCAL session (no network round-trip) — these are
// hot-path logging calls, so getSession() is correct here, not getUser().
async function currentUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

// ── Sessions ─────────────────────────────────────────────────────────────────

let currentSessionId: string | null = null;
let sessionStartMs = 0;

/** Open a session row on app entry, capturing arrival source + entry path. Safe
 *  to call repeatedly; it only opens one session per call and a no-op signed
 *  out. Stores the id in module scope so events attach to it. */
export async function startSession(): Promise<void> {
  try {
    const userId = await currentUserId();
    if (!userId || currentSessionId) return;
    const params = new URLSearchParams(window.location.search);
    const source =
      params.get("utm_source") ||
      (params.get("ref") ? "referral" : "") ||
      (document.referrer && !document.referrer.includes(window.location.host)
        ? "referral"
        : "direct");
    const { data } = await supabase
      .from("user_sessions")
      .insert({
        user_id: userId,
        source,
        entry_path: window.location.pathname,
        user_agent: navigator.userAgent.slice(0, 300),
      })
      .select("id")
      .single();
    if (data) {
      currentSessionId = (data as { id: string }).id;
      sessionStartMs = Date.now();
      void logEvent("session_start");
    }
  } catch {
    /* best-effort */
  }
}

/** Close the open session, stamping ended_at + duration. Call on page hide. */
export async function endSession(): Promise<void> {
  const id = currentSessionId;
  if (!id) return;
  currentSessionId = null;
  const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartMs) / 1000));
  try {
    await supabase
      .from("user_sessions")
      .update({ ended_at: new Date().toISOString(), duration_seconds: durationSeconds })
      .eq("id", id);
  } catch {
    /* best-effort */
  }
}

// ── Behavioral events ────────────────────────────────────────────────────────

/** Log a behavioral event (see the vocabulary above). Fire-and-forget. */
export async function logEvent(
  eventType: string,
  opts: { lessonId?: string; moduleId?: string; metadata?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    const userId = await currentUserId();
    if (!userId) return;
    await supabase.from("analytics_events").insert({
      user_id: userId,
      session_id: currentSessionId,
      event_type: eventType,
      lesson_id: opts.lessonId ?? null,
      module_id: opts.moduleId ?? null,
      metadata: opts.metadata ?? {},
    });
  } catch {
    /* best-effort */
  }
}

// ── In-app AI tutor query log (the crown-jewel asset) ────────────────────────

/** Log one in-app AI tutor exchange, tied to user + lesson + module + block.
 *  Returns the row id so the caller can later patch replayed_after /
 *  exited_after. Returns null on any failure (never throws). */
export async function logTutorInteraction(args: {
  lessonId?: string;
  moduleId?: string;
  blockId?: string;
  queryText: string;
  responseText?: string;
  iterationCount?: number;
  durationMs?: number;
}): Promise<string | null> {
  try {
    const userId = await currentUserId();
    if (!userId || !args.queryText?.trim()) return null;
    const { data, error } = await supabase
      .from("tutor_interactions")
      .insert({
        user_id: userId,
        lesson_id: args.lessonId ?? null,
        module_id: args.moduleId ?? null,
        block_id: args.blockId ?? null,
        query_text: args.queryText,
        response_text: args.responseText ?? null,
        iteration_count: args.iterationCount ?? 1,
        duration_ms: args.durationMs ?? null,
      })
      .select("id")
      .single();
    if (error || !data) return null;
    return (data as { id: string }).id;
  } catch {
    return null;
  }
}

/** Patch a logged tutor interaction once we know what the learner did next
 *  (replayed the lesson, or left the session). Best-effort. */
export async function patchTutorInteraction(
  id: string,
  patch: { replayedAfter?: boolean; exitedAfter?: boolean },
): Promise<void> {
  if (!id) return;
  try {
    await supabase
      .from("tutor_interactions")
      .update({
        replayed_after: patch.replayedAfter ?? null,
        exited_after: patch.exitedAfter ?? null,
      })
      .eq("id", id);
  } catch {
    /* best-effort */
  }
}
