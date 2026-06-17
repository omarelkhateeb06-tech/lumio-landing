import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { captureEmail } from "@/lib/supabase";
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
  // Seconds left on the resend cooldown. The magic link can lag or land in spam,
  // so the confirmation offers a resend rather than stranding the visitor (Outsider
  // HIGH-4). The cooldown keeps an impatient click from tripping the rate limit.
  const [resendIn, setResendIn] = useState(0);
  const confirmRef = useRef<HTMLDivElement>(null);

  // A track pill / share link lands here with ?cert=slug. Route the visitor to
  // that certificate after they confirm the magic link, so cert intent survives
  // the round-trip instead of dumping everyone on the generic dashboard
  // (Expansionist H1, Executor M1).
  const params =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const certSlug = params?.get("cert") ?? null;
  const refSource = params?.get("ref") ?? null;
  const redirectPath = certSlug ? `/app/cert/${certSlug}` : undefined;

  // The /signup links carry ?ref (and ?cert) so we can see which shared
  // credentials and invites drive account creation. The email-box path keeps
  // this via signupSource(); the account path previously dropped it entirely
  // (Expansionist HIGH-1). Persist the same attribution string here.
  function attributionSource(): string | null {
    if (!refSource) return null;
    const base = "signup_account";
    return certSlug ? `${base}__${refSource}_${certSlug}` : `${base}__${refSource}`;
  }

  // Persist referral attribution across the magic-link round-trip. The visitor
  // confirms the link in a fresh page load on /onboarding, where saveOnboarding
  // reads this key — so stash the raw ?ref= source here, fire-and-forget, guarded
  // for SSR / no-window. Only the first ref wins; we don't overwrite an existing
  // one, so a later untagged visit can't wipe an earlier attribution.
  useEffect(() => {
    if (typeof window === "undefined" || !refSource) return;
    try {
      if (!window.localStorage.getItem("lumio_ref")) {
        window.localStorage.setItem("lumio_ref", refSource);
      }
    } catch {
      // storage can be blocked (private mode, denied) — attribution is best-effort
    }
  }, [refSource]);

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
    // Persist referral attribution before the round-trip, fire-and-forget so a
    // logging failure never blocks the magic link (Expansionist HIGH-1).
    const source = attributionSource();
    if (source) void captureEmail(email, source);
    const res = await signInWithMagicLink(email, redirectPath);
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(mapAuthError(res.error, res.status));
    }
  }

  async function handleResend() {
    if (submitting || resendIn > 0) return;
    setError(null);
    setSubmitting(true);
    // Resend through the same redirect so a ?cert= visitor still lands on their
    // certificate after confirming, not the generic dashboard.
    const res = await signInWithMagicLink(email, redirectPath);
    setSubmitting(false);
    if (res.ok) {
      setResendIn(30);
    } else {
      setError(mapAuthError(res.error, res.status));
    }
  }

  const staggerDelay = (i: number) => (rm ? 0 : 0.05 + i * 0.1);

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#signup-content" className={SKIP_LINK}>Skip to content</a>
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
            One email, one click, then 5 quick questions (about a minute, no wrong answers) so we can pick the right lessons for you. Your lessons open right away, no password to remember.
          </motion.p>

          {/* Form / Success. The skip-link target lives on this always-rendered
              wrapper, not the inner form, so it survives the form→confirmation swap
              (Executor MED-1). The PillEmailForm keeps its own id for aria wiring. */}
          <motion.div
            id="signup-content"
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
                    Check your inbox for your sign-in link. Your first lesson is waiting.
                  </span>
                </div>
                {/* C1: set the expectation that the link can lag and may land in
                    spam, so a slow inbox doesn't read as a broken signup. */}
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
                id="signup-form"
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                buttonLabel="Email me a sign-in link"
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
            Free. No card. Unsubscribe in one click. Already started? The same link signs you in, you won't create a duplicate.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
