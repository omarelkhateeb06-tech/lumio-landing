/**
 * Lumio v2 — "Atelier"
 * Restrained luxury editorial. Single column reading column. No masthead,
 * no mono, no terminal aesthetic. The hero headline literally breathes
 * (variable-Fraunces opsz/wght/SOFT axes animated over 6s).
 *
 * Aesthetic reference: NYT Magazine feature + Aesop product page + Pitchfork review.
 * One serif, restrained DM Sans, generous whitespace, hairline frames,
 * multi-layer warm shadows.
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Loader2, Check, RefreshCw, Sparkles, X } from "lucide-react";
import { ease, dur, stagger, splitWords } from "@/lib/motion";
import { captureEmail, runPromptRunner, type PromptRunnerResponse } from "@/lib/supabase";

const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";

// Atelier palette: warm cream + espresso ink + single signal amber + surgical green
const C = {
  cream: "#F4F0E8",
  paperHi: "#FAF7F0",       // header strips
  espresso: "#3D2C1E",      // headlines (warm vs black)
  ink: "#1C1411",           // body
  umber: "#52443A",          // muted body
  amber: "#D45A1A",         // single signal color
  forest: "#1F4A35",
  hairline: "rgba(60, 44, 30, 0.10)",
  hairlineSoft: "rgba(60, 44, 30, 0.06)",
} as const;

// Multi-layer warm shadow with amber bottom tint
const SHADOW = {
  card: `0 1px 0 rgba(255,255,255,0.9) inset, 0 1px 2px rgba(60,44,30,0.04), 0 8px 24px -12px rgba(60,44,30,0.08), 0 24px 48px -24px rgba(212,90,26,0.10)`,
  lift: `0 1px 0 rgba(255,255,255,0.95) inset, 0 2px 4px rgba(60,44,30,0.05), 0 16px 40px -16px rgba(60,44,30,0.10), 0 40px 80px -40px rgba(212,90,26,0.12)`,
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Minimal nav (no masthead)
// ──────────────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-8 flex items-baseline justify-between">
        <a
          href="/"
          className="font-serif text-2xl tracking-tight"
          style={{
            color: C.espresso,
            fontVariationSettings: '"opsz" 72, "wght" 400',
          }}
        >
          Lumio
        </a>
        <nav className="flex items-baseline gap-8 text-sm" style={{ color: C.umber }}>
          <a href="#how" className="hover:text-current transition-colors" style={{ color: C.umber }}>
            How it works
          </a>
          <a href="#curriculum" className="hover:text-current transition-colors" style={{ color: C.umber }}>
            Curriculum
          </a>
          <a
            href={SIGNUP_URL}
            className="font-medium underline underline-offset-4 decoration-1"
            style={{ color: C.espresso, textDecorationColor: C.amber }}
          >
            Subscribe
          </a>
        </nav>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Breathing Hero — Fraunces with animated variable-font axes (the radical move)
// ──────────────────────────────────────────────────────────────────────────────
function BreathingHero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rm = useReducedMotion() ?? false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("That doesn't look like an email.");
      return;
    }
    setSubmitting(true);
    const res = await captureEmail(email, "v2_atelier_hero");
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  const text = `While you're Googling "best ChatGPT prompts," the person next to you just automated their entire Monday.`;
  const italicFrom = text.indexOf("the person next to you");
  const italicTo = italicFrom + "the person next to you".length;
  const words = splitWords(text);
  let charCursor = 0;

  return (
    <section className="relative pt-40 md:pt-48 pb-20 md:pb-28">
      <div className="max-w-[920px] mx-auto px-6 md:px-12 text-center">
        <h1
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: "clamp(48px, 7.5vw, 104px)",
            lineHeight: 0.96,
            letterSpacing: "-0.028em",
            fontVariationSettings: '"opsz" 144, "wght" 420, "SOFT" 30',
            animation: rm ? undefined : "fraunces-breathe 8s ease-in-out infinite",
            textWrap: "balance" as const,
          }}
        >
          {words.map((w, i) => {
            const start = charCursor;
            const end = charCursor + w.length;
            charCursor = end;
            const isItalic = start >= italicFrom && end <= italicTo;
            const wordIndex = words.slice(0, i).filter((s) => s.trim().length > 0).length;
            return (
              <motion.span
                key={i}
                initial={rm ? false : { opacity: 0, y: "0.45em", filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: rm ? 0 : dur.narrative,
                  delay: rm ? 0 : 0.1 + wordIndex * stagger.tight,
                  ease: ease.ink,
                }}
                className="inline-block whitespace-pre"
                style={
                  isItalic
                    ? {
                        fontStyle: "italic",
                        color: C.amber,
                        fontVariationSettings: '"opsz" 144, "wght" 360',
                        lineHeight: 1.1,
                      }
                    : undefined
                }
              >
                {w}
              </motion.span>
            );
          })}
        </h1>

        <motion.p
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.7, ease: ease.ink }}
          className="mt-10 mx-auto max-w-[520px]"
          style={{ color: C.umber, fontSize: 18, lineHeight: 1.55 }}
        >
          A 5-minute lesson in your inbox, every workday. Thirty of them, written for the
          person at work who's quietly behind on AI and tired of feeling that way.
        </motion.p>

        <motion.div
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.95, ease: ease.ink }}
          className="mt-12 max-w-[520px] mx-auto"
        >
          {submitted ? (
            <div
              className="flex items-center justify-center gap-3 py-5 px-6 rounded-full mx-auto w-fit"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: SHADOW.card,
                color: C.espresso,
              }}
            >
              <Check className="w-4 h-4" style={{ color: C.forest }} />
              <span className="text-sm">
                You're in. Tomorrow morning, Lesson 1 lands in your inbox.
              </span>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex items-center p-1.5 rounded-full"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: SHADOW.card,
                  border: `1px solid ${C.hairlineSoft}`,
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@work.com"
                  disabled={submitting}
                  className="flex-1 min-w-0 bg-transparent px-5 py-3 text-base focus:outline-none disabled:opacity-50"
                  style={{ color: C.ink }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full text-sm font-medium disabled:opacity-60 whitespace-nowrap transition-colors"
                  style={{ backgroundColor: C.espresso, color: C.cream }}
                >
                  {submitting ? "Sending…" : "Send me Lesson 1"}
                </button>
              </form>
              {error && (
                <p className="text-xs mt-2" style={{ color: "#9B2C2C" }}>
                  {error}
                </p>
              )}
              <p className="text-xs mt-4 leading-relaxed" style={{ color: C.umber }}>
                Free. No card. Reply with what's confusing and I'll rewrite the lesson for you.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Live PromptRunner — Atelier style (light, hairline frame, single column)
// ──────────────────────────────────────────────────────────────────────────────
type RunnerState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; original: string; data: PromptRunnerResponse }
  | { kind: "error"; message: string };

function LightPromptRunner() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [input, setInput] = useState("");
  const [state, setState] = useState<RunnerState>({ kind: "idle" });
  const rm = useReducedMotion() ?? false;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().length < 5) return;
    setState({ kind: "loading" });
    const res = await runPromptRunner(input.trim());
    if (res.ok) setState({ kind: "result", original: input.trim(), data: res.data });
    else setState({ kind: "error", message: res.error });
  }
  function reset() {
    setInput("");
    setState({ kind: "idle" });
  }

  return (
    <section ref={ref} className="py-24 md:py-40">
      <div className="max-w-[920px] mx-auto px-6 md:px-12 text-center">
        <motion.h2
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: dur.beat, ease: ease.ink }}
          className="font-serif mb-6"
          style={{
            color: C.espresso,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: '"opsz" 144, "wght" 380',
          }}
        >
          A working lesson.{" "}
          <em className="font-normal" style={{ color: C.amber }}>
            Right here.
          </em>
        </motion.h2>
        <motion.p
          initial={rm ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: dur.base, delay: 0.15 }}
          className="mb-14 mx-auto max-w-[440px]"
          style={{ color: C.umber, fontSize: 17, lineHeight: 1.55 }}
        >
          Paste a prompt you'd send to ChatGPT or Claude. Lumio rewrites it the way the lesson
          teaches you to.
        </motion.p>

        <div
          className="rounded-3xl text-left"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: SHADOW.lift,
            border: `1px solid ${C.hairlineSoft}`,
          }}
        >
          <div
            className="px-7 py-4 flex items-baseline justify-between"
            style={{
              borderBottom: `1px solid ${C.hairlineSoft}`,
              backgroundColor: C.paperHi,
              borderTopLeftRadius: "calc(1.5rem - 1px)",
              borderTopRightRadius: "calc(1.5rem - 1px)",
            }}
          >
            <span className="text-xs italic font-serif" style={{ color: C.umber }}>
              Lesson IV — Specificity
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.umber }}>
              Live · Free
            </span>
          </div>

          <div className="p-7 md:p-10 min-h-[280px]">
            <AnimatePresence mode="wait">
              {state.kind === "idle" && (
                <motion.form
                  key="idle"
                  onSubmit={submit}
                  initial={rm ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur.fast }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Write me a quarterly review email."
                    rows={3}
                    maxLength={600}
                    className="w-full bg-transparent text-lg resize-none focus:outline-none"
                    style={{
                      color: C.ink,
                      fontFamily: "ui-serif, Fraunces, Georgia, serif",
                      lineHeight: 1.4,
                    }}
                  />
                  <div
                    className="mt-5 pt-4 flex items-center justify-between gap-4"
                    style={{ borderTop: `1px solid ${C.hairlineSoft}` }}
                  >
                    <span className="text-xs" style={{ color: C.umber }}>
                      {input.length}/600
                    </span>
                    <button
                      type="submit"
                      disabled={input.trim().length < 5}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-opacity disabled:opacity-30"
                      style={{ backgroundColor: C.amber, color: "#FFFFFF" }}
                    >
                      <Sparkles className="w-4 h-4" /> Rewrite it
                    </button>
                  </div>
                </motion.form>
              )}

              {state.kind === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 py-12"
                >
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.amber }} />
                  <span className="text-sm italic" style={{ color: C.umber }}>
                    Reading your prompt…
                  </span>
                </motion.div>
              )}

              {state.kind === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8"
                >
                  <p className="text-sm mb-2" style={{ color: C.ink }}>
                    Couldn't complete the request. Try again.
                  </p>
                  <p className="text-sm mb-6" style={{ color: C.umber }}>
                    {state.message}
                  </p>
                  <button onClick={reset} className="text-sm flex items-center gap-2" style={{ color: C.amber }}>
                    <RefreshCw className="w-4 h-4" /> Try another
                  </button>
                </motion.div>
              )}

              {state.kind === "result" && (
                <motion.div
                  key="result"
                  initial={rm ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur.base, ease: ease.glass }}
                >
                  <div className="mb-8">
                    <div className="text-[10px] uppercase tracking-[0.22em] mb-3 flex items-center gap-2" style={{ color: C.umber }}>
                      <X className="w-3 h-3" /> Your prompt
                    </div>
                    <p
                      className="text-base italic"
                      style={{
                        color: C.umber,
                        fontFamily: "ui-serif, Fraunces, Georgia, serif",
                        lineHeight: 1.5,
                      }}
                    >
                      {state.original}
                    </p>
                  </div>
                  <div
                    className="pt-8"
                    style={{ borderTop: `1px solid ${C.hairlineSoft}` }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.22em] mb-3 flex items-center gap-2" style={{ color: C.amber }}>
                      <Sparkles className="w-3 h-3" /> Lumio rewrite
                    </div>
                    <p
                      className="text-base whitespace-pre-line"
                      style={{
                        color: C.ink,
                        fontFamily: "ui-serif, Fraunces, Georgia, serif",
                        lineHeight: 1.55,
                      }}
                    >
                      {state.data.improved_prompt}
                    </p>
                    <p
                      className="mt-6 pt-4 text-sm italic"
                      style={{ borderTop: `1px solid ${C.hairlineSoft}`, color: C.forest }}
                    >
                      {state.data.why_better}
                    </p>
                    <div className="mt-8 flex items-center gap-5">
                      <a
                        href={SIGNUP_URL}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: C.amber, color: "#FFFFFF" }}
                      >
                        Get all 30 lessons <ArrowRight className="w-4 h-4" />
                      </a>
                      <button onClick={reset} className="text-sm" style={{ color: C.umber }}>
                        Try another →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Curriculum: NYT-style TOC table, single column
// ──────────────────────────────────────────────────────────────────────────────
const SAMPLE_LESSONS = [
  { n: "01", title: "When to use ChatGPT vs. Google" },
  { n: "02", title: "Reading a model's hallucination" },
  { n: "03", title: "The 3-step framing technique" },
  { n: "04", title: "The quarterly review prompt" },
  { n: "05", title: "Meeting recap that managers read" },
  { n: "06", title: "Drafting the message you're avoiding" },
  { n: "07", title: "Brainstorm without the slop" },
  { n: "08", title: "Editing your own writing with AI" },
  { n: "09", title: "The reusable prompt library" },
  { n: "10", title: "When to stop using AI for the task" },
];

function CurriculumList() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useReducedMotion() ?? false;
  return (
    <section ref={ref} id="curriculum" className="py-24 md:py-40">
      <div className="max-w-[760px] mx-auto px-6 md:px-12">
        <h2
          className="font-serif text-center mb-16"
          style={{
            color: C.espresso,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: '"opsz" 144, "wght" 380',
          }}
        >
          The first ten lessons.
        </h2>
        <ul>
          {SAMPLE_LESSONS.map((les, i) => (
            <motion.li
              key={les.n}
              initial={rm ? false : { opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: dur.base,
                delay: i * stagger.base,
                ease: ease.ink,
              }}
              className="grid grid-cols-12 gap-4 items-baseline py-5"
              style={{ borderTop: i === 0 ? `1px solid ${C.hairline}` : "none", borderBottom: `1px solid ${C.hairline}` }}
            >
              <span
                className="col-span-1 font-serif italic"
                style={{
                  color: C.umber,
                  fontSize: 18,
                  fontVariationSettings: '"opsz" 72, "wght" 320',
                }}
              >
                {les.n}
              </span>
              <span
                className="col-span-9 font-serif"
                style={{
                  color: C.espresso,
                  fontSize: 22,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 72, "wght" 400',
                }}
              >
                {les.title}
              </span>
              <span className="col-span-2 text-right text-xs" style={{ color: C.umber }}>
                5 min
              </span>
            </motion.li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm italic" style={{ color: C.umber }}>
          + twenty more, one per workday until you're fluent.
        </p>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Final CTA — quiet, with oversized italic numeral as architecture
// ──────────────────────────────────────────────────────────────────────────────
function QuietFinal() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div
        aria-hidden
        className="absolute right-[-10vw] top-1/2 -translate-y-1/2 pointer-events-none font-serif italic select-none"
        style={{
          fontSize: "clamp(280px, 42vw, 620px)",
          color: C.espresso,
          opacity: 0.05,
          lineHeight: 0.8,
          fontVariationSettings: '"opsz" 144, "wght" 240',
        }}
      >
        5
      </div>
      <div className="relative max-w-[760px] mx-auto px-6 md:px-12 text-center">
        <h2
          className="font-serif mb-10"
          style={{
            color: C.espresso,
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: '"opsz" 144, "wght" 360',
          }}
        >
          Five minutes a day.{" "}
          <em className="font-normal" style={{ color: C.amber }}>
            Three Mondays
          </em>{" "}
          from now you're the one being asked.
        </h2>
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-medium"
          style={{ backgroundColor: C.espresso, color: C.cream }}
        >
          Start tomorrow morning <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function AtelierHome() {
  useEffect(() => {
    // No-op effect to ensure mount semantics match Dispatch (helps with route switching)
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip relative" style={{ backgroundColor: C.cream, color: C.ink }}>
      <Nav />
      <BreathingHero />
      <LightPromptRunner />
      <CurriculumList />
      <QuietFinal />
      <footer className="py-12" style={{ borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[920px] mx-auto px-6 md:px-12 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm italic" style={{ color: C.umber }}>
            Lumio. A lesson a day for the curious and behind.
          </p>
          <p className="text-xs" style={{ color: C.umber }}>
            © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
