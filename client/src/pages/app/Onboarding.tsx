import { useEffect, useRef, useState } from "react";
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
// Quiz definition — single-purpose questions mapped to profiles columns. The
// industry values are tags.slug (kind = 'industry'); the rest map to the
// CHECK-constrained enum columns. Order: confidence → field → habit → goal →
// role → discovery → org size → experience → company → data-use consent. The
// identity-capture steps (found_via onward) are all optional/skippable; the
// final consent step is an affirmative opt-in that never blocks finishing.
// ─────────────────────────────────────────────────────────────────────────────

interface Choice {
  value: string;
  label: string;
  sub: string;
}

interface SingleStep {
  key: "skill_level" | "industry" | "ai_usage" | "goal" | "found_via" | "company_size" | "years_experience";
  kind: "single";
  question: string;
  helper: string;
  choices: Choice[];
  /** Optional single steps can be advanced without a selection (and offer a Skip). */
  optional?: boolean;
}

interface TextStep {
  key: "job_role" | "company_name";
  kind: "text";
  question: string;
  helper: string;
  placeholder: string;
}

// Final affirmative-opt-in step: a single checkbox for data-use consent. Kept as
// its own kind so it never blocks finishing — an unchecked box just leaves no
// consent stamp.
interface ConsentStep {
  key: "data_consent";
  kind: "consent";
  question: string;
  helper: string;
}

