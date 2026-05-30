import { C, FONT_MONO } from "@/lib/theme";
import type { PersonalizationOverride } from "@/hooks/usePersonalizedBlock";

// Additive personalization chrome. The base block renders untouched as children;
// these supplementary fields frame it for the learner's actual job. intro sits
// above the block; example and exercise sit below in a tinted card.

function PersonalLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] uppercase tracking-[0.18em] mb-2"
      style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
    >
      {children}
    </div>
  );
}

export default function PersonalizationLayer({
  personalization,
  children,
}: {
  personalization: PersonalizationOverride;
  children: React.ReactNode;
}) {
  const { intro, example, exercise } = personalization;
  const hasFooter = !!(example || exercise);

  return (
    <>
      {intro && (
        <div
          className="mt-8 mb-2 pl-4"
          style={{ borderLeft: `2px solid ${C.orangeWashBorder}` }}
        >
          <PersonalLabel>For your work</PersonalLabel>
          <p className="text-base leading-relaxed" style={{ color: C.umber }}>
            {intro}
          </p>
        </div>
      )}

      {children}

      {hasFooter && (
        <div
          className="mt-6 p-6 rounded-2xl"
          style={{ backgroundColor: C.orangeWash, border: `1px solid ${C.orangeWashBorder}` }}
        >
          <PersonalLabel>Personalized for you</PersonalLabel>
          {example && (
            <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
              {example}
            </p>
          )}
          {exercise && (
            <p
              className="text-sm leading-relaxed mt-3 pt-3"
              style={{ color: C.espresso, borderTop: example ? `1px solid ${C.orangeWashBorder}` : "none" }}
            >
              {exercise}
            </p>
          )}
        </div>
      )}
    </>
  );
}
