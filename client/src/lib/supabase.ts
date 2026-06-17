import { createClient } from "@supabase/supabase-js";
import type { LessonBlock, LessonLevel } from "./curriculum";
import { buildPathV1, type RecLesson } from "./recommend";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev so we don't ship a silent no-op to production.
  // eslint-disable-next-line no-console
  console.error(
    "[Lumio] Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Get the real waitlist signup count. Used to power live subscriber displays
 * with actual data instead of a fake-ticking timer. Returns null on failure so
 * callers can choose to either hide the counter or fall back to a baseline.
 */
export async function fetchWaitlistCount(): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from("waitlist_signups")
      .select("*", { count: "exact", head: true });
    if (error || count == null) return null;
    return count;
  } catch {
    return null;
  }
}

/**
 * Insert an email into the waitlist_signups table.
 * Returns { ok: true } on success or { ok: false, error } on failure.
 * The table must exist with RLS allowing anonymous inserts (see supabase/migrations/).
 */
export async function captureEmail(email: string, source = "landing_hero") {
  try {
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email, source });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "unknown" };
  }
}

/**
 * Call the prompt-runner Edge Function. Returns the Lumio-improved version of a prompt.
 * The Edge Function lives at /functions/v1/prompt-runner on the same Supabase project
 * and holds the GROQ_API_KEY as a server-side secret.
 */
export interface PromptRunnerResponse {
  improved_prompt: string;
  why_better: string;
}

export async function runPromptRunner(
  userPrompt: string
): Promise<{ ok: true; data: PromptRunnerResponse } | { ok: false; error: string }> {
  if (!supabaseUrl) return { ok: false, error: "Supabase not configured" };
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/prompt-runner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || `HTTP ${res.status}` };
    }
    const data = (await res.json()) as PromptRunnerResponse;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum — published modules + lessons, fetched from the DB.
// Lessons are identified by slug in the URL and by UUID in storage. The whole
// published curriculum is small enough to fetch in one call; callers derive
// module grouping, global ordering, and prev/next from this shape.
// ─────────────────────────────────────────────────────────────────────────────

export interface CurriculumLesson {
  id: string; // uuid
  slug: string;
  title: string;
  hook: string | null;
  key_takeaway: string | null;
  level: LessonLevel;
  estimated_minutes: number;
  order_index: number;
  module_slug: string;
  module_title: string;
  module_order: number;
  /** The lesson's industry tag slug (tags.kind = 'industry'), or null. Drives the
   *  industry grouping of the Industry Deep Dives module on the dashboard. */
  industry: string | null;
}

export interface CurriculumModule {
  slug: string;
  title: string;
  order_index: number;
}

export interface Curriculum {
  modules: CurriculumModule[]; // ordered, only modules that have published lessons
  lessons: CurriculumLesson[]; // globally ordered: module order, then lesson order
}

interface LessonJoinRow {
  id: string;
  slug: string;
  title: string;
  hook: string | null;
  key_takeaway: string | null;
  level: LessonLevel;
  estimated_minutes: number;
  order_index: number;
  module: { slug: string; title: string; order_index: number } | { slug: string; title: string; order_index: number }[] | null;
  lesson_tags: { tags: { slug: string; kind: string } | { slug: string; kind: string }[] | null }[] | null;
}

function normalizeModule(m: LessonJoinRow["module"]) {
  return Array.isArray(m) ? m[0] : m;
}

/** Pull the first industry-kind tag slug off a joined lesson row, or null. */
function industryFromTags(lessonTags: LessonJoinRow["lesson_tags"]): string | null {
  for (const lt of lessonTags ?? []) {
    const tag = Array.isArray(lt.tags) ? lt.tags[0] : lt.tags;
    if (tag && tag.kind === "industry") return tag.slug;
  }
  return null;
}