type Step = SingleStep | TextStep | ConsentStep;

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
      { value: "hr", label: "HR", sub: "People, recruiting, or HR ops" },
      { value: "customer-service", label: "Customer service", sub: "Support, success, or service" },
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
  {
    key: "found_via",
    kind: "single",
    question: "How did you find Lumio?",
    helper: "Optional. It just helps us know what's working.",
    optional: true,
    choices: [
      { value: "youtube", label: "YouTube", sub: "A video or channel" },
      { value: "linkedin", label: "LinkedIn", sub: "A post or someone I follow" },
      { value: "reddit", label: "Reddit", sub: "A thread or community" },
      { value: "twitter", label: "X / Twitter", sub: "A post or reply" },
      { value: "search", label: "Search", sub: "Google or another search engine" },
      { value: "friend", label: "A friend or colleague", sub: "Someone told me about it" },
      { value: "other", label: "Somewhere else", sub: "None of these" },
    ],
  },
  {
    key: "company_size",
    kind: "single",
    question: "How big is your organization?",
    helper: "Optional. Skip if it's not relevant.",
    optional: true,
    choices: [
      { value: "1-10", label: "Just me / small team", sub: "1–10 people" },
      { value: "11-50", label: "A growing team", sub: "11–50 people" },
      { value: "51-200", label: "Mid-sized", sub: "51–200 people" },
      { value: "201-1000", label: "Large", sub: "201–1,000 people" },
      { value: "1000+", label: "Enterprise", sub: "More than 1,000 people" },
    ],
  },
  {
    key: "years_experience",
    kind: "single",
    question: "How long have you worked in your field?",
    helper: "Optional. It helps us pitch examples at the right level.",
    optional: true,
    choices: [
      { value: "0-2", label: "Just getting started", sub: "0–2 years" },
      { value: "3-7", label: "A few years in", sub: "3–7 years" },
      { value: "8-15", label: "Well established", sub: "8–15 years" },
      { value: "15+", label: "Deeply experienced", sub: "15+ years" },
    ],
  },
  {
    key: "company_name",
    kind: "text",
    question: "Where do you work?",
    helper: "Optional. Leave it blank if you'd rather not say.",
    placeholder: "Company or organization (optional)",
  },
  {
    key: "data_consent",
    kind: "consent",
    question: "One last thing.",
    helper: "How we'd like to use what you learn here.",
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
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // ARIA radiogroup keyboard contract: arrows move selection (and focus) and the
  // group is a single tab stop (roving tabindex). The selected option is the tab
  // stop; with nothing selected yet, the first option is.
  const selectedIndex = step.choices.findIndex((c) => c.value === value);

  function move(from: number, dir: 1 | -1) {
    const n = step.choices.length;
    const next = (from + dir + n) % n;
    onSelect(step.choices[next].value);
    btnRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        move(index, 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        move(index, -1);
        break;
      case "Home":
        e.preventDefault();
        onSelect(step.choices[0].value);
        btnRefs.current[0]?.focus();
        break;
      case "End": {
        e.preventDefault();
        const last = step.choices.length - 1;
        onSelect(step.choices[last].value);
        btnRefs.current[last]?.focus();
        break;
      }
    }
  }

  return (
    <div role="radiogroup" aria-label={step.question} className="grid gap-3">
      {step.choices.map((c, i) => {
        const selected = value === c.value;
        const isTabStop = selectedIndex === -1 ? i === 0 : selected;
        return (
          <button
            key={c.value}
            ref={(el) => { btnRefs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={isTabStop ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, i)}
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

// Affirmative-opt-in consent checkbox. Unchecked by default; a native checkbox
// keeps the keyboard/space-to-toggle contract for free. The Privacy Policy link
// opens in a new tab so it never interrupts the flow.
function ConsentCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor="data-consent"
      className={`flex items-start gap-3 text-left rounded-2xl px-5 py-4 cursor-pointer transition-colors ${FOCUS_RING}`}
      style={{
        backgroundColor: checked ? C.orangeWash : C.paperHi,
        border: `1.5px solid ${checked ? C.orange : C.hairline}`,
      }}
    >
      <input
        id="data-consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-0.5 shrink-0 ${FOCUS_RING}`}
        style={{ width: 18, height: 18, accentColor: C.orange }}
      />
      <span className="text-sm leading-relaxed" style={{ color: C.espresso }}>
        I agree that Lumio may use my learning activity to improve the product, and may share
        anonymized, aggregated insights with third parties. See our{" "}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          // Stop the click from toggling the surrounding label's checkbox when the
          // learner just wants to read the policy.
          onClick={(e) => e.stopPropagation()}
          className="underline underline-offset-2"
          style={{ color: C.orangeInk }}
        >
          Privacy Policy
        </a>
        .
      </span>
    </label>
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
  const [companyName, setCompanyName] = useState("");
  // Affirmative opt-in: unchecked by default. An unchecked finish simply records
  // no consent stamp.
  const [dataConsent, setDataConsent] = useState(false);
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
    if (step.kind === "text") return true; // text steps (role, company) are optional
    if (step.kind === "consent") return true; // never block finishing on consent
    if (step.optional) return true; // optional single steps can advance unselected
    const v = draft[step.key];
    if (!v) return false;
    if (step.key === "goal" && v === "other") return goalOther.trim().length > 0;
    return true;
  })();

  function selectSingle(key: SingleStep["key"], value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
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
      company_name: companyName,
      company_size: draft.company_size,
      years_experience: draft.years_experience,
      found_via: draft.found_via,
      data_consent: dataConsent,
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
    // A blank screen tells a screen reader nothing; announce the wait so the
    // page isn't silent until content appears (Executor).
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100vh" }}>
        <p className="sr-only" role="status" aria-live="polite">
          Loading your account.
        </p>
      </div>
    );
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
                <SingleChoice
                  step={step}
                  value={draft[step.key]}
                  onSelect={(v) => selectSingle(step.key, v)}
                />
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
            ) : step.kind === "text" ? (
              <>
                <label htmlFor={`text-${step.key}`} className="sr-only">
                  {step.question}
                </label>
                <input
                  id={`text-${step.key}`}
                  type="text"
                  value={step.key === "company_name" ? companyName : jobRole}
                  onChange={(e) =>
                    step.key === "company_name"
                      ? setCompanyName(e.target.value)
                      : setJobRole(e.target.value)
                  }
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
            ) : (
              <ConsentCheckbox checked={dataConsent} onChange={setDataConsent} />
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
            {saving ? "Saving…" : isLast ? "Start learning →" : "Continue →"}
          </button>
        </div>
      </main>
    </div>
  );
}
