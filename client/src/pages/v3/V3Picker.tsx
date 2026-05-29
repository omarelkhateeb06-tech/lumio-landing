import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

type Variant = {
  slug: string;
  badge: string;
  name: string;
  tagline: string;
  description: string;
  bg: string;
  fg: string;
  accent: string;
  group: "v1" | "v2" | "v3";
  external?: boolean;
};

const variants: Variant[] = [
  {
    slug: "/v1",
    badge: "Control",
    name: "v1 · Current",
    tagline: "The original (post-audit fixes).",
    description:
      "Editorial-warm card-stack. Hero + email + interactive PromptRunner + before/after demo + course grid + final CTA. The baseline you've been iterating on.",
    bg: "#FAFAF7", fg: "#1C1917", accent: "#F97316", group: "v1",
  },
  {
    slug: "/v2/dispatch",
    badge: "v2 · Bold",
    name: "v2 · Dispatch",
    tagline: "Newsroom + terminal. First swing.",
    description:
      "Newspaper masthead with live date. Asymmetric 12-col grid. Dark band PromptRunner. 30-lesson curriculum index. Architectural italic 5. Fake ticking subscriber count (audited flaw).",
    bg: "#F1EEE6", fg: "#0E0D0B", accent: "#E85D04", group: "v2",
  },
  {
    slug: "/v2/atelier",
    badge: "v2 · Quiet",
    name: "v2 · Atelier",
    tagline: "Luxury editorial. First swing.",
    description:
      "Centered reading column. Hero H1 with breathing variable-Fraunces axes on an 8s perpetual loop (audited flaw). Pill email form. Only 10 of 30 lessons shown.",
    bg: "#F4F0E8", fg: "#1C1411", accent: "#D45A1A", group: "v2",
  },
  {
    slug: "/v3/dispatch",
    badge: "v3 · Path 1",
    name: "v3 · Dispatch v2",
    tagline: "All 11 audit fixes applied.",
    description:
      "Real Supabase subscriber count. Masthead stripped to wordmark + Subscribe. Date/Vol/No moved to colophon under hero. Pill email form. Hero axis settles ONCE on load. Right-rail spec sheet on curriculum. 'THE HABIT' final CTA. Dark-band contrast fixed. Omar-signed line.",
    bg: "#F1EEE6", fg: "#0E0D0B", accent: "#E85D04", group: "v3",
  },
  {
    slug: "/v3/atelier",
    badge: "v3 · Path 2",
    name: "v3 · Atelier v2",
    tagline: "Soul pick, refined.",
    description:
      "Hero axis SETTLES once on load (no more 8s loop). Full 30-lesson curriculum (Hormozi's fix: show the stack). Omar-signed line. Same restrained typography. Live PromptRunner.",
    bg: "#F4F0E8", fg: "#1C1411", accent: "#D45A1A", group: "v3",
  },
  {
    slug: "/v3/sequence",
    badge: "v3 · Path 3",
    name: "v3 · Sequence",
    tagline: "Best-of-everything hybrid.",
    description:
      "Atelier centered hero with once-on-load settle. Pill email form. Manus's orange hairline at top + horizontal spec strip below hero. Dark Dispatch PromptRunner (contrast-fixed). Full 30-lesson curriculum with today's lesson highlighted in orange. 'THE HABIT' final CTA + architectural italic 5.",
    bg: "#F2EFE7", fg: "#0E0D0B", accent: "#E85D04", group: "v3",
  },
];

const groups: { id: "v1" | "v2" | "v3"; title: string; subtitle: string }[] = [
  { id: "v1", title: "Original", subtitle: "Where we started." },
  { id: "v2", title: "First two directions", subtitle: "Built before the audits. Kept untouched for comparison." },
  { id: "v3", title: "Audit-informed rebuilds", subtitle: "Three paths from the master synthesis. Naval / Rubin / Hormozi / Contrarian / First Principles / UI/UX Pro Max / Design synthesis all weighed in." },
];

