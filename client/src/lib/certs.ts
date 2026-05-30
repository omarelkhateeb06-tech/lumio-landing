// ─────────────────────────────────────────────────────────────────────────────
// Certification data layer — certs, the lessons they require, a learner's
// enrollment / payment / completion state, and the capstone submission.
//
// RLS shape this mirrors (see 20260529150000_cert_flow.sql + base schema):
//   certs / cert_lessons   public SELECT when the cert is_published
//   user_certs             own-row SELECT; INSERT self only (paid_at /
//                          completed_at must be null) — enrollment only. paid_at
//                          and completed_at are set out of band by an admin.
//   capstone_submissions   own-row SELECT; INSERT only when the parent
//                          user_certs.paid_at is set (the DB payment gate).
//   public.get_certificate SECURITY DEFINER RPC for the logged-out verify page.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "./supabase";
import { fetchCompletedLessonIds } from "./supabase";

// ── Row shapes ───────────────────────────────────────────────────────────────--

export interface CapstoneSpec {
  description: string;
  min_words?: number;
}

export interface Cert {
  id: string;
  slug: string;
  name: string;
  level: string | null;
  industry: string | null;
  description: string | null;
  price_cents: number;
  outcomes: string[];
  capstone_spec: CapstoneSpec;
  stripe_payment_link: string | null;
  base_cert_id: string | null;
  is_published: boolean;
}

export interface CertLessonItem {
  lesson_id: string;
  slug: string;
  title: string;
  estimated_minutes: number;
  position: number;
  is_required: boolean;
  completed: boolean;
}

export interface UserCert {
  id: string;
  cert_id: string;
  enrolled_at: string;
  paid_at: string | null;
  completed_at: string | null;
  verify_token: string;
}

// Status values allowed by capstone_submissions_status_check.
export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "needs_revision"
  | "rejected";

export interface CapstoneSubmissionContent {
  title: string;
  description: string;
  ai_tools: string;
  improvements: string;
  attestation: boolean;
}

export interface CapstoneSubmission {
  id: string;
  user_cert_id: string;
  attempt_number: number;
  submission_content: CapstoneSubmissionContent;
  status: SubmissionStatus;
  submitted_at: string;
}

// Derived, since user_certs has no status column and the client cannot write
// paid_at / completed_at.
export type CertStatus =
  | "not-started"
  | "in-progress"
  | "capstone-unlocked"
  | "submitted"
  | "certified";

// ── Reads ────────────────────────────────────────────────────────────────────--

function toStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function toCapstoneSpec(v: unknown): CapstoneSpec {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return {
      description: typeof o.description === "string" ? o.description : "",
      min_words: typeof o.min_words === "number" ? o.min_words : undefined,
    };
  }
  return { description: "" };
}

export async function getCertBySlug(slug: string): Promise<Cert | null> {
  const { data, error } = await supabase
    .from("certs")
    .select(
      "id, slug, name, level, industry, description, price_cents, outcomes, capstone_spec, stripe_payment_link, base_cert_id, is_published",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as Record<string, unknown>;
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    level: (r.level as string) ?? null,
    industry: (r.industry as string) ?? null,
    description: (r.description as string) ?? null,
    price_cents: r.price_cents as number,
    outcomes: toStringArray(r.outcomes),
    capstone_spec: toCapstoneSpec(r.capstone_spec),
    stripe_payment_link: (r.stripe_payment_link as string) ?? null,
    base_cert_id: (r.base_cert_id as string) ?? null,
    is_published: r.is_published as boolean,
  };
}

interface CertLessonJoinRow {
  position: number;
  is_required: boolean;
  lesson:
    | { id: string; slug: string; title: string; estimated_minutes: number }
    | { id: string; slug: string; title: string; estimated_minutes: number }[]
    | null;
}

// The cert's required lessons in order, each flagged with the current user's
// completion. Reads completed lesson ids in parallel so one network round trip
// covers progress.
export async function getCertLessonsWithCompletion(
  certId: string,
): Promise<CertLessonItem[]> {
  const [{ data, error }, completed] = await Promise.all([
    supabase
      .from("cert_lessons")
      .select("position, is_required, lesson:lessons(id, slug, title, estimated_minutes)")
      .eq("cert_id", certId)
      .order("position", { ascending: true }),
    fetchCompletedLessonIds(),
  ]);
  if (error || !data) return [];
  return (data as unknown as CertLessonJoinRow[])
    .map((row) => {
      const l = Array.isArray(row.lesson) ? row.lesson[0] : row.lesson;
      if (!l) return null;
      return {
        lesson_id: l.id,
        slug: l.slug,
        title: l.title,
        estimated_minutes: l.estimated_minutes,
        position: row.position,
        is_required: row.is_required,
        completed: completed.has(l.id),
      } satisfies CertLessonItem;
    })
    .filter((x): x is CertLessonItem => x !== null);
}

