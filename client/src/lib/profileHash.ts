// Deterministic profile hash shared by the personalization layer.
//
// The hash fingerprints exactly the profile fields the personalizer reads, in a
// FIXED key order, so the client hook, the verification script, and the
// personalize-blocks Edge Function all agree on whether a cached
// personalized_blocks row is still fresh. The Edge Function (Deno) cannot import
// this module, so it replicates canonicalProfile + the SHA-256 step verbatim;
// keep the two in sync if either changes.

export const GENERATOR_VERSION = "v1";

export interface PersonalizationProfile {
  job_role: string | null;
  industry: string | null;
  goal: string | null;
  skill_level: string | null;
  ai_usage: string | null;
}

// Canonical JSON: the five fields, fixed order, missing values normalized to
// null. JSON.stringify follows insertion order, so this string is stable.
export function canonicalProfile(p: Partial<PersonalizationProfile>): string {
  return JSON.stringify({
    job_role: p.job_role ?? null,
    industry: p.industry ?? null,
    goal: p.goal ?? null,
    skill_level: p.skill_level ?? null,
    ai_usage: p.ai_usage ?? null,
  });
}

export async function profileHash(p: Partial<PersonalizationProfile>): Promise<string> {
  const data = new TextEncoder().encode(canonicalProfile(p));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
