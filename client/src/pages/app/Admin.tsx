import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { C, FOCUS_RING, FONT_MONO, PILL, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav, AppNavRight } from "@/components/marketing";
import { formatCertDate } from "@/lib/certs";

const ADMIN_EMAIL = "omarelkhateeb06@gmail.com";

// ── Types ────────────────────────────────────────────────────────────────────

interface AdminSubmission {
  id: string;
  user_cert_id: string;
  attempt_number: number;
  submission_content: {
    title: string;
    description: string;
    prompt_and_result?: string;
    ai_tools: string;
    improvements?: string;
  };
  status: string;
  submitted_at: string | null;
  reviewer_notes: string | null;
  user_email: string;
  cert_name: string;
  cert_slug: string;
}

// ── Admin data helpers ───────────────────────────────────────────────────────

async function fetchAdminSubmissions(): Promise<AdminSubmission[]> {
  const { data, error } = await supabase.rpc("get_admin_capstones");
  if (error || !data) return [];
  return Array.isArray(data) ? (data as AdminSubmission[]) : [];
}

async function reviewSubmission(
  submissionId: string,
  status: string,
  notes: string,
  awardCert: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("admin_review_submission", {
    p_submission_id: submissionId,
    p_status: status,
    p_notes: notes,
    p_award_cert: awardCert,
  });
  if (error) return { ok: false, error: error.message };
  const d = data as Record<string, unknown>;
  return d?.ok ? { ok: true } : { ok: false, error: String(d?.error ?? "Unknown error") };
}

