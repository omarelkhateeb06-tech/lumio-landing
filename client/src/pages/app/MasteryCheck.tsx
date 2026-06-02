import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMasteryCheckBySlug,
  submitMasteryCheck,
  checkMasteryAnswer,
  type MasteryCheckPayload,
  type CheckQuestion,
  type CheckResponse,
  type CheckResponses,
  type SubmitResult,
  type AnswerFeedback,
} from "@/lib/gamification";
import {
  C, FOCUS_RING, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT, PILL,
} from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";
import { ConfettiBurst, playCompletionChime } from "@/components/Celebration";

const DashboardLink = (
  <a
    href="/app"
    className={`text-[13px] font-medium tracking-tight ${FOCUS_RING}`}
    style={{ color: C.umber }}
  >
    ← Dashboard
  </a>
);

// Frame wrapper so every state (loading, locked, runner, results) shares the
// same nav + paper canvas + centered column.
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#check-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={720} topAccent={false} right={DashboardLink} />
      <div id="check-content" className="max-w-[720px] mx-auto px-6 pt-[110px] pb-24">
        {children}
      </div>
    </div>
  );
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] uppercase tracking-[0.18em] mb-3"
      style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
    >
      {children}
    </div>
  );
}

// Round a cooldown timestamp into a friendly "in about N hours" / "N minutes".
function untilLabel(iso: string | null | undefined): string {
  if (!iso) return "later";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "now";
  // Never round down to "0 minutes" for a sub-minute wait.
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `in about ${mins} minute${mins === 1 ? "" : "s"}`;
  const hours = Math.round(mins / 60);
  return `in about ${hours} hour${hours === 1 ? "" : "s"}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Question views — MCQ (radio cards) and fill-blank (inline inputs in template)
// ─────────────────────────────────────────────────────────────────────────────

function McqQuestion({
  question,
  value,
  onChange,
  locked,
  feedback,
}: {
  question: Extract<CheckQuestion, { type: "multiple_choice" }>;
  value: string | undefined;
  onChange: (optionId: string) => void;
  locked: boolean;
  feedback: AnswerFeedback | undefined;
}) {
  const isCorrect = !!feedback?.correct;
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend
        className="font-serif text-2xl leading-snug mb-6"
        style={{ color: C.espresso, fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT) }}
      >
        {question.content.stem}
      </legend>
      <div className="space-y-3">
        {question.content.options.map((opt) => {
          const selected = value === opt.id;
          // After submitting, color only the chosen option (forest if correct,
          // error if not) and dim the rest — mirrors MultipleChoiceBlock.
          const stateColor = locked && selected ? (isCorrect ? C.forest : C.error) : selected ? C.orange : C.hairline;
          const bg = locked && selected ? (isCorrect ? C.orangeWash : C.surface) : selected ? C.orangeWash : C.surface;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 px-5 py-4 rounded-2xl transition-colors ${FOCUS_RING} ${locked ? "" : "cursor-pointer"}`}
              style={{
                backgroundColor: bg,
                border: `1.5px solid ${stateColor}`,
                opacity: locked && !selected ? 0.55 : 1,
              }}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={selected}
                disabled={locked}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-0.5 flex-shrink-0 grid place-items-center rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  border: `1.5px solid ${selected ? stateColor : C.inkDisc}`,
                  backgroundColor: selected ? stateColor : "transparent",
                }}
              >
                {selected && (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.surface }} />
                )}
              </span>
              <span className="text-base leading-relaxed" style={{ color: C.ink }}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function FillBlankQuestion({
  question,
  value,
  onChange,
  locked,
  feedback,
}: {
  question: Extract<CheckQuestion, { type: "fill_blank" }>;
  value: Record<string, string> | undefined;
  onChange: (blankId: string, text: string) => void;
  locked: boolean;
  feedback: AnswerFeedback | undefined;
}) {
  // Split the template on {{id}} placeholders, interleaving text and inputs.
  const segments = useMemo(
    () => question.content.template.split(/(\{\{\w+\}\})/g),
    [question.content.template],
  );

  const isCorrect = !!feedback?.correct;

  return (
    <div>
      <div
        className="text-base leading-[2.4]"
        style={{ color: C.ink }}
      >
        {segments.map((seg, i) => {
          const m = seg.match(/^\{\{(\w+)\}\}$/);
          if (m) {
            const blankId = m[1];
            // Number the blank for the label rather than exposing the raw id.
            const blankNum = segments.slice(0, i).filter((s) => /^\{\{\w+\}\}$/.test(s)).length + 1;
            const filled = !!value?.[blankId]?.trim();
            // Once locked, the whole question is graded as a unit, so every
            // blank takes the question-level correct/incorrect color.
            const border = locked ? (isCorrect ? C.forest : C.error) : filled ? C.orange : C.hairline;
            return (
              <input
                key={i}
                type="text"
                aria-label={`Blank ${blankNum}`}
                value={value?.[blankId] ?? ""}
                disabled={locked}
                onChange={(e) => onChange(blankId, e.target.value)}
                className={`inline-block mx-1 px-3 py-1 rounded-lg text-base ${FOCUS_RING}`}
                style={{
                  minWidth: 120,
                  backgroundColor: C.surface,
                  border: `1.5px solid ${border}`,
                  color: C.espresso,
                  fontFamily: FONT_MONO,
                }}
              />
            );
          }
          return <span key={i}>{seg}</span>;
        })}
      </div>
    </div>
  );
}

