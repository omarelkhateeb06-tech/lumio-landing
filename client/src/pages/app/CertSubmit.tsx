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
import { BrandNav } from "@/components/marketing";

const SUBMISSION_STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  needs_revision: "Needs revision",
  rejected: "Not approved",
};

function wordCount(s: string): number {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

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
      // Payment gate: no paid enrollment → bounce back to the overview.
      if (!uc || !uc.paid_at) {
        if (!cancelled) {
          toast.error("Complete your cert lessons and unlock the capstone to submit.");
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
      toast.error("Could not submit your capstone. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Your submission is under review.");
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (loading || !cert) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={720} right={<NavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />
        <div className="max-w-[720px] mx-auto px-6 pt-28 pb-20 md:pt-36">
          <div className="rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 320 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={720} right={<NavRight onSignOut={handleSignOut} email={user?.email ?? ""} />} />

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
          Submit your capstone
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
              Your submission is under review. You'll receive your badge within 3 business days.
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
              You've already submitted your capstone for this certificate. You'll receive your badge within 3 business days of approval.
            </p>
            <p className="mt-2 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
              Submitted {new Date(existing.submitted_at).toLocaleDateString()}
            </p>
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
                  {descWords} / {minWords} words minimum
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
                placeholder="Describe the task, the prompt or brief you wrote, the result you got, and your reflection."
              />
            </Field>

            <Field label="AI tool(s) used" htmlFor="aiTools">
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
              <span>This is my own original work.</span>
            </label>

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
              {submitting ? "Submitting…" : "Submit for review →"}
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
