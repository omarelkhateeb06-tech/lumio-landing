import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { BeforeAfterContent } from "@/lib/curriculum";
import { C, FONT_MONO, FOCUS_RING } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { saveBlockProgress } from "@/lib/supabase";
import { BlockCard, BlockLabel, useMarkViewed } from "./blockChrome";

// Side-by-side prompt comparison. Presentational: the "changes" list is hidden
// until the reader asks to see what improved, which records completion.

function PromptPanel({
  tone,
  caption,
  prompt,
}: {
  tone: "before" | "after";
  caption: string;
  prompt: string;
}) {
  const isBefore = tone === "before";
  return (
    <div
      className="p-5 rounded-xl h-full"
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${isBefore ? C.hairline : C.orangeWashBorder}`,
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-3"
        style={{ color: isBefore ? C.inkSoft : C.orangeInk, fontFamily: FONT_MONO }}
      >
        {caption}
      </div>
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap"
        style={{
          color: isBefore ? C.umber : C.espresso,
          fontFamily: FONT_MONO,
          textDecorationColor: C.orangeStrike,
        }}
      >
        {prompt}
      </p>
    </div>
  );
}

export default function BeforeAfterBlock({
  blockId,
  content,
}: {
  blockId: string;
  content: BeforeAfterContent;
}) {
  useMarkViewed(blockId);
  const rm = useReducedMotion() ?? false;
  const [revealed, setRevealed] = useState(false);

  function reveal() {
    setRevealed(true);
    void saveBlockProgress(blockId, { status: "completed", attempts: 1 });
  }

  return (
    <BlockCard>
      <BlockLabel>Before and after</BlockLabel>
      {content.question && (
        <p className="text-base leading-relaxed mb-5" style={{ color: C.espresso }}>
          {content.question}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <PromptPanel tone="before" caption="Before" prompt={content.before_prompt} />
        <PromptPanel tone="after" caption="After" prompt={content.after_prompt} />
      </div>

      <div className="mt-5">
        {!revealed ? (
          <button
            onClick={reveal}
            aria-expanded={false}
            className={`text-sm font-medium ${FOCUS_RING} cursor-pointer`}
            style={{ color: C.orangeInk }}
          >
            See what changed →
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.fast, ease: ease.ink }}
              aria-live="polite"
              className="px-5 py-4 rounded-xl"
              style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
              >
                What changed
              </div>
              <ul className="space-y-1.5 text-sm" style={{ color: C.espresso }}>
                {content.changes.map((change, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" style={{ color: C.orangeInk }}>
                      +
                    </span>
                    <span className="leading-relaxed">{change}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </BlockCard>
  );
}
