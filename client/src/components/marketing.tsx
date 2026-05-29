// Shared marketing-surface primitives.
// Single source of truth for the brand nav and the pill email-capture form
// used across the landing page, login, and signup. Keeps motion, focus, and
// spacing tokens consistent so the surfaces don't drift apart.

import { useState, type ReactNode, type FormEvent } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { C, SHADOW_PILL, FOCUS_RING, FOCUS_WITHIN, FONT_MONO, displayFV } from "@/lib/theme";

// ─────────────────────────────────────────────────────────────────────────────
// BrandNav — fixed header with the Lumio wordmark + a single right-side action.
// ─────────────────────────────────────────────────────────────────────────────

export function BrandNav({
  right,
  maxWidth = 1280,
  topAccent = true,
}: {
  right: ReactNode;
  maxWidth?: number;
  /** The 2px orange hairline at the very top. Lesson pages drop it for the scroll-progress bar. */
  topAccent?: boolean;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? `${C.paper}EE` : "transparent",
        borderBottom: scrolled ? `1px solid ${C.hairline}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      {topAccent && <div style={{ height: 2, backgroundColor: C.orange }} />}
      <div
        className="mx-auto px-6 md:px-10 pt-5 pb-5 flex items-baseline justify-between gap-4"
        style={{ maxWidth }}
      >
        <a
          href="/"
          className="font-serif text-2xl tracking-tight"
          style={{ color: C.ink, fontVariationSettings: displayFV(72) }}
        >
          Lumio
          <span
            aria-hidden="true"
            className="inline-block ml-0.5 italic font-light"
            style={{ color: C.orange }}
          >
            .
          </span>
        </a>
        {right}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PillEmailForm — the rounded email-capture pill + inline error.
// Controlled by the parent so each surface owns its own submit logic.
// ─────────────────────────────────────────────────────────────────────────────

export function PillEmailForm({
  id,
  email,
  onEmailChange,
  onSubmit,
  submitting,
  error,
  buttonLabel,
  formLabel,
}: {
  id?: string;
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  submitting: boolean;
  error?: string | null;
  buttonLabel: string;
  formLabel?: string;
}) {
  return (
    <>
      <form
        id={id}
        onSubmit={onSubmit}
        aria-busy={submitting}
        aria-label={formLabel}
        className={`flex items-center p-1.5 rounded-full ${FOCUS_WITHIN}`}
        style={{
          backgroundColor: C.surface,
          boxShadow: SHADOW_PILL,
          border: `1px solid ${C.hairlineSoft}`,
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={submitting}
          className="flex-1 min-w-0 bg-transparent px-5 py-3 text-base focus:outline-none disabled:opacity-50"
          style={{ color: C.ink }}
        />
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-3 rounded-full text-sm font-medium disabled:opacity-60 whitespace-nowrap transition-colors cursor-pointer ${FOCUS_RING}`}
          style={{ backgroundColor: C.ink, color: C.paper }}
        >
          {submitting ? "Sending…" : buttonLabel}
        </button>
      </form>
      {error && (
        <p className="text-xs mt-2 text-center" style={{ color: C.error }} role="alert">
          {error}
        </p>
      )}
    </>
  );
}

// Re-export so consumers can pull the mono token from the same module if needed.
export { FONT_MONO };
