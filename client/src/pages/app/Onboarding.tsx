import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, fetchOnboardingComplete, saveOnboarding, generateUserPath } from "@/lib/supabase";
import type { OnboardingAnswers, SkillLevel, AiUsage, OnboardingGoal } from "@/lib/supabase";
import {
  C,
  FOCUS_RING,
  FONT_MONO,
  SKIP_LINK,
  displayFV,
  DISPLAY_WEIGHT_SOFT,
  PILL,
} from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Quiz definition — five single-purpose questions mapped to profiles columns.
// The industry values are tags.slug (kind = 'industry'); the rest map to the
// CHECK-constrained enum columns. Order: confidence → field → habit → goal → role.
// ─────────────────────────────────────────────────────────────────────────────

interface Choice {
  value: string;
  label: string;
  sub: string;
}

interface SingleStep {
  key: "skill_level" | "industry" | "ai_usage" | "goal";
  kind: "single";
  question: string;
  helper: string;
  choices: Choice[];
}

interface TextStep {
  key: "job_role";
  kind: "text";
  question: string;
  helper: string;
  placeholder: string;
}

type Step = SingleStep | TextStep;

const STEPS: Step[] = [
  {
    key: "skill_level",
    kind: "single",
    question: "How comfortable are you with AI tools?",
    helper: "Be honest. It just shapes where we start you.",
    choices: [
      { value: "beginner", label: "Just starting", sub: "I've barely touched them" },
      { value: "some_experience", label: "Some experience", sub: "I use them now and then" },
      { value: "confident", label: "Confident", sub: "I use them often and want depth" },
    ],
  },
  {
    key: "industry",
    kind: "single",
    question: "Which field best describes your work?",
    helper: "We tailor examples to your world.",
    choices: [
      { value: "general", label: "General", sub: "A bit of everything, or none of these" },
      { value: "healthcare", label: "Healthcare", sub: "Clinical, care, or health admin" },
      { value: "legal", label: "Legal", sub: "Law, compliance, or contracts" },
      { value: "education", label: "Education", sub: "Teaching, training, or academia" },
      { value: "finance", label: "Finance", sub: "Accounting, banking, or analysis" },
      { value: "operations", label: "Operations", sub: "Process, logistics, or admin" },
    ],
  },
  {
    key: "ai_usage",
    kind: "single",
    question: "How often do you use AI in a typical week?",
    helper: "Frequency, not skill. They're different things.",
    choices: [
      { value: "not_at_all", label: "Not at all yet", sub: "This is a fresh start" },
      { value: "occasionally", label: "Occasionally", sub: "A few times a week" },
      { value: "regularly", label: "Regularly", sub: "Most days, for real work" },
    ],
  },
  {
    key: "goal",
    kind: "single",
    question: "What would make Lumio worth it for you?",
    helper: "Your main reason for being here.",
    choices: [
      { value: "save_time", label: "Save time", sub: "Get hours back on daily work" },
      { value: "stay_relevant", label: "Stay relevant", sub: "Keep pace as my field changes" },
      { value: "impress_team", label: "Stand out", sub: "Be the sharp one on my team" },
      { value: "other", label: "Something else", sub: "I'll tell you what" },
    ],
  },
  {
    key: "job_role",
    kind: "text",
    question: "What's your role?",
    helper: "Optional. A job title helps us pick the right examples.",
    placeholder: "e.g. Nurse, paralegal, marketing manager",
  },
];

type Draft = Partial<OnboardingAnswers>;

// ─────────────────────────────────────────────────────────────────────────────
// Step renderers
// ─────────────────────────────────────────────────────────────────────────────

