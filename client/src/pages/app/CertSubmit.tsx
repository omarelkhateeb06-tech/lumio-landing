import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCertBySlug,
  getUserCert,
  getCapstoneSubmission,
  submitCapstone,
  businessDaysSince,
  formatCertDate,
  CAPSTONE_RUBRIC,
  REVIEW_OVERDUE_AFTER_BUSINESS_DAYS,
  REVIEW_WINDOW_COPY,
  SUBMISSION_STATUS_LABEL,
} from "@/lib/certs";
import type { Cert, UserCert, CapstoneSubmission, CapstoneSubmissionContent } from "@/lib/certs";
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

// SUBMISSION_STATUS_LABEL now lives in @/lib/certs, reconciled with the derived
// status pill so the same review state never reads two different ways.

function wordCount(s: string): number {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

// businessDaysSince() now lives in @/lib/certs so the overdue-review fallback
// shares one (date-only, correct) definition with the overview and dashboard.

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CertSubmit() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;

  const [cert, setCert] = useState<Cert | null>(null);
  const [userCert, setUserCert] = useState<UserCert | null>(null);
  const [existing, setExisting] = useState<CapstoneSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiTools, setAiTools] = useState("");
  const [improvements, setImprovements] = useState("");
  const [attestation, setAttestation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const minWords = cert?.capstone_spec.min_words ?? 200;
  const descWords = wordCount(description);

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
      const uc = await getUserCert(c.id);
      // Payment gate: the DB requires paid_at before a submission is allowed.
      // Since paid_at is confirmed by hand, a learner who just paid may land here
      // before it posts, so the copy speaks to payment, not lessons (Contrarian).
      if (!uc || !uc.paid_at) {
        if (!cancelled) {
          // Drop the loading state before redirecting. Wouter's navigate is a
          // client-side route change, not a hard unload, so without this the
          // learner could be left staring at the skeleton forever (Executor H1).
          setLoading(false);
          toast.error("We haven't confirmed your payment for this certificate yet. Once it's in, you can submit your final project.");
          navigate(`/app/cert/${slug}`);
        }
        return;
      }
      const sub = await getCapstoneSubmission(uc.id);
      if (cancelled) return;
      setCert(c);
      setUserCert(uc);
      setExisting(sub);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  // Out-of-band review changes: a reviewer can flip the submission's status
  // (approve, or send it back again) while this tab sits in the background. The
  // sibling overview/dashboard pages already refetch on visibilitychange; this
  // page didn't, so a learner could keep seeing a stale "under review" screen
  // until a hard reload (Executor HIGH). Refetch the latest submission on refocus.
  useEffect(() => {
    if (!userCert) return;
    const uc = userCert;
    let cancelled = false;
    async function onVisible() {
      if (document.visibilityState !== "visible") return;
      const sub = await getCapstoneSubmission(uc.id);
      if (!cancelled) setExisting(sub);
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userCert]);

  // A prior submission that is not open for revision blocks resubmission.
  const locked = useMemo(
    () => existing != null && existing.status !== "needs_revision" && existing.status !== "rejected",
    [existing],
  );

  const canSubmit =
    title.trim().length > 0 &&
    descWords >= minWords &&
    aiTools.trim().length > 0 &&
    attestation &&
    !submitting;

  // Spell out exactly what is still missing, so the disabled submit button is
  // never a silent dead end at the finish line.
  const missing: string[] = [];
  if (title.trim().length === 0) missing.push("add a title");
  if (descWords < minWords) missing.push(`reach ${minWords} words (${descWords} so far)`);
  if (aiTools.trim().length === 0) missing.push("name the AI tool you used");
  if (!attestation) missing.push("confirm you did this task yourself");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userCert || !canSubmit) return;
    setSubmitting(true);
    const content: CapstoneSubmissionContent = {
      title: title.trim(),
      description: description.trim(),
      ai_tools: aiTools.trim(),
      improvements: improvements.trim(),
      attestation: true,
    };
    const res = await submitCapstone(userCert.id, content);
    setSubmitting(false);
    if (!res.ok) {
      toast.error("Could not submit your final project. Please try again.");
      return;
    }
    // Reflect the freshly inserted row so a return to this page (or a refocus
    // refetch) reads the true new state instead of the old attempt (Executor).
    if (res.submission) setExisting(res.submission);
    setSubmitted(true);
    toast.success("Your submission is under review.");
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={720} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36">
          <div className="rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 320 }} />
        </div>
      </div>
    );
  }

  // Loading finished but the cert is missing or unpublished. Show an honest
  // not-found state instead of an endless skeleton.
  if (!cert) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={720} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36 text-center">
          <h1
            className="font-serif"
            style={{ color: C.espresso, fontSize: 28, fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT) }}
          >
            We couldn't find that certificate
          </h1>
          <p className="mt-3 text-sm" style={{ color: C.umber }}>
            It may have moved or is not available yet.
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
      <BrandNav maxWidth={720} right={<AppNavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />

      <div id="main-content" className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <a href={`/app/cert/${cert.slug}`} className={`text-[13px] font-medium ${FOCUS_RING}`} style={{ color: C.umber }}>
          ← {cert.name}
        </a>

        <motion.h1
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, delay: 0.05, ease: ease.ink }}
          className="font-serif mt-6"
          style={{
            color: C.espresso,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
          }}
        >
          Your final project
        </motion.h1>

        {/* Success state */}
        {submitted ? (
          <motion.div
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="rounded-2xl p-8 mt-8 text-center"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.orangeWashBorder}` }}
          >
            <div aria-hidden="true" style={{ color: C.forest, fontSize: 32 }}>✓</div>
            <h2
              className="font-serif mt-3"
              style={{ color: C.forest, fontSize: 24, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
            >
              Submission received
            </h2>
            <p className="mt-3 text-sm" style={{ color: C.umber }}>
              Your submission is under review. A real person reviews every project, {REVIEW_WINDOW_COPY}.
            </p>
            <a
              href={`/app/cert/${cert.slug}`}
              className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Back to certificate
            </a>
          </motion.div>
        ) : locked && existing ? (
          /* Already submitted — show status, no resubmission */
          <motion.div
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="rounded-2xl p-8 mt-8"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
          >
            <span
              className="inline-block text-[12px] font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: C.orangeWash,
                border: `1px solid ${C.orangeWashBorder}`,
                color: C.orangeInk,
                fontFamily: FONT_MONO,
              }}
            >
              {SUBMISSION_STATUS_LABEL[existing.status] ?? existing.status}
            </span>
            <p className="mt-4 text-sm" style={{ color: C.espresso }}>
              {existing.status === "approved"
                ? "Your project was approved. Your certificate is being finalized and will appear on your certificate page shortly."
                : businessDaysSince(existing.submitted_at) >= REVIEW_OVERDUE_AFTER_BUSINESS_DAYS
                  ? "You've already submitted your final project. It's still with our reviewer. Thanks for your patience, we have not forgotten it. Reach out any time for an update."
                  : `You've already submitted your final project for this certificate. Once it's approved, the certificate is yours, ${REVIEW_WINDOW_COPY}.`}
            </p>
            {existing.submitted_at && (
              <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                Submitted {formatCertDate(existing.submitted_at)}
              </p>
            )}
            <a
              href={`/app/cert/${cert.slug}`}
              className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Back to certificate
            </a>
          </motion.div>
        ) : (
          /* The form */
          <motion.form
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: 0.12, ease: ease.ink }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <p className="text-sm leading-relaxed" style={{ color: C.umber }}>
              {cert.capstone_spec.description}
            </p>

            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3"
              style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
            >
              <span aria-hidden="true" style={{ color: C.forest, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p className="text-sm" style={{ color: C.espresso, lineHeight: 1.5 }}>
                A real person reads every submission. You'll hear back, {REVIEW_WINDOW_COPY}.
              </p>
            </div>

            {/* The pass criteria, shown while writing (not just on the sales page)
                so the learner can aim at the bar. Shared CAPSTONE_RUBRIC so the
                bar here is byte-identical to the overview (First Principles). */}
            <div>
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

            <Field label="Project title" htmlFor="title">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, color: C.ink }}
                placeholder="A short name for what you did"
              />
            </Field>

            <Field
              label="Project description"
              htmlFor="description"
              hint={
                <span style={{ color: descWords >= minWords ? C.forest : C.inkSoft }}>
                  {descWords} of about {minWords} words
                </span>
              }
            >
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, color: C.ink, resize: "vertical" }}
                placeholder="Just tell us what you did, what you asked the AI, and what came back. Write like you'd tell a coworker."
              />
            </Field>

            <Field label="Which AI did you use?" htmlFor="aiTools">
              <input
                id="aiTools"
                type="text"
                value={aiTools}
                onChange={(e) => setAiTools(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, color: C.ink }}
                placeholder="e.g. ChatGPT, Claude, Gemini"
              />
            </Field>

            <Field label="What would you do differently next time?" htmlFor="improvements">
              <textarea
                id="improvements"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, color: C.ink, resize: "vertical" }}
                placeholder="Optional, but the best reflections show growth."
              />
            </Field>

            <label className="flex items-start gap-3 text-sm cursor-pointer" style={{ color: C.espresso }}>
              <input
                type="checkbox"
                checked={attestation}
                onChange={(e) => setAttestation(e.target.checked)}
                className="mt-0.5"
                style={{ accentColor: C.orange, width: 16, height: 16, flexShrink: 0 }}
              />
              <span>I did this task myself. Using AI to do it is fine, that is the point.</span>
            </label>

            {!submitting && missing.length > 0 && (
              <p className="text-sm" style={{ color: C.umber }}>
                Just one or two things first: {missing.join(", ")}.
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`inline-block ${PILL} ${FOCUS_RING}`}
              style={{
                backgroundColor: C.orange,
                color: C.ink,
                opacity: canSubmit ? 1 : 0.5,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Sending…" : "Send it in →"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={htmlFor} className="text-sm font-medium" style={{ color: C.espresso }}>
          {label}
        </label>
        {hint && <span className="text-xs" style={{ fontFamily: FONT_MONO }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
