import { useEffect, useRef } from "react";
import { C, FONT_MONO } from "@/lib/theme";
import { markBlockViewed } from "@/lib/supabase";

// Shared chrome for the interactive lesson-reader blocks. Keeps the card frame
// and the mono label consistent with ExerciseCard in Lesson.tsx.

export function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] uppercase tracking-[0.18em] mb-3"
      style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
    >
      {children}
    </div>
  );
}

export function BlockCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-10 p-6 rounded-2xl"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      {children}
    </div>
  );
}

// Fire a one-time "viewed" record for a block when it first mounts. Anonymous
// users are a no-op inside markBlockViewed, so this is safe to call eagerly.
export function useMarkViewed(blockId: string) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void markBlockViewed(blockId);
  }, [blockId]);
}