async function stampPaid(
  email: string,
  certSlug: string,
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("admin_stamp_paid", {
    p_user_email: email,
    p_cert_slug: certSlug,
  });
  if (error) return { ok: false, error: error.message };
  const d = data as Record<string, unknown>;
  return d?.ok ? { ok: true } : { ok: false, error: String(d?.error ?? "Unknown error") };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;
  const [tab, setTab] = useState<"queue" | "stamp">("queue");

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (!user) return null;
  if (user.email !== ADMIN_EMAIL) {
    window.location.href = "/app";
    return null;
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={860} right={<AppNavRight onSignOut={handleSignOut} email={user.email} />} />

      <div id="main-content" className="max-w-[860px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <p
          className="text-[12px] uppercase tracking-[0.18em] mb-2"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          Admin
        </p>
        <h1
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
          }}
        >
          Capstone review
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 mt-8" style={{ borderBottom: `1px solid ${C.hairline}` }}>
          {(["queue", "stamp"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="pb-3 text-sm font-medium transition-colors focus-visible:outline-none"
              style={{
                color: tab === id ? C.espresso : C.umber,
                borderBottom: `2px solid ${tab === id ? C.orange : "transparent"}`,
                fontFamily: FONT_MONO,
              }}
            >
              {id === "queue" ? "Review queue" : "Stamp payment"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "queue" ? <ReviewQueue rm={rm} /> : <StampPayment />}
        </div>
      </div>
    </div>
  );
}

// ── Review Queue ─────────────────────────────────────────────────────────────

function ReviewQueue({ rm }: { rm: boolean }) {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchAdminSubmissions();
      if (!cancelled) {
        setSubmissions(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function remove(id: string) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setExpanded((e) => (e === id ? null : e));
  }

  if (loading) {
    return (
      <div
        className="rounded-2xl animate-pulse"
        style={{ backgroundColor: C.hairline, height: 200 }}
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
      >
        <p className="text-sm" style={{ color: C.umber }}>
          No submissions pending review.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: ease.ink }}
      className="space-y-4"
    >
      <p className="text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
        {submissions.length} pending
      </p>
      {submissions.map((s) => (
        <SubmissionCard
          key={s.id}
          submission={s}
          expanded={expanded === s.id}
          onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
          onDone={() => remove(s.id)}
        />
      ))}
    </motion.div>
  );
}

// ── Submission Card ──────────────────────────────────────────────────────────

type ActionState = "idle" | "approve" | "revision" | "reject";

function SubmissionCard({
  submission: s,
  expanded,
  onToggle,
  onDone,
}: {
  submission: AdminSubmission;
  expanded: boolean;
  onToggle: () => void;
  onDone: () => void;
}) {
  const [action, setAction] = useState<ActionState>("idle");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const statusMap: Record<string, string> = {
    approve: "approved",
    revision: "needs_revision",
    reject: "rejected",
  };

  async function confirm() {
    if (action === "idle") return;
    setSaving(true);
    const res = await reviewSubmission(
      s.id,
      statusMap[action],
      notes,
      action === "approve",
    );
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Could not save review.");
      return;
    }
    toast.success(action === "approve" ? "Approved and cert awarded." : "Review saved.");
    onDone();
  }

  const c = s.submission_content;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${C.hairline}`, backgroundColor: C.paperHi }}
    >
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]/60 focus-visible:ring-inset"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: C.espresso }}
            >
              {c.title || "(no title)"}
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: C.umber, fontFamily: FONT_MONO }}
            >
              {s.user_email} · {s.cert_name} · attempt {s.attempt_number}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-xs"
              style={{ color: C.inkSoft, fontFamily: FONT_MONO }}
            >
              {s.submitted_at ? formatCertDate(s.submitted_at) : "—"}
            </span>
            <span style={{ color: C.umber, fontSize: 11 }}>
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div
          className="px-6 pb-7 pt-4 space-y-5"
          style={{ borderTop: `1px solid ${C.hairline}` }}
        >
          <ContentBlock label="Description" text={c.description} />
          {c.prompt_and_result && (
            <ContentBlock label="Prompt and result" text={c.prompt_and_result} />
          )}
          <ContentBlock label="AI tools used" text={c.ai_tools} />
          {c.improvements && (
            <ContentBlock label="What they'd do differently" text={c.improvements} />
          )}
          {s.reviewer_notes && (
            <ContentBlock
              label="Prior reviewer notes"
              text={s.reviewer_notes}
              muted
            />
          )}

          {/* Actions */}
          {action === "idle" ? (
            <div className="flex gap-3 flex-wrap pt-2">
              <button
                type="button"
                onClick={() => setAction("approve")}
                className={`${PILL} ${FOCUS_RING}`}
                style={{ backgroundColor: C.forest, color: C.paper }}
              >
                Approve + award cert
              </button>
              <button
                type="button"
                onClick={() => setAction("revision")}
                className={`${PILL} ${FOCUS_RING}`}
                style={{ backgroundColor: C.orange, color: C.ink }}
              >
                Needs revision
              </button>
              <button
                type="button"
                onClick={() => setAction("reject")}
                className={`${PILL} ${FOCUS_RING}`}
                style={{
                  backgroundColor: C.surface,
                  color: C.espresso,
                  border: `1px solid ${C.hairline}`,
                }}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p
                className="text-xs font-medium"
                style={{ color: C.espresso, fontFamily: FONT_MONO }}
              >
                {action === "approve"
                  ? "Approve — notes for the learner (optional)"
                  : action === "revision"
                  ? "Tell them what to fix"
                  : "Rejection notes"}
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.hairline}`,
                  color: C.ink,
                  resize: "vertical",
                }}
                placeholder={
                  action === "approve"
                    ? "Optional. Something encouraging."
                    : "Explain what to improve."
                }
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={confirm}
                  disabled={saving}
                  className={`${PILL} ${FOCUS_RING}`}
                  style={{
                    backgroundColor: C.ink,
                    color: C.paper,
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving…" : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction("idle");
                    setNotes("");
                  }}
                  className={`${PILL} ${FOCUS_RING}`}
                  style={{
                    backgroundColor: C.surface,
                    color: C.umber,
                    border: `1px solid ${C.hairline}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ContentBlock({
  label,
  text,
  muted,
}: {
  label: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[11px] uppercase tracking-[0.16em] mb-1.5"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {label}
      </p>
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: muted ? C.inkSoft : C.espresso }}
      >
        {text}
      </p>
    </div>
  );
}

// ── Stamp Payment ────────────────────────────────────────────────────────────

function StampPayment() {
  const [email, setEmail] = useState("");
  const [certSlug, setCertSlug] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !certSlug.trim()) return;
    setSaving(true);
    const res = await stampPaid(email.trim(), certSlug.trim());
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Could not stamp payment.");
      return;
    }
    toast.success(`paid_at stamped for ${email.trim()}`);
    setEmail("");
    setCertSlug("");
  }

  const ready = email.trim().length > 0 && certSlug.trim().length > 0 && !saving;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-[480px]">
      <p className="text-sm leading-relaxed" style={{ color: C.umber }}>
        Use this when a learner has paid via Stripe but paid_at has not been set yet.
        It only updates an existing enrollment that has no paid_at.
      </p>

      <div>
        <label
          htmlFor="stamp-email"
          className="block text-sm font-medium mb-2"
          style={{ color: C.espresso }}
        >
          Learner email
        </label>
        <input
          id="stamp-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.hairline}`,
            color: C.ink,
          }}
          placeholder="learner@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="stamp-cert"
          className="block text-sm font-medium mb-2"
          style={{ color: C.espresso }}
        >
          Cert slug
        </label>
        <input
          id="stamp-cert"
          type="text"
          value={certSlug}
          onChange={(e) => setCertSlug(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-xl text-sm ${FOCUS_RING}`}
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.hairline}`,
            color: C.ink,
          }}
          placeholder="e.g. finance-ai-practitioner"
        />
      </div>

      <button
        type="submit"
        disabled={!ready}
        className={`${PILL} ${FOCUS_RING}`}
        style={{
          backgroundColor: C.orange,
          color: C.ink,
          opacity: ready ? 1 : 0.5,
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        {saving ? "Stamping…" : "Stamp paid_at →"}
      </button>
    </form>
  );
}