function SingleChoice({
  step,
  value,
  onSelect,
}: {
  step: SingleStep;
  value: string | undefined;
  onSelect: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={step.question} className="grid gap-3">
      {step.choices.map((c) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(c.value)}
            className={`text-left rounded-2xl px-5 py-4 cursor-pointer transition-colors ${FOCUS_RING}`}
            style={{
              backgroundColor: selected ? C.orangeWash : C.paperHi,
              border: `1.5px solid ${selected ? C.orange : C.hairline}`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-medium" style={{ color: C.espresso }}>
                  {c.label}
                </div>
                <div className="text-sm mt-0.5" style={{ color: C.umber }}>
                  {c.sub}
                </div>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1.5px solid ${selected ? C.orange : C.inkDisc}`,
                  backgroundColor: selected ? C.orange : "transparent",
                  boxShadow: selected ? `inset 0 0 0 3px ${C.paperHi}` : "none",
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const { user, signOut } = useAuth();
  const [, navigate] = useLocation();
  const rm = useReducedMotion() ?? false;

  const [checking, setChecking] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [goalOther, setGoalOther] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [saving, setSaving] = useState(false);

  // A user who already finished the quiz shouldn't see it again.
  useEffect(() => {
    let cancelled = false;
    fetchOnboardingComplete().then((done) => {
      if (cancelled) return;
      if (done) navigate("/app", { replace: true });
      else setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const total = STEPS.length;

  // Whether the current step is answered enough to advance.
  const canContinue = (() => {
    if (step.kind === "text") return true; // job_role is optional
    const v = draft[step.key];
    if (!v) return false;
    if (step.key === "goal" && v === "other") return goalOther.trim().length > 0;
    return true;
  })();

  function selectSingle(value: string) {
    setDraft((d) => ({ ...d, [step.key]: value }));
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  async function handleContinue() {
    if (!canContinue || saving) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    // Final step — assemble and persist.
    const answers: OnboardingAnswers = {
      skill_level: draft.skill_level as SkillLevel,
      industry: draft.industry as string,
      ai_usage: draft.ai_usage as AiUsage,
      goal: draft.goal as OnboardingGoal,
      goal_other: draft.goal === "other" ? goalOther : undefined,
      job_role: jobRole,
    };
    setSaving(true);
    const res = await saveOnboarding(answers);
    if (res.ok) {
      // Build the personalized path now that the profile exists. Best-effort:
      // a failure here shouldn't block entry — the Dashboard regenerates lazily
      // and falls back to the natural curriculum order in the meantime.
      await generateUserPath();
      // Kick off block personalization and Loops contact enrichment in the
      // background. Fire and forget: a Groq or Loops hiccup must never keep the
      // learner from reaching their dashboard.
      try {
        void supabase.functions.invoke("personalize-blocks");
        void supabase.functions.invoke("loops-enrich-contact");
      } catch {
        // ignore — both are best-effort and reconcile later
      }
      setSaving(false);
      navigate("/app", { replace: true });
    } else {
      setSaving(false);
      toast.error("Couldn't save your answers. Please try again.");
    }
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (checking) {
    return <div style={{ backgroundColor: C.paper, minHeight: "100vh" }} />;
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#onboarding-step" className={SKIP_LINK}>
        Skip to content
      </a>
      <BrandNav
        maxWidth={720}
        right={
          <button
            onClick={handleSignOut}
            className={`text-[13px] font-medium cursor-pointer hover:underline ${FOCUS_RING}`}
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            Sign out
          </button>
        }
      />

      <main
        id="onboarding-step"
        className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8" aria-hidden="true">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 9999,
                backgroundColor: i <= stepIndex ? C.orange : C.hairline,
                transition: rm ? undefined : "background-color 0.4s ease",
              }}
            />
          ))}
        </div>
        <div
          className="text-[12px] uppercase tracking-[0.18em] mb-6"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          Question {stepIndex + 1} of {total}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.key}
            initial={rm ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: dur.base, ease: ease.ink }}
          >
            <h1
              className="font-serif"
              style={{
                color: C.espresso,
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT),
                textWrap: "balance" as const,
              }}
            >
              {step.question}
            </h1>
            <p className="mt-3 mb-8 text-sm" style={{ color: C.umber }}>
              {step.helper}
            </p>

            {step.kind === "single" ? (
              <>
                <SingleChoice step={step} value={draft[step.key]} onSelect={selectSingle} />
                {step.key === "goal" && draft.goal === "other" && (
                  <motion.div
                    initial={rm ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: dur.base, ease: ease.ink }}
                    style={{ overflow: "hidden" }}
                  >
                    <label htmlFor="goal-other" className="sr-only">
                      Tell us your goal
                    </label>
                    <input
                      id="goal-other"
                      type="text"
                      value={goalOther}
                      onChange={(e) => setGoalOther(e.target.value)}
                      placeholder="What are you hoping to get out of this?"
                      className={`mt-4 w-full rounded-2xl px-5 py-4 text-base ${FOCUS_RING}`}
                      style={{
                        backgroundColor: C.surface,
                        border: `1.5px solid ${C.hairline}`,
                        color: C.ink,
                      }}
                    />
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <label htmlFor="job-role" className="sr-only">
                  {step.question}
                </label>
                <input
                  id="job-role"
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder={step.placeholder}
                  className={`w-full rounded-2xl px-5 py-4 text-base ${FOCUS_RING}`}
                  style={{
                    backgroundColor: C.surface,
                    border: `1.5px solid ${C.hairline}`,
                    color: C.ink,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleContinue();
                  }}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className={`text-sm font-medium cursor-pointer ${FOCUS_RING}`}
            style={{
              color: C.umber,
              opacity: stepIndex === 0 ? 0.3 : 1,
              pointerEvents: stepIndex === 0 ? "none" : "auto",
            }}
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className={`${PILL} ${FOCUS_RING}`}
            style={{
              backgroundColor: C.orange,
              color: C.ink,
              opacity: !canContinue || saving ? 0.45 : 1,
              cursor: !canContinue || saving ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? "Saving…"
              : isLast
                ? jobRole.trim()
                  ? "Start learning →"
                  : "Skip and start →"
                : "Continue →"}
          </button>
        </div>
      </main>
    </div>
  );
}
