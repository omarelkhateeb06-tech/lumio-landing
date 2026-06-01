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
  dollars,
  businessDaysSince,
  CAPSTONE_RUBRIC,
  REVIEW_OVERDUE_AFTER_BUSINESS_DAYS,
  REVIEW_WINDOW_COPY,
  formatCertDate,
} from "@/lib/certs";
import type {
  Cert,
  CertLessonItem,
  UserCert,
  CapstoneSubmission,
  CertStatus,
} from "@/lib/certs";
import { CERT_STATUS_TONE } from "@/lib/certStatusUi";
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
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// How long after starting checkout we treat the intent flag as a recent
// attempt. Long enough to bridge the out-of-band paid_at delay, short enough
// that an abandoned checkout reverts to the normal unlock button.
const CHECKOUT_WINDOW_MS = 3 * 60 * 60 * 1000;

// dollars() and businessDaysSince() now live in @/lib/certs so they share one
// definition with the dashboard and submit page (no drift, one correctness fix).

// Status pill tone now lives in @/lib/certStatusUi (shared with the dashboard).
const STATUS_TONE = CERT_STATUS_TONE;

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

  // This is the page a payer actually sits on after clicking the Stripe link.
  // Payment is confirmed out of band (an admin stamps paid_at by hand), so when
  // the learner switches back to this tab, quietly refetch the cert state so the
  // unlocked action appears without a manual reload (Executor H2; mirrors the
  // dashboard's visibilitychange refetch, which did not cover this page).
  useEffect(() => {
    if (!cert) return;
    const c = cert;
    let cancelled = false;
    async function onVisible() {
      if (document.visibilityState !== "visible") return;
      const [uc, ls] = await Promise.all([getUserCert(c.id), getCertLessonsWithCompletion(c.id)]);
      const sub = uc ? await getCapstoneSubmission(uc.id) : null;
      if (cancelled) return;
      setUserCert(uc);
      setLessons(ls);
      setSubmission(sub);
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [cert]);

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

  // Stripe Payment Links mark paid_at out of band (an admin sets it), so a
  // learner returning straight from checkout can still briefly see the unpaid
  // state. We remember the moment they STARTED checkout (a timestamp, not a
  // payment fact) so we can show an honest "if you just paid, this is
  // unlocking" bridge instead of the same pay button. The flag is a recent
  // intent signal only: it expires so an abandoned or declined checkout reverts
  // to the normal unlock button rather than implying payment forever.
  const paidFlagKey = cert ? `lumio_paid_${cert.id}` : "";
  const [checkoutPending, setCheckoutPending] = useState(false);
  useEffect(() => {
    if (!cert) return;
    const urlPaid = new URLSearchParams(window.location.search).get("paid") === "1";
    if (urlPaid) {
      localStorage.setItem(paidFlagKey, String(Date.now()));
      // Strip ?paid=1 so a later refresh or bookmark cannot re-arm the window.
      const url = new URL(window.location.href);
      url.searchParams.delete("paid");
      window.history.replaceState({}, "", url.toString());
    }
    const raw = localStorage.getItem(paidFlagKey);
    const ts = raw ? Number(raw) : 0;
    const recent = ts > 0 && Date.now() - ts < CHECKOUT_WINDOW_MS;
    if (raw && !recent) localStorage.removeItem(paidFlagKey);
    setCheckoutPending(urlPaid || recent);
  }, [cert, paidFlagKey]);

  // Once the admin propagates paid_at (status advances past in-progress), the
  // intent flag has done its job, so clear it for clean future visits.
  useEffect(() => {
    if (!cert) return;
    if (status !== "not-started" && status !== "in-progress") {
      localStorage.removeItem(paidFlagKey);
    }
  }, [status, cert, paidFlagKey]);

  function markCheckoutStarted() {
    if (paidFlagKey) localStorage.setItem(paidFlagKey, String(Date.now()));
  }

  // ── Loading / not-found ──────────────────────────────────────────────────--
  if (loading) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={860} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[860px] mx-auto px-6 pt-28 pb-20 md:pt-36">
          <div className="rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 240 }} />
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={860} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
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
      <BrandNav maxWidth={860} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />

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
          {/* Price + guarantee = the buy surface. Hidden once the capstone is in
              review or the cert is earned, so the "3 business days" promise lives
              in exactly one place (the status-aware ActionPanel) at a time. */}
          {status !== "submitted" && status !== "needs-revision" && status !== "certified" && (
            <>
              {/* Dream outcome before the number (Hormozi H2 + Contrarian HIGH):
                  at the buy moment the cert sells standing, not relief. "Not behind"
                  keeps the buyer in a deficit identity right where money and public
                  reputation are on the line, so we lead with what they can do, not
                  what they were afraid of. Not a fabricated claim. */}
              <p className="mt-6 text-base leading-relaxed" style={{ color: C.espresso, maxWidth: 560 }}>
                Proof you can put in front of your manager that you ship real work with AI, not just talk
                about it. A real person reviews one real task from your job, not a machine grading a quiz.
              </p>
              {/* Reframe the honesty, don't bury it (Contrarian MED): accreditation
                  is the wrong axis for "can you use AI." Turn the admission into the
                  differentiator instead of a pre-price apology. Still no fabrication. */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.umber, maxWidth: 520 }}>
                Not a college credential, and better for this. Accredited courses test what you memorized.
                Here, a real person confirms you did real work from your actual job.
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-2xl font-medium" style={{ color: C.espresso, fontFamily: FONT_MONO }}>
                  {dollars(cert.price_cents)}
                </span>
                <span className="text-sm" style={{ color: C.inkSoft }}>
                  one time
                </span>
              </div>
              {/* Anchor the price (Hormozi H1): a number alone has nothing to weigh
                  against. The honest, durable contrast is structural, not a brand or
                  a figure we would have to keep accurate: subscription forever versus
                  pay once. The "real person" promise is made once below, in the
                  guarantee, so it isn't restated five ways here (Rubin HIGH). */}
              <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft, maxWidth: 520 }}>
                A subscription learning site charges you every year, whether you use it or not. The lessons
                here are free. You pay once, when you're ready, and only if you want the certificate.
              </p>
              {/* Risk reversal, given real visual weight (Hormozi): a named,
                  bordered guarantee reads as a promise, not fine print. */}
              <div
                className="mt-5 rounded-2xl p-5"
                style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}`, maxWidth: 520 }}
              >
                <p className="text-sm font-medium" style={{ color: C.espresso }}>
                  Our guarantee
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: C.umber }}>
                  If your project isn't approved the first time, we tell you exactly what to fix and review it
                  again, free. Keep going and we'll keep reviewing. You keep your money and you keep working
                  toward the certificate.
                </p>
              </div>
              {/* One honest, gentle reason to not put it off, without restating the
                  "reviewed by a real person" promise yet again (Rubin HIGH). The
                  review window copy is single-sourced. */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.inkSoft, maxWidth: 520 }}>
                You'll hear back {REVIEW_WINDOW_COPY}. The earlier you submit, the sooner that is.
              </p>
            </>
          )}
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
          checkoutPending={checkoutPending && status === "in-progress" && allComplete}
          onUnlockClick={markCheckoutStarted}
          rm={rm}
        />

        {/* ── What you'll learn ───────────────────────────────────────────── */}
        {cert.outcomes.length > 0 && (
          <Section title="What you'll walk away with" rm={rm} delay={0.2}>
            <p className="text-sm mb-4" style={{ color: C.umber }}>
              By the time you submit your final project, you'll be able to:
            </p>
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
                      className="font-serif truncate hover:underline"
                      style={{
                        color: C.espresso,
                        fontSize: 15,
                        fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
                      }}
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
        <Section title="Your final project" rm={rm} delay={0.36}>
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
          >
            <p className="text-xs mb-3" style={{ color: C.umber }}>
              This is your final project: the one real task you do at the end to earn the certificate.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
              {cert.capstone_spec.description}
            </p>
            {cert.capstone_spec.min_words != null && (
              <p className="mt-3 text-xs" style={{ color: C.inkSoft }}>
                Aim for about {cert.capstone_spec.min_words} words, a few short paragraphs. This is not an essay test.
              </p>
            )}
            {/* What passing looks like, stated plainly before you pay (Hormozi:
                a visible bar turns "will I pass?" dread into a checklist). Shared
                CAPSTONE_RUBRIC so the bar shown here matches the submit page. */}
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.orangeWashBorder}` }}>
              <p className="text-sm font-medium" style={{ color: C.espresso }}>
                What a good submission looks like
              </p>
              <ul className="mt-2 space-y-1.5">
                {CAPSTONE_RUBRIC.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: C.umber }}>
                    <span aria-hidden="true" style={{ color: C.forest, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* One crisp human-review line (Naval: the page said this five ways;
                Contrarian: a single reviewer, not "our team"). */}
            <div
              className="mt-4 flex items-start gap-2.5 pt-4"
              style={{ borderTop: `1px solid ${C.orangeWashBorder}` }}
            >
              <span aria-hidden="true" style={{ color: C.forest, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p className="text-sm" style={{ color: C.espresso, lineHeight: 1.5 }}>
                A real person reads every submission. They're checking that you did the work, not that it's flawless.
              </p>
            </div>
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
  checkoutPending,
  onUnlockClick,
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
  checkoutPending: boolean;
  onUnlockClick: () => void;
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
      {/* Progress bar. Hidden for the certified state, and also for not-started:
          a 0-of-N bar at 0% on the buy surface is a small deflation before the
          learner has committed (mirrors the dashboard withholding the points row
          until there is real progress). */}
      {status !== "certified" && status !== "not-started" && (
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

      {/* lessons done but not paid: unlock the review via Stripe link. If the
          learner recently started checkout, bridge the out-of-band paid_at gap
          with an honest, conditional message (never asserting payment as fact,
          since the flag is set on click, not on a confirmed charge) and keep a
          clear way to finish paying if they did not complete it. */}
      {status === "in-progress" && allComplete && checkoutPending && (
        <div>
          <p className="text-sm mb-2 font-medium" style={{ color: C.espresso }}>
            If you just paid, your final project is unlocking now.
          </p>
          <p className="text-sm mb-4" style={{ color: C.umber }}>
            It can take a few minutes to confirm. Refresh and your final project
            will be ready to submit.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`inline-block ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.orange, color: C.ink }}
          >
            Refresh →
          </button>
          {cert.stripe_payment_link && (
            <p className="mt-4 text-sm" style={{ color: C.umber }}>
              Didn't finish checking out?{" "}
              <a
                href={cert.stripe_payment_link}
                onClick={onUnlockClick}
                className={`font-medium underline underline-offset-2 ${FOCUS_RING}`}
                style={{ color: C.orangeInk }}
              >
                Complete your payment ({dollars(cert.price_cents)})
              </a>
            </p>
          )}
        </div>
      )}
      {status === "in-progress" && allComplete && !checkoutPending && (
        <div>
          <p className="text-sm mb-4" style={{ color: C.espresso }}>
            You finished every lesson. One step left: a real person reviews your final project, then the certificate is yours.
          </p>
          {cert.stripe_payment_link ? (
            /* Lead the click with the outcome, not the cost (Hormozi H4). The price
               sits just beneath as a sub-label so the button reads as a decision
               already made, not a payment form. */
            <div className="flex flex-col items-start gap-1.5">
              <a
                href={cert.stripe_payment_link}
                onClick={onUnlockClick}
                className={`inline-block ${PILL} ${FOCUS_RING}`}
                style={{ backgroundColor: C.orange, color: C.ink }}
              >
                Get my certificate →
              </a>
              <span className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                {dollars(cert.price_cents)} one time, no subscription
              </span>
            </div>
          ) : (
            <p className="text-sm" style={{ color: C.umber }}>
              Checkout is not available yet. Check back soon.
            </p>
          )}
          {/* Cross-device payers and anyone past the local checkout window land
              here with only a pay button. A real person confirms payment by hand,
              so reassure plainly about a double charge first (Outsider HIGH), then
              set the honest expectation on timing. */}
          {cert.stripe_payment_link && (
            <p className="mt-4 text-sm" style={{ color: C.umber }}>
              Already paid? You won't be charged again. We confirm payments by hand, so it can take up to
              a day to show here. Refresh this page, and reach us if it has been longer.
            </p>
          )}
        </div>
      )}

      {/* paid: submit the capstone */}
      {status === "capstone-unlocked" && (
        <div>
          <p className="text-sm mb-4" style={{ color: C.espresso }}>
            Your final project is unlocked. Submit it to earn your certificate.
          </p>
          <a
            href={`/app/cert/${cert.slug}/submit`}
            className={`inline-block ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.orange, color: C.ink }}
          >
            Submit your final project →
          </a>
        </div>
      )}

      {/* submitted: under review */}
      {status === "submitted" && submission && (
        <div>
          {/* "approved" is set when the reviewer passes the work, but the cert is
              only earned once completed_at is stamped (out of band, like paid_at).
              Without this branch an approved learner sees "under review" until that
              stamp lands (Executor MED). Speak to the real, good news instead. */}
          <p className="text-sm" style={{ color: C.espresso }}>
            {submission.status === "approved"
              ? "Your final project was approved. Your certificate is being finalized and will appear here shortly."
              : businessDaysSince(submission.submitted_at) >= REVIEW_OVERDUE_AFTER_BUSINESS_DAYS
                ? "Your final project is still with our reviewer. Thanks for your patience, we have not forgotten it. If you would like an update, just reach out."
                : `Your final project is under review. A real person reviews every project, ${REVIEW_WINDOW_COPY}.`}
          </p>
          {submission.submitted_at && (
            <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
              Submitted {formatCertDate(submission.submitted_at)}
            </p>
          )}
        </div>
      )}

      {/* needs-revision: reviewer sent it back. Distinguish a true rejection from
          a light revision so the copy is honest (Contrarian), while both keep the
          free-resubmit path the earn-it guarantee promises. */}
      {status === "needs-revision" && submission && (
        <div>
          <p className="text-sm" style={{ color: C.espresso }}>
            {submission.status === "rejected"
              ? "Our reviewer could not pass your final project this time. The notes below explain what is missing. Reworking it and resubmitting is free, and we will review it again."
              : "Our reviewer sent your final project back with notes so you can earn it. Revising and resubmitting is free, and we want you to pass."}
          </p>
          {submission.reviewer_notes ? (
            <div
              className="mt-4 rounded-2xl p-4"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.orangeWashBorder}` }}
            >
              <p className="text-[12px] uppercase tracking-[0.18em] mb-2" style={{ color: C.umber, fontFamily: FONT_MONO }}>
                What to revise
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: C.espresso }}>
                {submission.reviewer_notes}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
              Check your email for the reviewer's notes.
            </p>
          )}
          <a
            href={`/app/cert/${cert.slug}/submit`}
            className={`inline-block mt-4 ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.orange, color: C.ink }}
          >
            Revise and resubmit →
          </a>
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

  // A feed share posts the public Verify page where a network actually sees it.
  // We deliberately use share-offsite (which works today) instead of LinkedIn's
  // add-to-profile flow, which silently fails without a real organizationId.
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;

  // Pre-written, on-brand post so sharing is one tap, not a blank box. The win is
  // the emotional peak ("I'm not behind anymore") — make it effortless to voice.
  const sharePost = `I just earned my ${cert.name} from Lumio. Proof I can actually use AI at work, reviewed by a real person. Verify it here: ${verifyUrl}`;

  // One-tap share to X, the highest-velocity channel, reusing the same on-brand
  // copy. Pure intent URL, zero infra (Expansionist).
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePost)}`;

  function copyVerify() {
    navigator.clipboard.writeText(verifyUrl).then(
      () => toast.success("Verification link copied."),
      () => toast.error("Could not copy the link."),
    );
  }

  function copyPost() {
    navigator.clipboard.writeText(sharePost).then(
      () => toast.success("Post copied. Paste it anywhere."),
      () => toast.error("Could not copy the post."),
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
          href={linkedInShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.ink, color: C.paper }}
        >
          Share on LinkedIn →
        </a>
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.ink, color: C.paper }}
        >
          Share on X →
        </a>
        <button
          type="button"
          onClick={copyPost}
          className={`inline-block ${PILL} ${FOCUS_RING}`}
          style={{ backgroundColor: C.orange, color: C.ink }}
        >
          Copy a post
        </button>
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
      {/* Capture intent at the peak (Expansionist). Frame the next cert as range,
          not catch-up: the buyer just resolved "I'm not behind," so a second cert
          can't sell that same relief again. It sells reach across their work
          (Contrarian #2). Zero-infra nudge to the hub. */}
      <a
        href="/app"
        className={`inline-block mt-5 text-sm font-medium ${FOCUS_RING}`}
        style={{ color: C.orangeInk }}
      >
        Prove it in another part of your work →
      </a>
    </div>
  );
}