export async function fetchCurriculum(): Promise<Curriculum> {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, hook, key_takeaway, level, estimated_minutes, order_index, module:modules!inner(slug, title, order_index), lesson_tags(tags(slug, kind))"
    )
    .eq("status", "published");

  if (error || !data) return { modules: [], lessons: [] };

  const lessons: CurriculumLesson[] = (data as unknown as LessonJoinRow[])
    .map((row) => {
      const mod = normalizeModule(row.module);
      if (!mod) return null;
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        hook: row.hook,
        key_takeaway: row.key_takeaway,
        level: row.level,
        estimated_minutes: row.estimated_minutes,
        order_index: row.order_index,
        module_slug: mod.slug,
        module_title: mod.title,
        module_order: mod.order_index,
        industry: industryFromTags(row.lesson_tags),
      } satisfies CurriculumLesson;
    })
    .filter((l): l is CurriculumLesson => l !== null)
    .sort((a, b) => a.module_order - b.module_order || a.order_index - b.order_index);

  const modules: CurriculumModule[] = [];
  const seen = new Set<string>();
  for (const l of lessons) {
    if (seen.has(l.module_slug)) continue;
    seen.add(l.module_slug);
    modules.push({ slug: l.module_slug, title: l.module_title, order_index: l.module_order });
  }

  return { modules, lessons };
}

// A single lesson with its module joined and ordered blocks attached — the shape
// the lesson reader consumes.
export interface LessonReaderData {
  id: string;
  slug: string;
  title: string;
  hook: string | null;
  key_takeaway: string | null;
  level: LessonLevel;
  estimated_minutes: number;
  module_title: string;
  blocks: LessonBlock[];
}

export async function fetchLessonBySlug(slug: string): Promise<LessonReaderData | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, hook, key_takeaway, level, estimated_minutes, " +
        "module:modules!inner(title), " +
        "blocks:lesson_blocks(id, lesson_id, order_index, type, content, personalizable)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as {
    id: string;
    slug: string;
    title: string;
    hook: string | null;
    key_takeaway: string | null;
    level: LessonLevel;
    estimated_minutes: number;
    module: { title: string } | { title: string }[] | null;
    blocks: LessonBlock[] | null;
  };

  const mod = Array.isArray(row.module) ? row.module[0] : row.module;
  const blocks = (row.blocks ?? []).slice().sort((a, b) => a.order_index - b.order_index);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    hook: row.hook,
    key_takeaway: row.key_takeaway,
    level: row.level,
    estimated_minutes: row.estimated_minutes,
    module_title: mod?.title ?? "",
    blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Lesson progress — authenticated users only. Keyed by lesson UUID.
// ─────────────────────────────────────────────────────────────────────────────

