import { motion, useReducedMotion } from "framer-motion";
import {
  C,
  FOCUS_RING,
  FONT_MONO,
  SKIP_LINK,
  displayFV,
  DISPLAY_WEIGHT_SOFT,
} from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Privacy — a public, on-brand placeholder. Linked from the onboarding consent
// step. Intentionally outside ProtectedRoute (like /verify) so anyone weighing
// the consent checkbox can read it without an account.
// ─────────────────────────────────────────────────────────────────────────────

// A small section heading + body block, so the placeholder reads like a real
// policy skeleton rather than a wall of text.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2
        className="font-serif"
        style={{
          color: C.espresso,
          fontSize: "clamp(20px, 2.4vw, 26px)",
          lineHeight: 1.2,
          fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
        }}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: C.umber }}>
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  const rm = useReducedMotion() ?? false;

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#privacy-content" className={SKIP_LINK}>
        Skip to content
      </a>
      <BrandNav
        maxWidth={720}
        right={
          <a
            href="/"
            className={`text-[13px] font-medium ${FOCUS_RING}`}
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            Back to Lumio
          </a>
        }
      />

      <main id="privacy-content" className="max-w-[720px] mx-auto px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <motion.div
          initial={rm ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.ink }}
        >
          {/* ──────────────────────────────────────────────────────────────────
              PLACEHOLDER — this policy is a working draft and is NOT legal advice.
              It is pending review by counsel before launch. Do not treat the text
              below as final or binding.
              ────────────────────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl px-5 py-4 mb-10 text-sm leading-relaxed"
            style={{
              backgroundColor: C.orangeWash,
              border: `1px solid ${C.orangeWashBorder}`,
              color: C.umber,
            }}
            role="note"
          >
            <span className="font-medium" style={{ color: C.espresso }}>
              Placeholder.
            </span>{" "}
            This page is a working draft pending review by counsel. The language here is not final
            and is not a binding legal agreement yet.
          </div>

          <div
            className="text-[12px] uppercase tracking-[0.18em] mb-4"
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            Privacy Policy
          </div>
          <h1
            className="font-serif"
            style={{
              color: C.espresso,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              fontVariationSettings: displayFV(120, DISPLAY_WEIGHT_SOFT),
              textWrap: "balance" as const,
            }}
          >
            How we handle your data.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: C.umber, maxWidth: 560 }}>
            Lumio is built for working adults learning to use AI on the job. We try to collect only
            what helps us teach you better, and to be plain about what we do with it.
          </p>

          <Section title="What we collect">
            <p>
              The basics you give us when you sign up and onboard — your email, and the optional
              answers you share about your role, field, and experience. We also record your learning
              activity inside the product, like the lessons you open and complete.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              We use what we collect to personalize your lessons, run the product, and improve it
              over time. If you opt in, we may use your learning activity to make Lumio better, and
              may share anonymized, aggregated insights with third parties. Aggregated means
              combined across many learners so it can't be traced back to you.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              The data-use consent is opt-in — leaving it unchecked is always fine, and you can
              change your mind later. The identity questions during onboarding are optional; skip
              any you'd rather not answer.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about your data? Reach us and we'll help. This section will carry a real
              contact route once this policy is finalized.
            </p>
          </Section>
        </motion.div>
      </main>
    </div>
  );
}
