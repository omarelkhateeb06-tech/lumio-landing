import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  GENERATOR_VERSION,
  profileHash,
  type PersonalizationProfile,
} from "@/lib/profileHash";
import type { LessonBlock } from "@/lib/curriculum";

// The three supplementary fields the personalizer may override. These are
// additive: they never replace the base teaching content, they frame it.
export interface PersonalizationOverride {
  intro?: string;
  example?: string;
  exercise?: string;
}

export interface UsePersonalizedBlock {
  content: LessonBlock;
  personalization: PersonalizationOverride | null;
  isPersonalized: boolean;
  loading: boolean;
}

const ALLOWED_KEYS: (keyof PersonalizationOverride)[] = ["intro", "example", "exercise"];

function pickAllowed(raw: unknown): PersonalizationOverride {
  const out: PersonalizationOverride = {};
  if (raw && typeof raw === "object") {
    for (const key of ALLOWED_KEYS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim()) out[key] = v.trim();
    }
  }
  return out;
}

// Serves a cached personalized version of a block when one is fresh for the
// current user, otherwise the base content unchanged. Read-only: this hook never
// triggers generation (that is the personalize-blocks Edge Function's job).
export function usePersonalizedBlock(
  blockId: string,
  baseContent: LessonBlock,
): UsePersonalizedBlock {
  const [override, setOverride] = useState<PersonalizationOverride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOverride(null);

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Fetch the profile (for the current hash) and the cached row together.
      const [{ data: profile }, { data: row }] = await Promise.all([
        supabase
          .from("profiles")
          .select("job_role, industry, goal, skill_level, ai_usage")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("personalized_blocks")
          .select("personalized_content, profile_hash, generator_version")
          .eq("block_id", blockId)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      if (!profile || !row || row.generator_version !== GENERATOR_VERSION) {
        setLoading(false);
        return;
      }

      const currentHash = await profileHash(profile as Partial<PersonalizationProfile>);
      if (cancelled) return;

      if (row.profile_hash !== currentHash) {
        setLoading(false);
        return; // stale: profile changed since this was generated
      }

      const picked = pickAllowed(row.personalized_content);
      setOverride(Object.keys(picked).length > 0 ? picked : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [blockId]);

  const isPersonalized = override !== null;
  // Merge the override fields onto the base block's content. The base teaching
  // fields are untouched; only intro/example/exercise are added.
  const content: LessonBlock = isPersonalized
    ? ({ ...baseContent, content: { ...baseContent.content, ...override } } as LessonBlock)
    : baseContent;

  return { content, personalization: override, isPersonalized, loading };
}
