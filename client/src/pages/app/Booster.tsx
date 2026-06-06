import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { fetchLessonBySlug, completeBooster } from "@/lib/supabase";
import type { LessonReaderData } from "@/lib/supabase";
import type { MultipleChoiceContent } from "@/lib/curriculum";
import { C, FOCUS_RING, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT, PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Booster — a short spaced-review pass over one lesson the learner finished a few
// days ago. It pulls the lesson's multiple-choice checkpoints, shows up to three
// at random one at a time (same look as the mastery check), then a calm
// "memory locked in" close. Nothing is scored or recorded except marking the
// queued booster complete. Deliberately minimal: no progress bar, no XP.
// ─────────────────────────────────────────────────────────────────────────────

const BOOSTER_QUESTION_COUNT = 3;

const DashboardLink = (
  <a
    href="/app"
    className={`text-[13px] font-medium tracking-tight ${FOCUS_RING}`}
    style={{ color: C.umber }}
  >
    ← Dashboard
  </a>
);

// Shared nav + paper canvas + centered column, matching the lesson/check frame.
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#booster-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={720} topAccent={false} right={DashboardLink} />
      <div id="booster-content" className="max-w-[720px] mx-auto px-6 pt-[110px] pb-24">
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

// A single booster question — radio cards graded client-side from is_correct.
// Mirrors the MasteryCheck MCQ card: chosen option colors forest/error once
// locked, the rest dim, and an explanation panel appears below.
function BoosterQuestion({
  content,
  value,
  onChange,
  locked,
}: {
  content: MultipleChoiceContent;
  value: string | undefined;
  onChange: (optionId: string) => void;
  locked: boolean;
}) {
  const chosen = content.options.find((o) => o.id === value) ?? null;
  const isCorrect = !!chosen?.is_correct;
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend
        className="font-serif text-2xl leading-snug mb-6"
        style={{ color: C.espresso, fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT) }}
      >
        {content.stem}
      </legend>
      <div className="space-y-3">
        {content.options.map((opt) => {
          const selected = value === opt.id;
          const stateColor = locked && selected ? (opt.is_correct ? C.forest : C.error) : selected ? C.orange : C.hairline;
          const bg = locked && selected ? (opt.is_correct ? C.orangeWash : C.surface) : selected ? C.orangeWash : C.surface;
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
                name={content.stem}
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

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {locked && chosen && (
            <motion.div
              key={chosen.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur.fast, ease: ease.ink }}
              className="mt-6 px-5 py-4 rounded-xl"
              style={{
                backgroundColor: isCorrect ? C.orangeWash : C.surface,
                border: `1px solid ${isCorrect ? C.orangeWashBorder : C.hairline}`,
              }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: isCorrect ? C.forest : C.error, fontFamily: FONT_MONO }}
              >
                {isCorrect ? "Still got it" : "Worth another look"}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
                {chosen.explanation ?? (isCorrect ? "That is the one." : "Have another look back at the lesson.")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </fieldset>
  );
}

// Deterministic-enough shuffle: pick `count` items in random order. Runs once per
// mount (memoized), so the chosen questions stay stable while the learner steps.
function pickRandom<T>(items: T[], count: number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

type Phase = "running" | "done";

export default function Booster() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  useAuth(); // ProtectedRoute handles redirect; this wires the context

  const rm = useReducedMotion() ?? false;
  const [lesson, setLesson] = useState<LessonReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("running");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const completedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLessonBySlug(slug).then((data) => {
      if (cancelled) return;
      setLesson(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // The booster's questions: up to three of the lesson's multiple-choice blocks,
  // chosen at random once per mount.
  const questions = useMemo(() => {
    if (!lesson) return [];
    const mcq = lesson.blocks.filter((b) => b.type === "multiple_choice");
    return pickRandom(mcq, BOOSTER_QUESTION_COUNT).map((b) => ({
      id: b.id,
      content: b.content as MultipleChoiceContent,
    }));
  }, [lesson]);

  // Stamp the queued booster complete the first time the close screen shows.
  useEffect(() => {
    if (phase === "done" && !completedRef.current) {
      completedRef.current = true;
      void completeBooster(slug);
    }
  }, [phase, slug]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Frame>
        <div className="rounded animate-pulse mb-4" style={{ backgroundColor: C.hairline, height: 14, width: 140 }} />
        <div className="rounded animate-pulse mb-3" style={{ backgroundColor: C.hairline, height: 40, width: "70%" }} />
        <div className="rounded animate-pulse" style={{ backgroundColor: C.hairline, height: 180 }} />
      </Frame>
    );
  }

  // ── Nothing to review (lesson gone or no checkpoints) ────────────────────────
  if (!lesson || questions.length === 0) {
    return (
      <Frame>
        <div className="py-24 text-center">
          <p
            className="font-serif text-3xl"
            style={{ color: C.umber, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
          >
            Nothing to review here.
          </p>
          <a href="/app" className={`inline-block mt-6 text-sm underline ${FOCUS_RING}`} style={{ color: C.orangeInk }}>
            ← Back to dashboard
          </a>
        </div>
      </Frame>
    );
  }

  // ── Completion ───────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <Frame>
        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.ink }}
        >
          <MonoLabel>Booster complete</MonoLabel>
          <h1
            className="font-serif"
            style={{
              color: C.forest,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
            }}
          >
            Memory locked in.
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: C.umber, maxWidth: 520 }}>
            Reviewing right before you forget is how it sticks. This lesson is now set deeper.
          </p>
          <div className="mt-10">
            <a
              href="/app"
              className={`inline-flex items-center gap-2 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.forest, color: C.paper }}
            >
              ← Back to dashboard
            </a>
          </div>
        </motion.div>
      </Frame>
    );
  }

  // ── Running ──────────────────────────────────────────────────────────────────
  const total = questions.length;
  const current = questions[step];
  const isLast = step === total - 1;
  const isLocked = !!locked[current.id];
  const hasAnswer = !!answers[current.id];

  return (
    <Frame>
      <motion.div
        initial={rm ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur.base, ease: ease.ink }}
      >
        <MonoLabel>Quick memory check · {lesson.title}</MonoLabel>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={rm ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={rm ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: dur.fast, ease: ease.ink }}
          >
            <BoosterQuestion
              content={current.content}
              value={answers[current.id]}
              onChange={(optionId) => setAnswers((prev) => ({ ...prev, [current.id]: optionId }))}
              locked={isLocked}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 pt-8 flex items-center justify-between gap-4" style={{ borderTop: `1px solid ${C.hairline}` }}>
          <span className="text-[12px] uppercase tracking-[0.18em]" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            {step + 1} of {total}
          </span>
          {!isLocked ? (
            <motion.button
              onClick={() => setLocked((prev) => ({ ...prev, [current.id]: true }))}
              disabled={!hasAnswer}
              whileTap={rm ? undefined : { scale: 0.97 }}
              className={`${PILL} ${FOCUS_RING} cursor-pointer disabled:opacity-50`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Check my answer
            </motion.button>
          ) : isLast ? (
            <motion.button
              onClick={() => setPhase("done")}
              whileTap={rm ? undefined : { scale: 0.97 }}
              className={`${PILL} ${FOCUS_RING} cursor-pointer`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Finish →
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
              whileTap={rm ? undefined : { scale: 0.97 }}
              className={`${PILL} ${FOCUS_RING} cursor-pointer`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Next question →
            </motion.button>
          )}
        </div>
      </motion.div>
    </Frame>
  );
}
