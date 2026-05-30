import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { MultipleChoiceContent } from "@/lib/curriculum";
import { C, FONT_MONO, FOCUS_RING, displayFV, DISPLAY_WEIGHT_SOFT } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { saveBlockProgress } from "@/lib/supabase";
import { BlockCard, BlockLabel, useMarkViewed } from "./blockChrome";

// Single-answer multiple choice with immediate formative feedback. Selecting an
// option reveals whether it was right and its explanation; status reaches
// "passed" once the correct option is chosen and never downgrades after.

export default function MultipleChoiceBlock({
  blockId,
  content,
}: {
  blockId: string;
  content: MultipleChoiceContent;
}) {
  useMarkViewed(blockId);
  const rm = useReducedMotion() ?? false;
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);

  const chosen = content.options.find((o) => o.id === selected) ?? null;
  const isCorrect = !!chosen?.is_correct;

  function choose(optionId: string) {
    if (passed) return; // lock once the answer has been found
    const opt = content.options.find((o) => o.id === optionId);
    if (!opt) return;
    const nextAttempts = attempts + 1;
    setSelected(optionId);
    setAttempts(nextAttempts);
    const nowPassed = opt.is_correct;
    if (nowPassed) setPassed(true);
    void saveBlockProgress(blockId, {
      status: nowPassed ? "passed" : "attempted",
      response: { selected: optionId },
      attempts: nextAttempts,
    });
  }

  return (
    <BlockCard>
      <BlockLabel>Quick check</BlockLabel>
      <fieldset className="border-0 p-0 m-0">
        <legend
          className="font-serif text-xl leading-snug mb-5"
          style={{ color: C.espresso, fontVariationSettings: displayFV(40, DISPLAY_WEIGHT_SOFT) }}
        >
          {content.stem}
        </legend>
        <div className="space-y-3">
          {content.options.map((opt) => {
            const isSel = selected === opt.id;
            const showState = isSel;
            const stateColor = showState ? (opt.is_correct ? C.forest : C.error) : C.hairline;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 px-5 py-4 rounded-2xl transition-colors ${FOCUS_RING} ${
                  passed ? "" : "cursor-pointer"
                }`}
                style={{
                  backgroundColor: isSel ? (opt.is_correct ? C.orangeWash : C.surface) : C.surface,
                  border: `1.5px solid ${isSel ? stateColor : C.hairline}`,
                  opacity: passed && !isSel ? 0.55 : 1,
                }}
              >
                <input
                  type="radio"
                  name={blockId}
                  value={opt.id}
                  checked={isSel}
                  disabled={passed}
                  onChange={() => choose(opt.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex-shrink-0 grid place-items-center rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    border: `1.5px solid ${isSel ? stateColor : C.inkDisc}`,
                    backgroundColor: isSel ? stateColor : "transparent",
                  }}
                >
                  {isSel && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.surface }} />
                  )}
                </span>
                <span className="text-base leading-relaxed" style={{ color: C.ink }}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {chosen && (
            <motion.div
              key={chosen.id}
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={rm ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: dur.fast, ease: ease.ink }}
              className="mt-5 px-5 py-4 rounded-xl"
              style={{
                backgroundColor: isCorrect ? C.orangeWash : C.surface,
                border: `1px solid ${isCorrect ? C.orangeWashBorder : C.hairline}`,
              }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: isCorrect ? C.forest : C.error, fontFamily: FONT_MONO }}
              >
                {isCorrect ? "Correct" : "Not quite"}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
                {chosen.explanation ??
                  (isCorrect ? "That is the one." : "Have another look and try again.")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlockCard>
  );
}
