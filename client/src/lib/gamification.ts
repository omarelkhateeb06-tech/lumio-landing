// ─────────────────────────────────────────────────────────────────────────────
// Gamification data layer — mastery checks, points, streaks, badges.
// Mirrors the Phase B/C schema (20260529120000_gamification_schema.sql).
//
// Integrity note: every value-bearing write goes through a SECURITY DEFINER RPC
// (submit_mastery_check, record_activity). The client never inserts points,
// mastery, or badge rows directly; it only reads its own rows and calls RPCs.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "./supabase";
import type { LessonLevel } from "./curriculum";

// ── Public (answer-key-stripped) question shapes returned by get_mastery_check ──

export interface CheckMcqOption {
  id: string;
  label: string;
}
export interface CheckMcqContent {
  stem: string;
  options: CheckMcqOption[];
}
export interface CheckFillBlankContent {
  template: string;
  blanks: { id: string }[];
}

export type CheckQuestion =
  | { id: string; type: "multiple_choice"; content: CheckMcqContent }
  | { id: string; type: "fill_blank"; content: CheckFillBlankContent };

export interface MasteryCheckPayload {
  check: {
    id: string;
    slug: string;
    scope: "lesson" | "module" | "level";
    title: string;
    description: string | null;
    pass_threshold: number;
    question_count: number;
  };
  questions: CheckQuestion[];
  status: {
    already_passed: boolean;
    attempts: number;
    locked_until: string | null;
  };
}

// A response value: an option id (multiple_choice) or a map of blank id to text
// (fill_blank). Keyed by question id.
export type CheckResponse = string | Record<string, string>;
export type CheckResponses = Record<string, CheckResponse>;

export interface SubmitResult {
  passed: boolean;
  already_passed: boolean;
  score: number;
  correct: number;
  total: number;
  lessons_cleared: number;
  points_awarded: number;
  badges_unlocked: string[];
  locked?: boolean;
  locked_until?: string;
}

// ── Catalog rows ────────────────────────────────────────────────────────────--

export interface MasteryCheckSummary {
  id: string;
  slug: string;
  scope: "lesson" | "module" | "level";
  level: LessonLevel | null;
  title: string;
  description: string | null;
  question_count: number;
  module_slug: string | null;
}

export interface BadgeDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | null;
  sort_order: number;
}

export interface UserStats {
  total_points: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date: string | null;
}

// ── Reads ────────────────────────────────────────────────────────────────────--

export async function fetchUserStats(): Promise<UserStats> {
  const empty: UserStats = {
    total_points: 0,
    current_streak_days: 0,
    longest_streak_days: 0,
    last_activity_date: null,
  };
  const { data, error } = await supabase
    .from("user_stats")
    .select("total_points, current_streak_days, longest_streak_days, last_activity_date")
    .maybeSingle();
  if (error || !data) return empty;
  return data as UserStats;
}

export async function fetchBadgeDefinitions(): Promise<BadgeDefinition[]> {
  const { data, error } = await supabase
    .from("badge_definitions")
    .select("id, slug, name, description, icon, tier, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as BadgeDefinition[];
}

// Set of badge ids the current user has earned.
export async function fetchEarnedBadgeIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from("user_badges").select("badge_id");
  if (error || !data) return new Set();
  return new Set((data as { badge_id: string }[]).map((r) => r.badge_id));
}

// All published checks, with module slug joined so the dashboard can map a check
// to the module / level card it belongs on.
export async function fetchMasteryChecks(): Promise<MasteryCheckSummary[]> {
  const { data, error } = await supabase
    .from("mastery_checks")
    .select("id, slug, scope, level, title, description, question_count, module:modules(slug)")
    .eq("status", "published");
  if (error || !data) return [];
  return (data as unknown as Array<{
    id: string;
    slug: string;
    scope: "lesson" | "module" | "level";
    level: LessonLevel | null;
    title: string;
    description: string | null;
    question_count: number;
    module: { slug: string } | { slug: string }[] | null;
  }>).map((r) => {
    const mod = Array.isArray(r.module) ? r.module[0] : r.module;
    return {
      id: r.id,
      slug: r.slug,
      scope: r.scope,
      level: r.level,
      title: r.title,
      description: r.description,
      question_count: r.question_count,
      module_slug: mod?.slug ?? null,
    };
  });
}

// The flat set of lesson ids the user has mastered (lesson / module / level
// mastery expanded server-side by the rules_v1 resolver). Unioned with completed
// lessons, this is what drops content out of the active path.
export async function fetchMasteredLessonIds(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data, error } = await supabase.rpc("user_mastered_lessons", { p_user: user.id });
  if (error || !data) return new Set();
  return new Set((data as { lesson_id: string }[]).map((r) => r.lesson_id));
}

// ── Check flow (RPCs) ──────────────────────────────────────────────────────────

export async function getMasteryCheck(checkId: string): Promise<MasteryCheckPayload | null> {
  const { data, error } = await supabase.rpc("get_mastery_check", { p_check_id: checkId });
  if (error || !data) return null;
  return data as MasteryCheckPayload;
}

// Resolve a check by its slug (the URL identifier) then load the served payload.
export async function getMasteryCheckBySlug(slug: string): Promise<MasteryCheckPayload | null> {
  const { data, error } = await supabase
    .from("mastery_checks")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return getMasteryCheck((data as { id: string }).id);
}

export async function submitMasteryCheck(
  checkId: string,
  responses: CheckResponses,
): Promise<{ ok: true; result: SubmitResult } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc("submit_mastery_check", {
    p_check_id: checkId,
    p_responses: responses,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, result: data as SubmitResult };
}

// Fire-and-forget: stamp today's activity so the streak advances. Safe to call
// on dashboard load and on lesson open; idempotent per calendar day server-side.
export async function recordActivity(): Promise<void> {
  await supabase.rpc("record_activity");
}

// Resolve the check id for a given module slug, if a published module check
// exists. Used by the dashboard "test out" CTA.
export function moduleCheckFor(
  checks: MasteryCheckSummary[],
  moduleSlug: string,
): MasteryCheckSummary | undefined {
  return checks.find((c) => c.scope === "module" && c.module_slug === moduleSlug);
}

export function levelCheckFor(
  checks: MasteryCheckSummary[],
  level: LessonLevel,
): MasteryCheckSummary | undefined {
  return checks.find((c) => c.scope === "level" && c.level === level);
}
