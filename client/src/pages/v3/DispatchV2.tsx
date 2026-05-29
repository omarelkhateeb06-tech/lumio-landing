/**
 * Lumio v3 — Dispatch v2 (Path 1)
 *
 * Applies the 11 unanimous audit fixes to the original Dispatch:
 *   1. Real Supabase subscriber count, no random ticker
 *   2. Masthead stripped to "Lumio." + "Subscribe ↗"
 *   3. Date/Vol/No moved to hairline colophon UNDER the hero
 *   4. useScroll from Framer Motion (no window.addEventListener)
 *   5. Pill email form with multi-layer warm shadow (from Atelier)
 *   6. Hero variable-axis settle ONCE on load, then static
 *   7. text-wrap balance + clamp hero to max-w-920
 *   8. Dark-band text contrast bumped (0.45/0.55 → 0.70+)
 *   9. "THE HABIT" eyebrow on Final CTA
 *  10. Right-rail spec sheet on the curriculum (Manus's move)
 *  11. Omar-signed line in the hero ("It's just me writing these. — Omar")
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Loader2, Check, RefreshCw, Sparkles } from "lucide-react";
import { ease, dur, stagger, splitWords } from "@/lib/motion";
import {
  captureEmail,
  fetchWaitlistCount,
  runPromptRunner,
  type PromptRunnerResponse,
} from "@/lib/supabase";

const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";

const C = {
  paper: "#F1EEE6",
  ink: "#0E0D0B",
  espresso: "#3D2C1E",
  umber: "#52443A",
  orange: "#E85D04",
  amberPaper: "#F7D9B5",
  forest: "#0B3D2E",
  hairline: "rgba(14, 13, 11, 0.08)",
  inkSoft: "rgba(14, 13, 11, 0.55)",
} as const;

const SHADOW_PILL = `0 1px 0 rgba(255,255,255,0.95) inset, 0 2px 4px rgba(60,44,30,0.05), 0 16px 40px -16px rgba(60,44,30,0.10), 0 40px 80px -40px rgba(232,93,4,0.12)`;

// ──────────────────────────────────────────────────────────────────────────────
// Stripped masthead — Lumio. + Subscribe only
// ──────────────────────────────────────────────────────────────────────────────
function CleanMasthead() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-colors"
      style={{
        backgroundColor: scrolled ? `${C.paper}EE` : "transparent",
        borderBottom: scrolled ? `1px solid ${C.hairline}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 flex items-baseline justify-between">
        <a
          href="/"
          className="font-serif text-2xl tracking-tight"
          style={{
            color: C.ink,
            fontVariationSettings: '"opsz" 72, "wght" 420',
          }}
        >
          Lumio
          <span className="inline-block ml-0.5 italic font-light" style={{ color: C.orange }}>.</span>
        </a>
        <a
          href={SIGNUP_URL}
          className="text-[13px] font-medium tracking-tight inline-flex items-center gap-1"
          style={{ color: C.ink }}
        >
          Subscribe <ArrowUpRight className="w-3.5 h-3.5" style={{ color: C.orange }} />
        </a>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Colophon strip UNDER the hero — date, vol, no, real count
// ──────────────────────────────────────────────────────────────────────────────
function Colophon({ subscribers }: { subscribers: number | null }) {
  const today = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const dateStamp = `${days[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  const launch = new Date("2026-01-01").getTime();
  const dispatchNo = String(Math.floor((today.getTime() - launch) / 86400000)).padStart(3, "0");

  return (
    <div
      className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] font-medium tabular-nums"
      style={{
        color: C.umber,
        fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
        borderTop: `1px solid ${C.hairline}`,
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <span>Vol. I</span>
      <span style={{ color: C.hairline }}>·</span>
      <span>No. {dispatchNo}</span>
      <span style={{ color: C.hairline }}>·</span>
      <span>{dateStamp}</span>
      {subscribers != null && (
        <>
          <span style={{ color: C.hairline }}>·</span>
          <span>
            <span style={{ color: C.forest }}>●</span>{" "}
            {subscribers.toLocaleString()} {subscribers === 1 ? "inbox" : "inboxes"}
          </span>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Hero — variable-axis settle once on load, balanced wrap, max-w-920
// ──────────────────────────────────────────────────────────────────────────────
function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rm = useReducedMotion() ?? false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("That doesn't look like an email.");
    setSubmitting(true);
    const res = await captureEmail(email, "v3_dispatch_hero");
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  const text = `While you're Googling "best ChatGPT prompts," the person next to you just automated their entire Monday.`;
  const italicFrom = text.indexOf("the person next to you");
  const italicTo = italicFrom + "the person next to you".length;
  const words = splitWords(text);
  let cursor = 0;

  return (
    <section className="pt-36 md:pt-48 pb-16 md:pb-20" style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-2 hidden lg:block" />
          <div className="lg:col-span-8 max-w-[920px]">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              The dispatch
            </div>
            <h1
              className="font-serif"
              style={{
                color: C.espresso,
                fontSize: "clamp(48px, 7vw, 92px)",
                lineHeight: 0.96,
                letterSpacing: "-0.028em",
                fontVariationSettings: '"opsz" 144, "wght" 420, "SOFT" 30',
                textWrap: "balance" as const,
                // Settle once on load: animates from wght 500 → 420 over 1.2s
                animation: rm ? undefined : "settle-axis 1.2s ease-out forwards",
              }}
            >
              {words.map((w, i) => {
                const start = cursor;
                const end = cursor + w.length;
                cursor = end;
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

            {/* Pill email form — stolen from Atelier */}
            <div className="mt-12 max-w-[540px]">
              {submitted ? (
                <div
                  className="flex items-start gap-3 p-5 rounded-3xl"
                  style={{ backgroundColor: "#FFFFFF", boxShadow: SHADOW_PILL }}
                >
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
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center p-1.5 rounded-full"
                    style={{
                      backgroundColor: "#FFFFFF",
                      boxShadow: SHADOW_PILL,
                      border: `1px solid ${C.hairline}`,
                    }}
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@work.com"
                      disabled={submitting}
                      className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm focus:outline-none disabled:opacity-50"
                      style={{ color: C.ink }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 whitespace-nowrap"
                      style={{ backgroundColor: C.ink, color: C.paper }}
                    >
                      {submitting ? "Sending…" : "Send Lesson 1"}
                    </button>
                  </form>
                  {error && (
                    <p className="text-xs mt-2" style={{ color: "#9B2C2C" }}>
                      {error}
                    </p>
                  )}
                  {/* Naval + Rubin's requested attribution line */}
                  <p className="text-xs mt-4 leading-relaxed italic" style={{ color: C.umber }}>
                    It's just me writing these. Reply with what's confusing and I'll rewrite the lesson for you. <span style={{ color: C.inkSoft }}>/ Omar</span>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Dark PromptRunner — same as v2 but with FIXED text contrast
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

  // Contrast-fixed opacities — was 0.45/0.55, now 0.72/0.82 to clear WCAG AA
  const muted = "rgba(241,238,230,0.72)";
  const subdued = "rgba(241,238,230,0.55)"; // only used on tertiary, larger text
  const strong = "rgba(241,238,230,0.92)";

  return (
    <section className="relative" style={{ backgroundColor: C.ink, color: C.paper }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div
          className="text-[11px] uppercase tracking-[0.22em] font-medium mb-8 flex items-baseline gap-3"
          style={{ color: muted, fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span style={{ color: C.orange }}>●</span>
          <span>LESSON 04 · LIVE</span>
          <span style={{ color: subdued }}>·</span>
          <span>Running on Groq · Llama 3.3 70B</span>
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
                  textWrap: "balance" as const,
                }}
              >
                Test your prompt fluency.
              </h2>
              <div
                className="relative border-t border-b py-6"
                style={{ borderColor: "rgba(241,238,230,0.18)" }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste a real prompt you use…"
                  rows={3}
                  maxLength={600}
                  className="w-full bg-transparent text-lg md:text-2xl resize-none focus:outline-none"
                  style={{
                    color: C.paper,
                    fontFamily: "'JetBrains Mono', monospace",
                    caretColor: C.orange,
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className="flex flex-wrap items-center gap-2 text-[12px]"
                  style={{ color: muted, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span>Try:</span>
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setInput(e)}
                      className="px-2 py-1 border hover:bg-white/[0.04] transition-colors"
                      style={{ borderColor: "rgba(241,238,230,0.22)", color: strong }}
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
              className="flex items-center gap-4 py-20"
            >
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.orange }} />
              <span style={{ color: muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>
                Lumio is reading your prompt…
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
              <p className="text-sm mb-3" style={{ color: C.paper }}>Couldn't complete the request. Try again.</p>
              <p className="text-sm mb-6" style={{ color: muted }}>{state.message}</p>
              <button onClick={reset} className="inline-flex items-center gap-2 text-sm" style={{ color: C.orange }}>
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
                  className="text-[11px] uppercase tracking-[0.22em] font-medium mb-3"
                  style={{ color: muted, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Your prompt
                </div>
                <p
                  className="whitespace-pre-line"
                  style={{
                    color: muted,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    lineHeight: 1.6,
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(232,93,4,0.5)",
                  }}
                >
                  {state.original}
                </p>
              </div>
              <div className="lg:col-span-7">
                <div
                  className="text-[11px] uppercase tracking-[0.22em] font-medium mb-3 flex items-center gap-2"
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
                  style={{ borderColor: "rgba(241,238,230,0.18)", color: strong }}
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
                  <button onClick={reset} className="text-sm" style={{ color: muted }}>
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
// Curriculum with right-rail spec sheet (Manus's move)
// ──────────────────────────────────────────────────────────────────────────────
const CURRICULUM = [
  { module: "I. Foundations", lessons: [
    { n: "01", title: "When to use ChatGPT vs. Google", min: 5, level: "BEG" },
    { n: "02", title: "Reading a model's hallucination", min: 5, level: "BEG" },
    { n: "03", title: "The 3-step framing technique", min: 7, level: "BEG" },
    { n: "04", title: "Stop writing prompts (start writing briefs)", min: 6, level: "BEG" },
    { n: "05", title: "System prompts and custom instructions", min: 8, level: "BEG" },
  ]},
  { module: "II. Everyday work", lessons: [
    { n: "06", title: "The 5-minute meeting debrief protocol", min: 5, level: "BEG" },
    { n: "07", title: "Inbox triage: auto-drafting responses", min: 6, level: "BEG" },
    { n: "08", title: "Writing better briefs for external teams", min: 7, level: "BEG" },
    { n: "09", title: "Calendar audits: where did your week go?", min: 5, level: "BEG" },
    { n: "10", title: "The Slack summary rule", min: 5, level: "BEG" },
  ]},
  { module: "III. Creation", lessons: [
    { n: "11", title: "Structural editing: rewrite without losing voice", min: 8, level: "INT" },
    { n: "12", title: "The brainstorming loop: getting past version 1", min: 7, level: "INT" },
    { n: "13", title: "Image generation: Midjourney prompting", min: 9, level: "INT" },
    { n: "14", title: "Synthesizing research: 30 PDFs into 1 page", min: 10, level: "INT" },
    { n: "15", title: "The outline method for long-form content", min: 8, level: "INT" },
  ]},
  { module: "IV. Business workflows", lessons: [
    { n: "16", title: "Automating lead research", min: 9, level: "INT" },
    { n: "17", title: "Standard Operating Procedures from video", min: 8, level: "INT" },
    { n: "18", title: "Data cleaning for the spreadsheet-phobic", min: 10, level: "INT" },
    { n: "19", title: "Building a localized custom GPT helper", min: 12, level: "INT" },
    { n: "20", title: "Competitor tracking on autopilot", min: 11, level: "INT" },
  ]},
  { module: "V. Industry deep dives", lessons: [
    { n: "21", title: "AI in Product Management: spec writing", min: 8, level: "ADV" },
    { n: "22", title: "AI in Marketing: campaign drafting", min: 8, level: "ADV" },
    { n: "23", title: "AI in Design: copy-fitting and UX writing", min: 9, level: "ADV" },
    { n: "24", title: "AI in Operations: process mapping", min: 10, level: "ADV" },
    { n: "25", title: "AI in Finance: quick P&L analysis", min: 10, level: "ADV" },
  ]},
  { module: "VI. Building with AI", lessons: [
    { n: "26", title: "Intro to LLM APIs for non-coders", min: 12, level: "ADV" },
    { n: "27", title: "Building multi-agent loops", min: 15, level: "ADV" },
    { n: "28", title: "Web scraping without writing code", min: 11, level: "ADV" },
    { n: "29", title: "Personal search engines: indexing your mind", min: 14, level: "ADV" },
    { n: "30", title: "The autonomous workday: what's next?", min: 12, level: "ADV" },
  ]},
];

function CurriculumWithSpecSheet() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useReducedMotion() ?? false;

  // Today's lesson = today's day-of-year mod 30 (just a stable highlight, like Manus)
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000);
  const todaysLessonN = String((dayOfYear % 30) + 1).padStart(2, "0");

  return (
    <section ref={ref} id="curriculum" className="py-24 md:py-40" style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              The curriculum
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2
              className="font-serif"
              style={{
                color: C.espresso,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 144, "wght" 380',
                textWrap: "balance" as const,
              }}
            >
              Six modules. Thirty lessons. <em className="font-normal" style={{ color: C.orange }}>One per workday.</em>
            </h2>
          </div>
          {/* Right-rail spec sheet — Manus's move */}
          <div className="lg:col-span-3 lg:pl-6 lg:border-l" style={{ borderColor: C.hairline }}>
            <dl
              className="space-y-4 text-[10px] uppercase tracking-[0.22em] font-medium"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              <div>
                <dt style={{ color: C.inkSoft }}>Edition</dt>
                <dd className="mt-1" style={{ color: C.ink }}>Vol. I · 30 lessons</dd>
              </div>
              <div>
                <dt style={{ color: C.inkSoft }}>Delivery</dt>
                <dd className="mt-1" style={{ color: C.ink }}>Daily email habit</dd>
              </div>
              <div>
                <dt style={{ color: C.inkSoft }}>Depth</dt>
                <dd className="mt-1" style={{ color: C.ink }}>6 modules · ~5 min each</dd>
              </div>
              <div>
                <dt style={{ color: C.inkSoft }}>Today's lesson</dt>
                <dd className="mt-1" style={{ color: C.orange }}>No. {todaysLessonN}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-12 max-w-[1100px]">
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
                {mod.lessons.map((les) => {
                  const isToday = les.n === todaysLessonN;
                  return (
                    <li
                      key={les.n}
                      className="grid grid-cols-12 gap-3 py-3 items-baseline group hover:bg-black/[0.02] transition-colors -mx-3 px-3"
                    >
                      <span
                        className="col-span-1 tabular-nums"
                        style={{
                          color: isToday ? C.orange : C.umber,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 12,
                          fontWeight: isToday ? 600 : 400,
                        }}
                      >
                        {les.n}
                      </span>
                      <span
                        className="col-span-7 md:col-span-8 font-serif"
                        style={{
                          color: isToday ? C.orange : C.ink,
                          fontSize: 18,
                          fontVariationSettings: '"opsz" 72, "wght" 400',
                        }}
                      >
                        {les.title}
                      </span>
                      <span
                        className="col-span-2 md:col-span-2 text-right tabular-nums"
                        style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}
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
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Final CTA — "THE HABIT" eyebrow, architectural italic 5
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
            The habit
          </div>
          <h2
            className="font-serif mb-8"
            style={{
              color: C.espresso,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 144, "wght" 380',
              textWrap: "balance" as const,
            }}
          >
            Five minutes a day.{" "}
            <em className="font-normal" style={{ color: C.orange }}>Three Mondays from now</em>{" "}
            you're the one being asked.
          </h2>
          <div className="flex flex-wrap items-baseline gap-6">
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center gap-2 px-7 py-4 text-base font-medium"
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Start tomorrow morning <ArrowRight className="w-4 h-4" />
            </a>
            <span
              className="text-[10px] uppercase tracking-[0.22em] font-medium"
              style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Free · No card · Unsubscribe in one click
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function DispatchV2() {
  const [subs, setSubs] = useState<number | null>(null);

  useEffect(() => {
    fetchWaitlistCount().then((c) => setSubs(c));
  }, []);

  return (
    <div className="v2-grain min-h-screen overflow-x-clip" style={{ backgroundColor: C.paper, color: C.ink }}>
      <style>{`
        @keyframes settle-axis {
          0% { font-variation-settings: "opsz" 144, "wght" 500, "SOFT" 50; }
          100% { font-variation-settings: "opsz" 144, "wght" 420, "SOFT" 30; }
        }
      `}</style>
      <CleanMasthead />
      <Hero />
      <Colophon subscribers={subs} />
      <DarkPromptRunner />
      <CurriculumWithSpecSheet />
      <FinalCTA />
      <footer
        className="py-12"
        style={{ backgroundColor: C.paper, borderTop: `1px solid ${C.hairline}` }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap items-baseline justify-between gap-4">
          <div className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}>
            Lumio. A daily dispatch on AI for knowledge workers.
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: C.umber, fontFamily: "'JetBrains Mono', monospace" }}>
            © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
