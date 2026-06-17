import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TryItLiveContent } from "@/lib/curriculum";
import { C, FONT_MONO, FOCUS_RING } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { supabase, fetchAiTutorConsent, setAiTutorConsent } from "@/lib/supabase";
import { patchTutorInteraction } from "@/lib/analytics";
import { BlockCard, BlockLabel, useMarkViewed } from "./blockChrome";

// Hands-on practice, now live. The reader holds a real conversation with the
// in-app tutor (the ask-tutor Edge Function), which streams its reply back as
// plain text against the lesson's own system_prompt. The block teaches by doing:
// after a few exchanges it offers a reference answer to compare against, never a
// correct-answer verdict.
//
// The Edge Function owns the query log (consent-gated) and hands back an
// interaction id via the x-interaction-id header. We only read that id so we can
// patch exited_after on unmount; we never log the exchange from the client.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// How long after the last completed reply a quick exit still counts as "bounced
// off the answer". Drives the exited_after signal the confusion map consumes.
const EXIT_WINDOW_MS = 60_000;

// Exchanges completed before the reference answer becomes available. Practising
// first is the point; the model answer is a comparison, not a shortcut.
const REVEAL_AFTER_EXCHANGES = 3;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TryItLiveBlock({
  blockId,
  content,
  lessonId,
  lessonSlug,
}: {
  blockId: string;
  content: TryItLiveContent;
  lessonId: string;
  lessonSlug: string;
}) {
  useMarkViewed(blockId);
  const rm = useReducedMotion() ?? false;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Consent: the real profile flag. While null we don't yet know; the notice is
  // only ever shown once, gated on this being a confirmed `false`.
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showConsentNotice, setShowConsentNotice] = useState(false);

  // Completed-exchange count (a "user send + finished assistant reply" pair).
  const [exchanges, setExchanges] = useState(0);

  // Running count of user sends; the Nth send is iteration N. Mutable ref so it
  // stays correct even if two sends are queued before a re-render lands.
  const iterationRef = useRef(0);

  // The most recent logged interaction id + when its reply finished, read on
  // unmount to decide whether to stamp exited_after. Refs so the cleanup closure
  // always sees the latest values without re-subscribing.
  const lastInteractionIdRef = useRef<string | null>(null);
  const lastCompletedAtRef = useRef<number>(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const draftRef = useRef("");
  draftRef.current = draft;

  // lessonSlug is part of the block's lesson context (kept alongside lessonId for
  // symmetry with the rest of the reader); the tutor is keyed by id server-side.
  void lessonSlug;

  // One-time consent read on mount.
  useEffect(() => {
    let cancelled = false;
    void fetchAiTutorConsent().then((ok) => {
      if (!cancelled) setConsent(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // On unmount: if the learner left right after a reply finished and we have an
  // interaction id, mark it as an exit. Best-effort, swallowing any failure.
  useEffect(() => {
    return () => {
      const id = lastInteractionIdRef.current;
      if (id && Date.now() - lastCompletedAtRef.current < EXIT_WINDOW_MS) {
        void patchTutorInteraction(id, { exitedAfter: true });
      }
    };
  }, []);

  // Keep the conversation pinned to the latest turn as it streams.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Send the current draft to the tutor and stream the reply into a fresh
  // assistant bubble. Assumes consent has been resolved (the gate runs first).
  async function send() {
    const text = draftRef.current.trim();
    if (!text || sending) return;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError("The tutor is not configured right now.");
      return;
    }

    setError(null);

    // The history we send is every prior turn, NOT the new message.
    const priorHistory = messages.map((m) => ({ role: m.role, content: m.content }));
    const iteration = iterationRef.current + 1;
    iterationRef.current = iteration;

    // Optimistically render the user bubble + an empty assistant bubble to stream
    // into, and clear the input.
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setDraft("");
    setSending(true);

    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        throw new Error("no-session");
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/ask-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          message: text,
          system_prompt: content.system_prompt,
          conversation_history: priorHistory,
          lesson_id: lessonId,
          block_id: blockId,
          iteration_count: iteration,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`http-${res.status}`);
      }

      // Capture the logged-row id (present only when the user has consented).
      const interactionId = res.headers.get("x-interaction-id");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        // Replace the last assistant bubble's content with the running answer.
        setMessages((prev) => {
          const next = prev.slice();
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "assistant") {
              next[i] = { role: "assistant", content: answer };
              break;
            }
          }
          return next;
        });
      }

      if (interactionId) {
        lastInteractionIdRef.current = interactionId;
      }
      lastCompletedAtRef.current = Date.now();
      setExchanges((n) => n + 1);
    } catch {
      // Quiet inline error; drop the empty assistant bubble we added.
      setMessages((prev) => {
        const next = prev.slice();
        if (next.length && next[next.length - 1].role === "assistant" && !next[next.length - 1].content) {
          next.pop();
        }
        return next;
      });
      setError("Something went wrong reaching the tutor. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  // Gate the very first send behind the one-time consent notice. If consent is
  // already true (or the flag is still loading and turns out true), we send
  // straight away. A confirmed false shows the notice exactly once.
  function attemptSend() {
    if (!draftRef.current.trim() || sending) return;
    if (consent === false && !showConsentNotice) {
      setShowConsentNotice(true);
      return;
    }
    void send();
  }

  // "OK, got it": record consent, flip local state, dismiss the notice, and send.
  function acceptConsent() {
    setShowConsentNotice(false);
    setConsent(true);
    void setAiTutorConsent();
    void send();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      attemptSend();
    }
  }

  if (!content.system_prompt || !content.system_prompt.trim()) return null;

  const canReveal = exchanges >= REVEAL_AFTER_EXCHANGES;

  return (
    <BlockCard>
      <BlockLabel>Try it live</BlockLabel>

      {/* Read-only task card */}
      <div
        className="px-5 py-4 rounded-xl mb-5"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
      >
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-2"
          style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
        >
          Your task
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.espresso }}>
          {content.instructions}
        </p>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="rounded-xl p-4 mb-3 overflow-y-auto"
        style={{
          backgroundColor: C.paper,
          border: `1px solid ${C.hairline}`,
          maxHeight: 360,
          minHeight: 96,
        }}
        aria-live="polite"
        aria-label="Conversation with the tutor"
      >
        {messages.length === 0 ? (
          <p className="text-sm leading-relaxed py-2" style={{ color: C.inkSoft }}>
            Write your attempt below and send it to get live feedback from the tutor.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      isUser
                        ? { backgroundColor: C.ink, color: C.paper }
                        : {
                            backgroundColor: C.surface,
                            color: C.espresso,
                            border: `1px solid ${C.hairline}`,
                          }
                    }
                  >
                    {m.content || (
                      <span
                        className="inline-flex items-center gap-1"
                        style={{ color: C.inkSoft }}
                        aria-label="Tutor is thinking"
                      >
                        <span className="animate-pulse">Thinking…</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* One-time consent notice (inline, not a modal) */}
      <AnimatePresence>
        {showConsentNotice && (
          <motion.div
            initial={rm ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: dur.fast, ease: ease.ink }}
            role="status"
            className="px-5 py-4 rounded-xl mb-3"
            style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
              Your questions help improve Lumio's curriculum. We may use anonymized query patterns
              to identify learning gaps.
            </p>
            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <button
                onClick={acceptConsent}
                className={`px-4 py-2 rounded-full text-sm font-medium ${FOCUS_RING} cursor-pointer`}
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                OK, got it
              </button>
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm underline underline-offset-2 ${FOCUS_RING}`}
                style={{ color: C.orangeInk }}
              >
                Learn more
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + send */}
      <div className="flex items-end gap-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={content.input_placeholder ?? "Write your attempt here…"}
          rows={2}
          aria-label="Your message to the tutor"
          className={`flex-1 p-3 rounded-xl text-sm resize-y ${FOCUS_RING}`}
          style={{
            backgroundColor: C.surface,
            border: `1.5px solid ${draft.trim() ? C.orange : C.hairline}`,
            color: C.espresso,
            fontFamily: FONT_MONO,
            lineHeight: 1.6,
          }}
        />
        <button
          onClick={attemptSend}
          disabled={sending || !draft.trim()}
          className={`px-5 py-3 rounded-full text-sm font-medium disabled:opacity-50 ${FOCUS_RING} cursor-pointer`}
          style={{ backgroundColor: C.orange, color: C.ink }}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>

      <p className="mt-2 text-[11px]" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
        Enter to send · Shift + Enter for a new line
      </p>

      {/* Quiet inline error */}
      {error && (
        <p className="mt-2 text-sm" style={{ color: C.error }} role="alert">
          {error}
        </p>
      )}

      {/* Reference answer, only after enough practice */}
      {canReveal && (
        <div className="mt-5">
          <button
            onClick={() => setRevealed((v) => !v)}
            aria-expanded={revealed}
            className={`text-sm font-medium ${FOCUS_RING} cursor-pointer`}
            style={{ color: C.orangeInk }}
          >
            {revealed ? "Hide reference answer" : "See a reference answer →"}
          </button>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={rm ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={rm ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: dur.fast, ease: ease.ink }}
                className="mt-4 px-5 py-4 rounded-xl"
                style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
              >
                <div
                  className="text-[11px] uppercase tracking-[0.18em] mb-2"
                  style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
                >
                  One strong version
                </div>
                <p className="text-[12px] mb-3" style={{ color: C.umber }}>
                  There is no single right answer here. Compare this against your own and notice what
                  it does well.
                </p>
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: C.espresso, fontFamily: FONT_MONO }}
                >
                  {content.ideal_output}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </BlockCard>
  );
}
