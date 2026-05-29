/**
 * Lumio v2 — "Dispatch"
 * Editorial newsroom + terminal. Masthead with live date stamp, dark band for
 * the live PromptRunner, typographic 30-lesson index, drop-cap How-it-works.
 *
 * Color system: newsprint paper + true ink + one signal orange.
 * Type system: Fraunces (surgical) + DM Sans + JetBrains Mono (date/terminal/mono).
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ease, dur, stagger, splitWords } from "@/lib/motion";
import { captureEmail, runPromptRunner, type PromptRunnerResponse } from "@/lib/supabase";

const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";

// ──────────────────────────────────────────────────────────────────────────────
// Design tokens (Dispatch palette)
// ──────────────────────────────────────────────────────────────────────────────
const C = {
  paper: "#F1EEE6",        // newsprint background
  ink: "#0E0D0B",          // true black ink
  espresso: "#3D2C1E",     // warm headline ink (vs pure black)
  umber: "#52443A",        // muted body text (passes WCAG on paper)
  orange: "#E85D04",       // single signal orange (WCAG-compliant)
  amberPaper: "#F7D9B5",   // amber tint for highlights
  forest: "#0B3D2E",       // surgical green — live state dot only
  hairline: "rgba(14, 13, 11, 0.08)",
  inkSoft: "rgba(14, 13, 11, 0.55)",
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Masthead: live date + dispatch number + subscriber count
// ──────────────────────────────────────────────────────────────────────────────
function Masthead({ scrolled, subscriberCount }: { scrolled: boolean; subscriberCount: number }) {
  const today = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const dateStamp = `${days[today.getDay()]} · ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  // Dispatch number = days since Lumio v0 launch (anchor: 2026-01-01)
  const launch = new Date("2026-01-01").getTime();
  const dispatchNo = String(Math.floor((today.getTime() - launch) / 86400000)).padStart(3, "0");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-colors"
      style={{
        backgroundColor: scrolled ? `${C.paper}EE` : "transparent",
        borderBottom: scrolled ? `1px solid ${C.hairline}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-3.5 flex items-baseline justify-between gap-6">
        <a href="/" className="font-serif text-2xl font-medium tracking-tight" style={{ color: C.ink }}>
          Lumio
          <span className="inline-block ml-1 italic font-light" style={{ color: C.orange }}>
            .
          </span>
        </a>
        <div
          className="hidden md:flex items-baseline gap-4 text-[10px] font-medium uppercase tracking-[0.22em] tabular-nums"
          style={{ color: C.umber, fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace" }}
        >
          <span>Vol. I</span>
          <span>·</span>
          <span>No. {dispatchNo}</span>
          <span>·</span>
          <span>{dateStamp}</span>
          <span>·</span>
          <span>
            <span style={{ color: C.forest }}>●</span> {subscriberCount.toLocaleString()} inboxes
          </span>
        </div>
        <a
          href={SIGNUP_URL}
          className="text-[12px] font-medium underline underline-offset-4 decoration-1"
          style={{ color: C.ink, textDecorationColor: C.orange }}
        >
          Subscribe
        </a>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Word-by-word mask reveal for the hero headline
// ──────────────────────────────────────────────────────────────────────────────
function HeadlineReveal({
  text,
  italicFrom,
  italicTo,
}: {
  text: string;
  italicFrom: number;
  italicTo: number;
}) {
  const rm = useReducedMotion() ?? false;
  const words = splitWords(text);
  let charCursor = 0;
  return (
    <h1
      className="font-serif tracking-tight"
      style={{
        color: C.espresso,
        fontSize: "clamp(48px, 7vw, 92px)",
        lineHeight: 0.96,
        fontVariationSettings: '"opsz" 144, "wght" 420, "SOFT" 30',
        letterSpacing: "-0.028em",
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
            initial={rm ? false : { opacity: 0, y: "0.4em", filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: rm ? 0 : dur.beat,
              delay: rm ? 0 : 0.1 + wordIndex * stagger.tight,
              ease: ease.ink,
            }}
            className="inline-block whitespace-pre"
            style={
              isItalic
                ? {
                    fontStyle: "italic",
                    color: C.orange,
                    fontVariationSettings: '"opsz" 144, "wght" 380',
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
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Live PromptRunner — Dispatch styling (dark band, terminal aesthetic)
// ──────────────────────────────────────────────────────────────────────────────
type RunnerState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; original: string; data: PromptRunnerResponse }
  | { kind: "error"; message: string };

const EXAMPLES = [
  "Write me a quarterly review email.",
  "Summarize this meeting transcript.",
  "Help me with my onboarding deck.",
];

function DarkPromptRunner() {
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
    <section
      className="relative"
      style={{ backgroundColor: C.ink, color: C.paper }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div
          className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8 flex items-baseline gap-3"
          style={{ color: "rgba(241,238,230,0.55)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span style={{ color: C.orange }}>●</span>
          <span>LESSON 04 · LIVE</span>
          <span>·</span>
          <span>RUNNING ON GROQ / LLAMA 3.3 70B</span>
        </div>

        <AnimatePresence mode="wait">
          {state.kind === "idle" && (
            <motion.form
              key="idle"
              onSubmit={submit}
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur.fast }}
              className="space-y-6"
            >
              <h2
                className="font-serif"
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.025em",
                  fontVariationSettings: '"opsz" 144, "wght" 380',
                  color: C.paper,
                }}
              >
                Paste a prompt.
                <br />
                <span style={{ color: C.orange, fontStyle: "italic", fontWeight: 350 }}>
                  Watch Lumio fix it.
                </span>
              </h2>
              <div
                className="relative border-t border-b py-6"
                style={{ borderColor: "rgba(241,238,230,0.15)" }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a prompt you'd send to ChatGPT or Claude…"
                  rows={3}
                  maxLength={600}
                  className="w-full bg-transparent text-lg md:text-2xl resize-none focus:outline-none"
                  style={{
                    color: C.paper,
                    fontFamily: "'JetBrains Mono', monospace",
                    caretColor: C.orange,
                  }}
                />
                {input.length === 0 && (
                  <span
                    className="absolute pointer-events-none"
                    style={{
                      top: "1.625rem",
                      left: `${"Type a prompt you'd send to ChatGPT or Claude…".length * 0.5}ch`,
                      width: 2,
                      height: "1.4em",
                      backgroundColor: C.orange,
                      animation: "cursor-blink 1s steps(2) infinite",
                    }}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className="flex flex-wrap items-center gap-2 text-[11px]"
                  style={{
                    color: "rgba(241,238,230,0.55)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span>TRY:</span>
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setInput(e)}
                      className="px-2 py-1 border hover:border-current transition-colors"
                      style={{ borderColor: "rgba(241,238,230,0.2)", color: "rgba(241,238,230,0.75)" }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={input.trim().length < 5}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-tight transition-opacity disabled:opacity-30"
                  style={{ backgroundColor: C.orange, color: C.paper }}
                >
                  Run lesson <ArrowRight className="w-4 h-4" />
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
              transition={{ duration: dur.fast }}
              className="flex items-center gap-4 py-20"
            >
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.orange }} />
              <span
                className="text-sm"
                style={{
                  color: "rgba(241,238,230,0.7)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                lumio is reading your prompt…
              </span>
            </motion.div>
          )}

          {state.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16"
            >
              <p className="text-sm mb-3" style={{ color: C.paper }}>
                Couldn't complete the request. Try again.
              </p>
              <p className="text-sm mb-6" style={{ color: "rgba(241,238,230,0.6)" }}>
                {state.message}
              </p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: C.orange }}
              >
                <RefreshCw className="w-4 h-4" /> Try another
              </button>
            </motion.div>
          )}

          {state.kind === "result" && (
            <motion.div
              key="result"
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: dur.base }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5">
                <div
                  className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
                  style={{
                    color: "rgba(241,238,230,0.45)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Your prompt
                </div>
                <p
                  className="whitespace-pre-line"
                  style={{
                    color: "rgba(241,238,230,0.55)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    lineHeight: 1.6,
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(232,93,4,0.4)",
                  }}
                >
                  {state.original}
                </p>
              </div>
              <div className="lg:col-span-7">
                <div
                  className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3 flex items-center gap-2"
                  style={{ color: C.orange, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <Sparkles className="w-3 h-3" /> Lumio rewrite
                </div>
                <p
                  className="whitespace-pre-line mb-6"
                  style={{
                    color: C.paper,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {state.data.improved_prompt}
                </p>
                <p
                  className="italic pt-4 border-t text-sm"
                  style={{
                    borderColor: "rgba(241,238,230,0.15)",
                    color: "rgba(241,238,230,0.7)",
                  }}
                >
                  {state.data.why_better}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <a
                    href={SIGNUP_URL}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
                    style={{ backgroundColor: C.orange, color: C.paper }}
                  >
                    Get all 30 lessons <ArrowRight className="w-4 h-4" />
                  </a>
                  <button onClick={reset} className="text-sm" style={{ color: "rgba(241,238,230,0.55)" }}>
                    Try another →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 30-Lesson typographic index — replaces the 6-card module grid
// ──────────────────────────────────────────────────────────────────────────────
const CURRICULUM = [
  { module: "I. Foundations", lessons: [
    { n: "01", title: "When to use ChatGPT vs. Google", min: 5, level: "BEG" },
    { n: "02", title: "What a model can and cannot remember", min: 5, level: "BEG" },
    { n: "03", title: "Reading a model's hallucination", min: 6, level: "BEG" },
    { n: "04", title: "The 3-step framing technique", min: 7, level: "BEG" },
    { n: "05", title: "Picking the right model for the job", min: 5, level: "BEG" },
  ]},
  { module: "II. Everyday work", lessons: [
    { n: "06", title: "Inbox: from 60 emails to 10 in 20 minutes", min: 6, level: "BEG" },
    { n: "07", title: "The quarterly review prompt", min: 5, level: "BEG" },
    { n: "08", title: "Meeting recap that managers read", min: 5, level: "BEG" },
    { n: "09", title: "Calendar triage with one prompt", min: 4, level: "BEG" },
    { n: "10", title: "Drafting the message you're avoiding", min: 6, level: "BEG" },
  ]},
  { module: "III. Creation", lessons: [
    { n: "11", title: "First draft: the writer's chair", min: 6, level: "INT" },
    { n: "12", title: "Brainstorm without the slop", min: 5, level: "INT" },
    { n: "13", title: "Image prompts that don't look like AI", min: 7, level: "INT" },
    { n: "14", title: "Editing your own writing with AI", min: 6, level: "INT" },
    { n: "15", title: "Slide decks: outline, then expand", min: 6, level: "INT" },
  ]},
  { module: "IV. Workflows", lessons: [
    { n: "16", title: "The reusable prompt library", min: 6, level: "INT" },
    { n: "17", title: "Connecting Claude to your docs", min: 7, level: "INT" },
    { n: "18", title: "Custom GPTs, plainly explained", min: 6, level: "INT" },
    { n: "19", title: "Automating the same task twice", min: 6, level: "INT" },
    { n: "20", title: "When to stop using AI for the task", min: 5, level: "INT" },
  ]},
  { module: "V. Industry", lessons: [
    { n: "21", title: "AI for product managers", min: 6, level: "ADV" },
    { n: "22", title: "AI for marketing & growth", min: 6, level: "ADV" },
    { n: "23", title: "AI for finance & operations", min: 6, level: "ADV" },
    { n: "24", title: "AI for design teams", min: 6, level: "ADV" },
    { n: "25", title: "AI for support & success", min: 6, level: "ADV" },
  ]},
  { module: "VI. Building", lessons: [
    { n: "26", title: "Prompt → product: shipping a tiny tool", min: 8, level: "ADV" },
    { n: "27", title: "Agents, explained without the hype", min: 7, level: "ADV" },
    { n: "28", title: "Evals: how to know it's working", min: 8, level: "ADV" },
    { n: "29", title: "AI fluency in your team", min: 6, level: "ADV" },
    { n: "30", title: "What good looks like, six months in", min: 7, level: "ADV" },
  ]},
];

function CurriculumIndex() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useReducedMotion() ?? false;
  return (
    <section ref={ref} className="py-24 md:py-40" style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-3">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              The curriculum
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2
              className="font-serif"
              style={{
                color: C.espresso,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 144, "wght" 380',
              }}
            >
              Six modules. Thirty lessons. <em className="font-normal" style={{ color: C.orange }}>One per workday.</em>
            </h2>
          </div>
        </div>

        <div className="space-y-12">
          {CURRICULUM.map((mod, modIdx) => (
            <motion.div
              key={mod.module}
              initial={rm ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: dur.base, delay: modIdx * stagger.base, ease: ease.glass }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 pt-8"
              style={{ borderTop: `1px solid ${C.hairline}` }}
            >
              <div className="lg:col-span-3">
                <div
                  className="font-serif italic"
                  style={{
                    color: C.umber,
                    fontSize: 22,
                    fontVariationSettings: '"opsz" 72, "wght" 350',
                  }}
                >
                  {mod.module}
                </div>
              </div>
              <ul className="lg:col-span-9 divide-y" style={{ borderColor: C.hairline }}>
                {mod.lessons.map((les) => (
                  <li
                    key={les.n}
                    className="grid grid-cols-12 gap-3 py-3 items-baseline group hover:bg-black/[0.02] transition-colors -mx-3 px-3"
                  >
                    <span
                      className="col-span-1 tabular-nums"
                      style={{
                        color: C.umber,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                      }}
                    >
                      {les.n}
                    </span>
                    <span
                      className="col-span-7 md:col-span-8 font-serif"
                      style={{
                        color: C.ink,
                        fontSize: 18,
                        fontVariationSettings: '"opsz" 72, "wght" 400',
                      }}
                    >
                      {les.title}
                    </span>
                    <span
                      className="col-span-2 md:col-span-2 text-right tabular-nums"
                      style={{
                        color: C.umber,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                      }}
                    >
                      {les.min} min
                    </span>
                    <span
                      className="col-span-2 md:col-span-1 text-right"
                      style={{
                        color: les.level === "BEG" ? C.forest : les.level === "INT" ? C.orange : C.espresso,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {les.level}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Final CTA — architectural italic numeral bleeding off the right edge
// ──────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48" style={{ backgroundColor: C.paper }}>
      <div
        aria-hidden
        className="absolute right-[-8vw] top-1/2 -translate-y-1/2 pointer-events-none font-serif italic select-none"
        style={{
          fontSize: "clamp(280px, 38vw, 580px)",
          color: C.amberPaper,
          opacity: 0.45,
          lineHeight: 0.8,
          fontVariationSettings: '"opsz" 144, "wght" 280',
        }}
      >
        5
      </div>
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="max-w-[640px]">
          <div
            className="text-[10px] uppercase tracking-[0.22em] font-medium mb-6"
            style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Subscribe
          </div>
          <h2
            className="font-serif mb-8"
            style={{
              color: C.espresso,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 144, "wght" 380',
            }}
          >
            Five minutes a day.
            <br />
            <em className="font-normal" style={{ color: C.orange }}>
              Three Mondays from now
            </em>{" "}
            you're the one being asked.
          </h2>
          <a
            href={SIGNUP_URL}
            className="inline-flex items-center gap-2 px-7 py-4 text-base font-medium"
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            Start tomorrow morning <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Hero — asymmetric, masthead-aware, big editorial type
// ──────────────────────────────────────────────────────────────────────────────
function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("That doesn't look like an email.");
      return;
    }
    setSubmitting(true);
    const res = await captureEmail(email, "v2_dispatch_hero");
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  const text = `While you're Googling "best ChatGPT prompts," the person next to you just automated their entire Monday.`;
  const italicFrom = text.indexOf("the person next to you");
  const italicTo = italicFrom + "the person next to you".length;

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-32" style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-2 hidden lg:block">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium tabular-nums"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              p. 01 / 04
            </div>
          </div>
          <div className="lg:col-span-8">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              The dispatch
            </div>
            <HeadlineReveal text={text} italicFrom={italicFrom} italicTo={italicTo} />
            <p
              className="mt-10 max-w-[560px]"
              style={{ color: C.umber, fontSize: 17, lineHeight: 1.55 }}
            >
              Catch up in 5 minutes a day. 30 lessons, one per workday. By lesson 10 you'll save an hour a week. By lesson 30 you'll be the person your team asks.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={SIGNUP_URL}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium"
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                Try Lesson 1, free <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#curriculum"
                className="text-sm underline underline-offset-4 decoration-1"
                style={{ color: C.ink, textDecorationColor: C.umber }}
              >
                or see the full curriculum
              </a>
            </div>

            <div className="mt-12 pt-8 max-w-[560px]" style={{ borderTop: `1px solid ${C.hairline}` }}>
              {submitted ? (
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-1 shrink-0" style={{ color: C.forest }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: C.ink }}>
                      You're in. Tomorrow morning, Lesson 1 lands in your inbox.
                    </p>
                    <p className="text-xs mt-1" style={{ color: C.umber }}>
                      Hit reply with what's still confusing. I read every one.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm mb-3" style={{ color: C.ink }}>
                    Or get Lesson 1 in your inbox:{" "}
                    <em style={{ color: C.umber, fontStyle: "italic" }}>
                      When to use ChatGPT vs. Google.
                    </em>
                  </p>
                  <form onSubmit={handleSubmit} className="flex gap-0">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@work.com"
                      disabled={submitting}
                      className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none disabled:opacity-50"
                      style={{
                        backgroundColor: "transparent",
                        color: C.ink,
                        border: `1px solid ${C.hairline}`,
                        borderRight: "none",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-3 text-sm font-medium disabled:opacity-60 whitespace-nowrap"
                      style={{ backgroundColor: C.orange, color: C.paper }}
                    >
                      {submitting ? "Sending…" : "Send"}
                    </button>
                  </form>
                  {error && (
                    <p className="text-xs mt-2" style={{ color: "#9B2C2C" }}>
                      {error}
                    </p>
                  )}
                  <p className="text-xs mt-4 leading-relaxed" style={{ color: C.umber }}>
                    Reply and tell me what's confusing. I'll rewrite the lesson and send it back.{" "}
                    <span style={{ color: C.inkSoft }}>/ Omar, building this solo.</span>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 hidden lg:block">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium tabular-nums"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Filed by Omar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function DispatchHome() {
  const [scrolled, setScrolled] = useState(false);
  const [subs, setSubs] = useState(1284);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Slow counter tick to feel "alive" without being noisy
    const t = setInterval(() => setSubs((s) => s + Math.round(Math.random() * 2)), 12000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  return (
    <div className="v2-grain min-h-screen overflow-x-clip" style={{ backgroundColor: C.paper, color: C.ink }}>
      <Masthead scrolled={scrolled} subscriberCount={subs} />
      <Hero />
      <DarkPromptRunner />
      <CurriculumIndex />
      <FinalCTA />
      <footer
        className="py-12"
        style={{ backgroundColor: C.paper, borderTop: `1px solid ${C.hairline}` }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap items-baseline justify-between gap-4">
          <div
            className="text-[10px] uppercase tracking-[0.22em] font-medium"
            style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Lumio. A daily dispatch on AI for knowledge workers.
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.22em] font-medium"
            style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
          >
            © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
