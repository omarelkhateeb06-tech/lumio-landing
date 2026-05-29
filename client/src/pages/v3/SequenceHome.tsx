/**
 * Lumio v3 — Sequence (Path 3)
 *
 * Best-of-everything hybrid. Built on the Outsider's insight: Atelier wins
 * attention, Dispatch wins conversion. Sequence does both in one scroll.
 *
 * - Atelier-style CENTERED hero with variable-axis settle (once on load)
 * - Pill email form with multi-layer warm shadow
 * - Manus's RIGHT-RAIL SPEC SHEET below the hero (Edition / Delivery / Today's lesson)
 * - Dispatch's DARK PROMPTRUNNER BAND with contrast fixed
 * - Dispatch's FULL 30-LESSON typographic index
 * - Lesson-01 "Start here" highlight in the curriculum index
 * - "THE HABIT" eyebrow on Final CTA
 * - Architectural italic 5 at low opacity
 * - Honest pre-launch framing: free while new, no fabricated subscriber count
 */

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Loader2, Check, RefreshCw, Sparkles } from "lucide-react";
import { ease, dur, stagger, splitWords } from "@/lib/motion";
import { captureEmail, runPromptRunner, type PromptRunnerResponse } from "@/lib/supabase";
import { C, SHADOW_PILL, FOCUS_RING, FOCUS_RING_DARK, FOCUS_WITHIN_DARK, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT, DISPLAY_WEIGHT_SOFT, CONFIRM_PILL } from "@/lib/theme";
import { BrandNav, PillEmailForm } from "@/components/marketing";

const SIGNUP_URL = "/signup";

