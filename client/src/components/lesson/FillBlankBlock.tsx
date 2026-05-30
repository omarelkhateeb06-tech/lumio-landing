import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { FillBlankContent } from "@/lib/curriculum";
import { C, FONT_MONO, FOCUS_RING } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { saveBlockProgress } from "@/lib/supabase";
import { BlockCard, BlockLabel, useMarkViewed } from "./blockChrome";

// A blank is satisfied when the trimmed input matches any of its accept entries,
// either as a case-insensitive literal or as a case-insensitive regex.
function matchesBlank(input: string, accept: string[]): boolean {
  const value = input.trim();
  if (!value) return false;
  const lower = value.toLowerCase();
  return accept.some((a) => {
    if (a.toLowerCase() === lower) return true;
    try {
      return new RegExp(a, "i").test(value);
    } catch {
      return false;
    }
  });
}

export default function FillBlankBlock({
  blockId,
  content,
}: {
  blockId: string;
  content: FillBlankContent;
}) {
  useMarkViewed(blockId);
  const rm = useReducedMotion() ?? false;
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);

  const segments = useMemo(
    () => content.template.split(/(\{\{\w+\}\})/g),
    [content.template],
  );

  const allFilled = content.blanks.every((b) => values[b.id]?.trim());

  function check() {
    if (passed) return;
    const allCorrect = content.blanks.every((b) => matchesBlank(values[b.id] ?? "", b.accept));
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecked(true);
    if (allCorrect) setPassed(true);
    void saveBlockProgress(blockId, {
      status: allCorrect ? "passed" : "attempted",
      response: { values },
      attempts: nextAttempts,
    });
  }

  return (
    <BlockCard>
      <BlockLabel>Fill in the blank</BlockLabel>

      <div className="text-base leading-[2.4]" style={{ color: C.ink }}>
        {segments.map((seg, i) => {
          const m = seg.match(/^\{\{(\w+)\}\}$/);
          if (!m) return <span key={i}>{seg}</span>;
          const blankId = m[1];
          const blank = content.blanks.find((b) => b.id === blankId);
          const correct = blank ? matchesBlank(values[blankId] ?? "", blank.accept) : false;
          const filled = !!values[blankId]?.trim();
          const borderColor = checked
            ? correct
              ? C.forest
              : C.error
            : filled
              ? C.orange
              : C.hairline;
          return (
            <input
              key={i}
              type="text"
              aria-label={`Blank ${blankId}`}
              value={values[blankId] ?? ""}
              disabled={passed}
              onChange={(e) => {
                const text = e.target.value;
                setValues((prev) => ({ ...prev, [blankId]: text }));
                if (checked) setChecked(false);
              }}
              className={`inline-block mx-1 px-3 py-1 rounded-lg text-base ${FOCUS_RING}`}
              style={{
                minWidth: 120,
                backgroundColor: C.surface,
                border: `1.5px solid ${borderColor}`,
                color: C.espresso,
                fontFamily: FONT_MONO,
              }}
            />
          );
        })}
      </div>

      {!passed && (
        <div className="mt-5">
          <button
            onClick={check}
            disabled={!allFilled}
            className={`text-sm font-medium ${FOCUS_RING} cursor-pointer disabled:opacity-40`}
            style={{ color: C.orangeInk }}
          >
            Check answer →
          </button>
        </div>
      )}

      <div aria-live="polite">
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.fast, ease: ease.ink }}
              className="mt-5 px-5 py-4 rounded-xl"
              style={{
                backgroundColor: passed ? C.orangeWash : C.surface,
                border: `1px solid ${passed ? C.orangeWashBorder : C.hairline}`,
              }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: passed ? C.forest : C.error, fontFamily: FONT_MONO }}
              >
                {passed ? "Correct" : "Not quite"}
              </div>
              {!passed && (
                <div className="mb-2 text-sm" style={{ color: C.espresso }}>
                  A strong answer:{" "}
                  {content.blanks.map((b, i) => (
                    <span key={b.id}>
                      {i > 0 && ", "}
                      <span style={{ fontFamily: FONT_MONO, color: C.orangeInk }}>{b.ideal}</span>
                    </span>
                  ))}
                </div>
              )}
              {content.explanation && (
                <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
                  {content.explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlockCard>
  );
}
