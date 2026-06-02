import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { getCertificate, LESSON_TIME_COPY } from "@/lib/certs";
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
import { toast } from "sonner";

// The public cert deliberately uses a long, formal date ("January 5, 2026")
// rather than the compact formatCertDate used inside the app. It must still pin
// timeZone:"UTC" so an awarded date never renders a day off from the UTC dates
// shown elsewhere near midnight (First Principles MED-3).
function formatDate(iso?: string): string {
  if (!iso) return "";
  // Guard a malformed timestamp so the public credential never prints the literal
  // "Invalid Date" string under the holder's name (Executor L2).
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Let the holder (or anyone proud of it) share the live, verifiable link in one
// tap. Native share sheet on mobile, clipboard copy everywhere else. This is the
// cheapest growth surface we have: a real credential someone wants to show off
// (Expansionist M2).
function ShareCredentialButton({ title, slug }: { title?: string; slug?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Build the share URL from origin + pathname only. Reading window.location.href
  // would re-share whatever tracking params a referral link left in the address
  // bar, polluting the holder's clean credential link for the next person
  // (Expansionist H2).
  const url = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "";
  const text = title ? `I earned the ${title} from Lumio.` : "I earned a certificate from Lumio.";

  // The public Verify page is the surface recruiters and peers land on, so it
  // needs the same one-tap feed shares the holder's dashboard already has, not
  // just clipboard. Pure intent URLs, zero infra (Expansionist HIGH). Tag the
  // outbound link so social inbound is distinguishable in analytics.
  // Carry the cert slug on shared links so feed-driven inbound gets the same
  // personalized "you just saw a real {cert} credential" landing and cert-level
  // attribution the email/verify path already gets (Expansionist M1).
  const sharedUrl = slug ? `${url}?ref=share&cert=${encodeURIComponent(slug)}` : `${url}?ref=share`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharedUrl)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${sharedUrl}`)}`;
  // LinkedIn/X are broadcast; the highest-trust referral is the 1:1 "you should
  // do this too" email a holder sends a specific colleague. A mailto needs zero
  // infra and opens the holder's own client, so the invite comes from them, not
  // from us (Expansionist HIGH-2). Carries the same ?ref=share attribution.
  const emailSubject = title ? `I earned the ${title} from Lumio` : "I earned a certificate from Lumio";
  const emailBody = `${text}\n\nYou can verify it here: ${sharedUrl}\n\nThought you might want to do it too. The lessons are free to start.`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        // Share the ?ref=share-tagged URL so a native share (a major Slack/iMessage
        // spread vector) carries the same attribution the LinkedIn/X links do,
        // instead of silently dropping the ref (Naval LOW / Expansionist LOW-4).
        await navigator.share({ title: title ?? "Lumio certificate", text, url: sharedUrl });
        return;
      } catch {
        // user cancelled or share failed; fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission). Don't fail
      // silently: tell the holder the link so they can still copy it (Executor L1).
      toast.error("Couldn't copy automatically. Your link: " + sharedUrl);
    }
  }
  return (
    <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
      <a
        href={linkedInShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-xs font-medium ${FOCUS_RING}`}
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        Share on LinkedIn →
      </a>
      <span aria-hidden="true" style={{ color: C.inkSoft, opacity: 0.5 }}>·</span>
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-xs font-medium ${FOCUS_RING}`}
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        Share on X →
      </a>
      <span aria-hidden="true" style={{ color: C.inkSoft, opacity: 0.5 }}>·</span>
      <a
        href={mailtoUrl}
        className={`inline-flex items-center gap-2 text-xs font-medium ${FOCUS_RING}`}
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        Email it →
      </a>
      <span aria-hidden="true" style={{ color: C.inkSoft, opacity: 0.5 }}>·</span>
      <button
        type="button"
        onClick={share}
        className={`inline-flex items-center gap-2 text-xs font-medium ${FOCUS_RING}`}
        style={{ color: C.umber, fontFamily: FONT_MONO }}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
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

  // Name the credential in the tab and in the social/link preview, then restore
  // the defaults on unmount. With no SSR we can't render per-cert OG images, but
  // setting og/twitter title + description in the DOM is free and is picked up by
  // any scraper that executes JS (e.g. LinkedIn re-scrapes), degrading cleanly to
  // the static homepage meta for those that don't (Expansionist MED).
  useEffect(() => {
    const DEFAULT_TITLE = "Lumio | Go from AI-curious to AI-confident";
    const DEFAULT_DESC = `Daily lessons, ${LESSON_TIME_COPY}, that teach knowledge workers to actually use AI at work.`;
    const DEFAULT_OG_URL = "https://lumio.app/";
    const canonicalUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : DEFAULT_OG_URL;
    function setMeta(selector: string, content: string) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    }
    // A JS-executing scraper (LinkedIn re-scrape, etc.) can read a credential-level
    // JSON-LD block; degrades cleanly to the static Organization block for others.
    // Inserted/removed per mount so the home page never carries a stale credential
    // (Expansionist H2).
    let ld: HTMLScriptElement | null = null;
    if (view?.found && view.cert_title) {
      const who = view.anonymous || !view.holder_name ? "A Lumio learner" : view.holder_name;
      const title = `${view.cert_title} · Reviewed at Lumio`;
      const desc = `${who} earned the ${view.cert_title}. A real person at Lumio reviewed one real work task for it.`;
      document.title = title;
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[property="og:description"]', desc);
      setMeta('meta[property="og:url"]', canonicalUrl);
      setMeta('meta[property="twitter:title"]', title);
      setMeta('meta[property="twitter:description"]', desc);

      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalCredential",
        name: view.cert_title,
        credentialCategory: "certificate",
        url: canonicalUrl,
        ...(view.awarded_at ? { dateCreated: view.awarded_at } : {}),
        // Attribute the credential to its issuer (Lumio) rather than asserting an
        // external recognizing body. `recognizedBy` implies accreditation we
        // explicitly don't claim, so use the issuer relation instead (Contrarian L1).
        issuedBy: { "@type": "Organization", name: "Lumio", url: DEFAULT_OG_URL },
      });
      document.head.appendChild(ld);
    }
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[property="og:title"]', DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', DEFAULT_DESC);
      setMeta('meta[property="og:url"]', DEFAULT_OG_URL);
      setMeta('meta[property="twitter:title"]', DEFAULT_TITLE);
      setMeta('meta[property="twitter:description"]', DEFAULT_DESC);
      if (ld && ld.parentNode) ld.parentNode.removeChild(ld);
    };
  }, [view]);

  // Every exit path off this page should carry attribution, not just the primary
  // CTA (Expansionist M): a viewer who clicks the brand nav is still a referral
  // from the holder who shared this credential.
  const homeHref = view?.cert_slug
    ? `/?ref=verify&cert=${encodeURIComponent(view.cert_slug)}`
    : "/?ref=verify";
  const navRight = (
    <a
      href={homeHref}
      className={`text-[13px] font-medium ${FOCUS_RING}`}
      style={{ color: C.umber, fontFamily: FONT_MONO }}
    >
      Lumio
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
              Reviewed Certificate
            </div>

            {view.anonymous || !view.holder_name ? (
              <p className="text-sm italic" style={{ color: C.inkSoft }}>
                Awarded to a Lumio learner
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

            {/* Name the actual work. A credential that can't say what was done is
                barely stronger than a participation badge to the manager it's meant
                to convince (First-Principles HIGH-1). Hidden for anonymous holders
                (the RPC returns null there) so a project title can't de-anonymize. */}
            {view.project_title && (
              <p className="mt-4 text-sm" style={{ color: C.umber }}>
                for the project:{" "}
                <span className="italic" style={{ color: C.espresso }}>
                  {view.project_title}
                </span>
              </p>
            )}

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
                Reviewed by Lumio
              </span>
            </div>
            {/* State exactly what the badge attests, so a stranger doesn't read it
                as accreditation it isn't. Precise scope is the stronger claim
                (Contrarian MED-1). H2: name that the review is what makes it
                authentic. T4: a one-line "what is Lumio" so a manager who's never
                heard of us knows what the credential is for. */}
            <p className="mt-3 mx-auto text-xs leading-relaxed" style={{ color: C.inkSoft, maxWidth: 380 }}>
              Lumio teaches working adults to use AI on the job. This page confirms a real person at Lumio
              reviewed one real work task submitted for this certificate.
            </p>

            <div>
              <ShareCredentialButton title={view.cert_title} slug={view.cert_slug} />
            </div>

            <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${C.orangeWashBorder}` }}>
              <p className="text-sm" style={{ color: C.umber }}>
                {view.cert_title ? `Want the ${view.cert_title} too?` : "Want a credential like this one?"}
              </p>
              <p className="mt-2 mx-auto text-xs leading-relaxed" style={{ color: C.inkSoft, maxWidth: 360 }}>
                Learn to put AI to use at work, and have something real to show for it. The lessons are
                free to start, and the certificate is one payment when you're ready, reviewed by a real person.
              </p>
              {/* G4: send straight to signup with attribution, not the homepage.
                  A stranger who clicked a real person's credential is already
                  past the "what is this" stage -- the extra homepage hop only
                  loses them. ?ref=verify&cert= carries the source through. */}
              <a
                href={view.cert_slug ? `/signup?ref=verify&cert=${encodeURIComponent(view.cert_slug)}` : "/signup?ref=verify"}
                className={`inline-block mt-3 ${PILL} ${FOCUS_RING}`}
                style={{ backgroundColor: C.orange, color: C.ink }}
              >
                Start free and earn yours →
              </a>
              {/* One invitation, not two: the headline question and this button
                  already complete the thought, so the trailing "there's a track for
                  you too" line was a redundant second ask (Rubin L8). */}
            </div>
          </motion.div>
        ) : view?.errored ? (
          /* A failed lookup (network/RLS) is NOT a fake credential. Showing a real
             holder the "not found" tombstone during a transient blip makes them
             look like a forger on the one page recruiters see, so we offer a retry
             instead (Executor HIGH-1). */
          <motion.div
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.ink }}
            className="w-full rounded-2xl px-8 py-16 text-center"
            style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
            role="alert"
          >
            <h1
              className="font-serif"
              style={{ color: C.espresso, fontSize: 28, fontVariationSettings: displayFV(96, DISPLAY_WEIGHT_SOFT) }}
            >
              Couldn't load this certificate
            </h1>
            <p className="mt-3 text-sm" style={{ color: C.umber }}>
              Something went wrong reaching our server. This doesn't mean the certificate is invalid.
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`inline-block mt-6 ${PILL} ${FOCUS_RING}`}
              style={{ backgroundColor: C.orange, color: C.ink }}
            >
              Try again →
            </button>
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
              href="/?ref=verify"
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
