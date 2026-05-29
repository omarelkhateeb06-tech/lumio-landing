import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMasteryCheckBySlug,
  submitMasteryCheck,
  type MasteryCheckPayload,
  type CheckQuestion,
  type CheckResponse,
  type CheckResponses,
  type SubmitResult,
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
  const mins = Math.round(ms / 60000);
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
}: {
  question: Extract<CheckQuestion, { type: "multiple_choice" }>;
  value: string | undefined;
  onChange: (optionId: string) => void;
}) {
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
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 px-5 py-4 rounded-2xl cursor-pointer transition-colors ${FOCUS_RING}`}
              style={{
                backgroundColor: selected ? C.orangeWash : C.surface,
                border: `1.5px solid ${selected ? C.orange : C.hairline}`,
              }}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={selected}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-0.5 flex-shrink-0 grid place-items-center rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  border: `1.5px solid ${selected ? C.orange : C.inkDisc}`,
                  backgroundColor: selected ? C.orange : "transparent",
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
}: {
  question: Extract<CheckQuestion, { type: "fill_blank" }>;
  value: Record<string, string> | undefined;
  onChange: (blankId: string, text: string) => void;
}) {
  // Split the template on {{id}} placeholders, interleaving text and inputs.
  const segments = useMemo(
    () => question.content.template.split(/(\{\{\w+\}\})/g),
    [question.content.template],
  );

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
            return (
              <input
                key={i}
                type="text"
                aria-label={`Blank ${blankId}`}
                value={value?.[blankId] ?? ""}
                onChange={(e) => onChange(blankId, e.target.value)}
                className={`inline-block mx-1 px-3 py-1 rounded-lg text-base ${FOCUS_RING}`}
                style={{
                  minWidth: 120,
                  backgroundColor: C.surface,
                  border: `1.5px solid ${value?.[blankId]?.trim() ? C.orange : C.hairline}`,
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
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

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

  async function handleSubmit() {
    if (!payload) return;
    setSubmitting(true);
    setError(null);
    const res = await submitMasteryCheck(payload.check.id, responses);
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
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }

  function retake() {
    setResponses({});
    setStep(0);
    setResult(null);
    setError(null);
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
            Check not found.
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
          <MonoLabel>{passed ? "Passed" : "Not yet"}</MonoLabel>
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
            {passed ? "You aced it." : "Almost there."}
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: C.umber }}>
            You answered {result.correct} of {result.total} correctly ({scorePct}%).
            {passed
              ? " That clears the bar."
              : ` You need ${thresholdPct}% to pass. Review the lessons and try again.`}
          </p>

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
                  <span className="text-base" style={{ color: C.ink }}>Lessons cleared</span>
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
                You can retake this {untilLabel(result.locked_until)}.
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
          <MonoLabel>Mastery check · {check.scope}</MonoLabel>
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

          <ul className="mt-8 space-y-2.5 text-base" style={{ color: C.ink }}>
            <li className="flex items-center gap-3">
              <span style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>{total}</span>
              question{total === 1 ? "" : "s"}
            </li>
            <li className="flex items-center gap-3">
              <span style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>{thresholdPct}%</span>
              to pass
            </li>
            {status.attempts > 0 && (
              <li className="flex items-center gap-3">
                <span style={{ color: C.umber, fontFamily: FONT_MONO }}>{status.attempts}</span>
                previous attempt{status.attempts === 1 ? "" : "s"}
              </li>
            )}
          </ul>

          <div className="mt-10">
            {locked ? (
              <p className="text-base" style={{ color: C.umber }}>
                This check is cooling down. You can take it {untilLabel(status.locked_until)}.
              </p>
            ) : (
              <button
                onClick={() => { setPhase("running"); setStep(0); }}
                disabled={total === 0}
                className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                Begin check →
              </button>
            )}
          </div>
        </motion.div>
      </Frame>
    );
  }

  // ── Running (stepper) ──────────────────────────────────────────────────────
  const isLast = step === total - 1;
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
            />
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="mt-6 text-sm" role="alert" style={{ color: C.error }}>
          {error}
        </p>
      )}

      {/* Nav */}
      <div className="mt-12 pt-8 flex items-center justify-between gap-4" style={{ borderTop: `1px solid ${C.hairline}` }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`text-sm font-medium ${FOCUS_RING} disabled:opacity-0`}
          style={{ color: C.umber }}
        >
          ← Back
        </button>

        {isLast ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            whileTap={rm ? undefined : { scale: 0.97 }}
            className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            {submitting ? "Grading…" : "Submit check"}
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            disabled={!answered(current)}
            whileTap={rm ? undefined : { scale: 0.97 }}
            className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            Next →
          </motion.button>
        )}
      </div>
    </Frame>
  );
}