// Feedback panel shown after a question is submitted. Mirrors the feedback box
// in MultipleChoiceBlock — same tokens, same copy pattern.
function FeedbackPanel({ feedback }: { feedback: AnswerFeedback }) {
  const correct = feedback.correct;
  return (
    <div aria-live="polite">
      <div
        className="mt-6 px-5 py-4 rounded-xl"
        style={{
          backgroundColor: correct ? C.orangeWash : C.surface,
          border: `1px solid ${correct ? C.orangeWashBorder : C.hairline}`,
        }}
      >
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-2"
          style={{ color: correct ? C.forest : C.error, fontFamily: FONT_MONO }}
        >
          {correct ? "Got it" : "Almost"}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
          {feedback.explanation ?? (correct ? "That is the one." : "The lesson covers this one. No rush, have another look.")}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "intro" | "running" | "result";

export default function MasteryCheck() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  useAuth();

  const rm = useReducedMotion() ?? false;
  const [payload, setPayload] = useState<MasteryCheckPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<CheckResponses>({});
  const [feedback, setFeedback] = useState<Record<string, AnswerFeedback>>({});
  // The id of the question currently being graded (null when idle). Keyed by id,
  // not a global boolean, so an in-flight grade never dims or locks a sibling
  // question the learner navigated to while the network call was still open.
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // True while this component is mounted. Async handlers (grade, submit) can
  // resolve after the learner has navigated away; guarding setState on this ref
  // avoids React's "update on an unmounted component" warning and stray writes
  // into a dead tree (Executor H1).
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMasteryCheckBySlug(slug).then((data) => {
      if (cancelled) return;
      setPayload(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const questions = payload?.questions ?? [];
  const total = questions.length;
  const current = questions[step];

  const answered = (q: CheckQuestion | undefined): boolean => {
    if (!q) return false;
    const r = responses[q.id];
    if (q.type === "multiple_choice") return typeof r === "string" && r.length > 0;
    // fill_blank: every blank has non-empty text
    if (typeof r !== "object" || r === null) return false;
    return q.content.blanks.every((b) => (r as Record<string, string>)[b.id]?.trim());
  };

  const answeredCount = questions.filter(answered).length;
  const allAnswered = total > 0 && answeredCount === total;

  function setResponse(qid: string, value: CheckResponse) {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  }

  // Grade the current question server-side and lock it. Records nothing — the
  // final score is computed independently in submit_mastery_check.
  async function gradeCurrent() {
    if (!current) return;
    // One grade at a time. Without this guard a double-click (or Enter held)
    // fires two overlapping requests against the same question (Contrarian #3).
    if (gradingId !== null) return;
    // Capture the question being graded so the result is always written back to
    // the right id even if the learner navigates away mid-grade.
    const q = current;
    const response = responses[q.id];
    if (response === undefined) return;
    setGradingId(q.id);
    setError(null);
    // Hold the timeout id so we can clear it the moment the grade resolves,
    // instead of leaving a 15s timer running (and rejecting into nothing) after
    // every successful check (Executor H1).
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Race the grade against a timeout so a hung request can never freeze the
      // whole stepper (nav stays disabled while gradingId is set). On timeout we
      // reject into the catch below, which clears gradingId in finally.
      const fb = await Promise.race([
        checkMasteryAnswer(q.id, response),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("grade-timeout")), 15000);
        }),
      ]);
      if (!aliveRef.current) return;
      if (!fb) {
        setError("Could not check that answer. Please try again.");
        return;
      }
      setFeedback((prev) => ({ ...prev, [q.id]: fb }));
    } catch {
      if (aliveRef.current) setError("Could not check that answer. Please try again.");
    } finally {
      if (timer) clearTimeout(timer);
      if (aliveRef.current) setGradingId(null);
    }
  }

  async function handleSubmit() {
    if (!payload) return;
    setSubmitting(true);
    setError(null);
    const res = await submitMasteryCheck(payload.check.id, responses);
    if (!aliveRef.current) return;
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult(res.result);
    setPhase("result");
    if (res.result.passed && !rm) {
      setShowConfetti(true);
      playCompletionChime();
      setTimeout(() => {
        if (aliveRef.current) setShowConfetti(false);
      }, 3000);
    }
  }

  function retake() {
    setResponses({});
    setFeedback({});
    setStep(0);
    setResult(null);
    setError(null);
    // Clear any leftover in-flight grading id so the fresh attempt never starts
    // with navigation frozen by a stale isGrading (Executor MED).
    setGradingId(null);
    setPhase("running");
  }

  // ── Loading ──────────────────────────────────────────────────────────────--
  if (loading) {
    return (
      <Frame>
        <div className="rounded animate-pulse mb-4" style={{ backgroundColor: C.hairline, height: 14, width: 160 }} />
        <div className="rounded animate-pulse mb-3" style={{ backgroundColor: C.hairline, height: 44, width: "75%" }} />
        <div className="rounded animate-pulse mb-8" style={{ backgroundColor: C.hairline, height: 24, width: "55%" }} />
        <div className="rounded animate-pulse" style={{ backgroundColor: C.hairline, height: 180 }} />
      </Frame>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────--
  if (!payload) {
    return (
      <Frame>
        <div className="py-24 text-center">
          <p
            className="font-serif text-3xl"
            style={{ color: C.umber, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
          >
            We couldn't find that check.
          </p>
          <a href="/app" className={`inline-block mt-6 text-sm underline ${FOCUS_RING}`} style={{ color: C.orangeInk }}>
            ← Back to dashboard
          </a>
        </div>
      </Frame>
    );
  }

  const { check, status } = payload;
  const locked = !!status.locked_until && new Date(status.locked_until).getTime() > Date.now();
  const thresholdPct = Math.round(check.pass_threshold * 100);

  // ── Result screen ──────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const passed = result.passed;
    const scorePct = Math.round(result.score * 100);
    return (
      <Frame>
        <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>
        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.ink }}
        >
          <MonoLabel>{passed ? "Nicely done" : "Keep going"}</MonoLabel>
          <h1
            className="font-serif"
            style={{
              color: passed ? C.forest : C.espresso,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
            }}
          >
            {passed ? "You knew this." : "Almost there."}
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: C.umber }}>
            {passed
              ? "On to the next one."
              : "Have a look at the lessons and try again whenever you like."}
          </p>
          <p className="mt-3 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            {result.correct} of {result.total} correct · {scorePct}%
          </p>
          {/* On a miss, lead with reassurance, not the bar they fell short of: the
              threshold framed as a gotcha reads like a grade report to an anxious
              learner (Outsider MED). The lessons are the path forward, not a
              punishment. */}
          {!passed && (
            <p className="mt-2 text-xs" style={{ color: C.umber }}>
              You needed {thresholdPct}% to skip these. No problem, the lessons walk you right through it.
            </p>
          )}

          {passed && (
            <div className="mt-8 grid gap-3">
              {result.points_awarded > 0 && (
                <div
                  className="flex items-center justify-between px-5 py-4 rounded-2xl"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
                >
                  <span className="text-base" style={{ color: C.ink }}>Points earned</span>
                  <span className="font-medium" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
                    +{result.points_awarded}
                  </span>
                </div>
              )}
              {result.lessons_cleared > 0 && (
                <div
                  className="flex items-center justify-between px-5 py-4 rounded-2xl"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
                >
                  <span className="text-base" style={{ color: C.ink }}>Lessons you can skip now</span>
                  <span className="font-medium" style={{ color: C.forest, fontFamily: FONT_MONO }}>
                    {result.lessons_cleared}
                  </span>
                </div>
              )}
              {result.badges_unlocked.length > 0 && (
                <div
                  className="px-5 py-4 rounded-2xl"
                  style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
                >
                  <div className="text-[12px] uppercase tracking-[0.18em] mb-2" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
                    Badge{result.badges_unlocked.length === 1 ? "" : "s"} unlocked
                  </div>
                  <p className="text-base" style={{ color: C.espresso }}>
                    {result.badges_unlocked.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <a
              href="/app"
              className={`inline-flex items-center gap-2 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: passed ? C.forest : C.ink, color: C.paper }}
            >
              Back to dashboard →
            </a>
            {!passed && !result.locked && (
              <button
                onClick={retake}
                className={`${PILL} ${FOCUS_RING} cursor-pointer`}
                style={{ backgroundColor: C.surface, color: C.ink, border: `1px solid ${C.hairline}` }}
              >
                Try again
              </button>
            )}
            {!passed && result.locked && (
              <span className="text-sm" style={{ color: C.umber }}>
                You can try this again {untilLabel(result.locked_until)}.
              </span>
            )}
          </div>
        </motion.div>
      </Frame>
    );
  }

  // ── Intro screen (also handles already-passed and locked) ──────────────────
  if (phase === "intro") {
    return (
      <Frame>
        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.ink }}
        >
          <MonoLabel>Quick check</MonoLabel>
          <h1
            className="font-serif"
            style={{
              color: C.espresso,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
            }}
          >
            {check.title}
          </h1>
          {check.description && (
            <p className="mt-5 text-lg leading-relaxed" style={{ color: C.umber }}>
              {check.description}
            </p>
          )}

          {status.already_passed && (
            <div
              className="mt-6 px-5 py-4 rounded-2xl"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.forest}` }}
            >
              <p className="text-base" style={{ color: C.forest }}>
                You have already passed this check. Retaking it will not change what you have cleared.
              </p>
            </div>
          )}

          {!locked && !status.already_passed && (
            <p className="mt-6 text-base leading-relaxed" style={{ color: C.umber, maxWidth: 480 }}>
              This is optional. If you don't pass, nothing you've completed is lost. You can simply
              learn the lessons, or try again whenever you like.
            </p>
          )}

          <ul className="mt-8 space-y-2.5 text-base" style={{ color: C.ink }}>
            <li className="flex items-center gap-3">
              <span style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>{total}</span>
              question{total === 1 ? "" : "s"}
            </li>
            <li className="flex items-center gap-3">
              <span style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>{thresholdPct}%</span>
              to skip these lessons
            </li>
          </ul>

          <div className="mt-10">
            {locked ? (
              <p className="text-base" style={{ color: C.umber }}>
                Take a breather. You can try this again {untilLabel(status.locked_until)}.
              </p>
            ) : (
              <button
                onClick={() => { setPhase("running"); setStep(0); }}
                disabled={total === 0}
                className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                Try the questions →
              </button>
            )}
          </div>
        </motion.div>
      </Frame>
    );
  }

  // ── Running (stepper) ──────────────────────────────────────────────────────
  const isLast = step === total - 1;
  const currentFeedback = current ? feedback[current.id] : undefined;
  const isGraded = !!currentFeedback;
  // A grade is in flight (any question). We use it to freeze navigation so a
  // learner cannot jump to a sibling question while a network grade is open.
  const isGrading = gradingId !== null;
  // The current question is the one being graded right now.
  const currentIsGrading = !!current && gradingId === current.id;
  // First question still missing an answer, for the last-step safety hint.
  const firstUnansweredStep = questions.findIndex((q) => !answered(q));
  return (
    <Frame>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: C.umber, fontFamily: FONT_MONO }}>
            Question {step + 1} of {total}
          </p>
          <p className="text-[12px]" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            {answeredCount}/{total} answered
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.hairline }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: C.orange }}
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={rm ? { duration: 0 } : { duration: dur.fast, ease: ease.ink }}
          />
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        Question {step + 1} of {total}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current?.id ?? step}
          initial={rm ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={rm ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: dur.fast, ease: ease.ink }}
        >
          {current?.type === "multiple_choice" && (
            <McqQuestion
              question={current}
              value={responses[current.id] as string | undefined}
              onChange={(optionId) => setResponse(current.id, optionId)}
              locked={isGraded || currentIsGrading}
              feedback={currentFeedback}
            />
          )}
          {current?.type === "fill_blank" && (
            <FillBlankQuestion
              question={current}
              value={responses[current.id] as Record<string, string> | undefined}
              onChange={(blankId, text) => {
                const prev = (responses[current.id] as Record<string, string> | undefined) ?? {};
                setResponse(current.id, { ...prev, [blankId]: text });
              }}
              locked={isGraded || currentIsGrading}
              feedback={currentFeedback}
            />
          )}
          {currentFeedback && <FeedbackPanel feedback={currentFeedback} />}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="mt-6 text-sm" role="alert" style={{ color: C.error }}>
          {error}
        </p>
      )}

      {/* If the learner is on the last question but somehow left an earlier one
          blank, tell them exactly which and offer a jump, so the submit button
          is never disabled with no visible reason. */}
      {isLast && !allAnswered && firstUnansweredStep >= 0 && (
        <p className="mt-6 text-sm" style={{ color: C.umber }}>
          A question still needs an answer.{" "}
          <button
            onClick={() => setStep(firstUnansweredStep)}
            className={`font-medium underline underline-offset-2 ${FOCUS_RING} cursor-pointer`}
            style={{ color: C.orangeInk }}
          >
            Go to question {firstUnansweredStep + 1} →
          </button>
        </p>
      )}

      {/* Nav */}
      <div className="mt-12 pt-8 flex items-center justify-between gap-4" style={{ borderTop: `1px solid ${C.hairline}` }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || isGrading}
          className={`text-sm font-medium ${FOCUS_RING} disabled:opacity-0`}
          style={{ color: C.umber }}
        >
          ← Back
        </button>

        {!isGraded ? (
          <motion.button
            onClick={gradeCurrent}
            disabled={!answered(current) || isGrading}
            whileTap={rm ? undefined : { scale: 0.97 }}
            className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            {currentIsGrading ? "Checking…" : "Check my answer"}
          </motion.button>
        ) : isLast ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting || isGrading}
            whileTap={rm ? undefined : { scale: 0.97 }}
            className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            {submitting ? "Adding up your score…" : "See how it went"}
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            disabled={isGrading}
            whileTap={rm ? undefined : { scale: 0.97 }}
            className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            Next question →
          </motion.button>
        )}
      </div>
    </Frame>
  );
}