export async function markLessonComplete(
  lessonId: string
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function unmarkLessonComplete(
  lessonId: string
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const { error } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Fire a lifecycle event to Loops via the loops-track-event Edge Function.
// Best-effort and fire-and-forget: any failure is swallowed so it can never
// block the learning UX. The Edge Function enforces the event-name allowlist and
// resolves the caller's email server-side, so this only forwards the name.
export async function trackLoopsEvent(eventName: string): Promise<void> {
  try {
    await supabase.functions.invoke("loops-track-event", { body: { eventName } });
  } catch {
    // ignore — email automation is best-effort
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Booster queue — spaced review. On a lesson's FIRST completion the client
// enqueues one booster scheduled a few days out; a scheduled Edge Function later
// fires the 'booster_ready' Loops email, and the learner completes a short
// review in-app (which stamps completed_at). RLS pins every row to its owner.
// ─────────────────────────────────────────────────────────────────────────────

// Days between finishing a lesson and its booster becoming due. Reviewing right
// before the forgetting curve bites is what makes it stick.
const BOOSTER_DELAY_DAYS = 4;

export interface PendingBooster {
  lesson_slug: string;
  lesson_title: string;
}

// Enqueue a booster for a freshly completed lesson. Idempotent: if a booster for
// this lesson already exists for the user (pending or done), it inserts nothing,
// so re-completing a lesson (e.g. after an Undo) never stacks duplicates.
// Best-effort — callers fire-and-forget; a failure must never block completion.
export async function queueBooster(
  lessonSlug: string,
  lessonTitle: string,
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Skip if this lesson already has a booster row for the user.
  const { data: existing } = await supabase
    .from("booster_queue")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_slug", lessonSlug)
    .limit(1)
    .maybeSingle();
  if (existing) return { ok: true };

  const scheduledFor = new Date(
    Date.now() + BOOSTER_DELAY_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { error } = await supabase.from("booster_queue").insert({
    user_id: user.id,
    lesson_slug: lessonSlug,
    lesson_title: lessonTitle,
    scheduled_for: scheduledFor,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Boosters that are due now and not yet completed, soonest first. Drives the
// dashboard "ready to review" card. Empty array when none (or signed out).
export async function fetchPendingBoosters(): Promise<PendingBooster[]> {
  const { data, error } = await supabase
    .from("booster_queue")
    .select("lesson_slug, lesson_title")
    .is("completed_at", null)
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true });
  if (error || !data) return [];
  return data as PendingBooster[];
}

// Mark the learner's most recent pending booster for a lesson as complete. Scoped
// to the caller's own rows by RLS; updates the newest open one only.
export async function completeBooster(
  lessonSlug: string,
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const { data: row } = await supabase
    .from("booster_queue")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_slug", lessonSlug)
    .is("completed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!row) return { ok: true }; // nothing pending — treat as a no-op success
  const { error } = await supabase
    .from("booster_queue")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", (row as { id: string }).id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Returns the set of completed lesson UUIDs for the current user.
export async function fetchCompletedLessonIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("completed", true);
  if (error || !data) return new Set();
  return new Set((data as { lesson_id: string }[]).map((r) => r.lesson_id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Block-level progress — interactive blocks (Phase 3). Keyed by block UUID, a
// finer grain than user_progress: it records per-block status, the learner's
// response payload, and a running attempt count. RLS allows own-row select /
// insert / update only (no delete). Lesson-level completion is unaffected.
// ─────────────────────────────────────────────────────────────────────────────

export type BlockStatus = "viewed" | "attempted" | "passed" | "completed";

// Record that the learner has seen an interactive block. ignoreDuplicates makes
// this insert-only, so it can never downgrade a block that's already
// attempted / passed / completed back to "viewed". Best-effort and silent: a
// signed-out reader (none today, but defensive) is a no-op rather than an error.
export async function markBlockViewed(blockId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("user_block_progress")
    .upsert(
      { user_id: user.id, block_id: blockId, status: "viewed" },
      { onConflict: "user_id,block_id", ignoreDuplicates: true }
    );
}

// Persist the learner's interaction with a block: its status, the response
// payload, and the running attempt count (the component owns the canonical
// count). completed_at is stamped once the block reaches a terminal state
// (passed or completed). Mirrors markLessonComplete's auth + return style.
export async function saveBlockProgress(
  blockId: string,
  opts: { status: BlockStatus; response?: unknown; attempts: number }
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const terminal = opts.status === "passed" || opts.status === "completed";
  const { error } = await supabase.from("user_block_progress").upsert(
    {
      user_id: user.id,
      block_id: blockId,
      status: opts.status,
      response: opts.response ?? null,
      attempts: opts.attempts,
      completed_at: terminal ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,block_id" }
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI tutor consent — a single boolean on the profiles row (ai_tutor_consent).
// Gates whether the ask-tutor Edge Function logs the learner's raw query text.
// The client uses these to drive a one-time inline notice in the try_it_live
// block. Best-effort and own-row scoped via RLS, mirroring the helpers above.
// ─────────────────────────────────────────────────────────────────────────────

// Whether the current user has opted in to AI tutor query logging. Defaults to
// false on no session, no profile row, or any read failure.
export async function fetchAiTutorConsent(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("ai_tutor_consent")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return false;
  return (data as { ai_tutor_consent: boolean | null }).ai_tutor_consent === true;
}

// Record the current user's opt-in to AI tutor query logging. Best-effort: a
// signed-out caller or write failure is a no-op (the notice still dismisses
// client-side; the Edge Function simply keeps not logging until this lands).
export async function setAiTutorConsent(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("profiles")
    .update({ ai_tutor_consent: true })
    .eq("id", user.id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding — one profiles row per user. The quiz captures the personalization
// signals the recommendation engine consumes (skill level + industry + goal +
// usage). onboarding_completed_at is the gate flag: null/no-row means the user
// has not finished the quiz and should be routed to it on first login.
// ─────────────────────────────────────────────────────────────────────────────

export type SkillLevel = "beginner" | "some_experience" | "confident";
export type AiUsage = "not_at_all" | "occasionally" | "regularly";
export type OnboardingGoal = "save_time" | "stay_relevant" | "impress_team" | "other";

export interface OnboardingAnswers {
  skill_level: SkillLevel;
  industry: string; // a tags.slug where kind = 'industry'
  ai_usage: AiUsage;
  goal: OnboardingGoal;
  goal_other?: string;
  job_role?: string;
  // Identity-capture signals (all optional / skippable in the quiz).
  company_name?: string;
  company_size?: string; // '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  years_experience?: string; // '0-2' | '3-7' | '8-15' | '15+'
  found_via?: string; // 'youtube' | 'linkedin' | 'reddit' | 'twitter' | 'search' | 'friend' | 'referral' | 'other'
  // Affirmative opt-in to data use. Only true stamps a consent record.
  data_consent?: boolean;
}

// Generate a short, URL-safe referral code (e.g. "lum-7f3a9c2e") from the
// platform CSPRNG. Lowercase alphanumeric so it's easy to read aloud and share.
function generateReferralCode(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `lum-${code}`;
}

// Current consent copy version. Bump when the consent language materially
// changes so each stamp records which wording the user actually agreed to.
const DATA_CONSENT_VERSION = "v1";

// Whether the current user has finished onboarding. Returns false when there's
// no session, no profile row, or onboarding_completed_at is null — all of which
// mean "send them to the quiz."
export async function fetchOnboardingComplete(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return false;
  return data.onboarding_completed_at != null;
}

// Upsert the quiz answers onto the user's profile row and stamp completion.
// goal_other is only persisted when goal is "other"; job_role is optional.
// Also captures the identity signals (company, size, experience, found_via),
// resolves referral attribution from localStorage, mints the user's own referral
// code on first onboarding, and — only on affirmative opt-in — stamps consent.
export async function saveOnboarding(
  answers: OnboardingAnswers
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Mint a referral code the first time only — never overwrite an existing one,
  // so a user's shareable code stays stable across re-onboarding.
  const { data: existing } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .maybeSingle();
  const referralCode =
    (existing as { referral_code: string | null } | null)?.referral_code ?? generateReferralCode();

  // The code that referred this user, dropped on /signup before the magic-link
  // round-trip. Read defensively (no window during SSR / tests).
  const referredByCode =
    typeof window !== "undefined" ? window.localStorage.getItem("lumio_ref") : null;

  const row: Record<string, unknown> = {
    id: user.id,
    skill_level: answers.skill_level,
    industry: answers.industry,
    ai_usage: answers.ai_usage,
    goal: answers.goal,
    goal_other: answers.goal === "other" ? answers.goal_other?.trim() || null : null,
    job_role: answers.job_role?.trim() || null,
    company_name: answers.company_name?.trim() || null,
    company_size: answers.company_size ?? null,
    years_experience: answers.years_experience ?? null,
    found_via: answers.found_via ?? null,
    referral_code: referralCode,
    referred_by_code: referredByCode || null,
    onboarding_completed_at: new Date().toISOString(),
  };

  // Stamp consent only on affirmative opt-in. An unchecked box simply leaves no
  // consent record — we never write a "declined" state, just absence.
  if (answers.data_consent === true) {
    row.data_consent_at = new Date().toISOString();
    row.data_consent_version = DATA_CONSENT_VERSION;
  }

  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation engine (rules_v1) — fetch the tag-aware lesson set, build a
// personalized path with the pure engine in recommend.ts, and persist it to
// user_paths + user_path_items. Reads come back as an ordered list of lesson
// UUIDs that the Dashboard maps onto the curriculum.
// ─────────────────────────────────────────────────────────────────────────────

interface RecLessonJoinRow {
  id: string;
  slug: string;
  level: LessonLevel;
  order_index: number;
  module: { slug: string; order_index: number } | { slug: string; order_index: number }[] | null;
  lesson_tags: { tags: { slug: string } | { slug: string }[] | null }[] | null;
}

// Published lessons with module + tag slugs attached — the shape rules_v1 needs.
export async function fetchRecommenderLessons(): Promise<RecLesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, level, order_index, module:modules!inner(slug, order_index), lesson_tags(tags(slug))"
    )
    .eq("status", "published");

  if (error || !data) return [];

  return (data as unknown as RecLessonJoinRow[])
    .map((row) => {
      const mod = Array.isArray(row.module) ? row.module[0] : row.module;
      if (!mod) return null;
      const tags = (row.lesson_tags ?? [])
        .map((lt) => (Array.isArray(lt.tags) ? lt.tags[0]?.slug : lt.tags?.slug))
        .filter((s): s is string => Boolean(s));
      return {
        id: row.id,
        slug: row.slug,
        level: row.level,
        module_slug: mod.slug,
        module_order: mod.order_index,
        order_index: row.order_index,
        tags,
      } satisfies RecLesson;
    })
    .filter((l): l is RecLesson => l !== null);
}

// Generate a fresh path for the current user and persist it. Deactivates any
// previous active path first, then inserts a new user_paths row and its ordered
// items. Best-effort: callers can ignore failures (the Dashboard falls back to
// the natural curriculum order when no path exists).
export async function generateUserPath(): Promise<{ ok: boolean; pathId?: string; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("skill_level, industry, goal")
    .eq("id", user.id)
    .maybeSingle();
  if (pErr || !profile || !profile.skill_level || !profile.goal) {
    return { ok: false, error: pErr?.message ?? "Profile incomplete" };
  }

  const [lessons, completed] = await Promise.all([
    fetchRecommenderLessons(),
    fetchCompletedLessonIds(),
  ]);
  // `mastered` is the seam for future mastery checks — empty under rules_v1.
  const mastered = new Set<string>();
  const exclude = new Set<string>(completed);
  mastered.forEach((id) => exclude.add(id));

  const path = buildPathV1({
    profile: {
      skill_level: profile.skill_level,
      industry: profile.industry ?? "general",
      goal: profile.goal,
    },
    lessons,
    exclude,
  });

  // Deactivate prior active paths so there's a single source of truth.
  await supabase
    .from("user_paths")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { data: newPath, error: insErr } = await supabase
    .from("user_paths")
    .insert({ user_id: user.id, generator_version: "rules_v1", is_active: true })
    .select("id")
    .single();
  if (insErr || !newPath) return { ok: false, error: insErr?.message ?? "Path insert failed" };

  if (path.active.length > 0) {
    const items = path.active.map((lesson_id, i) => ({
      path_id: newPath.id,
      lesson_id,
      position: i,
    }));
    const { error: itemErr } = await supabase.from("user_path_items").insert(items);
    if (itemErr) return { ok: false, error: itemErr.message };
  }

  return { ok: true, pathId: newPath.id };
}

// The current user's industry tag slug (profiles.industry), or null. Used by the
// dashboard to surface the learner's own field first in the Industry Deep Dives
// section. "general" is treated as no specific industry by the consuming UI.
export async function fetchUserIndustry(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("industry")
    .eq("id", user.id)
    .maybeSingle();
  return (data as { industry: string | null } | null)?.industry ?? null;
}

// A small, read-only summary of the current user's profile for the profile page.
export interface ProfileSummary {
  industry: string | null;
  job_role: string | null;
  skill_level: SkillLevel | null;
  goal: OnboardingGoal | null;
  goal_other: string | null;
}

export async function fetchProfileSummary(): Promise<ProfileSummary | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("industry, job_role, skill_level, goal, goal_other")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;
  const p = data as {
    industry: string | null;
    job_role: string | null;
    skill_level: SkillLevel | null;
    goal: OnboardingGoal | null;
    goal_other: string | null;
  };
  return {
    industry: p.industry,
    job_role: p.job_role,
    skill_level: p.skill_level,
    goal: p.goal,
    goal_other: p.goal_other,
  };
}

// The current user's active path as an ordered list of lesson UUIDs. Empty when
// the user has no active path yet (e.g. onboarded before rules_v1 shipped).
export async function fetchActivePath(): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: paths } = await supabase
    .from("user_paths")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("generated_at", { ascending: false })
    .limit(1);
  const pathId = paths?.[0]?.id;
  if (!pathId) return [];

  const { data: items } = await supabase
    .from("user_path_items")
    .select("lesson_id, position")
    .eq("path_id", pathId)
    .order("position", { ascending: true });

  return (items ?? []).map((r) => (r as { lesson_id: string }).lesson_id);
}
