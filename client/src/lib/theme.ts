// ─────────────────────────────────────────────────────────────────────────────
// Lumio design tokens — single source of truth for the brand palette and the
// signature pill shadow. Imported by every user-facing page so the palette can
// never drift between surfaces. The CSS custom properties in client/index.css
// mirror these values for any shadcn / utility-class usage.
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
  paper: "#F2EFE7", // warm off-white background
  paperHi: "#FAF7F0", // raised surface (cards)
  surface: "#FFFFFF", // pure-white raised surface (pills, floating cards on paper)
  ink: "#0E0D0B", // near-black text / primary buttons
  espresso: "#3D2C1E", // headings
  umber: "#52443A", // secondary text (~6.9:1 on paper)
  orange: "#E85D04", // brand accent — large display + on-dark only (fails AA on paper at small sizes)
  orangeInk: "#A8380A", // darker burnt-orange for small/normal-size text on paper (~5.7:1, meets WCAG AA)
  amberPaper: "#F7D9B5", // soft amber wash
  forest: "#0B3D2E", // success / complete
  orangeWash: "rgba(232, 93, 4, 0.05)", // tinted callout background (key takeaway)
  orangeWashBorder: "rgba(232, 93, 4, 0.14)", // tinted callout hairline
  hairline: "rgba(14, 13, 11, 0.08)",
  hairlineSoft: "rgba(14, 13, 11, 0.05)",
  inkSoft: "rgba(14, 13, 11, 0.68)", // tertiary captions (~6.5:1 on paper, meets WCAG AA)
  inkDisc: "rgba(14, 13, 11, 0.46)", // incomplete progress dot / empty indicator (~3.1:1 on paper, meets 3:1 non-text UI)
  orangeStrike: "rgba(232, 93, 4, 0.5)", // strike-through line on the "before" prompt
  // Paper-tinted text/lines for use on the dark (ink) band — tokenized so the
  // dark surface stays in the design system instead of using raw rgba literals.
  paperMuted: "rgba(241, 238, 230, 0.72)", // secondary text on dark (~8.6:1)
  paperSubdued: "rgba(241, 238, 230, 0.55)", // tertiary text on dark (~4.9:1, large/UI)
  paperStrong: "rgba(241, 238, 230, 0.92)", // emphasis text on dark
  hairlineOnDark: "rgba(241, 238, 230, 0.18)", // hairline on dark band
  error: "#9B2C2C", // form error text
} as const;

// Monospace stack for spec labels, lesson numbers, and the prompt runner — kept
// here so the family can never drift between the dozens of inline usages.
export const FONT_MONO = "'JetBrains Mono', monospace";

// Display weight tokens for the Fraunces variable serif. Two named weights keep
// headings consistent instead of a smear of arbitrary 360/380/400/420 values.
export const DISPLAY_WEIGHT = 420; // primary display: marketing hero H1s + wordmark
export const DISPLAY_WEIGHT_SOFT = 380; // everything else serif: section heads, app H1s, accents

// Build a Fraunces font-variation-settings string from the display tokens so
// every heading routes through one source of truth instead of inline literals.
export const displayFV = (
  opsz: number,
  wght: number = DISPLAY_WEIGHT,
  soft?: number,
): string =>
  `"opsz" ${opsz}, "wght" ${wght}${soft != null ? `, "SOFT" ${soft}` : ""}`;

// Skip-to-content link — visually hidden until focused. Tokenized so the
// high-contrast focus chip stays identical across every page.
export const SKIP_LINK =
  "sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:bg-[#0E0D0B] focus:text-[#F2EFE7] focus:outline-none focus:ring-2 focus:ring-[#E85D04]";

// Confetti palette for the lesson-completion burst — kept here so the colors are
// part of the design system rather than orphaned in the component.
export const CONFETTI = ["#E85D04", "#0B3D2E", "#E8B04A", "#3D2C1E", "#D94F04", "#1C6B4F"] as const;

// Visible keyboard-focus ring for controls on the light (paper) surface.
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE7] rounded-full";

// Focus ring variant for controls sitting on the dark (ink) band.
export const FOCUS_RING_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0B]";

// Focus-within ring for wrapper controls (e.g. pill email forms) on paper.
export const FOCUS_WITHIN =
  "focus-within:ring-2 focus-within:ring-[#E85D04]/60";

// Focus-within ring variant for wrapper controls on the dark (ink) band.
export const FOCUS_WITHIN_DARK =
  "focus-within:ring-2 focus-within:ring-[#E85D04]/70";

export const SHADOW_PILL = `0 1px 0 rgba(255,255,255,0.95) inset, 0 2px 4px rgba(60,44,30,0.05), 0 16px 40px -16px rgba(60,44,30,0.10), 0 40px 80px -40px rgba(232,93,4,0.12)`;

// Pill CTA geometry — single source of truth for every primary/secondary action
// pill. Color (background/foreground) stays per-use via inline style; this owns
// only shape, padding, type, and hover. Works on <a>, <button>, motion.button.
export const PILL = "px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80";

// Confirmation pill — the "you're in / check your inbox" success state shared by
// the landing hero, final CTA, login, and signup. Geometry only; surface color
// and shadow stay per-use (they sit on paper via SHADOW_PILL).
export const CONFIRM_PILL = "inline-flex items-center justify-center gap-3 py-5 px-6 rounded-full mx-auto w-fit";
