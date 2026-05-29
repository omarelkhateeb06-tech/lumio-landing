// Lumio motion system
// Derived from the design-motion-principles audit (Kowalski / Krehel / Tompkins lens).
// One ease curve per material weight. One duration per intent. Real system, not random.

export const ease = {
  /** Slow-in, used for serif text reveals and editorial moments. */
  ink: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Anticipatory curve for card / surface entrances. */
  glass: [0.32, 0.72, 0, 1] as [number, number, number, number],
  /** Snappy with slight overshoot for buttons and CTAs. */
  haptic: [0.4, 0, 0.2, 1] as [number, number, number, number],
  /** Bidirectional swap (AnimatePresence between states). */
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
} as const;

export const dur = {
  /** 120ms — hover tints, focus rings. */
  micro: 0.12,
  /** 220ms — CTA press, chip hover, fast swaps. */
  fast: 0.22,
  /** 340ms — card enter, cascade items. */
  base: 0.34,
  /** 560ms — signature single-element reveals. */
  beat: 0.56,
  /** 820ms — narrative beats (hero headline). */
  narrative: 0.82,
} as const;

export const stagger = {
  /** 40ms — word-by-word. */
  tight: 0.04,
  /** 60ms — grid items, list rows. */
  base: 0.06,
  /** 120ms — section blocks. */
  loose: 0.12,
} as const;

/** Slice a string into <span> words for word-mask reveal animations. */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((s) => s.length > 0);
}
