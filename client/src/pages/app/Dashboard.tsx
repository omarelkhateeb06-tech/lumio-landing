import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Footprints, Flag, Crown, Sparkles, Flame, Zap, Compass, Gem, BadgeCheck, Lock,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCurriculum,
  fetchCompletedLessonIds,
  fetchActivePath,
  fetchProfileSummary,
  fetchPendingBoosters,
  generateUserPath,
} from "@/lib/supabase";
import type { Curriculum, CurriculumLesson, ProfileSummary, OnboardingGoal, PendingBooster } from "@/lib/supabase";
import {
  fetchUserStats,
  fetchBadgeDefinitions,
  fetchEarnedBadgeIds,
  fetchMasteryChecks,
  fetchMasteredLessonIds,
  recordActivity,
  moduleCheckFor,
  levelCheckFor,
} from "@/lib/gamification";
import type { UserStats, BadgeDefinition, MasteryCheckSummary } from "@/lib/gamification";
import { fetchDashboardCerts, CERT_STATUS_LABEL, dollars, isLessonsDoneUnpaid, certProgressPct, LESSON_TIME_COPY } from "@/lib/certs";
import type { CertDashboardCard } from "@/lib/certs";
import { CERT_STATUS_TONE } from "@/lib/certStatusUi";
import { C, FOCUS_RING, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT, PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { truncateEmail } from "@/lib/format";
import { BrandNav } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

// The subline carries the emotional job of the product: "I'm not behind
// anymore." We reflect the dream outcome the learner named at onboarding back at
// them, so the dashboard's center of gravity is who they're becoming, not a
// fraction of a 124-lesson catalog. The progress bar below already shows counts.
function goalSubline(
  goal: OnboardingGoal | null,
  goalOther: string | null,
  started: boolean,
): string {
  switch (goal) {
    case "save_time":
      return started
        ? "You're building the skills that give your time back."
        : "Let's start giving your time back.";
    case "stay_relevant":
      return started
        ? "You're keeping pace with where work is heading."
        : "A few minutes a day, and you're keeping pace with where work is heading.";
    case "impress_team":
      return started
        ? "You're becoming the person your team turns to."
        : "Let's build the skills your team will notice.";
    case "other": {
      // The learner typed their own dream outcome at onboarding. Echo it back
      // after a colon, where any free-text fragment stays grammatical. Skip
      // overlong entries that would wrap awkwardly.
      const aim = goalOther?.trim();
      if (aim && aim.length <= 60) {
        return started
          ? `Still moving toward what you came here for: ${aim}.`
          : `Let's move toward what you came here for: ${aim}.`;
      }
      return started
        ? "You're making real progress. Keep going."
        : "Your first lesson is ready.";
    }
    default:
      return started
        ? "You're making real progress. Keep going."
        : "Your first lesson is ready.";
  }
}

const LEVEL_LABEL: Record<CurriculumLesson["level"], string> = {
  beginner: "Beginner",
  growing: "Growing",
  confident: "Confident",
};

// The Industry Deep Dives module is presented grouped by profession rather than
// as one 42-lesson card. The DB keeps it as a single module slug.
const IDD_MODULE_SLUG = "industry-deep-dives";

const INDUSTRY_LABEL: Record<string, string> = {
  healthcare: "Healthcare",
  legal: "Legal",
  education: "Education",
  finance: "Finance",
  hr: "HR",
  "customer-service": "Customer service",
  general: "General and cross-field",
};

// Operations is no longer a selectable field and has no certificate, so its
// lone deep-dive lesson folds into the general bucket for display.
function industryDisplayKey(slug: string | null): string {
  if (!slug || slug === "operations") return "general";
  return slug;
}

function industryLabel(key: string): string {
  return INDUSTRY_LABEL[key] ?? key;
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav action (right side of the brand nav)
// ─────────────────────────────────────────────────────────────────────────────

function NavActions({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-3 text-[13px]" style={{ color: C.umber, fontFamily: FONT_MONO }}>
      {email && <span className="hidden sm:block">{truncateEmail(email)}</span>}
      {email && <span className="hidden sm:block" style={{ opacity: 0.4 }}>·</span>}
      <a href="/app/profile" className={`font-medium hover:underline ${FOCUS_RING}`} style={{ color: C.umber }}>
        Profile
      </a>
      <span style={{ opacity: 0.4 }}>·</span>
      <button
        onClick={onSignOut}
        className={`font-medium hover:underline cursor-pointer ${FOCUS_RING}`}
        style={{ color: C.ink }}
      >
        Sign out
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Today's lesson card
// ─────────────────────────────────────────────────────────────────────────────

function TodayCard({
  lesson,
  certName,
  total,
  rm,
  demoted = false,
}: {
  lesson: CurriculumLesson | null;
  certName?: string | null;
  total: number;
  rm: boolean;
  // When a "ready to certify" callout owns the loud orange button below, today's
  // lesson steps down to a quiet link so one screen carries one loud action
  // (First Principles H1: don't stack two orange CTAs at the buy moment).
  demoted?: boolean;
}) {
  if (!lesson) {
    return (
      <motion.div
        initial={rm ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur.base, delay: 0.4, ease: ease.ink }}
        className="rounded-2xl p-8 mt-10"
        style={{
          backgroundColor: C.paperHi,
          border: `1px solid ${C.hairline}`,
        }}
      >
        <h2
          className="font-serif text-2xl"
          style={{
            color: C.forest,
            fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
          }}
        >
          You finished every lesson.
        </h2>
        <p className="mt-3 text-sm" style={{ color: C.umber }}>
          That's all {total} lessons in the Lumio curriculum so far. Every module, every lesson. Well done.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.4, ease: ease.ink }}
      className="rounded-2xl p-8 mt-10"
      style={{
        backgroundColor: C.paperHi,
        border: `1px solid ${C.hairline}`,
      }}
    >
      <div
        className="text-[12px] uppercase tracking-[0.18em] mb-3"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {lesson.module_title}
      </div>
      <h2
        className="font-serif"
        style={{
          color: C.espresso,
          fontSize: "clamp(30px, 4vw, 42px)",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
        }}
      >
        {lesson.title}
      </h2>
      {/* Just the time. A difficulty stamp ("Confident") on the one lesson we're
          nudging the learner into reads as a test of ability, not an invitation;
          the level still structures the module grid below where it aids planning. */}
      <div
        className="mt-2 text-sm"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {lesson.estimated_minutes} min
      </div>
      {lesson.hook && (
        <p className="mt-4 italic text-sm leading-relaxed" style={{ color: C.umber }}>
          {lesson.hook}
        </p>
      )}
      {/* Make the lesson → certificate link explicit so a 5-minute lesson
          visibly moves the named finish line the hero bar is tracking. */}
      {certName && (
        <p className="mt-4 text-sm" style={{ color: C.forest }}>
          Counts toward {certName}
        </p>
      )}
      {demoted ? (
        <a
          href={`/lesson/${lesson.slug}`}
          className={`inline-block mt-6 text-sm font-medium ${FOCUS_RING}`}
          style={{ color: C.orangeInk }}
        >
          Start lesson →
        </a>
      ) : (
        <a
          href={`/lesson/${lesson.slug}`}
          className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.orange, color: C.ink }}
        >
          Start lesson →
        </a>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Module progress grid
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_ORDER: CurriculumLesson["level"][] = ["beginner", "growing", "confident"];

function ModuleGrid({
  curriculum,
  completed,
  checks,
  rm,
}: {
  curriculum: Curriculum;
  completed: Set<string>;
  checks: MasteryCheckSummary[];
  rm: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  // The full library is a reference, not the home. Keep it one click away so the
  // dashboard greets the learner with one next move instead of a wall of every
  // lesson, which is the exact "I'm behind" feeling this product exists to calm
  // (Naval: subtract; the catalog stays reachable, just not fronted).
  const [showAll, setShowAll] = useState(false);

  // Level checks let a confident learner test out of an entire level at once.
  const levelChecks = LEVEL_ORDER.map((lvl) => ({ lvl, check: levelCheckFor(checks, lvl) }))
    .filter((x) => x.check);

  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.55, ease: ease.ink }}
      className="mt-16"
    >
      {/* "All lessons", not "Your progress": progress is anchored to the active
          certificate up top. This section is the full library to browse, so it
          shouldn't compete for the headline-progress framing (First Principles). */}
      <div className={`flex items-center justify-between gap-3 ${showAll ? "mb-6" : ""}`}>
        <h2
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: 22,
            fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
          }}
        >
          All lessons
        </h2>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          aria-controls="all-lessons-body"
          className={`text-sm font-medium cursor-pointer ${FOCUS_RING}`}
          style={{ color: C.orangeInk }}
        >
          {showAll ? "Hide" : "Browse all lessons →"}
        </button>
      </div>

      {showAll && (
      <div id="all-lessons-body">
      {levelChecks.length > 0 && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          {/* Reassure right at the click, not just inside the check (Outsider HIGH):
              an anxious learner reads "skip ahead" as a test they could fail and
              lose progress on. Name that nothing is lost. */}
          <span className="text-xs mr-1" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            Already comfortable? Answer a few questions to skip these lessons. Nothing is lost if you don't:
          </span>
          {levelChecks.map(({ lvl, check }) => (
            <a
              key={check!.id}
              href={`/check/${check!.slug}`}
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${FOCUS_RING}`}
              style={{ backgroundColor: C.surface, color: C.orangeInk, border: `1px solid ${C.orangeWashBorder}` }}
            >
              {LEVEL_LABEL[lvl]} level →
            </a>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {curriculum.modules
          .filter((mod) => mod.slug !== IDD_MODULE_SLUG)
          .map((mod) => {
          const moduleLessons = curriculum.lessons.filter((l) => l.module_slug === mod.slug);
          const moduleTotal = moduleLessons.length;
          const completedInModule = moduleLessons.filter((l) => completed.has(l.id)).length;
          const isOpen = expanded === mod.slug;
          return (
            <div
              key={mod.slug}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: C.paperHi,
                border: `1px solid ${C.hairline}`,
              }}
            >
              <button
                type="button"
                className={`w-full text-left cursor-pointer ${FOCUS_RING}`}
                aria-expanded={isOpen}
                aria-controls={`mod-panel-${mod.slug}`}
                aria-label={`${mod.title} - ${completedInModule} of ${moduleTotal} complete`}
                onClick={() => setExpanded(isOpen ? null : mod.slug)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="text-[12px] uppercase tracking-[0.08em] sm:tracking-[0.14em] mb-1 leading-tight"
                    style={{ color: C.umber, fontFamily: FONT_MONO }}
                  >
                    {mod.title}
                  </div>
                  <span
                    aria-hidden="true"
                    style={{
                      color: C.inkSoft,
                      fontSize: 12,
                      transition: rm ? undefined : "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  >
                    &#x25BE;
                  </span>
                </div>
                {/* Per-lesson dots carry the progress visually; the precise count
                    is kept for screen readers only so the row reads as one idea,
                    not a number repeated next to its own picture (Rubin). */}
                <span className="sr-only">{completedInModule} of {moduleTotal} complete</span>
                {/* Completed dots are solid-filled, incomplete are hollow rings, so
                    done/not-done reads without relying on color alone. */}
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  {moduleLessons.map((l) => {
                    const done = completed.has(l.id);
                    return (
                      <div
                        key={l.id}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: done ? C.orange : "transparent",
                          border: done ? "none" : `1.5px solid ${C.inkDisc}`,
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`mod-panel-${mod.slug}`}
                    role="region"
                    aria-label={`${mod.title} lessons`}
                    initial={rm ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: dur.base, ease: ease.ink }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="mt-3 pt-3 space-y-1.5" style={{ borderTop: `1px solid ${C.hairline}` }}>
                      {moduleLessons.map((l) => (
                        <li key={l.id} className="flex items-center gap-2">
                          {completed.has(l.id) && (
                            <span aria-hidden="true" style={{ color: C.forest, fontSize: 12, flexShrink: 0 }}>&#x2713;</span>
                          )}
                          <a
                            href={`/lesson/${l.slug}`}
                            className="font-serif hover:underline"
                            style={{
                              color: C.espresso,
                              fontSize: 15,
                              fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {l.title}
                            {completed.has(l.id) && (
                              <span className="sr-only"> (completed)</span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {(() => {
                      const moduleCheck = moduleCheckFor(checks, mod.slug);
                      if (!moduleCheck || completedInModule === moduleTotal) return null;
                      return (
                        <a
                          href={`/check/${moduleCheck.slug}`}
                          className={`inline-block mt-3 text-xs font-medium ${FOCUS_RING}`}
                          style={{ color: C.orangeInk }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Already know this? Skip ahead →
                        </a>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      </div>
      )}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Industry deep dives — the 42-lesson module presented grouped by profession.
// The learner's own field is surfaced first and opened by default; the other
// fields are collapsed under "Explore other fields" so the section reads as
// "a path made for someone like me" rather than one undifferentiated pile.
// ─────────────────────────────────────────────────────────────────────────────

function LessonRow({ lesson, done }: { lesson: CurriculumLesson; done: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {done && (
        <span aria-hidden="true" style={{ color: C.forest, fontSize: 12, flexShrink: 0 }}>&#x2713;</span>
      )}
      <a
        href={`/lesson/${lesson.slug}`}
        className="font-serif hover:underline"
        style={{
          color: C.espresso,
          fontSize: 15,
          fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {lesson.title}
        {done && <span className="sr-only"> (completed)</span>}
      </a>
    </li>
  );
}

function FieldGroup({
  label,
  lessons,
  completed,
  open,
  onToggle,
  rm,
}: {
  label: string;
  lessons: CurriculumLesson[];
  completed: Set<string>;
  open: boolean;
  onToggle: () => void;
  rm: boolean;
}) {
  const total = lessons.length;
  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const panelId = `field-panel-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      <button
        type="button"
        className={`w-full text-left cursor-pointer ${FOCUS_RING}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label} - ${doneCount} of ${total} complete`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="text-base font-medium leading-tight" style={{ color: C.espresso }}>
            {label}
          </div>
          <span
            aria-hidden="true"
            style={{
              color: C.inkSoft,
              fontSize: 12,
              transition: rm ? undefined : "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block",
              flexShrink: 0,
            }}
          >
            &#x25BE;
          </span>
        </div>
        <div className="text-xs mt-1" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
          {doneCount}/{total} complete
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${label} lessons`}
            initial={rm ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            style={{ overflow: "hidden" }}
          >
            <ul className="mt-3 pt-3 space-y-1.5" style={{ borderTop: `1px solid ${C.hairline}` }}>
              {lessons.map((l) => (
                <LessonRow key={l.id} lesson={l} done={completed.has(l.id)} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IndustryDeepDives({
  lessons,
  completed,
  userIndustry,
  moduleCheck,
  rm,
}: {
  lessons: CurriculumLesson[];
  completed: Set<string>;
  userIndustry: string | null;
  moduleCheck: MasteryCheckSummary | undefined;
  rm: boolean;
}) {
  // Group the module's lessons by their industry tag (operations folds into general).
  const groups = new Map<string, CurriculumLesson[]>();
  for (const l of lessons) {
    const key = industryDisplayKey(l.industry);
    const arr = groups.get(key);
    if (arr) arr.push(l);
    else groups.set(key, [l]);
  }

  const userKey = industryDisplayKey(userIndustry);
  const hasUserField = userKey !== "general" && groups.has(userKey);

  // Order the "other" fields: largest first, with the general bucket always last.
  const otherKeys = Array.from(groups.keys())
    .filter((k) => k !== userKey)
    .sort((a, b) => {
      if (a === "general") return 1;
      if (b === "general") return -1;
      return (groups.get(b)?.length ?? 0) - (groups.get(a)?.length ?? 0);
    });

  // The user's own field opens by default; other fields start collapsed.
  const [openKey, setOpenKey] = useState<string | null>(hasUserField ? userKey : null);

  const allDone = lessons.length > 0 && lessons.every((l) => completed.has(l.id));

  if (lessons.length === 0) return null;

  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.6, ease: ease.ink }}
      className="mt-8"
    >
      {/* Secondary section: lighter than the two "earning" headings (Certificates,
          Your progress) so the resting screen has one clear spine, not four equal
          serif headings competing for the eye (Rubin). */}
      <h2
        className="font-serif mb-2"
        style={{ color: C.umber, fontSize: 17, fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT) }}
      >
        Lessons for your line of work
      </h2>
      <p className="text-sm mb-6" style={{ color: C.umber }}>
        {hasUserField
          ? `Lessons built for ${industryLabel(userKey).toLowerCase()} work, plus every other field whenever you want to explore.`
          : "Real-world lessons grouped by profession. Open the field closest to your work."}
      </p>

      {/* The learner's own field, prominent and open by default */}
      {hasUserField && (
        <div className="mb-4">
          <FieldGroup
            label={industryLabel(userKey)}
            lessons={groups.get(userKey) ?? []}
            completed={completed}
            open={openKey === userKey}
            onToggle={() => setOpenKey(openKey === userKey ? null : userKey)}
            rm={rm}
          />
        </div>
      )}

      {otherKeys.length > 0 && (
        <>
          {hasUserField && (
            <div
              className="text-[12px] uppercase tracking-[0.14em] mb-3 mt-6"
              style={{ color: C.umber, fontFamily: FONT_MONO }}
            >
              Explore other fields
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherKeys.map((key) => (
              <FieldGroup
                key={key}
                label={industryLabel(key)}
                lessons={groups.get(key) ?? []}
                completed={completed}
                open={openKey === key}
                onToggle={() => setOpenKey(openKey === key ? null : key)}
                rm={rm}
              />
            ))}
          </div>
        </>
      )}

      {moduleCheck && !allDone && (
        <a
          href={`/check/${moduleCheck.slug}`}
          className={`inline-block mt-5 text-xs font-medium ${FOCUS_RING}`}
          style={{ color: C.orangeInk }}
        >
          Already know this? Skip ahead →
        </a>
      )}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// First-login welcome card
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeCard({
  total,
  rm,
  onDismiss,
  firstLessonSlug,
}: {
  total: number;
  rm: boolean;
  onDismiss: () => void;
  // The first path lesson for this brand-new learner. When present, the welcome
  // CTA walks them straight into it instead of just dismissing and leaving them
  // to find the card below, so the very first action is "begin," not "close"
  // (Outsider MED-6).
  firstLessonSlug?: string | null;
}) {
  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={rm ? undefined : { opacity: 0, height: 0, marginTop: 0, padding: 0, overflow: "hidden" }}
      transition={{ duration: dur.base, ease: ease.ink }}
      className="rounded-2xl p-8 mt-10"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      <ul className="space-y-2 text-sm" style={{ color: C.espresso, lineHeight: 1.6 }}>
        <li>{total} short lessons, {LESSON_TIME_COPY}, in plain language.</li>
        <li>Work through them at your own pace. No deadlines, no pressure.</li>
        <li>Mark each one complete to track your progress across every module.</li>
      </ul>
      {firstLessonSlug ? (
        <a
          href={`/lesson/${firstLessonSlug}`}
          onClick={onDismiss}
          className={`inline-block mt-5 text-sm font-medium ${FOCUS_RING}`}
          style={{ color: C.orangeInk }}
        >
          Start your first lesson →
        </a>
      ) : (
        <button
          onClick={onDismiss}
          className={`mt-5 text-sm font-medium cursor-pointer ${FOCUS_RING}`}
          style={{ color: C.orangeInk }}
        >
          Got it →
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats row — points only. We deliberately dropped the day-streak: a streak is a
// fear mechanic ("don't fall behind") that reinstalls the exact anxiety this
// product exists to relieve ("I'm not behind anymore"). Points stay because they
// reward forward motion without punishing a missed day.
// ─────────────────────────────────────────────────────────────────────────────

function StatsRow({ stats, rm }: { stats: UserStats; rm: boolean }) {
  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.2, ease: ease.ink }}
      className="mt-6 flex items-center gap-3 flex-wrap"
    >
      <div
        className="flex items-baseline gap-2 px-4 py-2.5 rounded-full"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
      >
        <span className="text-lg font-medium" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
          {stats.total_points.toLocaleString()}
        </span>
        <span className="text-sm" style={{ color: C.umber }}>points</span>
      </div>
      {/* Say what the number is for. An unexplained score reads as manipulation to
          the skeptical adult this product is for. Points come from several places
          (lessons, checks, showing up), so we name them honestly as a running tally
          of work done rather than asserting a per-lesson formula (Naval M5). */}
      <span className="text-sm" style={{ color: C.inkSoft }}>
        for the work you've put in
      </span>
    </motion.div>
  );
}

// Maps the lucide icon names stored on badge_definitions to their components.
// Falls back to BadgeCheck if a seed introduces a name not mapped here.
const BADGE_ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  flag: Flag,
  crown: Crown,
  sparkles: Sparkles,
  flame: Flame,
  zap: Zap,
  compass: Compass,
  gem: Gem,
  "badge-check": BadgeCheck,
};

// ─────────────────────────────────────────────────────────────────────────────
// Badge grid — earned badges render in full color, locked ones dim with a lock
// glyph so progress reads at a glance without relying on color alone.
// ─────────────────────────────────────────────────────────────────────────────

function BadgeGrid({
  badges,
  earned,
  rm,
}: {
  badges: BadgeDefinition[];
  earned: Set<string>;
  rm: boolean;
}) {
  if (badges.length === 0) return null;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.7, ease: ease.ink }}
      className="mt-16"
    >
      <div className="mb-6">
        {/* Secondary section, deliberately lighter than the earning headings (Rubin). */}
        <h2
          className="font-serif"
          style={{
            color: C.umber,
            fontSize: 17,
            fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
          }}
        >
          Badges
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const has = earned.has(badge.id);
          const Icon = has ? (BADGE_ICONS[badge.icon] ?? BadgeCheck) : Lock;
          return (
            <div
              key={badge.id}
              className="rounded-2xl p-5 flex flex-col items-center text-center"
              style={{
                backgroundColor: has ? C.surface : C.paperHi,
                border: `1px solid ${has ? C.orangeWashBorder : C.hairline}`,
                opacity: has ? 1 : 0.6,
              }}
            >
              <Icon
                aria-hidden="true"
                size={28}
                strokeWidth={1.75}
                color={has ? C.orange : C.inkDisc}
              />
              <div
                className="mt-3 text-sm font-medium"
                style={{ color: has ? C.espresso : C.umber }}
              >
                {badge.name}
              </div>
              <p className="mt-1 text-xs leading-snug" style={{ color: C.inkSoft }}>
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificates section — one card per published cert with progress + a
// status-aware call to action.
// ─────────────────────────────────────────────────────────────────────────────

// CERT_STATUS_TONE now lives in @/lib/certStatusUi so the dashboard pill and the
// cert overview badge share one source of truth.

function certCta(card: CertDashboardCard): { label: string; href: string } {
  const { cert, status, nextLessonSlug, completedCount, total } = card;
  const overview = `/app/cert/${cert.slug}`;
  if (status === "certified") return { label: "View certificate →", href: overview };
  if (status === "submitted") return { label: "View status →", href: overview };
  if (status === "needs-revision") return { label: "Revise and resubmit →", href: `${overview}/submit` };
  if (status === "capstone-unlocked") return { label: "Submit final project →", href: `${overview}/submit` };
  if (isLessonsDoneUnpaid(card))
    return { label: `Earn my certificate (${dollars(cert.price_cents)}) →`, href: overview };
  // Every lesson done but no payment link wired yet: don't dangle a buy CTA we
  // can't honor. Point at the overview, which explains what's next (Contrarian M1).
  if (status === "in-progress" && total > 0 && completedCount === total)
    return { label: "See what's next →", href: overview };
  if (status === "in-progress" && nextLessonSlug)
    return { label: "Continue learning →", href: `/lesson/${nextLessonSlug}` };
  return { label: "Start earning →", href: overview };
}

function CertWidget({
  certs,
  rm,
  calloutCertId,
}: {
  certs: CertDashboardCard[];
  rm: boolean;
  // The cert the "ready to certify" callout already owns. Its card here drops to
  // the plain in-progress treatment so the loud unlock lives in exactly one place
  // (First Principles H2, Naval H1, Rubin #2).
  calloutCertId?: string;
}) {
  if (certs.length === 0) return null;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.5, ease: ease.ink }}
      className="mt-16"
    >
      <h2
        className="font-serif mb-2"
        style={{ color: C.espresso, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
      >
        Certificates
      </h2>
      <p className="mb-6 text-sm leading-relaxed" style={{ color: C.umber, maxWidth: 560 }}>
        Each certificate ends with one real task from your own work, reviewed by a real person. Finish it
        and you've got a link anyone can open and check, one to bring to your next review or add to your
        portfolio, real work that shows you can run with AI.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {certs.map((card) => {
          const { cert, total, completedCount, status } = card;
          const pct = certProgressPct(completedCount, total);
          // A learner who finished every lesson but has not paid is in "in-progress"
          // with a 100% bar. The plain "In progress" pill makes a done card look
          // stalled and hides that money is the only thing left. Surface a distinct
          // "lessons done, unlock" signal so the card sells the capstone instead
          // (Contrarian: the dashboard should not look dead at the buy moment). But
          // if the callout above already owns this cert, stay plain so the loud
          // unlock isn't duplicated within one viewport.
          const lessonsDoneUnpaid = isLessonsDoneUnpaid(card) && cert.id !== calloutCertId;
          const tone = lessonsDoneUnpaid
            ? { bg: C.orangeWash, border: C.orangeWashBorder, ink: C.orangeInk }
            : CERT_STATUS_TONE[status];
          const pillLabel = lessonsDoneUnpaid ? "Lessons done" : CERT_STATUS_LABEL[status];
          const cta = certCta(card);
          // One loud next action, not seven. The single loud "start" lives in
          // TodayCard at the top of the page; here, only certificates the learner
          // has ALREADY started get the filled button. Untouched certificates
          // demote to a quiet text link so the dashboard points at one obvious
          // move (First Principles, Naval). The callout cert also demotes here
          // because its loud unlock already lives in CertifyCallout above.
          const isPrimary = status !== "not-started" && cert.id !== calloutCertId;
          return (
            <div
              key={cert.id}
              className="rounded-2xl p-6 flex flex-col"
              style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <a
                  href={`/app/cert/${cert.slug}`}
                  className={`font-serif hover:underline ${FOCUS_RING}`}
                  style={{ color: C.espresso, fontSize: 19, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
                >
                  {cert.name}
                </a>
                <span
                  className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: tone.bg,
                    border: `1px solid ${tone.border}`,
                    color: tone.ink,
                    fontFamily: FONT_MONO,
                  }}
                >
                  {pillLabel}
                </span>
              </div>

              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: 6, backgroundColor: C.hairline }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${completedCount} of ${total} cert lessons complete`}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: C.orange,
                    borderRadius: 9999,
                    minWidth: completedCount > 0 ? 6 : 0,
                    transition: rm ? undefined : "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </div>

              {isPrimary ? (
                <a
                  href={cta.href}
                  className={`inline-block mt-5 text-sm font-medium px-4 py-2 rounded-full self-start ${FOCUS_RING}`}
                  style={{ backgroundColor: C.orange, color: C.ink }}
                >
                  {cta.label}
                </a>
              ) : (
                <a
                  href={cta.href}
                  className={`inline-block mt-5 text-sm font-medium self-start ${FOCUS_RING}`}
                  style={{ color: C.orangeInk }}
                >
                  {cta.label}
                </a>
              )}
              {/* The emotional peak ("I'm not behind anymore") is the moment to make
                  sharing effortless, so an earned credential gets a one-click route
                  straight to its public page from the dashboard, not just from the
                  cert overview (Expansionist M2). */}
              {status === "certified" && card.userCert?.verify_token && (
                <a
                  href={`/verify/${card.userCert.verify_token}?ref=share&cert=${encodeURIComponent(card.cert.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block mt-3 text-sm font-medium self-start ${FOCUS_RING}`}
                  style={{ color: C.umber }}
                >
                  Share it →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

// The single highest-value moment in the funnel: every lesson done, only the
// paid human review left. Hormozi + Naval: lift it above the noise. Rendered
// directly under TodayCard so the buy moment is not buried four sections down.
// Links to the cert overview, which carries the "Already paid?" reassurance and
// arms the checkout flag, so the dashboard never implies a second charge
// (Contrarian #4). Only renders when there's a live payment link (Executor H3).
function CertifyCallout({ ready, rm }: { ready: CertDashboardCard | undefined; rm: boolean }) {
  if (!ready) return null;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.2, ease: ease.ink }}
      className="mt-6 rounded-2xl p-6"
      style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
    >
      <p className="text-[12px] font-medium mb-2" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
        One thing left.
      </p>
      <h2
        className="font-serif"
        style={{ color: C.espresso, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
      >
        You finished every lesson in {ready.cert.name}.
      </h2>
      {/* One job for this callout: you're done, the proof is next. The guarantee
          and the review window live on the overview, so they aren't restated here
          (Rubin HIGH: the same promise on two screens dilutes it). */}
      <p className="mt-2 text-sm leading-relaxed" style={{ color: C.umber, maxWidth: 560 }}>
        All that's left is to show what you did: a real person reviews one real work task, then you earn the
        certificate. This is the part you can point to at work.
      </p>
      <div className="mt-4 flex flex-col items-start gap-1.5">
        <a
          href={`/app/cert/${ready.cert.slug}`}
          className={`inline-block text-sm font-medium px-4 py-2 rounded-full ${FOCUS_RING}`}
          style={{ backgroundColor: C.orange, color: C.ink }}
        >
          Get my certificate →
        </a>
        <span className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
          {dollars(ready.cert.price_cents)} one time, no subscription
        </span>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Boosters ready — spaced-review nudges that have come due. Invisible when none.
// A short memory check beats re-reading; reviewing at the right moment is what
// makes a lesson stick. Card style matches the cert widget (paperHi + hairline).
// ─────────────────────────────────────────────────────────────────────────────

function BoosterCard({ boosters, rm }: { boosters: PendingBooster[]; rm: boolean }) {
  if (boosters.length === 0) return null; // render nothing when no boosters are due
  const multiple = boosters.length > 1;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.45, ease: ease.ink }}
      className="mt-16 rounded-2xl p-6"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      <div className="text-[12px] uppercase tracking-[0.18em] mb-2" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
        Ready to review
      </div>
      <h2
        className="font-serif"
        style={{ color: C.espresso, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
      >
        Quick memory check
      </h2>
      <p className="mt-2 mb-5 text-sm leading-relaxed" style={{ color: C.umber, maxWidth: 560 }}>
        {multiple
          ? `You have ${boosters.length} lessons ready to review.`
          : "Takes 2 minutes. Reviewing at the right moment is what makes it stick."}
      </p>
      <div className="grid gap-2">
        {boosters.slice(0, 3).map((b) => (
          <a
            key={b.lesson_slug}
            href={`/app/booster/${b.lesson_slug}`}
            className={`flex items-center justify-between gap-3 px-5 py-4 rounded-2xl ${FOCUS_RING}`}
            style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
          >
            <span
              className="font-serif"
              style={{ color: C.espresso, fontSize: 16, fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT) }}
            >
              {b.lesson_title}
            </span>
            <span className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>2 min</span>
              <span aria-hidden="true" style={{ color: C.orangeInk }}>→</span>
            </span>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;
  const [curriculum, setCurriculum] = useState<Curriculum>({ modules: [], lessons: [] });
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [pathOrder, setPathOrder] = useState<string[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [checks, setChecks] = useState<MasteryCheckSummary[]>([]);
  const [certs, setCerts] = useState<CertDashboardCard[]>([]);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [pendingBoosters, setPendingBoosters] = useState<PendingBooster[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Fire-and-forget: stamp today's activity (feeds badge/activity logic
    // server-side). We no longer surface a day-streak in the UI. Swallow failures
    // so a flaky network never raises an unhandled rejection (Executor LOW).
    recordActivity().catch(() => {});
    (async () => {
      // A rejected fetch here used to leave setLoading(false) unreached, hanging
      // the learner on the skeleton forever. try/finally guarantees we always
      // exit the loading state, even if a read fails.
      try {
        const [curr, done, masteredIds, userStats, badgeDefs, earnedIds, allChecks, certCards, prof, boosters] =
          await Promise.all([
            fetchCurriculum(),
            fetchCompletedLessonIds(),
            fetchMasteredLessonIds(),
            fetchUserStats(),
            fetchBadgeDefinitions(),
            fetchEarnedBadgeIds(),
            fetchMasteryChecks(),
            fetchDashboardCerts(),
            fetchProfileSummary(),
            fetchPendingBoosters(),
          ]);
        // The personalized path drives lesson ordering. If the user has none yet
        // (onboarded before rules_v1 shipped), generate it lazily, then read back.
        let path = await fetchActivePath();
        if (path.length === 0) {
          const gen = await generateUserPath();
          if (gen.ok) path = await fetchActivePath();
        }
        if (cancelled) return;
        setCurriculum(curr);
        setCompleted(done);
        setMastered(masteredIds);
        setStats(userStats);
        setBadges(badgeDefs);
        setEarnedBadges(earnedIds);
        setChecks(allChecks);
        setCerts(certCards);
        setProfile(prof);
        setPendingBoosters(boosters);
        setPathOrder(path);
        if (done.size === 0 && masteredIds.size === 0 && !localStorage.getItem("lumio_welcomed")) {
          setShowWelcome(true);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Dashboard load failed", err);
          setLoadFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Payment is confirmed out of band: a learner pays through a Stripe link
  // (often in another tab), and an admin stamps paid_at by hand. When the
  // learner switches back to this tab, quietly refetch just the cert cards so
  // the newly unlocked state appears without making them reload (Executor H1).
  useEffect(() => {
    let cancelled = false;
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      fetchDashboardCerts()
        .then((cards) => {
          if (!cancelled) setCerts(cards);
        })
        .catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Effective completion = completed ∪ mastered (the rules_v1 seam). Test-out
  // clears lessons, so a mastered lesson reads as done everywhere on the board.
  const effectiveCompleted = useMemo(() => {
    const s = new Set(completed);
    mastered.forEach((id) => s.add(id));
    return s;
  }, [completed, mastered]);

  const total = curriculum.lessons.length;
  const completedCount = curriculum.lessons.filter((l) => effectiveCompleted.has(l.id)).length;

  // Order lessons by the personalized path when available, falling back to the
  // natural curriculum order. "Today's lesson" is the first path lesson the user
  // hasn't completed yet.
  const byId = new Map(curriculum.lessons.map((l) => [l.id, l]));
  const orderedLessons: CurriculumLesson[] =
    pathOrder.length > 0
      ? pathOrder.map((id) => byId.get(id)).filter((l): l is CurriculumLesson => Boolean(l))
      : curriculum.lessons;
  const nextLesson: CurriculumLesson | null =
    orderedLessons.find((l) => !effectiveCompleted.has(l.id)) ?? null;
  const pct = certProgressPct(completedCount, total);

  // Hero progress anchor: the certificate the learner is actively working
  // toward, closest to completion. The top bar tracks this achievable unit
  // (8-12 lessons) instead of the full 124-lesson catalog, so a paying learner
  // sees real forward motion rather than a 2% sliver against a mountain.
  const userIndustry = profile?.industry ?? null;

  const activeCert =
    certs
      .filter((c) => c.status === "in-progress" || c.status === "capstone-unlocked")
      .sort((a, b) => {
        const pa = a.total > 0 ? a.completedCount / a.total : 0;
        const pb = b.total > 0 ? b.completedCount / b.total : 0;
        return pb - pa;
      })[0] ?? null;

  // For a learner with no cert in motion yet, anchor the hero to a concrete,
  // named target rather than the 124-lesson catalog: prefer one matching their
  // industry, then the most achievable (fewest lessons, cheapest). First
  // Principles: a payer should always see a finish line that has a name on it.
  const spineCert =
    activeCert ??
    [...certs]
      // Only suggest certs the learner could actually start now. A cert that is
      // already certified, awaiting review, or sent back for revision must never
      // be offered as "your fastest path: start this" — that misdirects them at
      // the worst moment (Contrarian/First Principles regression catch).
      .filter(
        (c) =>
          c.status !== "certified" &&
          c.status !== "submitted" &&
          c.status !== "needs-revision",
      )
      .sort((a, b) => {
        const industryMatch =
          Number(b.cert.industry === userIndustry) - Number(a.cert.industry === userIndustry);
        if (industryMatch !== 0) return industryMatch;
        if (a.total !== b.total) return a.total - b.total;
        return a.cert.price_cents - b.cert.price_cents;
      })[0] ?? null;
  // True only when spineCert is a suggestion the learner hasn't begun.
  const spineIsTarget = !activeCert && !!spineCert;
  const anchorTotal = spineCert ? spineCert.total : total;
  const anchorDone = spineCert ? spineCert.completedCount : completedCount;
  const anchorPct = certProgressPct(anchorDone, anchorTotal);

  // "Today's lesson" must advance the exact cert the hero bar is tracking, or
  // the headline target and the primary button point at different lessons and a
  // 5-minute lesson leaves the named finish line unmoved (First Principles).
  // Prefer the spine cert's next required lesson; fall back to the global
  // personalized path only when the spine has no next lesson (cert complete) or
  // that lesson is not in the catalog.
  const spineNextSlug = spineCert?.nextLessonSlug ?? null;
  const todayLesson: CurriculumLesson | null = spineNextSlug
    ? (curriculum.lessons.find((l) => l.slug === spineNextSlug) ?? nextLesson)
    : nextLesson;
  // Name the cert on the card only when the lesson genuinely earns it.
  const todayCertName =
    spineCert && todayLesson?.slug === spineNextSlug ? spineCert.cert.name : null;

  // The one cert sitting at the buy moment (all lessons done, payment open).
  // Computed once and threaded through so TodayCard demotes, the callout owns the
  // loud CTA, and CertWidget stays plain for it (First Principles H1/H2).
  const readyCert = certs.find(isLessonsDoneUnpaid);

  // Industry Deep Dives is rendered as its own profession-grouped section.
  const iddLessons = curriculum.lessons.filter((l) => l.module_slug === IDD_MODULE_SLUG);
  const iddCheck = moduleCheckFor(checks, IDD_MODULE_SLUG);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={960} right={<NavActions email={user?.email ?? ""} onSignOut={handleSignOut} />} />

      <div id="main-content" className="max-w-[960px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        {/* Greeting */}
        <motion.h1
          className="font-serif"
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.05, ease: ease.ink }}
          style={{
            color: C.espresso,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT),
          }}
        >
          {greeting()}
        </motion.h1>

        <motion.p
          initial={rm ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.15, ease: ease.ink }}
          className="mt-2 text-lg"
          style={{ color: C.umber }}
        >
          {goalSubline(profile?.goal ?? null, profile?.goal_other ?? null, completedCount > 0)}
        </motion.p>

        {/* Points — held back until the learner has actually done something, so a
            brand-new payer is never greeted by a zero score. */}
        {!loading && stats && completedCount > 0 && <StatsRow stats={stats} rm={rm} />}

        {/* Progress bar */}
        <motion.div
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, delay: 0.25, ease: ease.ink }}
          className="mt-6"
        >
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, backgroundColor: C.hairline }}
            role="progressbar"
            aria-valuenow={anchorPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={
              spineCert
                ? spineIsTarget
                  ? `${spineCert.cert.name}: ${anchorTotal} lessons to your first certificate`
                  : `${spineCert.cert.name}: ${anchorDone} of ${anchorTotal} lessons complete`
                : `${completedCount} of ${total} lessons complete`
            }
          >
            <div
              style={{
                width: `${anchorPct}%`,
                height: "100%",
                backgroundColor: C.orange,
                borderRadius: 9999,
                transition: rm ? undefined : "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                minWidth: anchorDone > 0 ? 8 : 0,
              }}
            />
          </div>
          <p
            className="mt-2 text-xs"
            style={{ color: C.inkSoft, fontFamily: FONT_MONO }}
          >
            {spineCert
              ? spineIsTarget
                ? `Start here: ${spineCert.cert.name} · ${anchorTotal} lessons`
                : `${spineCert.cert.name} · ${anchorDone} of ${anchorTotal} lessons`
              : completedCount === 0
                ? `${total} lessons waiting whenever you're ready`
                : `${completedCount} ${completedCount === 1 ? "lesson" : "lessons"} complete`}
          </p>
        </motion.div>

        {/* First-login welcome */}
        <AnimatePresence>
          {showWelcome && (
            <WelcomeCard
              total={total}
              rm={rm}
              firstLessonSlug={todayLesson?.slug}
              onDismiss={() => {
                localStorage.setItem("lumio_welcomed", "1");
                setShowWelcome(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Persistent live region so screen readers hear the skeleton→content
            swap. The failure case is intentionally silent here — the role="alert"
            error panel below owns that announcement, so AT hears it once, not
            twice (Executor). */}
        <p className="sr-only" role="status" aria-live="polite">
          {loading ? "Loading your dashboard." : loadFailed || total === 0 ? "" : "Your dashboard is ready."}
        </p>

        {/* Today's lesson + module grid — skeleton while curriculum loads */}
        {loading ? (
          <div className="mt-10">
            {/* Today card skeleton */}
            <div
              className="rounded-2xl animate-pulse"
              style={{ backgroundColor: C.hairline, height: 200 }}
            />
            {/* Module grid skeleton */}
            <div className="mt-16">
              <div
                className="rounded animate-pulse mb-6"
                style={{ backgroundColor: C.hairline, height: 22, width: 120 }}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl animate-pulse"
                    style={{ backgroundColor: C.hairline, height: 88 }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : loadFailed || total === 0 ? (
          // The published curriculum is never genuinely empty, so an empty
          // result after loading means a fetch failed (RLS, network). We show an
          // honest retry instead of falsely congratulating a paying learner for
          // "finishing all 0 lessons."
          <motion.div
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="rounded-2xl p-8 mt-10"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
            role="alert"
          >
            <h2
              className="font-serif text-2xl"
              style={{ color: C.espresso, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
            >
              We could not load your lessons.
            </h2>
            <p className="mt-3 text-sm" style={{ color: C.umber }}>
              Your progress is safe. This is on our end, not yours. Give it a moment and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={`inline-block mt-6 ${PILL} ${FOCUS_RING} cursor-pointer`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Try again
            </button>
          </motion.div>
        ) : (
          <>
            <TodayCard
              lesson={todayLesson}
              certName={todayCertName}
              total={total}
              rm={rm}
              demoted={!!readyCert}
            />
            <CertifyCallout ready={readyCert} rm={rm} />
            <CertWidget certs={certs} rm={rm} calloutCertId={readyCert?.cert.id} />
            <BoosterCard boosters={pendingBoosters} rm={rm} />
            <ModuleGrid curriculum={curriculum} completed={effectiveCompleted} checks={checks} rm={rm} />
            <IndustryDeepDives
              lessons={iddLessons}
              completed={effectiveCompleted}
              userIndustry={userIndustry}
              moduleCheck={iddCheck}
              rm={rm}
            />
            <BadgeGrid badges={badges} earned={earnedBadges} rm={rm} />
          </>
        )}
      </div>
    </div>
  );
}
