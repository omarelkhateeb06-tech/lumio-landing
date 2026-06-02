// ─────────────────────────────────────────────────────────────────────────────
// Shared completion celebration — confetti burst + synthesized chime. Used by
// both the lesson reader (mark complete) and the mastery check (pass). Kept in
// one place so the two surfaces can never drift. No audio assets, no packages.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { CONFETTI } from "@/lib/theme";

// A short, pleasant major-chord arpeggio synthesized live — no audio assets, no
// packages. Triggered by a user click so the AudioContext is allowed to start.
// Wrapped in try/catch because audio is a nice-to-have, never load-bearing.
export function playCompletionChime() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Master gain so the whole flourish sits softly under the UI.
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // Ascending major arpeggio: C5 - E5 - G5 - C6 (the "ta-da" shape).
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const start = now + i * 0.085;
      const length = 0.55;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      osc.connect(gain).connect(master);
      osc.start(start);
      osc.stop(start + length + 0.05);
    });

    setTimeout(() => ctx.close().catch(() => {}), 1400);
  } catch {
    // Silent: never let audio break the completion flow.
  }
}

// Full-screen confetti burst on completion. Particles fire outward with an
// upward bias, then fall under "gravity" while spinning — a celebratory rain
// rather than a small puff. aria-hidden + fixed overlay, pointer-events: none.
//
// `soft` halves the particle count for routine moments (a single lesson) so the
// full burst stays reserved for real milestones — finishing a track, passing a
// mastery check, earning a capstone (Rubin: don't spend the big reward on small
// wins, or it stops meaning anything).
export function ConfettiBurst({ soft = false }: { soft?: boolean }) {
  const COUNT = soft ? 40 : 90;
  const colors = CONFETTI;
  const particles = Array.from({ length: COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 120 + Math.random() * 300;
    // Burst target (upward bias so it lifts before falling).
    const bx = Math.cos(angle) * speed;
    const by = Math.sin(angle) * speed - 220;
    const isRibbon = i % 2 === 0;
    return {
      bx,
      by,
      drift: (Math.random() - 0.5) * 120, // sideways sway on the way down
      fall: 380 + Math.random() * 320, // how far below the burst point it lands
      r: Math.random() * 1080 - 540,
      color: colors[i % colors.length],
      w: isRibbon ? 6 + Math.random() * 4 : 7 + Math.random() * 6,
      h: isRibbon ? 12 + Math.random() * 8 : 7 + Math.random() * 6,
      round: !isRibbon,
      delay: Math.random() * 0.1,
      duration: 1.9 + Math.random() * 0.9,
    };
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "50%",
        top: "42%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: [0, p.bx, p.bx + p.drift],
            y: [0, p.by, p.by + p.fall],
            rotate: [0, p.r * 0.5, p.r],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            ease: [0.22, 0.61, 0.36, 1],
            times: [0, 0.4, 1],
            delay: p.delay,
          }}
          style={{
            position: "absolute",
            width: p.w,
            height: p.h,
            borderRadius: p.round ? "50%" : "1px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
