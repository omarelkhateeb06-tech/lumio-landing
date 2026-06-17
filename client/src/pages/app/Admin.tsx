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

// Analytics RPC return shapes ─────────────────────────────────────────────────

interface DataAssetHealth {
  total_identified_users: number;
  users_per_industry: Record<string, number>;
  consented_users: number;
  tutor_queries_logged: number;
  avg_session_minutes: number;
  targets: {
    total_identified_users: number;
    users_per_industry: number;
    tutor_queries_logged: number;
    avg_session_minutes: number;
  };
}

interface EngagementDistribution {
  at_risk: number;
  active: number;
  power: number;
  total: number;
}

interface RetentionCohort {
  cohort_week: string;
  cohort_size: number;
  retained_d1: number;
  retained_d7: number;
  retained_d30: number;
}

interface CertFunnelRow {
  cert_id: string;
  cert_slug: string;
  cert_name: string;
  enrolled: number;
  paid: number;
  completed: number;
  avg_days_to_complete: number;
}

interface TopEvent {
  event_type: string;
  event_count: number;
}

interface ConfusionRow {
  lesson_id: string;
  lesson_title: string;
  module_id: string;
  module_title: string;
  interactions: number;
  avg_iterations: number;
}

const EMPTY_HEALTH: DataAssetHealth = {
  total_identified_users: 0,
  users_per_industry: {},
  consented_users: 0,
  tutor_queries_logged: 0,
  avg_session_minutes: 0,
  targets: {
    total_identified_users: 2000,
    users_per_industry: 200,
    tutor_queries_logged: 5000,
    avg_session_minutes: 12,
  },
};

const EMPTY_ENGAGEMENT: EngagementDistribution = {
  at_risk: 0,
  active: 0,
  power: 0,
  total: 0,
};

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

async function fetchDataAssetHealth(): Promise<DataAssetHealth> {
  const { data, error } = await supabase.rpc("admin_data_asset_health");
  if (error || !data || typeof data !== "object") return EMPTY_HEALTH;
  const d = data as Partial<DataAssetHealth>;
  return {
    ...EMPTY_HEALTH,
    ...d,
    users_per_industry: d.users_per_industry ?? {},
    targets: { ...EMPTY_HEALTH.targets, ...(d.targets ?? {}) },
  };
}

async function fetchEngagementDistribution(): Promise<EngagementDistribution> {
  const { data, error } = await supabase.rpc("admin_engagement_distribution");
  if (error || !data || typeof data !== "object") return EMPTY_ENGAGEMENT;
  return { ...EMPTY_ENGAGEMENT, ...(data as Partial<EngagementDistribution>) };
}

async function fetchRetentionCohorts(): Promise<RetentionCohort[]> {
  const { data, error } = await supabase.rpc("admin_retention_cohorts");
  if (error || !data) return [];
  return Array.isArray(data) ? (data as RetentionCohort[]) : [];
}

async function fetchCertFunnel(): Promise<CertFunnelRow[]> {
  const { data, error } = await supabase.rpc("admin_cert_funnel");
  if (error || !data) return [];
  return Array.isArray(data) ? (data as CertFunnelRow[]) : [];
}

async function fetchTopEvents(): Promise<TopEvent[]> {
  const { data, error } = await supabase.rpc("admin_top_events");
  if (error || !data) return [];
  return Array.isArray(data) ? (data as TopEvent[]) : [];
}