export async function getUserCert(certId: string): Promise<UserCert | null> {
  const { data, error } = await supabase
    .from("user_certs")
    .select("id, cert_id, enrolled_at, paid_at, completed_at, verify_token")
    .eq("cert_id", certId)
    .maybeSingle();
  if (error || !data) return null;
  return data as UserCert;
}

export async function getCapstoneSubmission(
  userCertId: string,
): Promise<CapstoneSubmission | null> {
  const { data, error } = await supabase
    .from("capstone_submissions")
    .select("id, user_cert_id, attempt_number, submission_content, status, submitted_at")
    .eq("user_cert_id", userCertId)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as CapstoneSubmission;
}

// ── Writes ───────────────────────────────────────────────────────────────────--

// Idempotent enrollment: creates the user_certs row if the learner has none.
// The unique (user_id, cert_id) index makes a re-run a no-op via ignoreDuplicates.
// Never touches paid_at / completed_at (RLS forbids it and admins own those).
export async function enrollInCert(
  certId: string,
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const { error } = await supabase
    .from("user_certs")
    .upsert(
      { user_id: user.id, cert_id: certId },
      { onConflict: "user_id,cert_id", ignoreDuplicates: true },
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Insert a capstone submission. The DB enforces the payment gate (the INSERT
// policy requires the parent user_certs.paid_at to be set), so a learner who has
// not paid is rejected at the database, not just the UI.
export async function submitCapstone(
  userCertId: string,
  content: CapstoneSubmissionContent,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("capstone_submissions")
    .insert({ user_cert_id: userCertId, submission_content: content });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Dashboard summary ────────────────────────────────────────────────────────--

export interface CertDashboardCard {
  cert: Cert;
  total: number;
  completedCount: number;
  nextLessonSlug: string | null;
  userCert: UserCert | null;
  status: CertStatus;
}

// One card per published cert with the current user's progress + derived status.
// Small N (two certs in v1), so the per-cert fan-out is acceptable.
export async function fetchDashboardCerts(): Promise<CertDashboardCard[]> {
  const { data, error } = await supabase
    .from("certs")
    .select(
      "id, slug, name, level, industry, description, price_cents, outcomes, capstone_spec, stripe_payment_link, base_cert_id, is_published",
    )
    .eq("is_published", true)
    .order("base_cert_id", { ascending: true, nullsFirst: true });
  if (error || !data) return [];

  const certs = (data as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    level: (r.level as string) ?? null,
    industry: (r.industry as string) ?? null,
    description: (r.description as string) ?? null,
    price_cents: r.price_cents as number,
    outcomes: toStringArray(r.outcomes),
    capstone_spec: toCapstoneSpec(r.capstone_spec),
    stripe_payment_link: (r.stripe_payment_link as string) ?? null,
    base_cert_id: (r.base_cert_id as string) ?? null,
    is_published: r.is_published as boolean,
  } satisfies Cert));

  return Promise.all(
    certs.map(async (cert) => {
      const [lessons, userCert] = await Promise.all([
        getCertLessonsWithCompletion(cert.id),
        getUserCert(cert.id),
      ]);
      const submission = userCert ? await getCapstoneSubmission(userCert.id) : null;
      const total = lessons.length;
      const completedCount = lessons.filter((l) => l.completed).length;
      const nextLesson = lessons.find((l) => !l.completed) ?? null;
      return {
        cert,
        total,
        completedCount,
        nextLessonSlug: nextLesson?.slug ?? null,
        userCert,
        status: deriveCertStatus(userCert, submission, completedCount),
      } satisfies CertDashboardCard;
    }),
  );
}

// ── Public verification (logged-out) ─────────────────────────────────────────--

export interface CertificateView {
  found: boolean;
  anonymous?: boolean;
  holder_name?: string | null;
  cert_title?: string;
  cert_slug?: string;
  awarded_at?: string;
}

export async function getCertificate(token: string): Promise<CertificateView> {
  const { data, error } = await supabase.rpc("get_certificate", { p_token: token });
  if (error || !data) return { found: false };
  return data as CertificateView;
}

// ── Status derivation ────────────────────────────────────────────────────────--

// Order matters: a certified cert outranks an open submission, which outranks an
// unlocked-but-unsubmitted capstone, etc. completedCount comes from the caller's
// getCertLessonsWithCompletion result so the rule lives in one place.
export function deriveCertStatus(
  userCert: UserCert | null,
  submission: CapstoneSubmission | null,
  completedCount: number,
): CertStatus {
  if (userCert?.completed_at) return "certified";
  if (submission) return "submitted";
  if (userCert?.paid_at) return "capstone-unlocked";
  if (completedCount > 0 || userCert) return "in-progress";
  return "not-started";
}

export const CERT_STATUS_LABEL: Record<CertStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  "capstone-unlocked": "Capstone unlocked",
  submitted: "Submitted",
  certified: "Certified",
};