// ──────────────────────────────────────────────────────────────────────────────
// Subscribe action for the brand nav (right side).
// ──────────────────────────────────────────────────────────────────────────────
const SubscribeAction = (
  <a
    href={SIGNUP_URL}
    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium tracking-tight transition-opacity hover:opacity-80 ${FOCUS_RING}`}
    style={{ backgroundColor: C.ink, color: C.paper }}
  >
    Start free <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
  </a>
);

// ──────────────────────────────────────────────────────────────────────────────
// Hero: Atelier-style centered + variable-axis settle once on load
// ──────────────────────────────────────────────────────────────────────────────
function CenteredHero() {
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
    const res = await captureEmail(email, "v3_sequence_hero");
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  const text = `Thirty days from now, AI is just how you work.`;
  const italicFrom = text.indexOf("just how you work");
  const italicTo = italicFrom + "just how you work".length;
  const words = splitWords(text);
  let cursor = 0;

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-[960px] mx-auto px-6 md:px-12 text-center">
        {/* Hormozi: value stack explicit and above the fold */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.fast, delay: 0.0, ease: ease.ink }}
          className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
          style={{
            color: C.umber,
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: `1px solid ${C.hairline}`,
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <span>30 Lessons</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>5 Min Each</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>Ships Daily</span>
        </motion.div>
        <h1
          className="font-serif"
          aria-label={text}
          style={{
            color: C.espresso,
            fontSize: "clamp(48px, 7.2vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.028em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT, 30),
            animation: rm ? undefined : "sequence-settle 2s cubic-bezier(0.22,1,0.36,1) forwards",
            textWrap: "balance" as const,
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
                aria-hidden="true"
                initial={rm ? false : { opacity: 0, y: "0.4em", filter: "blur(6px)" }}
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
                        color: C.orange,
                        fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
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
          initial={rm ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.7, ease: ease.ink }}
          className="mt-8 mx-auto max-w-[560px]"
          style={{ color: C.umber, fontSize: 18, lineHeight: 1.55 }}
        >
          Stop feeling behind on AI. One 5-minute lesson lands in your inbox every
          workday, in plain English, and you use it that same afternoon. Starts from
          the very basics. No experience needed.
        </motion.p>

        <motion.div
          initial={rm ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.9, ease: ease.ink }}
          className="mt-10 mx-auto max-w-[540px]"
        >
          {submitted ? (
            <div className="text-center" role="status" aria-live="polite">
              <div
                className={CONFIRM_PILL}
                style={{ backgroundColor: C.surface, boxShadow: SHADOW_PILL, color: C.espresso }}
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: C.forest }} aria-hidden="true" />
                <span className="text-sm">
                  You're in. Lesson 1 lands the next workday.
                </span>
              </div>
              <p className="mt-5 text-sm" style={{ color: C.umber }}>
                Want to start right now?{" "}
                <a href="/signup" className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Create your account →
                </a>
              </p>
            </div>
          ) : (
            <>
              <PillEmailForm
                id="hero-form"
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Send me Lesson 1"
                formLabel="Get the first lesson by email"
              />
              <p
                className="text-center mt-4"
                style={{
                  color: C.inkSoft,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Free · No card · Your email stays private · One-click unsubscribe
              </p>
              <p className="text-center mt-3 text-xs" style={{ color: C.umber }}>
                Lesson 1 starts the next workday, or{" "}
                <a href="/signup" className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  create an account to start instantly →
                </a>
              </p>
              <p className="text-sm mt-6 leading-relaxed italic max-w-[440px] mx-auto" style={{ color: C.umber }}>
                It's just me writing these. Reply with what's confusing and I'll rewrite the lesson for you. <span className="font-medium not-italic" style={{ color: C.espresso }}>/ Omar</span>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Spec sheet strip — Manus's right-rail flattened to horizontal under hero
// ──────────────────────────────────────────────────────────────────────────────
function SpecStrip() {
  return (
    <section
      aria-labelledby="program-details-heading"
      style={{ borderTop: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}` }}
    >
      <h2 id="program-details-heading" className="sr-only">Program details</h2>
      <dl className="max-w-[1100px] mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
        {[
          { label: "Format", value: "30 daily lessons" },
          { label: "Time", value: "5 minutes each" },
          { label: "Delivery", value: "Straight to your inbox" },
          { label: "Pace", value: "One per workday", accent: true },
        ].map((spec) => (
          <div key={spec.label}>
            <dt
              className="text-[12px] uppercase tracking-[0.22em] mb-1"
              style={{ color: C.inkSoft, fontFamily: FONT_MONO }}
            >
              {spec.label}
            </dt>
            <dd
              className="text-[12px] uppercase tracking-[0.18em] font-medium tabular-nums"
              style={{
                color: spec.accent ? C.orangeInk : C.ink,
                fontFamily: FONT_MONO,
              }}
            >
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Dark PromptRunner band (Dispatch's, contrast-fixed)
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
  function reset() { setInput(""); setState({ kind: "idle" }); }

  const muted = C.paperMuted;
  const subdued = C.paperSubdued;
  const strong = C.paperStrong;

  return (
    <section aria-labelledby="demo-heading" className="relative my-24 md:my-32" style={{ backgroundColor: C.ink, color: C.paper }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div
          className="text-[12px] uppercase tracking-[0.22em] font-medium mb-6 flex items-baseline gap-3 flex-wrap"
          style={{ color: muted, fontFamily: FONT_MONO }}
        >
          <span style={{ color: C.orange }} aria-hidden="true">●</span>
          <span>Try it live</span>
          <span style={{ color: subdued }} aria-hidden="true">·</span>
          <span>Real AI, not a mockup</span>
        </div>
        {/* Persistent section heading — single visible <h2> so the page has a
            clean H1→H2 outline for screen-reader heading navigation. */}
        <h2
          id="demo-heading"
          className="font-serif mb-10"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
            color: C.paper,
            textWrap: "balance" as const,
          }}
        >
          See what Lumio actually does.
        </h2>
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
              <div
                className={`relative border-t border-b py-6 rounded-sm ${FOCUS_WITHIN_DARK}`}
                style={{ borderColor: C.hairlineOnDark }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type anything you'd ask AI. Or tap an example below."
                  aria-label="Enter a prompt to improve"
                  rows={3}
                  maxLength={600}
                  className="placeholder-on-dark w-full bg-transparent text-lg md:text-2xl resize-none focus:outline-none"
                  style={{
                    color: C.paper,
                    fontFamily: FONT_MONO,
                    caretColor: C.orange,
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className="flex flex-wrap items-center gap-2 text-[12px]"
                  style={{ color: muted, fontFamily: FONT_MONO }}
                  role="group"
                  aria-label="Example prompts to try"
                >
                  <span aria-hidden="true">Try:</span>
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setInput(e)}
                      aria-label={`Use example prompt: ${e}`}
                      className={`px-2 py-1 border hover:bg-white/[0.04] transition-colors ${FOCUS_RING_DARK}`}
                      style={{ borderColor: C.hairlineOnDark, color: strong }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={input.trim().length < 5}
                  className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-tight transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${FOCUS_RING_DARK}`}
                  style={{ backgroundColor: C.orange, color: C.ink }}
                >
                  Improve my prompt <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.form>
          )}
          {state.kind === "loading" && (
            <motion.div key="loading" initial={rm ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 py-20" role="status" aria-live="polite">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.orange }} aria-hidden="true" />
              <span style={{ color: muted, fontFamily: FONT_MONO, fontSize: 14 }}>
                Lumio is reading your prompt…
              </span>
            </motion.div>
          )}
          {state.kind === "error" && (
            <motion.div key="error" initial={rm ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="py-16" role="alert">
              <p className="text-sm mb-3" style={{ color: C.paper }}>Couldn't complete the request. Try again.</p>
              <p className="text-sm mb-6" style={{ color: strong }}>{state.message}</p>
              <button onClick={reset} className={`inline-flex items-center gap-2 text-sm ${FOCUS_RING_DARK}`} style={{ color: C.orange }}>
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try another
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
                <div className="text-[12px] uppercase tracking-[0.22em] font-medium mb-3" style={{ color: muted, fontFamily: FONT_MONO }}>
                  Your prompt
                </div>
                <p className="whitespace-pre-line" style={{ color: muted, fontFamily: FONT_MONO, fontSize: 14, lineHeight: 1.6, textDecoration: "line-through", textDecorationColor: C.orangeStrike }}>
                  {state.original}
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="text-[12px] uppercase tracking-[0.22em] font-medium mb-3 flex items-center gap-2" style={{ color: C.orange, fontFamily: FONT_MONO }}>
                  <Sparkles className="w-3 h-3" aria-hidden="true" /> Lumio rewrite
                </div>
                <p className="whitespace-pre-line mb-6" style={{ color: C.paper, fontFamily: FONT_MONO, fontSize: 14, lineHeight: 1.6 }}>
                  {state.data.improved_prompt}
                </p>
                <p className="italic pt-4 border-t text-sm" style={{ borderColor: C.hairlineOnDark, color: strong }}>
                  {state.data.why_better}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <a href={SIGNUP_URL} className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium ${FOCUS_RING_DARK}`} style={{ backgroundColor: C.orange, color: C.ink }}>
                    Get all 30 lessons free <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <button onClick={reset} className={`text-sm ${FOCUS_RING_DARK}`} style={{ color: strong }}>Try another →</button>
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
// Full 30-lesson curriculum — same structure as DispatchV2 but inline
// ──────────────────────────────────────────────────────────────────────────────
const CURRICULUM = [
  { module: "I. Foundations", lessons: [
    { n: "01", title: "When to use ChatGPT vs. Google", min: 5, level: "BEG" },
    { n: "02", title: "Spot when AI is making things up", min: 5, level: "BEG" },
    { n: "03", title: "The 3-step framing technique", min: 7, level: "BEG" },
    { n: "04", title: "Stop writing prompts (start writing briefs)", min: 6, level: "BEG" },
    { n: "05", title: "Set up AI once so it remembers how you work", min: 8, level: "BEG" },
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
    { n: "13", title: "Make a great image from a sentence", min: 9, level: "INT" },
    { n: "14", title: "Synthesizing research: 30 PDFs into 1 page", min: 10, level: "INT" },
    { n: "15", title: "The outline method for long-form content", min: 8, level: "INT" },
  ]},
  { module: "IV. Business workflows", lessons: [
    { n: "16", title: "Automating lead research", min: 9, level: "INT" },
    { n: "17", title: "Turn a screen recording into a step-by-step guide", min: 8, level: "INT" },
    { n: "18", title: "Data cleaning for the spreadsheet-phobic", min: 10, level: "INT" },
    { n: "19", title: "Build your own AI helper that knows your company", min: 12, level: "INT" },
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
    { n: "26", title: "Connect AI to your other tools (no code)", min: 12, level: "ADV" },
    { n: "27", title: "Chain AI steps to finish a whole task", min: 15, level: "ADV" },
    { n: "28", title: "Pull data from any website without code", min: 11, level: "ADV" },
    { n: "29", title: "Find anything you've ever saved, instantly", min: 14, level: "ADV" },
    { n: "30", title: "The autonomous workday: what's next?", min: 12, level: "ADV" },
  ]},
];

function Curriculum() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useReducedMotion() ?? false;

  return (
    <section ref={ref} id="curriculum" className="py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <h2
          className="font-serif text-center mb-4"
          style={{
            color: C.espresso,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
            textWrap: "balance" as const,
          }}
        >
          Six modules. Thirty lessons. <em className="font-normal" style={{ color: C.orange }}>One per workday.</em>
        </h2>
        <p className="text-center text-sm italic mb-4" style={{ color: C.umber }}>
          Each lesson builds on the last. By Lesson 30 you're not learning AI anymore. You're just using it.
        </p>
        <p
          className="text-center text-[11px] uppercase mb-16"
          style={{ color: C.umber, fontFamily: FONT_MONO, letterSpacing: "0.12em" }}
        >
          <span style={{ color: C.forest }}>Beginner</span> <span style={{ opacity: 0.6 }}>BEG</span>
          <span aria-hidden="true" className="mx-2" style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: C.orangeInk }}>Growing</span> <span style={{ opacity: 0.6 }}>INT</span>
          <span aria-hidden="true" className="mx-2" style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: C.espresso }}>Confident</span> <span style={{ opacity: 0.6 }}>ADV</span>
        </p>
        <div className="space-y-12">
          {CURRICULUM.map((mod, modIdx) => (
            <motion.div
              key={mod.module}
              initial={rm ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: dur.base, delay: modIdx * stagger.base, ease: ease.glass }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 pt-6"
              style={{ borderTop: `1px solid ${C.hairline}` }}
            >
              <div className="lg:col-span-3">
                <div
                  className="font-serif italic"
                  style={{ color: C.umber, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
                >
                  {mod.module}
                </div>
              </div>
              <ul className="lg:col-span-9 divide-y" style={{ borderColor: C.hairlineSoft }}>
                {mod.lessons.map((les) => {
                  const isFirst = les.n === "01";
                  return (
                    <li
                      key={les.n}
                      className="grid grid-cols-12 gap-3 py-3 items-start hover:bg-black/[0.02] transition-colors -mx-3 px-3"
                    >
                      <span
                        className="col-span-1 tabular-nums"
                        style={{
                          color: isFirst ? C.orangeInk : C.umber,
                          fontFamily: FONT_MONO,
                          fontSize: 12,
                          fontWeight: isFirst ? 600 : 400,
                        }}
                      >
                        {les.n}
                      </span>
                      <span
                        className="col-span-7 md:col-span-8 font-serif leading-snug"
                        style={{
                          color: isFirst ? C.orangeInk : C.ink,
                          fontSize: 18,
                          fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
                        }}
                      >
                        {les.title}{isFirst && (
                          <span
                            className="ml-2 text-[11px] uppercase tracking-[0.12em] align-middle"
                            style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
                          >
                            Start here
                          </span>
                        )}
                      </span>
                      <span
                        className="col-span-2 md:col-span-2 text-right tabular-nums"
                        style={{ color: C.umber, fontFamily: FONT_MONO, fontSize: 12 }}
                      >
                        {les.min} min
                      </span>
                      <span
                        className="col-span-2 md:col-span-1 text-right"
                        style={{
                          color: les.level === "BEG" ? C.forest : les.level === "INT" ? C.orangeInk : C.espresso,
                          fontFamily: FONT_MONO,
                          fontSize: 12,
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
// Final CTA — "THE HABIT" + architectural italic 5 at low opacity
// ──────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("That doesn't look like an email.");
    setSubmitting(true);
    const res = await captureEmail(email, "v3_sequence_cta");
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div
        aria-hidden
        className="hidden lg:block absolute right-[-12vw] top-1/2 -translate-y-1/2 pointer-events-none font-serif italic select-none"
        style={{
          fontSize: "clamp(280px, 34vw, 560px)",
          color: C.espresso,
          opacity: 0.06,
          lineHeight: 0.8,
          fontVariationSettings: displayFV(144, 280),
        }}
      >
        5
      </div>
      <div className="relative max-w-[920px] mx-auto px-6 md:px-12 text-center">
        <div
          className="text-[12px] uppercase tracking-[0.22em] font-medium mb-6 inline-block"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          The habit
        </div>
        <h2
          className="font-serif mb-10"
          style={{
            color: C.espresso,
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
            textWrap: "balance" as const,
          }}
        >
          Five minutes a day.{" "}
          <em className="font-normal" style={{ color: C.orange }}>Six Mondays from now,</em>{" "}
          you're the one people ask.
        </h2>

        <p
          className="text-center text-[12px] uppercase tracking-[0.16em] mb-8"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          30 lessons · one per workday · 5 minutes each · the exact prompts, ready to copy · yours free
        </p>

        {/* Hormozi: second email capture — person who scrolled all 30 lessons needs a form, not a link */}
        <div className="max-w-[540px] mx-auto">
          {submitted ? (
            <div className="text-center" role="status" aria-live="polite">
              <div
                className={CONFIRM_PILL}
                style={{ backgroundColor: C.surface, boxShadow: SHADOW_PILL, color: C.espresso }}
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: C.forest }} aria-hidden="true" />
                <span className="text-sm">You're in. Lesson 1 lands the next workday.</span>
              </div>
              <p className="mt-5 text-sm" style={{ color: C.umber }}>
                Want to start right now?{" "}
                <a href="/signup" className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Create your account →
                </a>
              </p>
            </div>
          ) : (
            <>
              <PillEmailForm
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Send me Lesson 1"
                formLabel="Get the first lesson by email"
              />
              <p className="mt-4 text-xs italic" style={{ color: C.umber }}>
                Free while it's new. I'd rather have your feedback than your money right now.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function SequenceHome() {
  return (
    <div className="v2-grain min-h-screen overflow-x-clip relative" style={{ backgroundColor: C.paper, color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <style>{`
        @keyframes sequence-settle {
          0%   { font-variation-settings: "opsz" 120, "wght" 500, "SOFT" 80; letter-spacing: -0.024em; }
          100% { font-variation-settings: "opsz" 144, "wght" 420, "SOFT" 30; letter-spacing: -0.028em; }
        }
      `}</style>
      <BrandNav maxWidth={1100} right={SubscribeAction} />
      <main id="main-content">
        <CenteredHero />
        <SpecStrip />
        <DarkPromptRunner />
        <Curriculum />
        <FinalCTA />
      </main>
      <footer className="py-10" style={{ borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm italic" style={{ color: C.umber }}>
            Lumio. One five-minute AI lesson, every workday.
          </p>
          <p className="text-xs" style={{ color: C.umber }}>© 2026</p>
        </div>
      </footer>
    </div>
  );
}
