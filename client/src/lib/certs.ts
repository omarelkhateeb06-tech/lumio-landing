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
import { fetchMasteredLessonIds } from "./gamification";

// ── Row shapes ───────────────────────────────────────────────────────────────--

export interface CapstoneSpec {
  description: string;
  min_words?: number;
}

// The word floor used when a cert's capstone_spec.min_words is null. Defined once
// so the submit page's gate and the overview's "aim for N words" line read the
// same number instead of the overview promising no count while the submit page
// silently demands 200 (Naval, Outsider, Contrarian MED-3, First Principles).
export const DEFAULT_MIN_WORDS = 200;

// Lesson length and delivery cadence, single-sourced so every surface tells the
// same truth. Lessons actually run 5 to 15 minutes, so no screen should claim a
// flat "five minutes each" while the lesson cards stamp "12 min" / "15 min"
// (First Principles HIGH-1). Delivery copy is likewise stated identically on the
// marketing page, dashboard, and verify page (First Principles LOW-1).
export const LESSON_TIME_COPY = "a few minutes each";
// The precise length range, single-sourced so the marketing spec strip ("Time:
// 5 to 15 minutes") can't drift from the prose elsewhere. The prose stays the
// softer "a few minutes each"; this is the exact figure for the one place that
// states a number (First Principles MED-1).
export const LESSON_TIME_RANGE = "5 to 15 minutes";
export const LESSON_1_DELIVERY_COPY = "the next workday";

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
  // The actual prompt/brief the learner used and the result they got back. The
  // rubric promises a reviewer will look for this (CAPSTONE_RUBRIC item 2), but
  // until now the form had no field to capture it, so the reviewer was judging a
  // paraphrase. Optional so it never becomes a needs-revision trap, but prompted
  // (First Principles H2, Contrarian H2). Optional for backward compatibility with
  // rows submitted before this field existed.
  prompt_and_result?: string;
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
  reviewer_notes: string | null;
}

// Derived, since user_certs has no status column and the client cannot write
// paid_at / completed_at.
export type CertStatus =
  | "not-started"
  | "in-progress"
  | "capstone-unlocked"
  | "submitted"
  | "needs-revision"
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

// Public, auth-free list of the published tracks (slug + name + industry), for
// the marketing home so a cold visitor can see their own field is covered and
// click straight to it, instead of reading four generic "how it works" steps
// (Expansionist MED-2). Reads only public-RLS columns; no per-user state.
export interface PublishedCert {
  slug: string;
  name: string;
  industry: string | null;
  price_cents: number;
}

export async function listPublishedCerts(): Promise<PublishedCert[]> {
  const { data, error } = await supabase
    .from("certs")
    .select("slug, name, industry, price_cents, base_cert_id, stripe_payment_link")
    .eq("is_published", true)
    .order("base_cert_id", { ascending: true, nullsFirst: true });
  if (error || !data) return [];
  return (data as Record<string, unknown>[])
    // Only surface tracks a visitor can actually buy. A track with no
    // stripe_payment_link dead-ends at "Checkout is not available yet" the moment
    // they finish the lessons, which destroys trust at the worst possible point.
    // Hide it from every public listing until it has a live link (Hormozi M2).
    .filter((r) => !!(r.stripe_payment_link as string | null))
    .map((r) => ({
      slug: r.slug as string,
      name: r.name as string,
      industry: (r.industry as string) ?? null,
      price_cents: (r.price_cents as number) ?? 0,
    }));
}

