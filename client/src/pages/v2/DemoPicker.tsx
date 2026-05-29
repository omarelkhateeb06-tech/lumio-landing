import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const variants = [
  {
    slug: "/v1",
    name: "v1 — Current",
    tagline: "What's live now (post-audit fixes).",
    description:
      "Editorial-warm card-stack. Hero + interactive PromptRunner + before/after demo + course grid + final CTA. The control.",
    bg: "#FAFAF7",
    fg: "#1C1917",
    accent: "#F97316",
    note: "Control",
  },
  {
    slug: "/v2/dispatch",
    name: "v2 — Dispatch",
    tagline: "Newsroom + terminal. A daily AI dispatch.",
    description:
      "Masthead with live date + dispatch number + subscriber count. Asymmetric 12-col grid. Dark band for the live PromptRunner. 30-lesson typographic curriculum index. Architectural italic 5 on the final CTA.",
    bg: "#F1EEE6",
    fg: "#0E0D0B",
    accent: "#E85D04",
    note: "Bold · Structured",
  },
  {
    slug: "/v2/atelier",
    name: "v2 — Atelier",
    tagline: "Quiet luxury editorial. The headline breathes.",
    description:
      "Single centered reading column. Hero H1 with animated variable-Fraunces axes (opsz/wght/SOFT breathing on a 6s loop). Hairline-framed rounded cards. NYT-style TOC of the first ten lessons. Restrained motion, generous whitespace.",
    bg: "#F4F0E8",
    fg: "#1C1411",
    accent: "#D45A1A",
    note: "Quiet · Luxurious",
  },
];

export default function DemoPicker() {
  return (
    <div className="min-h-screen px-6 md:px-12 py-12 md:py-20" style={{ backgroundColor: "#0E0D0B", color: "#F1EEE6" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12 md:mb-20">
          <div
            className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ color: "rgba(241,238,230,0.5)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            Lumio · Compare directions
          </div>
          <h1
            className="font-serif"
            style={{
              color: "#F1EEE6",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 144, "wght" 380',
              maxWidth: "780px",
            }}
          >
            Three directions for the landing page.{" "}
            <em className="font-normal" style={{ color: "#E85D04" }}>
              Pick one or send it to Manus.
            </em>
          </h1>
          <p className="mt-6 max-w-[600px] text-base leading-relaxed" style={{ color: "rgba(241,238,230,0.65)" }}>
            Synthesized from 10 design audits. Click into each to feel it. Open in separate tabs and tab between them to
            compare. The Manus prompt for an outside take is at <code className="px-1.5 py-0.5 rounded bg-white/10">MANUS_PROMPT.md</code> in the repo root.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {variants.map((v) => (
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
              <div className="p-8 md:p-10 flex flex-col h-full min-h-[420px]">
                <div className="flex items-baseline justify-between mb-8">
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] font-medium"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: v.fg, opacity: 0.55 }}
                  >
                    {v.note}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: v.accent }} />
                </div>
                <h2
                  className="font-serif mb-3"
                  style={{
                    fontSize: 36,
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    fontVariationSettings: '"opsz" 144, "wght" 400',
                    color: v.fg,
                  }}
                >
                  {v.name}
                </h2>
                <p className="font-serif italic mb-6" style={{ color: v.accent, fontSize: 18 }}>
                  {v.tagline}
                </p>
                <p className="text-sm leading-relaxed mt-auto" style={{ color: v.fg, opacity: 0.7 }}>
                  {v.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm" style={{ color: "rgba(241,238,230,0.7)" }}>
          <div className="rounded-xl p-6" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
              style={{ color: "#E85D04", fontFamily: "'JetBrains Mono', monospace" }}
            >
              How to evaluate
            </div>
            <ul className="space-y-2">
              <li>1. Open each in a separate tab. Tab between them quickly.</li>
              <li>2. Read the hero out loud. Which one makes you feel something?</li>
              <li>3. Try the PromptRunner on each. Which interaction feels alive?</li>
              <li>4. Scroll to the curriculum. Which one makes you trust there are 30 lessons?</li>
              <li>5. Show one to a friend without saying which is yours. What do they call it?</li>
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3"
              style={{ color: "#E85D04", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Want a 4th opinion?
            </div>
            <p className="leading-relaxed">
              The file <code className="px-1.5 py-0.5 rounded bg-white/10">MANUS_PROMPT.md</code> in the repo root contains a full
              transformation brief baked from all 10 audits. Paste it into Manus (or any AI website builder) and compare what it
              produces against these three. Different tools, same source brief, very different outputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
