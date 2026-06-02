import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { C, SHADOW_PILL, FOCUS_RING, SKIP_LINK, displayFV, CONFIRM_PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav, PillEmailForm } from "@/components/marketing";

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const { signInWithMagicLink } = useAuth();
  const rm = useReducedMotion() ?? false;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Seconds left on the resend cooldown. A magic link can lag or land in spam, so
  // the confirmation must offer a resend instead of leaving the visitor stuck with
  // no recourse (Outsider HIGH-4). The cooldown keeps an impatient click from
  // tripping Supabase's own rate limit.
  const [resendIn, setResendIn] = useState(0);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation when the form is swapped out, so keyboard and
  // screen-reader users aren't stranded on a now-removed submit button (Executor H3).
  useEffect(() => {
    if (submitted) confirmRef.current?.focus();
  }, [submitted]);

  // Tick the resend cooldown down to zero.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function handleResend() {
    if (submitting || resendIn > 0) return;
    setError(null);
    setSubmitting(true);
    const res = await signInWithMagicLink(email);
    setSubmitting(false);
    if (res.ok) {
      setResendIn(30);
    } else {
      setError(mapAuthError(res.error, res.status));
    }
  }

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
      <a href="#login-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav
        right={
          <a
            href="/signup"
            className={`text-[13px] font-medium tracking-tight ${FOCUS_RING}`}
            style={{ color: C.umber }}
          >
            New here? Start free →
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
            Welcome back.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: staggerDelay(1), ease: ease.ink }}
            className="mt-6 mx-auto max-w-[440px]"
            style={{ color: C.umber, fontSize: 18, lineHeight: 1.55 }}
          >
            Enter your email and we'll send a one-click sign-in link. No password to remember.
          </motion.p>

          {/* Form / Success. Skip-link target on the always-rendered wrapper so it
              survives the form→confirmation swap (Executor MED-1). */}
          <motion.div
            id="login-content"
            tabIndex={-1}
            initial={rm ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, delay: staggerDelay(2), ease: ease.ink }}
            className="mt-10"
          >
            {submitted ? (
              <div ref={confirmRef} tabIndex={-1} role="status" aria-live="polite">
                <div
                  className={CONFIRM_PILL}
                  style={{ backgroundColor: C.surface, boxShadow: SHADOW_PILL, color: C.espresso }}
                >
                  <Check className="w-4 h-4 shrink-0" style={{ color: C.forest }} aria-hidden="true" />
                  <span className="text-sm">
                    Check your inbox for your sign-in link.
                  </span>
                </div>
                {/* C1: the magic-link can lag a minute and often lands in spam.
                    Saying so up front turns "it's not working" frustration into
                    expected waiting (and removes the duplicate "lessons are
                    waiting," which already lives in the footer below -- Rubin). */}
                <p className="mt-4 text-sm" style={{ color: C.umber }}>
                  It can take a minute to arrive. If you don't see it, check your spam folder.
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={submitting || resendIn > 0}
                  className={`mt-3 text-sm font-medium underline underline-offset-2 disabled:no-underline disabled:opacity-60 ${FOCUS_RING}`}
                  style={{ color: C.umber }}
                >
                  {submitting
                    ? "Sending…"
                    : resendIn > 0
                      ? `Resend in ${resendIn}s`
                      : "Didn't get it? Resend the link"}
                </button>
                {error && (
                  <p className="mt-3 text-sm" style={{ color: C.umber }} role="alert">
                    {error}
                  </p>
                )}
              </div>
            ) : (
              <PillEmailForm
                id="login-form"
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Email me a sign-in link"
                formLabel="Sign in by email"
              />
            )}
          </motion.div>

          {/* Footer note — returning users don't need sign-up copy */}
          <motion.p
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur.base, delay: staggerDelay(3), ease: ease.ink }}
            className="text-xs italic mt-8"
            style={{ color: C.umber }}
          >
            Your lessons are waiting.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