async function fetchConfusionMap(): Promise<ConfusionRow[]> {
  const { data, error } = await supabase.rpc("admin_confusion_map");
  if (error || !data) return [];
  return Array.isArray(data) ? (data as ConfusionRow[]) : [];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, signOut } = useAuth();
  const rm = useReducedMotion() ?? false;
  const [tab, setTab] = useState<"queue" | "stamp" | "analytics">("queue");

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
          {(["queue", "stamp", "analytics"] as const).map((id) => (
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
              {id === "queue"
                ? "Review queue"
                : id === "stamp"
                ? "Stamp payment"
                : "Analytics"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "queue" ? (
            <ReviewQueue rm={rm} />
          ) : tab === "stamp" ? (
            <StampPayment />
          ) : (
            <AnalyticsPanel rm={rm} />
          )}
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

// ── Analytics ────────────────────────────────────────────────────────────────

const INDUSTRY_LABELS: Record<string, string> = {
  total_identified_users: "Identified users",
  tutor_queries_logged: "Tutor queries",
  avg_session_minutes: "Avg session (min)",
};

function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}

function fmtDec(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return (Math.round(n * 10) / 10).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

function pct(value: number, target: number): number {
  if (!target || !Number.isFinite(target)) return 0;
  return Math.max(0, Math.min(100, (value / target) * 100));
}

function AnalyticsPanel({ rm }: { rm: boolean }) {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<DataAssetHealth>(EMPTY_HEALTH);
  const [engagement, setEngagement] = useState<EngagementDistribution>(EMPTY_ENGAGEMENT);
  const [cohorts, setCohorts] = useState<RetentionCohort[]>([]);
  const [funnel, setFunnel] = useState<CertFunnelRow[]>([]);
  const [events, setEvents] = useState<TopEvent[]>([]);
  const [confusion, setConfusion] = useState<ConfusionRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [h, e, c, f, ev, cf] = await Promise.all([
        fetchDataAssetHealth(),
        fetchEngagementDistribution(),
        fetchRetentionCohorts(),
        fetchCertFunnel(),
        fetchTopEvents(),
        fetchConfusionMap(),
      ]);
      if (!cancelled) {
        setHealth(h);
        setEngagement(e);
        setCohorts(c);
        setFunnel(f);
        setEvents(ev);
        setConfusion(cf);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[220, 120, 160].map((h, i) => (
          <div
            key={i}
            className="rounded-2xl animate-pulse"
            style={{ backgroundColor: C.hairline, height: h }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: ease.ink }}
      className="space-y-10"
    >
      <DataAssetHealthSection health={health} />
      <EngagementSection engagement={engagement} />
      <RetentionSection cohorts={cohorts} />
      <CertFunnelSection funnel={funnel} />
      <TopEventsSection events={events} />
      <ConfusionSection confusion={confusion} />
    </motion.div>
  );
}

// Shared analytics primitives ─────────────────────────────────────────────────

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4">
      <p
        className="text-[11px] uppercase tracking-[0.16em] mb-1"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {kicker}
      </p>
      <h2 className="text-base font-medium" style={{ color: C.espresso }}>
        {title}
      </h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      {children}
    </div>
  );
}

function EmptyLine({ text = "No data yet" }: { text?: string }) {
  return (
    <p className="text-sm" style={{ color: C.inkSoft }}>
      {text}
    </p>
  );
}

function ProgressBar({ value, target }: { value: number; target: number }) {
  return (
    <div
      className="rounded-full overflow-hidden mt-3"
      style={{ height: 4, backgroundColor: C.hairline }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct(value, target)}%`, backgroundColor: C.orange }}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  target,
  decimal,
}: {
  label: string;
  value: number;
  target: number;
  decimal?: boolean;
}) {
  const shown = decimal ? fmtDec(value) : fmtNum(value);
  const shownTarget = decimal ? fmtDec(target) : fmtNum(target);
  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.16em]"
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-serif"
        style={{
          color: C.espresso,
          fontSize: 28,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
        }}
      >
        {shown}
      </p>
      <p className="mt-1 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
        of {shownTarget} target
      </p>
      <ProgressBar value={value} target={target} />
    </div>
  );
}

// Table primitives — shared by retention / funnel / confusion ─────────────────

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`pb-2 text-[11px] uppercase tracking-[0.14em] font-normal ${
        right ? "text-right" : "text-left"
      }`}
      style={{ color: C.umber, fontFamily: FONT_MONO }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  right,
  strong,
}: {
  children: React.ReactNode;
  right?: boolean;
  strong?: boolean;
}) {
  return (
    <td
      className={`py-2.5 text-sm align-top ${right ? "text-right tabular-nums" : "text-left"}`}
      style={{
        color: strong ? C.espresso : C.umber,
        fontFamily: right ? FONT_MONO : undefined,
      }}
    >
      {children}
    </td>
  );
}

// Sections ────────────────────────────────────────────────────────────────────

function DataAssetHealthSection({ health }: { health: DataAssetHealth }) {
  const industries = Object.entries(health.users_per_industry).sort(
    (a, b) => b[1] - a[1],
  );
  return (
    <section>
      <SectionHead kicker="Hero metric" title="Data asset health" />
      <Card>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label={INDUSTRY_LABELS.total_identified_users}
            value={health.total_identified_users}
            target={health.targets.total_identified_users}
          />
          <MetricCard
            label={INDUSTRY_LABELS.tutor_queries_logged}
            value={health.tutor_queries_logged}
            target={health.targets.tutor_queries_logged}
          />
          <MetricCard
            label={INDUSTRY_LABELS.avg_session_minutes}
            value={health.avg_session_minutes}
            target={health.targets.avg_session_minutes}
            decimal
          />
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.16em]"
              style={{ color: C.umber, fontFamily: FONT_MONO }}
            >
              Consented users
            </p>
            <p
              className="mt-2 font-serif"
              style={{
                color: C.espresso,
                fontSize: 28,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
              }}
            >
              {fmtNum(health.consented_users)}
            </p>
            <p className="mt-1 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
              opted in to data use
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p
            className="text-[11px] uppercase tracking-[0.16em] mb-3"
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            Users per industry · target {fmtNum(health.targets.users_per_industry)} each
          </p>
          {industries.length === 0 ? (
            <EmptyLine />
          ) : (
            <ul className="space-y-2.5">
              {industries.map(([industry, count]) => (
                <li key={industry}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm" style={{ color: C.espresso }}>
                      {industry}
                    </span>
                    <span
                      className="text-xs tabular-nums"
                      style={{ color: C.umber, fontFamily: FONT_MONO }}
                    >
                      {fmtNum(count)} / {fmtNum(health.targets.users_per_industry)}
                    </span>
                  </div>
                  <ProgressBar value={count} target={health.targets.users_per_industry} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </section>
  );
}

function EngagementSection({ engagement }: { engagement: EngagementDistribution }) {
  const items: { label: string; value: number }[] = [
    { label: "At risk", value: engagement.at_risk },
    { label: "Active", value: engagement.active },
    { label: "Power", value: engagement.power },
    { label: "Total", value: engagement.total },
  ];
  return (
    <section>
      <SectionHead kicker="Cohort split" title="Engagement" />
      <Card>
        {engagement.total === 0 ? (
          <EmptyLine />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((it) => (
              <div key={it.label}>
                <p
                  className="text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: C.umber, fontFamily: FONT_MONO }}
                >
                  {it.label}
                </p>
                <p
                  className="mt-1.5 font-serif"
                  style={{
                    color: C.espresso,
                    fontSize: 26,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    fontVariationSettings: displayFV(48, DISPLAY_WEIGHT_SOFT),
                  }}
                >
                  {fmtNum(it.value)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

function RetentionSection({ cohorts }: { cohorts: RetentionCohort[] }) {
  return (
    <section>
      <SectionHead kicker="Weekly cohorts" title="Retention" />
      <Card>
        {cohorts.length === 0 ? (
          <EmptyLine />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
                  <Th>Week</Th>
                  <Th right>Size</Th>
                  <Th right>D1</Th>
                  <Th right>D7</Th>
                  <Th right>D30</Th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr
                    key={c.cohort_week}
                    style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}
                  >
                    <Td strong>{c.cohort_week}</Td>
                    <Td right>{fmtNum(c.cohort_size)}</Td>
                    <Td right>{fmtNum(c.retained_d1)}</Td>
                    <Td right>{fmtNum(c.retained_d7)}</Td>
                    <Td right>{fmtNum(c.retained_d30)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}

function CertFunnelSection({ funnel }: { funnel: CertFunnelRow[] }) {
  return (
    <section>
      <SectionHead kicker="Enrolled → completed" title="Certificate funnel" />
      <Card>
        {funnel.length === 0 ? (
          <EmptyLine />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
                  <Th>Cert</Th>
                  <Th right>Enrolled</Th>
                  <Th right>Paid</Th>
                  <Th right>Completed</Th>
                  <Th right>Avg days</Th>
                </tr>
              </thead>
              <tbody>
                {funnel.map((f) => (
                  <tr
                    key={f.cert_id}
                    style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}
                  >
                    <Td strong>{f.cert_name}</Td>
                    <Td right>{fmtNum(f.enrolled)}</Td>
                    <Td right>{fmtNum(f.paid)}</Td>
                    <Td right>{fmtNum(f.completed)}</Td>
                    <Td right>{f.completed > 0 ? fmtDec(f.avg_days_to_complete) : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}

function TopEventsSection({ events }: { events: TopEvent[] }) {
  const max = events.reduce((m, e) => Math.max(m, e.event_count), 0);
  return (
    <section>
      <SectionHead kicker="Last 30 days" title="Top events" />
      <Card>
        {events.length === 0 ? (
          <EmptyLine />
        ) : (
          <ul className="space-y-2.5">
            {events.map((e) => (
              <li key={e.event_type}>
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className="text-sm truncate"
                    style={{ color: C.espresso, fontFamily: FONT_MONO }}
                  >
                    {e.event_type}
                  </span>
                  <span
                    className="text-xs tabular-nums flex-shrink-0"
                    style={{ color: C.umber, fontFamily: FONT_MONO }}
                  >
                    {fmtNum(e.event_count)}
                  </span>
                </div>
                <ProgressBar value={e.event_count} target={max} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

function ConfusionSection({ confusion }: { confusion: ConfusionRow[] }) {
  return (
    <section>
      <SectionHead kicker="Where learners struggle" title="Confusion map" />
      <Card>
        {confusion.length === 0 ? (
          <EmptyLine />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
                  <Th>Lesson</Th>
                  <Th>Module</Th>
                  <Th right>Interactions</Th>
                  <Th right>Avg iters</Th>
                </tr>
              </thead>
              <tbody>
                {confusion.map((c) => (
                  <tr
                    key={c.lesson_id}
                    style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}
                  >
                    <Td strong>{c.lesson_title}</Td>
                    <Td>{c.module_title}</Td>
                    <Td right>{fmtNum(c.interactions)}</Td>
                    <Td right>{fmtDec(c.avg_iterations)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs" style={{ color: C.inkSoft }}>
          Fills in once the in-app AI tutor ships.
        </p>
      </Card>
    </section>
  );
}