// The lowest published track price, in cents, or null if none are loaded. Lets
// the marketing page anchor "most tracks are $X, paid once" honestly from real
// data instead of hiding the price until the buy moment (Hormozi HIGH).
export function lowestCertPriceCents(certs: PublishedCert[]): number | null {
  const prices = certs.map((c) => c.price_cents).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
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
  // A lesson the learner tested out of via a mastery check is genuinely done, so
  // it must count toward cert progress. Without the mastered union, a learner who
  // skipped a cert's final lesson by passing a check would show completedCount <
  // total forever, the "ready to certify" callout would never fire, and the buy
  // moment would silently never surface for any test-out learner (Executor HIGH-2).
  const [{ data, error }, completed, mastered] = await Promise.all([
    supabase
      .from("cert_lessons")
      .select("position, is_required, lesson:lessons(id, slug, title, estimated_minutes)")
      .eq("cert_id", certId)
      .order("position", { ascending: true }),
    fetchCompletedLessonIds(),
    fetchMasteredLessonIds(),
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
        completed: completed.has(l.id) || mastered.has(l.id),
      } satisfies CertLessonItem;
    })
    .filter((x): x is CertLessonItem => x !== null);
}

export async function getUserCert(certId: string): Promise<UserCert | null> {
  // RLS scopes to the current user and a unique (user_id, cert_id) index means
  // one row at most, but .limit(1) keeps maybeSingle from erroring (and the
  // status silently falling back to "not-started") on any unexpected duplicate.
  const { data, error } = await supabase
    .from("user_certs")
    .select("id, cert_id, enrolled_at, paid_at, completed_at, verify_token")
    .eq("cert_id", certId)
    .order("enrolled_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as UserCert;
}

export async function getCapstoneSubmission(
  userCertId: string,
): Promise<CapstoneSubmission | null> {
  const { data, error } = await supabase
    .from("capstone_submissions")
    .select("id, user_cert_id, attempt_number, submission_content, status, submitted_at, reviewer_notes")
    // attempt_number first, then submitted_at, then id: a resubmission could
    // share an attempt_number with the prior row (no unique constraint on the
    // pair) and submitted_at can be null on a freshly inserted row (NULLs sort
    // first under desc), so the monotonic id is the final tiebreak that
    // guarantees we always read the newest attempt (Executor H2).
    .eq("user_cert_id", userCertId)
    .order("attempt_number", { ascending: false })
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false })
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
): Promise<{ ok: boolean; error?: string; submission?: CapstoneSubmission }> {
  // A revision is a new attempt: read the latest attempt and increment, so a
  // resubmission never silently shares attempt_number 1 with the rejected row
  // (which would make "latest attempt" ambiguous in the reviewer's queue).
  const prev = await getCapstoneSubmission(userCertId);
  const attempt_number = (prev?.attempt_number ?? 0) + 1;
  // Return the inserted row so the caller can reflect the true new state instead
  // of holding a stale prior submission after a resubmit (Executor HIGH).
  const { data, error } = await supabase
    .from("capstone_submissions")
    .insert({ user_cert_id: userCertId, submission_content: content, attempt_number })
    .select("id, user_cert_id, attempt_number, submission_content, status, submitted_at, reviewer_notes")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, submission: (data as CapstoneSubmission) ?? undefined };
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
// N is the number of published tracks (small), so the per-cert fan-out is fine.
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
  project_title?: string | null;
  awarded_at?: string;
  // True only when the lookup itself failed (network/RLS), as opposed to a token
  // that genuinely has no certificate. The Verify page must not show a real
  // holder a fraud-implying "not found" tombstone during a transient blip
  // (Executor HIGH-1).
  errored?: boolean;
}

// get_certificate is typed p_token uuid, so a hand-typed or truncated token that
// isn't a valid UUID makes PostgREST return a 400. That is a genuinely bogus
// link, not a server failure, so validate the shape first and treat a malformed
// token as a real miss ("not found") rather than the "Try again" error tombstone
// that would otherwise loop forever (Executor HIGH).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getCertificate(token: string): Promise<CertificateView> {
  // Trim once and use the trimmed value for BOTH the shape check and the RPC
  // call. Validating token.trim() but sending the raw token meant a link with
  // trailing whitespace passed the UUID guard, then hit PostgREST as a non-UUID
  // and 400'd into the "Try again" error tombstone forever (Executor L1).
  const clean = token.trim();
  if (!UUID_RE.test(clean)) return { found: false };
  const { data, error } = await supabase.rpc("get_certificate", { p_token: clean });
  // Distinguish a failed call from a real miss: an RPC error means we could not
  // load the record, not that the credential is fake.
  if (error) return { found: false, errored: true };
  if (!data) return { found: false };
  // Shape-guard before casting: if a future RPC change ever returns a scalar or an
  // unexpected shape, `view.found` would be undefined (falsy) and the page would
  // silently render "not found" with no error signal. Treat anything that isn't a
  // proper result object as a load error instead (Executor MED).
  if (typeof data !== "object" || Array.isArray(data) || !("found" in data)) {
    return { found: false, errored: true };
  }
  return data as CertificateView;
}

