import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TryItLiveContent } from "@/lib/curriculum";
import { C, FONT_MONO, FOCUS_RING } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { saveBlockProgress } from "@/lib/supabase";
import { BlockCard, BlockLabel, useMarkViewed } from "./blockChrome";

// Hands-on practice. The reader writes their own attempt, then reveals a strong
// version to model against. This block teaches by example, so the reveal is
// framed as a reference to compare against, never as a correct-answer verdict.
// Status moves attempted -> completed; it never reaches "passed".

export default function TryItLiveBlock({
  blockId,
  content,
}: {
  blockId: string;
  content: TryItLiveContent;
}) {
  useMarkViewed(blockId);
  const rm = useReducedMotion() ?? false;
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const attemptedSaved = useRef(false);

  function handleChange(value: string) {
    setText(value);
    if (!attemptedSaved.current && value.trim()) {
      attemptedSaved.current = true;
      void saveBlockProgress(blockId, {
        status: "attempted",
        response: { attempt: value },
        attempts: 1,
      });
    }
  }

  function reveal() {
    setRevealed(true);
    void saveBlockProgress(blockId, {
      status: "completed",
      response: { attempt: text },
      attempts: 1,
    });
  }

  return (
    <BlockCard>
      <BlockLabel>Try it live</BlockLabel>
      <p className="text-base leading-relaxed mb-4" style={{ color: C.espresso }}>
        {content.instructions}
      </p>

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={content.input_placeholder ?? "Write your attempt here…"}
        rows={5}
        className={`w-full p-4 rounded-xl text-sm resize-y ${FOCUS_RING}`}
        style={{
          backgroundColor: C.surface,
          border: `1.5px solid ${text.trim() ? C.orange : C.hairline}`,
          color: C.espresso,
          fontFamily: FONT_MONO,
          lineHeight: 1.6,
        }}
      />

      <div className="mt-4">
        <button
          onClick={reveal}
          aria-expanded={revealed}
          className={`text-sm font-medium ${FOCUS_RING} cursor-pointer`}
          style={{ color: C.orangeInk }}
        >
          {revealed ? "Strong version shown below" : "See a strong version →"}
        </button>
      </div>

      <div aria-live="polite">
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.fast, ease: ease.ink }}
              className="mt-5 px-5 py-4 rounded-xl"
              style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
              >
                One strong version
              </div>
              <p className="text-[12px] mb-3" style={{ color: C.umber }}>
                There is no single right answer here. Compare this against your own and notice what
                it does well.
              </p>
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: C.espresso, fontFamily: FONT_MONO }}
              >
                {content.ideal_output}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlockCard>
  );
}
