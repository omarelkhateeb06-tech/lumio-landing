import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCertBySlug,
  getCertLessonsWithCompletion,
  getUserCert,
  getCapstoneSubmission,
  enrollInCert,
  deriveCertStatus,
  CERT_STATUS_LABEL,
} from "@/lib/certs";
import type {
  Cert,
  CertLessonItem,
  UserCert,
  CapstoneSubmission,
  CertStatus,
} from "@/lib/certs";
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
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function dollars(cents: number): string {
  const v = cents / 100;
  return Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`;
}

const STATUS_TONE: Record<CertStatus, { bg: string; border: string; ink: string }> = {
  "not-started": { bg: C.surface, border: C.hairline, ink: C.umber },
  "in-progress": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  "capstone-unlocked": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  submitted: { bg: C.orangeWash, border: C.orangeWashBorder, ink: C.orangeInk },
  certified: { bg: C.surface, border: C.orangeWashBorder, ink: C.forest },
};

function StatusBadge({ status }: { status: CertStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-block text-[12px] font-medium px-3 py-1 rounded-full"
      style={{
        backgroundColor: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.ink,
        fontFamily: FONT_MONO,
      }}
    >
      {CERT_STATUS_LABEL[status]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How certification works — static three-step explainer
// ─────────────────────────────────────────────────────────────────────────────

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Complete the lessons",
    body: "Work through every lesson in this certificate at your own pace. Your progress saves automatically.",
  },
  {
    n: "02",
    title: "Submit your capstone",
    body: "Apply what you learned to a real task and submit it for review. This is where the certificate is earned.",
  },
  {
    n: "03",
    title: "Receive your credential",
    body: "Get a verifiable badge with a public verification link you can share on LinkedIn or with an employer.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CertOverview() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;

  const [cert, setCert] = useState<Cert | null>(null);
  const [lessons, setLessons] = useState<CertLessonItem[]>([]);
  const [userCert, setUserCert] = useState<UserCert | null>(null);
  const [submission, setSubmission] = useState<CapstoneSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const c = await getCertBySlug(slug);
      if (!c) {
        if (!cancelled) {
          setCert(null);
          setLoading(false);
        }
        return;
      }
      const [ls, uc] = await Promise.all([
        getCertLessonsWithCompletion(c.id),
        getUserCert(c.id),
      ]);
      const sub = uc ? await getCapstoneSubmission(uc.id) : null;
      if (cancelled) return;
      setCert(c);
      setLessons(ls);
      setUserCert(uc);
      setSubmission(sub);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  const total = lessons.length;
  const completedCount = lessons.filter((l) => l.completed).length;
  const allComplete = total > 0 && completedCount === total;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const nextLesson = lessons.find((l) => !l.completed) ?? null;
  const status = deriveCertStatus(userCert, submission, completedCount);

  async function startEarning() {
    if (!cert) return;
    setEnrolling(true);
    const res = await enrollInCert(cert.id);
    setEnrolling(false);
    if (!res.ok) {
      toast.error("Could not start the certificate. Please try again.");
      return;
    }
    const target = nextLesson ?? lessons[0];
    if (target) navigate(`/lesson/${target.slug}`);
    else setUserCert(await getUserCert(cert.id));
  }

  // ── Loading / not-found ──────────────────────────────────────────────────--
  if (loading) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={860} right={<NavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[860px] mx-auto px-6 pt-28 pb-20 md:pt-36">
          <div className="rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 240 }} />
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={860} right={<NavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[860px] mx-auto px-6 pt-28 pb-20 md:pt-36 text-center">
          <h1
            className="font-serif"
            style={{ color: C.espresso, fontSize: 32, fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT) }}
          >
            Certificate not found
          </h1>
          <p className="mt-3 text-sm" style={{ color: C.umber }}>
            This certificate does not exist or is not yet published.
          </p>
          <a
            href="/app"
            className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.ink, color: C.paper }}
          >
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={860} right={<NavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />

      <div id="main-content" className="max-w-[860px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <a href="/app" className={`text-[13px] font-medium ${FOCUS_RING}`} style={{ color: C.umber }}>
          ← Dashboard
        </a>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.05, ease: ease.ink }}
          className="mt-6"
        >
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span
              className="text-[12px] uppercase tracking-[0.18em]"
              style={{ color: C.umber, fontFamily: FONT_MONO }}
            >
              {cert.industry ? `${cert.industry} certificate` : "Certificate"}
            </span>
            <StatusBadge status={status} />
          </div>
          <h1
            className="font-serif"
            style={{
              color: C.espresso,
              fontSize: "clamp(32px, 4.5vw, 48px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
            }}
          >
            {cert.name}
          </h1>
          {cert.description && (
            <p className="mt-4 text-lg leading-relaxed" style={{ color: C.umber }}>
              {cert.description}
            </p>
          )}
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-2xl font-medium" style={{ color: C.espresso, fontFamily: FONT_MONO }}>
              {dollars(cert.price_cents)}
            </span>
            <span className="text-sm" style={{ color: C.inkSoft }}>
              one time, unlocks your capstone review
            </span>
          </div>
        </motion.div>

        {/* ── Primary status-aware action ─────────────────────────────────── */}
        <ActionPanel
          cert={cert}
          status={status}
          userCert={userCert}
          submission={submission}
          completedCount={completedCount}
          total={total}
          pct={pct}
          allComplete={allComplete}
          nextLesson={nextLesson}
          enrolling={enrolling}
          onStart={startEarning}
          rm={rm}
        />

        {/* ── What you'll learn ───────────────────────────────────────────── */}
        {cert.outcomes.length > 0 && (
          <Section title="What you'll learn" rm={rm} delay={0.2}>
            <ul className="space-y-3">
              {cert.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.espresso }}>
                  <span aria-hidden="true" style={{ color: C.forest, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ lineHeight: 1.55 }}>{o}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Lessons included ────────────────────────────────────────────── */}
        <Section title="Lessons included" rm={rm} delay={0.28}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${C.hairline}`, backgroundColor: C.paperHi }}
          >
            <ul>
              {lessons.map((l, i) => (
                <li
                  key={l.lesson_id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairline}` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: l.completed ? C.forest : "transparent",
                        border: l.completed ? "none" : `1.5px solid ${C.inkDisc}`,
                        color: C.paper,
                        fontSize: 10,
                      }}
                    >
                      {l.completed ? "✓" : ""}
                    </span>
                    <a
                      href={`/lesson/${l.slug}`}
                      className="text-sm truncate hover:underline"
                      style={{ color: C.espresso }}
                    >
                      {l.title}
                      {l.completed && <span className="sr-only"> (completed)</span>}
                    </a>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                    {l.estimated_minutes} min
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ── Capstone ────────────────────────────────────────────────────── */}
        <Section title="Your capstone project" rm={rm} delay={0.36}>
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
              {cert.capstone_spec.description}
            </p>
            {cert.capstone_spec.min_words != null && (
              <p className="mt-3 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                Minimum {cert.capstone_spec.min_words} words.
              </p>
            )}
          </div>
        </Section>

        {/* ── How certification works ─────────────────────────────────────── */}
        <Section title="How certification works" rm={rm} delay={0.44}>
          <div className="grid sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl p-5"
                style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
              >
                <div className="text-sm font-medium mb-2" style={{ color: C.orangeInk, fontFamily: FONT_MONO }}>
                  {s.n}
                </div>
                <div className="text-sm font-medium mb-1.5" style={{ color: C.espresso }}>
                  {s.title}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: C.umber }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

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
      className="mt-14"
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
// Status-aware action panel
// ─────────────────────────────────────────────────────────────────────────────

function ActionPanel({
  cert,
  status,
  userCert,
  submission,
  completedCount,
  total,
  pct,
  allComplete,
  nextLesson,
  enrolling,
  onStart,
  rm,
}: {
  cert: Cert;
  status: CertStatus;
  userCert: UserCert | null;
  submission: CapstoneSubmission | null;
  completedCount: number;
  total: number;
  pct: number;
  allComplete: boolean;
  nextLesson: CertLessonItem | null;
  enrolling: boolean;
  onStart: () => void;
  rm: boolean;
}) {
  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, delay: 0.12, ease: ease.ink }}
      className="rounded-2xl p-6 mt-8"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      {/* Progress bar (always shown except for the certified state) */}
      {status !== "certified" && (
        <div className="mb-5">
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, backgroundColor: C.hairline }}
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
                minWidth: completedCount > 0 ? 8 : 0,
                transition: rm ? undefined : "width 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            {completedCount} of {total} lessons complete · {pct}%
          </p>
        </div>
      )}

      {/* not-started: enroll + go to first lesson */}
      {status === "not-started" && (
        <button
          type="button"
          onClick={onStart}
          disabled={enrolling}
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.orange, color: C.ink, opacity: enrolling ? 0.6 : 1 }}
        >
          {enrolling ? "Starting…" : "Start earning →"}
        </button>
      )}

      {/* in-progress, lessons remaining: continue learning */}
      {status === "in-progress" && !allComplete && nextLesson && (
        <a
          href={`/lesson/${nextLesson.slug}`}
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.orange, color: C.ink }}
        >
          Continue learning →
        </a>
      )}

      {/* lessons done but not paid: unlock capstone via Stripe link */}
      {status === "in-progress" && allComplete && (
        <div>
          <p className="text-sm mb-4" style={{ color: C.espresso }}>
            You finished every lesson. Unlock the capstone review to earn your certificate.
          </p>
          {cert.stripe_payment_link ? (
            <a
              href={cert.stripe_payment_link}
              className={`inline-block ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.orange, color: C.ink }}
            >
              Unlock capstone ({dollars(cert.price_cents)}) →
            </a>
          ) : (
            <p className="text-sm" style={{ color: C.umber }}>
              Capstone checkout is not available yet. Check back soon.
            </p>
          )}
        </div>
      )}

      {/* paid: submit the capstone */}
      {status === "capstone-unlocked" && (
        <div>
          <p className="text-sm mb-4" style={{ color: C.espresso }}>
            Your capstone is unlocked. Submit your project to earn your certificate.
          </p>
          <a
            href={`/app/cert/${cert.slug}/submit`}
            className={`inline-block ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.orange, color: C.ink }}
          >
            Submit your capstone →
          </a>
        </div>
      )}

      {/* submitted: under review */}
      {status === "submitted" && submission && (
        <div>
          <p className="text-sm" style={{ color: C.espresso }}>
            Your capstone is under review. You'll receive your badge within 3 business days.
          </p>
          <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            Submitted {new Date(submission.submitted_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* certified: certificate + share */}
      {status === "certified" && userCert && (
        <CertifiedPanel cert={cert} userCert={userCert} />
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Certified state — verify link + LinkedIn share
// ─────────────────────────────────────────────────────────────────────────────

function CertifiedPanel({ cert, userCert }: { cert: Cert; userCert: UserCert }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = `${origin}/verify/${userCert.verify_token}`;
  const awarded = userCert.completed_at ? new Date(userCert.completed_at) : new Date();
  const year = awarded.getFullYear();
  const month = awarded.getMonth() + 1;

  const linkedInUrl =
    "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME" +
    `&name=${encodeURIComponent(cert.name)}` +
    "&organizationId=" +
    `&issueYear=${year}` +
    `&issueMonth=${month}` +
    `&certUrl=${encodeURIComponent(verifyUrl)}` +
    `&certId=${encodeURIComponent(userCert.id)}`;

  function copyVerify() {
    navigator.clipboard.writeText(verifyUrl).then(
      () => toast.success("Verification link copied."),
      () => toast.error("Could not copy the link."),
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true" style={{ color: C.forest, fontSize: 18 }}>✓</span>
        <span className="text-sm font-medium" style={{ color: C.forest }}>
          You earned this certificate
        </span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.ink, color: C.paper }}
        >
          Share on LinkedIn →
        </a>
        <button
          type="button"
          onClick={copyVerify}
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.surface, color: C.espresso, border: `1px solid ${C.hairline}` }}
        >
          Copy verification link
        </button>
      </div>
      <div
        className="mt-4 text-xs break-all px-4 py-3 rounded-xl"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, color: C.umber, fontFamily: FONT_MONO }}
      >
        {verifyUrl}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav right (matches Dashboard)
// ─────────────────────────────────────────────────────────────────────────────

function NavRight({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-2 text-[13px]" style={{ color: C.umber, fontFamily: FONT_MONO }}>
      {email && <span className="hidden sm:block">{email.length > 20 ? email.slice(0, 20) + "…" : email}</span>}
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