export default function V3Picker() {
  return (
    <div className="min-h-screen px-6 md:px-12 py-12 md:py-20" style={{ backgroundColor: "#0E0D0B", color: "#F1EEE6" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 md:mb-16">
          <div
            className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ color: "rgba(241,238,230,0.5)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            Lumio · Six landing pages · Plus Manus
          </div>
          <h1
            className="font-serif"
            style={{
              color: "#F1EEE6",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 144, "wght" 380',
              maxWidth: "880px",
              textWrap: "balance" as const,
            }}
          >
            Compare every version side by side.{" "}
            <em className="font-normal" style={{ color: "#E85D04" }}>
              Open them in separate tabs.
            </em>
          </h1>
          <p className="mt-6 max-w-[680px] text-base leading-relaxed" style={{ color: "rgba(241,238,230,0.65)" }}>
            v1 is the original (audit-fixed). v2 are the first two distinct directions before the master synthesis. v3 are the three audit-informed rebuilds. Plus the Manus output for reference (screenshot only. Manus deployed it in their own environment).
          </p>
        </div>

        {groups.map((g) => {
          const items = variants.filter((v) => v.group === g.id);
          return (
            <section key={g.id} className="mb-14">
              <div className="flex items-baseline gap-4 mb-6">
                <h2
                  className="font-serif"
                  style={{
                    color: "#F1EEE6",
                    fontSize: 28,
                    fontVariationSettings: '"opsz" 144, "wght" 400',
                  }}
                >
                  {g.title}
                </h2>
                <p className="text-sm italic" style={{ color: "rgba(241,238,230,0.55)" }}>
                  {g.subtitle}
                </p>
              </div>
              <div className={`grid gap-6 grid-cols-1 ${items.length >= 3 ? "lg:grid-cols-3" : items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
                {items.map((v) => (
                  <Link
                    key={v.slug}
                    href={v.slug}
                    className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 duration-300"
                    style={{
                      backgroundColor: v.bg,
                      color: v.fg,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="p-7 md:p-9 flex flex-col h-full min-h-[340px]">
                      <div className="flex items-baseline justify-between mb-6">
                        <span
                          className="text-[10px] uppercase tracking-[0.22em] font-medium"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: v.fg, opacity: 0.55 }}
                        >
                          {v.badge}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: v.accent }} />
                      </div>
                      <h3
                        className="font-serif mb-3"
                        style={{
                          fontSize: 28,
                          lineHeight: 1.0,
                          letterSpacing: "-0.02em",
                          fontVariationSettings: '"opsz" 144, "wght" 400',
                          color: v.fg,
                        }}
                      >
                        {v.name}
                      </h3>
                      <p className="font-serif italic mb-5" style={{ color: v.accent, fontSize: 16 }}>
                        {v.tagline}
                      </p>
                      <p className="text-sm leading-relaxed mt-auto" style={{ color: v.fg, opacity: 0.72 }}>
                        {v.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Manus reference */}
        <section className="mb-14">
          <div className="flex items-baseline gap-4 mb-6">
            <h2
              className="font-serif"
              style={{ color: "#F1EEE6", fontSize: 28, fontVariationSettings: '"opsz" 144, "wght" 400' }}
            >
              The outside take
            </h2>
            <p className="text-sm italic" style={{ color: "rgba(241,238,230,0.55)" }}>
              Same brief, different builder.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(241,238,230,0.03)" }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
              style={{ color: "#E85D04", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Manus output
            </div>
            <h3
              className="font-serif mb-3"
              style={{ color: "#F1EEE6", fontSize: 28, fontVariationSettings: '"opsz" 144, "wght" 400' }}
            >
              The Manus version.
            </h3>
            <p className="text-sm leading-relaxed mb-4 max-w-[760px]" style={{ color: "rgba(241,238,230,0.72)" }}>
              Manus ran the same MANUS_PROMPT.md brief and produced its own newspaper-editorial direction with Didone serif, structured right-rail spec sheet, founder voice as pull quote, and "THE HABIT" final CTA. <strong style={{ color: "#E85D04" }}>It also violated the brief by inventing a fake testimonial</strong> ("LEO RUBIN, DESIGN AUDITOR"). Open in Manus to see it live.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(241,238,230,0.5)" }}>
              You have the screenshots in your conversation. Manus's deployed URL is the one place this exists. Use it for comparison against v2/dispatch and v3/dispatch.
            </p>
          </div>
        </section>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm" style={{ color: "rgba(241,238,230,0.7)" }}>
          <div className="rounded-xl p-6" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
              style={{ color: "#E85D04", fontFamily: "'JetBrains Mono', monospace" }}
            >
              How to evaluate
            </div>
            <ul className="space-y-2">
              <li>1. Open each in its own browser tab. Tab between them fast.</li>
              <li>2. Read the hero out loud on each. Which one's voice fits the product?</li>
              <li>3. Try the PromptRunner on each (v3 versions all have a working backend).</li>
              <li>4. Scroll to the curriculum. Which makes you trust there are 30 real lessons?</li>
              <li>5. Show one to a non-designer friend. What do they call the product?</li>
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
              style={{ color: "#E85D04", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Council scorecard recap
            </div>
            <ul className="space-y-2">
              <li><strong>Atelier (soul):</strong> Naval, Rubin, Contrarian. 3 votes</li>
              <li><strong>Dispatch (proof):</strong> Hormozi, First Principles, UI/UX Pro Max, Design Synthesis ·4 votes</li>
              <li><strong>Manus:</strong> 0 votes (disqualified for fake testimonial)</li>
              <li className="pt-2 italic" style={{ color: "rgba(241,238,230,0.55)" }}>Sequence is the synthesis of all three ·Atelier's hero + Dispatch's backbone + Manus's best structural moves.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