// ── Status derivation ────────────────────────────────────────────────────────--

// Order matters: a certified cert outranks an open submission, which outranks an
// unlocked-but-unsubmitted capstone, etc. completedCount comes from the caller's
// getCertLessonsWithCompletion result so the rule lives in one place.
// A submission a reviewer sent back: the learner must act (revise + resubmit),
// not keep waiting. One predicate so deriveCertStatus and the submit page's
// "locked" gate can never disagree about which states reopen the form (First
// Principles MED-1; this is also the reconciliation Executor H2 needs so the
// success screen never outranks a freshly refetched "sent back" submission).
export function isOpenForRevision(status: SubmissionStatus): boolean {
  return status === "needs_revision" || status === "rejected";
}

export function deriveCertStatus(
  userCert: UserCert | null,
  submission: CapstoneSubmission | null,
  completedCount: number,
): CertStatus {
  if (userCert?.completed_at) return "certified";
  if (submission) {
    // Collapsing these into "submitted" would tell a rejected learner "under
    // review" forever.
    if (isOpenForRevision(submission.status)) return "needs-revision";
    return "submitted";
  }
  if (userCert?.paid_at) return "capstone-unlocked";
  if (completedCount > 0 || userCert) return "in-progress";
  return "not-started";
}

// Percent of lessons complete, clamped and rounded. The formula was hand-written
// in four places (CertOverview, Dashboard x3) and could drift; single-sourced so
// every progress bar reads the same arithmetic (First Principles MED-2).
export function certProgressPct(done: number, total: number): number {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export const CERT_STATUS_LABEL: Record<CertStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  "capstone-unlocked": "Ready for your project",
  submitted: "Submitted",
  "needs-revision": "Almost there",
  certified: "Certified",
};

// Labels for the raw DB submission status, shown on the submit page. Kept here
// next to CERT_STATUS_LABEL (not redefined inside CertSubmit) so the two label
// sets for one review pipeline can't drift, and so "needs_revision" reads with
// the same gentle phrasing as the derived "needs-revision" pill (First
// Principles HIGH: the page-local table said "Let's take another pass" while the
// pill said "Almost there" for the identical state).
export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  // F2: "submitted" and "under_review" are one waiting state to the learner --
  // both mean "it's in, a human will read it." Showing two different words for
  // what feels like the same moment reads as a status change that didn't happen.
  // Both say "Submitted"; the reassurance copy carries the "a person is reading
  // it" nuance.
  under_review: "Submitted",
  approved: "Approved",
  needs_revision: "Almost there",
  rejected: "Almost there",
};

// One UTC-explicit date formatter for every cert-related date (submitted,
// awarded). The public Verify page previously formatted without timeZone:"UTC",
// so an awarded date could render one calendar day off from the submitted date
// shown elsewhere near midnight (First Principles MED-3). Single-sourced here.
export function formatCertDate(iso?: string | null): string {
  if (!iso) return "";
  // Guard against a malformed timestamp: new Date("garbage").toLocaleDateString()
  // returns "Invalid Date", which would render literally on the certificate and
  // the public verify page. Fall back to empty so the surrounding "Awarded {date}"
  // line simply omits the date rather than printing "Invalid Date" (Executor L2).
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { timeZone: "UTC" });
}

// ── Shared cert helpers ──────────────────────────────────────────────────────--

