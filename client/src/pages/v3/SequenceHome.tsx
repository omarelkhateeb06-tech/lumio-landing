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

import { useEffect, useRef, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { getCertBySlug, listPublishedCerts, lowestCertPriceCents, dollars, LESSON_1_DELIVERY_COPY, LESSON_TIME_RANGE, type PublishedCert } from "@/lib/certs";

const SIGNUP_URL = "/signup";

// Carry referral attribution from a shared certificate link (/?ref=verify&cert=slug)
// into the waitlist source, so we can see which earned credentials actually drive
// signups instead of losing that signal at the email box (Expansionist M2).
function signupSource(base: string): string {
  if (typeof window === "undefined") return base;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  const cert = params.get("cert");
  if (!ref) return base;
  return cert ? `${base}__${ref}_${cert}` : `${base}__${ref}`;
}

// Same referral attribution, carried onto the /signup links so a visitor who
// skips the email box and creates an account directly still keeps the signal
// of which shared certificate brought them in (Expansionist M2).
function signupHref(): string {
  if (typeof window === "undefined") return SIGNUP_URL;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return SIGNUP_URL;
  const cert = params.get("cert");
  const q = new URLSearchParams();
  q.set("ref", ref);
  if (cert) q.set("cert", cert);
  return `${SIGNUP_URL}?${q.toString()}`;
}

// A 1:1 referral vector for the peak-intent moment right after someone signs up
// (Expansionist M3). Carries ?ref=invite so the inbound is acknowledged and
// attributed by the same plumbing as the track pills and share links.
function inviteMailto(): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://lumio.app";
  const link = `${origin}/?ref=invite`;
  const body = `I've been doing this short daily AI lesson and thought you'd want it too. The first one is free: ${link}`;
  return `mailto:?subject=${encodeURIComponent("Thought you'd want this")}&body=${encodeURIComponent(body)}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Subscribe action for the brand nav (right side). A returning learner who is
// already signed in should be invited back into the app, not pushed to sign up
// again (which dead-ends at a magic-link they don't need). Reads existing auth
// state, no new infra (Expansionist MED-1).
// ──────────────────────────────────────────────────────────────────────────────
function SubscribeAction() {
  const { user } = useAuth();
  if (user) {
    return (
      <a
        href="/app"
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium tracking-tight transition-opacity hover:opacity-80 ${FOCUS_RING}`}
        style={{ backgroundColor: C.ink, color: C.paper }}
      >
        Continue learning <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    );
  }
  return (
    <a
      href={SIGNUP_URL}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium tracking-tight transition-opacity hover:opacity-80 ${FOCUS_RING}`}
      style={{ backgroundColor: C.ink, color: C.paper }}
    >
      Start free <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Hero: Atelier-style centered + variable-axis settle once on load
// ──────────────────────────────────────────────────────────────────────────────
function CenteredHero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refCertName, setRefCertName] = useState<string | null>(null);
  const [refMode, setRefMode] = useState<"credential" | "track" | "invite" | null>(null);
  const rm = useReducedMotion() ?? false;

  // Personalize the hero for every warm inbound, not just credential links
  // (Expansionist M1):
  //  - verify/share → "you just saw a real {cert} certificate"
  //  - track        → a coworker/pill sent them to a specific track
  //  - invite       → a coworker invited them (no cert needed)
  // For verify/share/track we look up the cert name to name it; invite stands alone.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref === "invite") {
      setRefMode("invite");
      return;
    }
    const isCredential = ref === "verify" || ref === "share";
    if (!isCredential && ref !== "track") return;
    setRefMode(isCredential ? "credential" : "track");
    const slug = params.get("cert");
    if (!slug) return;
    let cancelled = false;
    getCertBySlug(slug)
      .then((c) => {
        if (!cancelled && c) setRefCertName(c.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("That doesn't look like an email.");
    setSubmitting(true);
    const res = await captureEmail(email, signupSource("v3_sequence_hero"));
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError("Couldn't send the link. Check your connection and try again.");
  }

  // H4: "AI is just how you work" overclaims a finished state to a reader who is
  // anxious they're behind -- it can read as "everyone but you already does this."
  // "starts to feel like" promises the same destination as a direction they're
  // moving toward, which is both truer and less intimidating.
  const text = `A few weeks of this, and AI starts to feel like how you work.`;
  const italicFrom = text.indexOf("how you work");
  const italicTo = italicFrom + "how you work".length;
  const words = splitWords(text);
  let cursor = 0;

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-[960px] mx-auto px-6 md:px-12 text-center">
        {(refMode === "invite" || ((refMode === "credential" || refMode === "track") && refCertName)) && (
          <motion.p
            initial={rm ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.fast, ease: ease.ink }}
            className="mb-6 mx-auto max-w-[560px] text-base"
            style={{ color: C.espresso }}
          >
            {refMode === "credential" && refCertName && (
              <>
                You just saw a real, person-reviewed{" "}
                <span style={{ color: C.orangeInk, fontWeight: 500 }}>{refCertName}</span>{" "}
                certificate. Here is the daily habit behind it.
              </>
            )}
            {refMode === "track" && refCertName && (
              <>
                The{" "}
                <span style={{ color: C.orangeInk, fontWeight: 500 }}>{refCertName}</span>{" "}
                track starts with the same daily habit. Here is how it works.
              </>
            )}
            {refMode === "invite" && (
              <>A coworker thought you'd want this. Here is the daily habit they're talking about.</>
            )}
          </motion.p>
        )}
        {/* Eyebrow spec pill removed: the SpecStrip directly below the hero
            already carries the same three facts (format / time / cadence) with
            more dignity, so repeating them 60px apart was noise (Rubin M4). */}
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
          One short lesson every workday, free to learn. When you're ready, you do one real
          task from your job and earn a certificate, one payment, no subscription.
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
                  You're in. Lesson 1 arrives {LESSON_1_DELIVERY_COPY}.
                </span>
              </div>
              <p className="mt-5 text-sm" style={{ color: C.umber }}>
                Want to start right now?{" "}
                <a href={signupHref()} className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Create your account →
                </a>
              </p>
              <p className="mt-2 text-sm" style={{ color: C.umber }}>
                Know someone who feels behind on AI?{" "}
                <a href={inviteMailto()} className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Send them the first lesson →
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
                Lesson 1 starts {LESSON_1_DELIVERY_COPY}, or{" "}
                <a href={signupHref()} className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
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
          { label: "Format", value: "30-day core path" },
          { label: "Time", value: LESSON_TIME_RANGE },
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
  "Summarize a long article.",
  "Help me plan a team offsite.",
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
          <span>Try it yourself, free</span>
          <span style={{ color: subdued }} aria-hidden="true">·</span>
          <span>A taste of what you'll learn</span>
        </div>
        {/* Persistent section heading — single visible <h2> so the page has a
            clean H1→H2 outline for screen-reader heading navigation. */}
        <h2
          id="demo-heading"
          className="font-serif mb-4"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
            color: C.paper,
            textWrap: "balance" as const,
          }}
        >
          See the kind of thing you'll learn.
        </h2>
        {/* Tell a first-timer what the box does before they type. "Make it better"
            alone left an outsider asking "better at what?" (Outsider H3). Framed as
            a teaching demo, not a guarantee the paid product must clear (Naval H2,
            Contrarian M1): the lessons teach the skill, this just shows the idea. */}
        {/* S3: dropped "one idea from a lesson, not the whole thing." The hedge
            talked the demo down before the visitor had tried it. Let the result
            make its own case; keep only the privacy reassurance. */}
        <p className="mb-10 text-base" style={{ color: muted, maxWidth: 520 }}>
          Type anything you'd ask AI below. We'll show you how a small change sharpens what you
          get back, and exactly what we changed. Nothing is saved.
        </p>
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
                  aria-label="Type something you'd ask AI"
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
              {/* Privacy note: lead with the reassurance, not the warning. An
                  anxious newcomer reads "don't paste anything confidential" as a
                  threat; opening with "nothing is saved" turns the same fact into
                  safety, then the caution lands gently (Outsider HIGH-2, Contrarian
                  H2). */}
              <p className="text-[12px]" style={{ color: subdued }}>
                Nothing you type is saved. We only use it to show you the rewrite, so there's no need to
                paste anything confidential.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className="flex flex-wrap items-center gap-2 text-[12px]"
                  style={{ color: muted, fontFamily: FONT_MONO }}
                  role="group"
                  aria-label="Examples to try"
                >
                  <span aria-hidden="true">Try:</span>
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setInput(e)}
                      aria-label={`Use this example: ${e}`}
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
                  Sharpen it <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.form>
          )}
          {state.kind === "loading" && (
            <motion.div key="loading" initial={rm ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 py-20" role="status" aria-live="polite">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.orange }} aria-hidden="true" />
              <span style={{ color: muted, fontFamily: FONT_MONO, fontSize: 14 }}>
                Lumio is reading what you typed…
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
                  What you typed
                </div>
                {/* No strikethrough on the visitor's own words. Crossing out what they
                    wrote tells an anxious buyer the machine beat them; the teaching
                    point lands better when their version is simply the starting
                    point, not a mistake (Naval H1 / First-Principles M5). */}
                <p className="whitespace-pre-line" style={{ color: muted, fontFamily: FONT_MONO, fontSize: 14, lineHeight: 1.6 }}>
                  {state.original}
                </p>
                <p className="mt-4 text-xs italic" style={{ color: strong }}>
                  Yours is fine. Here's a small change that helps.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="text-[12px] uppercase tracking-[0.22em] font-medium mb-3 flex items-center gap-2" style={{ color: C.orange, fontFamily: FONT_MONO }}>
                  <Sparkles className="w-3 h-3" aria-hidden="true" /> One small tweak to try
                </div>
                <p className="whitespace-pre-line mb-6" style={{ color: C.paper, fontFamily: FONT_MONO, fontSize: 14, lineHeight: 1.6 }}>
                  {state.data.improved_prompt}
                </p>
                <p className="italic pt-4 border-t text-sm" style={{ borderColor: C.hairlineOnDark, color: strong }}>
                  {state.data.why_better}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <a href={signupHref()} className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium ${FOCUS_RING_DARK}`} style={{ backgroundColor: C.orange, color: C.ink }}>
                    Start free, earn a certificate that shows it <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
    { n: "01", title: "You're Not Behind (and It's Not Cheating)", min: 5, level: "BEG" },
    { n: "02", title: "What AI Actually Is (and Isn't)", min: 6, level: "BEG" },
    { n: "03", title: "Which AI Tool, and Is It Online?", min: 6, level: "BEG" },
    { n: "04", title: "The AI Tool Landscape: Which One Does What", min: 9, level: "BEG" },
    { n: "05", title: "When to use ChatGPT vs. Google", min: 15, level: "BEG" },
  ]},
  { module: "II. First Steps", lessons: [
    { n: "06", title: "Your First Five Minutes (and Your First Win)", min: 5, level: "BEG" },
    { n: "07", title: "Free vs Paid: What You Actually Need", min: 5, level: "BEG" },
    { n: "08", title: "The 3-step framing technique", min: 15, level: "BEG" },
    { n: "09", title: "Stop writing prompts (start writing briefs)", min: 15, level: "BEG" },
    { n: "10", title: "What's a Good Job for AI?", min: 6, level: "BEG" },
  ]},
  { module: "III. Working well with AI", lessons: [
    { n: "11", title: "Fact-Checking AI: A Practical Method", min: 7, level: "INT" },
    { n: "12", title: "AI and Your Privacy: Where Your Data Goes", min: 6, level: "INT" },
    { n: "13", title: "Trust Calibration: Knowing When to Believe AI", min: 7, level: "INT" },
    { n: "14", title: "Catching the Subtle Errors AI Slips In", min: 7, level: "ADV" },
    { n: "15", title: "Verifying AI at Scale Without Burning Out", min: 8, level: "ADV" },
  ]},
  { module: "IV. Everyday work", lessons: [
    { n: "16", title: "The 5-minute meeting debrief protocol", min: 5, level: "BEG" },
    { n: "17", title: "Inbox triage: auto-drafting responses", min: 6, level: "BEG" },
    { n: "18", title: "Writing better briefs for external teams", min: 7, level: "BEG" },
    { n: "19", title: "The Slack summary rule", min: 5, level: "BEG" },
    { n: "20", title: "Summarizing Long Documents in Seconds", min: 15, level: "BEG" },
  ]},
  { module: "V. Creation", lessons: [
    { n: "21", title: "Structural editing: rewrite without losing voice", min: 8, level: "INT" },
    { n: "22", title: "The Brainstorming Loop: Generating Many Options", min: 7, level: "INT" },
    { n: "23", title: "Make a great image from a sentence", min: 9, level: "INT" },
    { n: "24", title: "Synthesizing research: 30 PDFs into 1 page", min: 10, level: "INT" },
    { n: "25", title: "The outline method for long-form content", min: 8, level: "INT" },
  ]},
  { module: "VI. Business workflows", lessons: [
    { n: "26", title: "Automating lead research", min: 9, level: "INT" },
    { n: "27", title: "Turn a screen recording into a step-by-step guide", min: 8, level: "INT" },
    { n: "28", title: "Data cleaning for the spreadsheet-phobic", min: 10, level: "INT" },
    { n: "29", title: "Build your own AI helper that knows your company", min: 12, level: "INT" },
    { n: "30", title: "Competitor tracking on autopilot", min: 11, level: "INT" },
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
        <p className="text-center text-sm italic mb-16" style={{ color: C.umber }}>
          Each lesson builds on the last, so day 30 feels earned, not rushed.
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
                        className="col-span-9 font-serif leading-snug"
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
                        className="col-span-2 text-right tabular-nums"
                        style={{ color: C.umber, fontFamily: FONT_MONO, fontSize: 12 }}
                      >
                        {les.min} min
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm mx-auto max-w-[560px] mt-16" style={{ color: C.umber, lineHeight: 1.6 }}>
          These thirty are the starting path. Once you're in, your field opens up to a deeper
          library of lessons built for your line of work.
        </p>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Certificates — the bridge from the free daily habit to the paid, provable
// outcome. A cold visitor must learn the real product exists: you can earn a
// certificate, backed by one real work task a real person reviews.
// ──────────────────────────────────────────────────────────────────────────────
const CERT_STEPS = [
  {
    n: "01",
    title: "Learn it, free",
    body: "Work through the daily lessons in your field, a few minutes a day. No card, no pressure.",
  },
  {
    n: "02",
    title: "Do one real task",
    body: "Each certificate ends with a final project: one real task from your actual work. You do it, you submit it.",
  },
  {
    n: "03",
    title: "A real person checks it",
    body: "A real person reviews your work, not an algorithm. We are checking that you did the work, not that it is flawless.",
  },
  {
    n: "04",
    title: "Show what you did",
    body: "You get a certificate with a link anyone can open to see it was issued by Lumio. Put it on LinkedIn, send it to your manager.",
  },
];

function Certificates() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useReducedMotion() ?? false;
  const [tracks, setTracks] = useState<PublishedCert[]>([]);

  // Show the real, published tracks so a cold visitor can see their own line of
  // work is covered and click straight to it (Expansionist MED-2). Public columns
  // only; if the call fails we simply hide the list rather than block the page.
  useEffect(() => {
    let cancelled = false;
    listPublishedCerts()
      .then((rows) => {
        if (!cancelled) setTracks(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Dedupe by display name so multi-tier tracks (a base cert and its variants
  // share a name) don't render as two identical pills (Executor MED-1).
  const uniqueTracks = tracks.filter(
    (t, i) => tracks.findIndex((o) => o.name === t.name) === i,
  );
  const floorCents = lowestCertPriceCents(tracks);

  return (
    <section ref={ref} id="certificates" className="py-24 md:py-32" style={{ borderTop: `1px solid ${C.hairline}` }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div
          className="text-[12px] uppercase tracking-[0.22em] font-medium mb-6 text-center"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          When you're ready
        </div>
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
          Earn a certificate that <em className="font-normal" style={{ color: C.orange }}>shows</em> it.
        </h2>
        {/* Pull the dream outcome forward to where cold traffic decides, instead of
            leaving it behind the auth wall on the cert page (Hormozi HIGH-1). */}
        <p className="text-center text-lg mx-auto max-w-[560px] mb-4" style={{ color: C.espresso, lineHeight: 1.55 }}>
          The next time AI comes up at work, you're not the one hoping nobody asks. You have real,
          reviewed work to point to.
        </p>
        {/* Set the mental model straight: the certificate is gated on its own short
            lesson set, not the full 30-day path (First-Principles H1). */}
        <p className="text-center text-base mx-auto max-w-[560px] mb-4" style={{ color: C.umber, lineHeight: 1.55 }}>
          Each track is built for one line of work, with its own short set of lessons. Pick yours,
          then do one real task from your actual job.
        </p>
        {floorCents != null && (
          <p className="text-center text-sm mx-auto max-w-[560px] mb-3" style={{ color: C.umber }}>
            Founding price: tracks start at {dollars(floorCents)}, and rise to $99 after the first 50
            certifications. You pay once when you're ready, never a subscription, and the daily lessons
            stay free.
          </p>
        )}
        {/* Surface the risk reversal at the moment of hesitation, not only behind
            signup on the cert page (Hormozi HIGH-2, Outsider #3). */}
        <p className="text-center text-sm mx-auto max-w-[560px] mb-10" style={{ color: C.umber }}>
          If your project isn't approved the first time, we tell you exactly what to fix and review
          your revision again, free. And if it still isn't approved after that first revision, we'll
          refund you. No questions.
        </p>

        {/* Link each track to signup (not the auth-gated /app/cert route), so a
            logged-out visitor lands somewhere they can act, carrying cert-level
            attribution (Executor/Expansionist/Contrarian R1). */}
        {uniqueTracks.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2.5 mb-16" aria-label="Certificate tracks">
            {uniqueTracks.map((t) => (
              <li key={t.slug}>
                {/* C2: show each track's real price on the pill. A visitor
                    scanning for their field also sees the number before they
                    click, so the price never arrives as a surprise behind signup. */}
                <a
                  href={`/signup?ref=track&cert=${t.slug}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-opacity hover:opacity-80 ${FOCUS_RING}`}
                  style={{ border: `1px solid ${C.hairline}`, color: C.espresso }}
                >
                  {t.name}
                  <span style={{ color: C.umber, fontFamily: FONT_MONO, fontSize: 12 }}>
                    {dollars(t.price_cents)}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {CERT_STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={rm ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: dur.base, delay: i * stagger.base, ease: ease.glass }}
            >
              <div
                className="tabular-nums mb-3"
                style={{ color: C.orangeInk, fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.1em" }}
              >
                {step.n}
              </div>
              <h3
                className="font-serif mb-2"
                style={{ color: C.espresso, fontSize: 21, fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT) }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: C.umber }}>
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 text-center">
          <a
            href={signupHref()}
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-tight transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            Start free, then earn a certificate <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
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
    const res = await captureEmail(email, signupSource("v3_sequence_cta"));
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
          A few minutes a day.{" "}
          <em className="font-normal" style={{ color: C.orange }}>That's</em>{" "}
          the whole thing.
        </h2>

        {/* Hormozi: second email capture — person who scrolled all 30 lessons needs a form, not a link */}
        <div className="max-w-[540px] mx-auto">
          {submitted ? (
            <div className="text-center" role="status" aria-live="polite">
              <div
                className={CONFIRM_PILL}
                style={{ backgroundColor: C.surface, boxShadow: SHADOW_PILL, color: C.espresso }}
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: C.forest }} aria-hidden="true" />
                <span className="text-sm">You're in. Lesson 1 arrives {LESSON_1_DELIVERY_COPY}.</span>
              </div>
              <p className="mt-5 text-sm" style={{ color: C.umber }}>
                Want to start right now?{" "}
                <a href={signupHref()} className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Create your account →
                </a>
              </p>
              <p className="mt-2 text-sm" style={{ color: C.umber }}>
                Know someone who feels behind on AI?{" "}
                <a href={inviteMailto()} className={`font-medium underline underline-offset-2 ${FOCUS_RING}`} style={{ color: C.espresso }}>
                  Send them the first lesson →
                </a>
              </p>
            </div>
          ) : (
            <>
              <PillEmailForm
                id="cta-form"
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Send me Lesson 1"
                formLabel="Get the first lesson by email"
              />
              {/* Re-plant the outcome for the warmest lead on the page without
                  repeating the free/pay-later promise verbatim (Hormozi M5 vs Rubin). */}
              <p className="mt-4 text-xs italic" style={{ color: C.umber }}>
                No card needed to start. Keep going and you can earn a certificate that shows what you can do.
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
      <BrandNav maxWidth={1100} right={<SubscribeAction />} />
      <main id="main-content">
        <CenteredHero />
        <SpecStrip />
        <DarkPromptRunner />
        <Curriculum />
        <Certificates />
        <FinalCTA />
      </main>
      <footer className="py-10" style={{ borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm italic" style={{ color: C.umber }}>
            Lumio. One short AI lesson, every workday.
          </p>
          <p className="text-xs" style={{ color: C.umber }}>© 2026</p>
        </div>
      </footer>
    </div>
  );
}
