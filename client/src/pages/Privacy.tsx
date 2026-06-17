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
// Privacy — public, plain-language data policy. Linked from the onboarding
// consent step and the AI tutor consent notice. Intentionally outside
// ProtectedRoute (like /verify) so anyone weighing a consent choice can read it
// without an account. Must exist before any AI tutor query logging goes live.
//
// NOTE: the deletion contact address below is a placeholder. Swap
// privacy@lumio.so for the real support inbox before driving traffic.
// ─────────────────────────────────────────────────────────────────────────────

const CONTACT_EMAIL = "privacy@lumio.so"; // placeholder — replace with real inbox

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
            Lumio is built for working adults learning to use AI on the job. We collect only what
            helps us teach you better, and we try to be plain about what we do with it. No fine
            print, no surprises.
          </p>

          <Section title="What we collect">
            <p>
              <strong style={{ color: C.espresso }}>Account basics.</strong> Your email, and the
              optional answers you give during onboarding about your role, field, organization, and
              experience.
            </p>
            <p>
              <strong style={{ color: C.espresso }}>Learning activity.</strong> Which lessons you
              open, complete, and revisit, and how you move through the product. This is what lets
              us show you the right next lesson.
            </p>
            <p>
              <strong style={{ color: C.espresso }}>AI tutor questions.</strong> When you practice
              with the in-app AI tutor, the questions you type are saved only if you have turned on
              AI tutor data sharing. If you have not, your questions are answered in the moment and
              not stored.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              We use what we collect to personalize your lessons to your role and field, to run the
              product, and to make it better over time.
            </p>
            <p>
              The main reason we look at AI tutor questions is to find where learners get stuck.
              When many people ask about the same idea, that tells us a lesson needs clearer
              teaching. That is how the questions you ask quietly improve the curriculum for
              everyone.
            </p>
          </Section>

          <Section title="What we share">
            <p>
              We do not sell your personal information.
            </p>
            <p>
              We may share anonymized, aggregate patterns with third parties such as curriculum
              partners and research groups. Aggregate means combined across many learners, so it
              describes a trend, not a person. We do not share raw questions tied to an individual.
              Your specific queries stay with us. Only the broad patterns ever leave.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              AI tutor data sharing is opt-in. You can turn it on or off at any time, and leaving it
              off is always fine. The tutor works exactly the same either way.
            </p>
            <p>
              The identity questions during onboarding are optional too. Skip any you would rather
              not answer.
            </p>
          </Section>

          <Section title="Deleting your data">
            <p>
              You can ask us to delete your account and the data tied to it at any time. Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`underline underline-offset-2 ${FOCUS_RING}`}
                style={{ color: C.orangeInk }}
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and we will take care of it.
            </p>
          </Section>

          <p className="mt-12 text-xs" style={{ color: C.inkSoft, fontFamily: FONT_MONO }}>
            Last updated June 2026.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
