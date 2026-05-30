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
  generateUserPath,
} from "@/lib/supabase";
import type { Curriculum, CurriculumLesson } from "@/lib/supabase";
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
import { fetchDashboardCerts, CERT_STATUS_LABEL } from "@/lib/certs";
import type { CertDashboardCard, CertStatus } from "@/lib/certs";
import { C, FOCUS_RING, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT, PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
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

function truncateEmail(email: string, max = 20): string {
  if (email.length <= max) return email;
  return email.slice(0, max) + "…";
}

const LEVEL_LABEL: Record<CurriculumLesson["level"], string> = {
  beginner: "Beginner",
  growing: "Growing",
  confident: "Confident",
};

// ─────────────────────────────────────────────────────────────────────────────
// Nav action (right side of the brand nav)
// ─────────────────────────────────────────────────────────────────────────────

function NavActions({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-2 text-[13px]" style={{ color: C.umber, fontFamily: FONT_MONO }}>
      {email && <span className="hidden sm:block">{truncateEmail(email)}</span>}
      {email && <span className="hidden sm:block" style={{ opacity: 0.4 }}>·</span>}
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
  total,
  rm,
}: {
  lesson: CurriculumLesson | null;
  total: number;
  rm: boolean;
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
      <div
        className="mt-2 text-sm"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {lesson.estimated_minutes} min · {LEVEL_LABEL[lesson.level]}
      </div>
      {lesson.hook && (
        <p className="mt-4 italic text-sm leading-relaxed" style={{ color: C.umber }}>
          {lesson.hook}
        </p>
      )}
      <a
        href={`/lesson/${lesson.slug}`}
        className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
        style={{ backgroundColor: C.orange, color: C.ink }}
      >
        Start lesson →
      </a>
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
      <h2
        className="font-serif mb-6"
        style={{
          color: C.espresso,
          fontSize: 22,
          fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
        }}
      >
        Your progress
      </h2>

      {levelChecks.length > 0 && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs mr-1" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            Already know this? Test out:
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
        {curriculum.modules.map((mod) => {
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
                <div
                  className="text-xs mb-3"
                  style={{ color: C.inkSoft, fontFamily: FONT_MONO }}
                >
                  {completedInModule}/{moduleTotal} complete
                </div>
                {/* Per-lesson dots — completed dots are solid-filled, incomplete
                    are hollow rings, so done/not-done reads without relying on
                    color alone (colorblind-safe). */}
                <div className="flex items-center gap-1.5 flex-wrap">
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
                            className="text-sm hover:underline"
                            style={{ color: C.umber }}
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
                          Test out of this module →
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
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// First-login welcome card
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeCard({ total, rm, onDismiss }: { total: number; rm: boolean; onDismiss: () => void }) {
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
        <li>{total} short lessons. Five minutes each, in plain language.</li>
        <li>Work through them at your own pace. No deadlines, no pressure.</li>
        <li>Mark each one complete to track your progress across every module.</li>
      </ul>
      <button
        onClick={onDismiss}
        className={`mt-5 text-sm font-medium cursor-pointer ${FOCUS_RING}`}
        style={{ color: C.orangeInk }}
      >
        Got it →
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats row — points + streak. Daily-viewed surface, so motion stays a single
// subtle fade-in (Emil restraint); the numbers themselves carry the weight.
// ─────────────────────────────────────────────────────────────────────────────

function StatsRow({ stats, rm }: { stats: UserStats; rm: boolean }) {
  const streak = stats.current_streak_days;
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
      <div
        className="flex items-baseline gap-2 px-4 py-2.5 rounded-full"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
      >
        <span aria-hidden="true" style={{ fontSize: 15 }}>{streak > 0 ? "🔥" : "·"}</span>
        <span className="text-lg font-medium" style={{ color: C.espresso, fontFamily: FONT_MONO }}>
          {streak}
        </span>
        <span className="text-sm" style={{ color: C.umber }}>
          day{streak === 1 ? "" : "s"}
        </span>
      </div>
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
  const earnedCount = badges.filter((b) => earned.has(b.id)).length;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.7, ease: ease.ink }}
      className="mt-16"
    >
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: 22,
            fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
          }}
        >
          Badges
        </h2>
        <span className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
          {earnedCount}/{badges.length} earned
        </span>
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

const CERT_STATUS_TONE: Record<CertStatus, { bg: string; border: string; ink: string }> = {
  "not-started": { bg: C.surface, border: C.hairline, ink: C.umber },
  "in-progress": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  "capstone-unlocked": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  submitted: { bg: C.orangeWash, border: C.orangeWashBorder, ink: C.orangeInk },
  certified: { bg: C.surface, border: C.orangeWashBorder, ink: C.forest },
};

function certCta(card: CertDashboardCard): { label: string; href: string } {
  const { cert, status, nextLessonSlug, completedCount, total } = card;
  const overview = `/app/cert/${cert.slug}`;
  if (status === "certified") return { label: "View certificate →", href: overview };
  if (status === "submitted") return { label: "View status →", href: overview };
  if (status === "capstone-unlocked") return { label: "Submit capstone →", href: `${overview}/submit` };
  if (status === "in-progress" && total > 0 && completedCount === total)
    return { label: "Unlock capstone →", href: overview };
  if (status === "in-progress" && nextLessonSlug)
    return { label: "Continue learning →", href: `/lesson/${nextLessonSlug}` };
  return { label: "Start earning →", href: overview };
}

function CertWidget({ certs, rm }: { certs: CertDashboardCard[]; rm: boolean }) {
  if (certs.length === 0) return null;
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.62, ease: ease.ink }}
      className="mt-16"
    >
      <h2
        className="font-serif mb-6"
        style={{ color: C.espresso, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
      >
        Certificates
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {certs.map((card) => {
          const { cert, total, completedCount, status } = card;
          const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
          const tone = CERT_STATUS_TONE[status];
          const cta = certCta(card);
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
                  {CERT_STATUS_LABEL[status]}
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
              <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                {completedCount} of {total} lessons
              </p>

              <a
                href={cta.href}
                className={`inline-block mt-5 text-sm font-medium ${FOCUS_RING}`}
                style={{ color: C.orangeInk }}
              >
                {cta.label}
              </a>
            </div>
          );
        })}
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
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Fire-and-forget: stamp today's activity so the streak advances on visit.
    recordActivity();
    (async () => {
      const [curr, done, masteredIds, userStats, badgeDefs, earnedIds, allChecks, certCards] =
        await Promise.all([
          fetchCurriculum(),
          fetchCompletedLessonIds(),
          fetchMasteredLessonIds(),
          fetchUserStats(),
          fetchBadgeDefinitions(),
          fetchEarnedBadgeIds(),
          fetchMasteryChecks(),
          fetchDashboardCerts(),
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
      setPathOrder(path);
      setLoading(false);
      if (done.size === 0 && masteredIds.size === 0 && !localStorage.getItem("lumio_welcomed")) {
        setShowWelcome(true);
      }
    })();
    return () => {
      cancelled = true;
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
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

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
          {completedCount === 0
            ? "Your first lesson is ready."
            : `You've completed ${completedCount} of ${total} lessons.`}
        </motion.p>

        {/* Points + streak */}
        {!loading && stats && <StatsRow stats={stats} rm={rm} />}

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
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${completedCount} of ${total} lessons complete`}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                backgroundColor: C.orange,
                borderRadius: 9999,
                transition: rm ? undefined : "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                minWidth: completedCount > 0 ? 8 : 0,
              }}
            />
          </div>
          <p
            className="mt-2 text-xs"
            style={{ color: C.inkSoft, fontFamily: FONT_MONO }}
          >
            {completedCount} of {total} lessons complete · {pct}%
          </p>
        </motion.div>

        {/* First-login welcome */}
        <AnimatePresence>
          {showWelcome && (
            <WelcomeCard
              total={total}
              rm={rm}
              onDismiss={() => {
                localStorage.setItem("lumio_welcomed", "1");
                setShowWelcome(false);
              }}
            />
          )}
        </AnimatePresence>

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
        ) : (
          <>
            <TodayCard lesson={nextLesson} total={total} rm={rm} />
            <ModuleGrid curriculum={curriculum} completed={effectiveCompleted} checks={checks} rm={rm} />
            <CertWidget certs={certs} rm={rm} />
            <BadgeGrid badges={badges} earned={earnedBadges} rm={rm} />
          </>
        )}
      </div>
    </div>
  );
}
