import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { getCertificate } from "@/lib/certs";
import type { CertificateView } from "@/lib/certs";
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

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Public certificate verification — renders with no auth. Reads only the
// public-safe fields exposed by the get_certificate SECURITY DEFINER RPC.
// ─────────────────────────────────────────────────────────────────────────────

export default function Verify() {
  const { token = "" } = useParams<{ token: string }>();
  const rm = useReducedMotion() ?? false;
  const [view, setView] = useState<CertificateView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const v = await getCertificate(token);
      if (cancelled) return;
      setView(v);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

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
        className="max-w-[720px] mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col items-center"
      >
        {loading ? (
          <div className="w-full rounded-2xl animate-pulse" style={{ backgroundColor: C.hairline, height: 360 }} />
        ) : view?.found ? (
          <motion.div
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="w-full rounded-2xl px-8 py-12 md:px-12 md:py-16 text-center"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.orangeWashBorder}` }}
          >
            <div
              className="text-[12px] uppercase tracking-[0.24em] mb-6"
              style={{ color: C.umber, fontFamily: FONT_MONO }}
            >
              Certificate of Completion
            </div>

            {view.anonymous || !view.holder_name ? (
              <p className="text-sm italic" style={{ color: C.inkSoft }}>
                Awarded to a verified Lumio learner
              </p>
            ) : (
              <h1
                className="font-serif"
                style={{
                  color: C.espresso,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  lineHeight: 1.1,
                  fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
                }}
              >
                {view.holder_name}
              </h1>
            )}

            <p className="mt-6 text-sm" style={{ color: C.umber }}>
              has earned the
            </p>
            <h2
              className="font-serif mt-2"
              style={{
                color: C.orangeInk,
                fontSize: "clamp(22px, 3vw, 30px)",
                lineHeight: 1.15,
                fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT),
              }}
            >
              {view.cert_title}
            </h2>

            {view.awarded_at && (
              <p className="mt-6 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
                Awarded {formatDate(view.awarded_at)}
              </p>
            )}

            <div
              className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-full"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.orangeWashBorder}` }}
            >
              <span aria-hidden="true" style={{ color: C.forest, fontSize: 14 }}>✓</span>
              <span className="text-xs font-medium" style={{ color: C.forest, fontFamily: FONT_MONO }}>
                Verified by Lumio
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="w-full rounded-2xl px-8 py-16 text-center"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
          >
            <h1
              className="font-serif"
              style={{ color: C.espresso, fontSize: 28, fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT) }}
            >
              Certificate not found
            </h1>
            <p className="mt-3 text-sm" style={{ color: C.umber }}>
              This certificate could not be found or has not yet been awarded.
            </p>
            <a
              href="/"
              className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.ink, color: C.paper }}
            >
              Learn about Lumio
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
