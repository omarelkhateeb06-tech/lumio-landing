import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { C, SHADOW_PILL, FOCUS_RING, SKIP_LINK, displayFV, CONFIRM_PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav, PillEmailForm } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Signup() {
  const { signInWithMagicLink } = useAuth();
  const rm = useReducedMotion() ?? false;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapAuthError(msg?: string, status?: number): string {
    if (!msg) return "Couldn't send the link. Check your connection and try again.";
    const lower = msg.toLowerCase();
    const isRateLimit =
      status === 429 ||
      lower.includes("rate") ||
      lower.includes("too many") ||
      lower.includes("security purposes") ||
      lower.includes("you can only request");
    if (isRateLimit) {
      const secs = msg.match(/(\d+)\s*seconds?/i)?.[1];
      return secs
        ? `Please wait ${secs} seconds before requesting another link.`
        : "Too many attempts. Please wait a minute and try again.";
    }
    if (lower.includes("invalid") || lower.includes("not found") || lower.includes("does not exist"))
      return "We don't recognize that email. Double-check it or create a new account.";
    if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to fetch"))
      return "Connection problem. Check your internet and try again.";
    return "Couldn't send the link. Check your connection and try again.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setSubmitting(true);
    const res = await signInWithMagicLink(email);
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(mapAuthError(res.error, res.status));
    }
  }

  const staggerDelay = (i: number) => (rm ? 0 : 0.05 + i * 0.1);

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#signup-form" className={SKIP_LINK}>Skip to content</a>
      <BrandNav
        right={
          <a
            href="/login"
            className={`text-[13px] font-medium tracking-tight ${FOCUS_RING}`}
            style={{ color: C.umber }}
          >
            Already have an account? Sign in →
          </a>
        }
      />

      <main className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-[540px] mx-auto pt-24 pb-20 text-center">

          {/* Headline */}
          <motion.h1
            className="font-serif"
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: staggerDelay(0), ease: ease.ink }}
            style={{
              color: C.espresso,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 0.96,
              letterSpacing: "-0.028em",
              fontVariationSettings: displayFV(144),
              textWrap: "balance" as const,
            }}
          >
            Start your first lesson in minutes.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: staggerDelay(1), ease: ease.ink }}
            className="mt-6 mx-auto max-w-[440px]"
            style={{ color: C.umber, fontSize: 18, lineHeight: 1.55 }}
          >
            One email, one click, and your first lesson opens right away. No password to remember.
          </motion.p>

          {/* Form / Success */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: staggerDelay(2), ease: ease.ink }}
            className="mt-10"
          >
            {submitted ? (
              <div
                className={CONFIRM_PILL}
                style={{ backgroundColor: C.surface, boxShadow: SHADOW_PILL, color: C.espresso }}
                role="status"
                aria-live="polite"
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: C.forest }} aria-hidden="true" />
                <span className="text-sm">
                  Check your inbox for the magic link. Your first lesson is waiting.
                </span>
              </div>
            ) : (
              <PillEmailForm
                id="signup-form"
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Send magic link"
                formLabel="Create your account by email"
              />
            )}
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur.base, delay: staggerDelay(3), ease: ease.ink }}
            className="text-xs italic mt-8"
            style={{ color: C.umber }}
          >
            Free. No card. Unsubscribe in one click.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
