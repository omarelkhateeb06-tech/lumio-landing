import { motion, useReducedMotion } from "framer-motion";
import {
  C,
  FOCUS_RING,
  FONT_MONO,
  SKIP_LINK,
  displayFV,
  DISPLAY_WEIGHT_SOFT,
  PILL,
} from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// 404 — the catch-all route. Kept in the same paper/serif voice as the rest of
// the app so a mistyped URL never drops the learner onto an off-brand surface.
// ─────────────────────────────────────────────────────────────────────────────

export default function NotFound() {
  const rm = useReducedMotion() ?? false;

  const navRight = (
    <a
      href="/"
      className={`text-[13px] font-medium ${FOCUS_RING}`}
      style={{ color: C.umber, fontFamily: FONT_MONO }}
    >
      lumio.app
    </a>
  );

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#main-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={720} right={navRight} />

      <div
        id="main-content"
        className="max-w-[720px] mx-auto px-6 pt-40 pb-20 md:pt-48 md:pb-28 text-center"
      >
        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.ink }}
        >
          <div
            className="text-[12px] uppercase tracking-[0.24em] mb-6"
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            Error 404
          </div>
          <h1
            className="font-serif"
            style={{
              color: C.espresso,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
            }}
          >
            This page wandered off.
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: C.umber }}>
            The page you're looking for doesn't exist, or it may have moved.
            Let's get you back on track.
          </p>
          <a
            href="/"
            className={`inline-block mt-8 ${PILL} ${FOCUS_RING}`}
            style={{ backgroundColor: C.orange, color: C.ink }}
          >
            Back to Lumio →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