// The promised human-review window, and the point past which we switch to
// apologetic "still with our reviewer" copy. Named once so the prose window and
// the overdue threshold can never drift apart across the overview/submit pages
// (First Principles). OVERDUE is one business day past the promise.
export const REVIEW_SLA_BUSINESS_DAYS = 3;
export const REVIEW_OVERDUE_AFTER_BUSINESS_DAYS = 4;

// The single promise string for the review window. Every surface that tells a
// learner how long review takes reads this, so the number can never be typed by
// hand into one page and drift from REVIEW_SLA_BUSINESS_DAYS (First Principles
// H1: the constant existed but the prose "3 business days" was still hand-typed
// in four places).
export const REVIEW_WINDOW_COPY = `usually within ${REVIEW_SLA_BUSINESS_DAYS} business days`;

// The post-submission status message, single-sourced so the overview's
// "submitted" panel and the submit page's "locked" panel can never describe the
// same review state with two slightly different sentences (First Principles
// HIGH-1: the "approved, finalizing" copy was typed out near-identically in both
// files). The voice differs only by where the learner is standing, so that is
// the one parameter. The approved branch is identical for both voices.
export function reviewStatusMessage(
  status: SubmissionStatus,
  submittedAt: string | null | undefined,
  voice: "overview" | "submit",
): string {
  if (status === "approved") {
    return "Your final project was approved. Your certificate is being finalized and will appear here shortly.";
  }
  const overdue = businessDaysSince(submittedAt) >= REVIEW_OVERDUE_AFTER_BUSINESS_DAYS;
  if (overdue) {
    return "Your final project is still with our reviewer. Thanks for your patience, we have not forgotten it. Reach out any time for an update.";
  }
  return voice === "overview"
    ? `Your final project is under review. A real person reviews every project, ${REVIEW_WINDOW_COPY}.`
    : `You've already submitted your final project. Once it's approved, the certificate is yours. A real person reviews every project, ${REVIEW_WINDOW_COPY}.`;
}

// The capstone pass criteria, shown before paying (overview) and again while
// writing the submission. One definition so a learner is never told two
// different bars for the same human review (First Principles MED, Naval). There
// is no compiler check on duplicated string arrays, so this is the dedup that
// actually prevents a silent fairness drift.
export const CAPSTONE_RUBRIC: readonly string[] = [
  "You did a real task, not a hypothetical.",
  "You showed the prompt or brief you actually used and the result you got.",
  "You reflected on what worked and what you would change.",
];

// Price formatting lived in three files (Dashboard, CertOverview, CertSubmit).
// One definition so a learner never sees "$30" in one place and "$30.00" in
// another (First Principles, Executor).
export function dollars(cents: number): string {
  const v = cents / 100;
  return Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`;
}

// The single highest-value funnel state: every lesson done, only the paid human
// review left. The definition was copy-pasted in four places (CertWidget,
// certCta, CertifyCallout, CertOverview) and could silently drift. It now also
// requires a live payment link, so the dashboard never sends a learner to an
// overview that can't take payment yet (Executor H3).
export function isLessonsDoneUnpaid(card: CertDashboardCard): boolean {
  return (
    card.status === "in-progress" &&
    card.total > 0 &&
    card.completedCount === card.total &&
    !!card.cert.stripe_payment_link
  );
}

// Whole business days elapsed since an ISO timestamp, counting by calendar date
// (not 24h offsets). A submission at 11pm Monday and one at 1am Tuesday should
// not differ by a day's worth of "overdue" tone. Used only to soften review-wait
// copy after the promised window, so date-only is the honest unit. Computed in
// UTC for both endpoints so the count is stable regardless of the viewer's
// timezone (Contrarian H2). Returns 0 for missing/invalid input (safe default:
// on-time copy).
export function businessDaysSince(iso: string | null | undefined): number {
  if (!iso) return 0;
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return 0;
  // Strip time in UTC so day boundaries, not time-of-day or local offset, drive
  // the count.
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let count = 0;
  while (cursor < end) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}
