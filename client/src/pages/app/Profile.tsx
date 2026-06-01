import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Footprints, Flag, Crown, Sparkles, Flame, Zap, Compass, Gem, BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfileSummary } from "@/lib/supabase";
import type { ProfileSummary, SkillLevel } from "@/lib/supabase";
import {
  fetchBadgeDefinitions,
  fetchEarnedBadgeIds,
} from "@/lib/gamification";
import type { BadgeDefinition } from "@/lib/gamification";
import { fetchDashboardCerts, CERT_STATUS_LABEL } from "@/lib/certs";
import type { CertDashboardCard } from "@/lib/certs";
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
import { BrandNav, AppNavRight } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Labels — mirror the onboarding choices so a learner sees the same words back.
// ─────────────────────────────────────────────────────────────────────────────

const INDUSTRY_LABEL: Record<string, string> = {
  healthcare: "Healthcare",
  legal: "Legal",
  education: "Education",
  finance: "Finance",
  hr: "HR",
  "customer-service": "Customer service",
  general: "General",
};

const SKILL_LABEL: Record<SkillLevel, string> = {
  beginner: "Just starting",
  some_experience: "Some experience",
  confident: "Confident",
};

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3" style={{ borderTop: `1px solid ${C.hairline}` }}>
      <span className="text-xs uppercase tracking-[0.12em]" style={{ color: C.umber, fontFamily: FONT_MONO }}>
        {label}
      </span>
      <span className="text-sm text-right" style={{ color: C.espresso }}>
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
  rm,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  rm: boolean;
  delay: number;
}) {
  return (
    <motion.section
      initial={rm ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay, ease: ease.ink }}
      className="mt-12"
    >
      <h2
        className="font-serif mb-5"
        style={{ color: C.espresso, fontSize: 22, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;

  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [certs, setCerts] = useState<CertDashboardCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, badgeDefs, earnedIds, certCards] = await Promise.all([
        fetchProfileSummary(),
        fetchBadgeDefinitions(),
        fetchEarnedBadgeIds(),
        fetchDashboardCerts(),
      ]);
      if (cancelled) return;
      setProfile(p);
      setBadges(badgeDefs);
      setEarned(earnedIds);
      setCerts(certCards);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  const earnedBadges = badges.filter((b) => earned.has(b.id));
  const earnedCerts = certs.filter((c) => c.status === "certified");
  const inProgressCerts = certs.filter((c) => c.status !== "certified" && c.status !== "not-started");

  const industryLabel = profile?.industry
    ? INDUSTRY_LABEL[profile.industry] ?? profile.industry
    : "Not set";
  const skillLabel = profile?.skill_level ? SKILL_LABEL[profile.skill_level] : "Not set";

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav
        maxWidth={720}
        right={
          <AppNavRight
            onSignOut={handleSignOut}
            left={
              <>
                <a href="/app" className={`font-medium hover:underline ${FOCUS_RING}`} style={{ color: C.umber }}>
                  Dashboard
                </a>
                <span style={{ opacity: 0.4 }}>·</span>
              </>
            }
          />
        }
      />

      <div id="main-content" className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.h1
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.05, ease: ease.ink }}
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT),
          }}
        >
          Your profile
        </motion.h1>

        {loading ? (
          <div className="mt-10 rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 280 }} />
        ) : (
          <>
            {/* Identity */}
            <motion.div
              initial={rm ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.base, delay: 0.15, ease: ease.ink }}
              className="mt-8 rounded-2xl px-6 py-2"
              style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
            >
              {user?.email && <Row label="Email" value={user.email} />}
              {profile?.job_role && <Row label="Role" value={profile.job_role} />}
              <Row label="Field" value={industryLabel} />
              <Row label="Experience" value={skillLabel} />
            </motion.div>

            {/* Certificates */}
            <Section title="Certificates earned" rm={rm} delay={0.24}>
              {earnedCerts.length === 0 ? (
                <p className="text-sm" style={{ color: C.umber }}>
                  {inProgressCerts.length > 0
                    ? "You're on your way. Finish a certificate to see it here."
                    : "No certificates yet. Pick one from your dashboard to get started."}
                </p>
              ) : (
                <ul className="space-y-3">
                  {earnedCerts.map((card) => (
                    <li
                      key={card.cert.id}
                      className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
                      style={{ backgroundColor: C.surface, border: `1px solid ${C.orangeWashBorder}` }}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span aria-hidden="true" style={{ color: C.forest, fontSize: 15, flexShrink: 0 }}>✓</span>
                        <a
                          href={`/app/cert/${card.cert.slug}`}
                          className="text-sm font-medium truncate hover:underline"
                          style={{ color: C.espresso }}
                        >
                          {card.cert.name}
                        </a>
                      </span>
                      <span className="text-xs flex-shrink-0" style={{ color: C.forest, fontFamily: FONT_MONO }}>
                        {CERT_STATUS_LABEL[card.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* Achievements */}
            <Section title="Your achievements" rm={rm} delay={0.32}>
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm" style={{ color: C.umber }}>
                  Badges you've earned
                </span>
                <span className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                  {earnedBadges.length}/{badges.length} earned
                </span>
              </div>
              {earnedBadges.length === 0 ? (
                <p className="text-sm" style={{ color: C.umber }}>
                  Complete lessons and certificates to start earning badges.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => {
                    const Icon = BADGE_ICONS[badge.icon] ?? BadgeCheck;
                    return (
                      <div
                        key={badge.id}
                        className="rounded-2xl p-5 flex flex-col items-center text-center"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.orangeWashBorder}` }}
                      >
                        <Icon aria-hidden="true" size={26} strokeWidth={1.75} color={C.orange} />
                        <div className="mt-3 text-sm font-medium" style={{ color: C.espresso }}>
                          {badge.name}
                        </div>
                        <p className="mt-1 text-xs leading-snug" style={{ color: C.inkSoft }}>
                          {badge.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

            <motion.div
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: dur.base, delay: 0.4, ease: ease.ink }}
              className="mt-12"
            >
              <a
                href="/app"
                className={`inline-block ${PILL} ${FOCUS_RING}`}
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                Back to dashboard
              </a>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
