import { useEffect, useState } from "react";
import { useParams } from "wouter";
import {
  motion, useScroll, useReducedMotion, useTransform, AnimatePresence,
} from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCompletedLessonIds,
  fetchCurriculum,
  fetchLessonBySlug,
  markLessonComplete,
  trackLoopsEvent,
  unmarkLessonComplete,
} from "@/lib/supabase";
import type { CurriculumLesson, LessonReaderData } from "@/lib/supabase";
import type { LessonBlock } from "@/lib/curriculum";
import { C, FOCUS_RING, FONT_MONO, SKIP_LINK, displayFV, DISPLAY_WEIGHT_SOFT, PILL } from "@/lib/theme";
import { dur, ease } from "@/lib/motion";
import { BrandNav } from "@/components/marketing";
import { ConfettiBurst, playCompletionChime } from "@/components/Celebration";
import BeforeAfterBlock from "@/components/lesson/BeforeAfterBlock";
import MultipleChoiceBlock from "@/components/lesson/MultipleChoiceBlock";
import FillBlankBlock from "@/components/lesson/FillBlankBlock";
import TryItLiveBlock from "@/components/lesson/TryItLiveBlock";
import PersonalizationLayer from "@/components/lesson/PersonalizationLayer";
import { usePersonalizedBlock } from "@/hooks/usePersonalizedBlock";

// ─────────────────────────────────────────────────────────────────────────────
// Nav action — lesson pages drop the orange top strip for the scroll-progress bar.
// ─────────────────────────────────────────────────────────────────────────────

// Loops lifecycle events must fire at most once per browser session. Loops
// journeys are not idempotent, so a double-fire would send a duplicate email.
// We dedupe by event name in a module-level set that lives for the session.
const firedLoopsEvents = new Set<string>();
function fireLoopsEventOnce(eventName: string) {
  if (firedLoopsEvents.has(eventName)) return;
  firedLoopsEvents.add(eventName);
  void trackLoopsEvent(eventName);
}

const DashboardLink = (
  <a
    href="/app"
    className={`text-[13px] font-medium tracking-tight ${FOCUS_RING}`}
    style={{ color: C.umber }}
  >
    ← Dashboard
  </a>
);

// ─────────────────────────────────────────────────────────────────────────────
// Inline renderer — handles **bold** within any span of text
// ─────────────────────────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  // Split on **bold** and *italic* patterns, preserving delimiters as chunks
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} style={{ color: C.espresso }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} style={{ color: C.umber }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer
// Paragraphs separated by "\n\n". Lines starting with "- " are list items.
// Inline **bold** is handled by renderInline on every line.
// ─────────────────────────────────────────────────────────────────────────────

function renderMarkdown(body: string) {
  const paragraphs = body.split("\n\n");

  return paragraphs.map((para, pIdx) => {
    const lines = para.split("\n").filter((l) => l.trim() !== "");

    // List block: every line starts with "- "
    const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
    if (isList) {
      return (
        <ul
          key={pIdx}
          className="mb-5 pl-5 space-y-1"
          style={{ color: C.ink, lineHeight: 1.7, listStyleType: "disc" }}
        >
          {lines.map((l, i) => (
            <li key={i} className="text-lg">
              {renderInline(l.slice(2))}
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph — join lines, render with inline bold
    const fullText = lines.join(" ");
    return (
      <p key={pIdx} className="mb-5 text-lg" style={{ color: C.ink, lineHeight: 1.7 }}>
        {renderInline(fullText)}
      </p>
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Block renderer — renders a lesson block by its type. Interactive block types
// (multiple_choice, fill_blank, try_it_live, before_after) arrive in Phase 3;
// for now the published curriculum uses reading + mini_project.
// ─────────────────────────────────────────────────────────────────────────────

function ExerciseCard({ brief, parts }: { brief: string; parts: { id: string; prompt: string }[] }) {
  return (
    <div
      className="mt-10 p-6 rounded-2xl"
      style={{ backgroundColor: C.paperHi, border: `1px solid ${C.hairline}` }}
    >
      <div
        className="text-[12px] uppercase tracking-[0.18em] mb-2"
        style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
      >
        Your exercise
      </div>
      <p className="text-sm leading-relaxed" style={{ color: C.espresso }}>
        {brief}
      </p>
      {parts.length > 0 && (
        <ol className="mt-3 pl-5 space-y-1.5 text-sm list-decimal" style={{ color: C.espresso }}>
          {parts.map((part) => (
            <li key={part.id}>{part.prompt}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

function renderBlock(block: LessonBlock) {
  switch (block.type) {
    case "reading":
      return <div key={block.id}>{renderMarkdown(block.content.markdown)}</div>;
    case "mini_project":
      return <ExerciseCard key={block.id} brief={block.content.brief} parts={block.content.parts} />;
    case "multiple_choice":
      return <MultipleChoiceBlock key={block.id} blockId={block.id} content={block.content} />;
    case "fill_blank":
      return <FillBlankBlock key={block.id} blockId={block.id} content={block.content} />;
    case "try_it_live":
      return <TryItLiveBlock key={block.id} blockId={block.id} content={block.content} />;
    case "before_after":
      return <BeforeAfterBlock key={block.id} blockId={block.id} content={block.content} />;
    default:
      return null;
  }
}

// Wraps a block with its personalized version when one is cached and fresh for
// the current user. The base block always renders; personalization is additive
// framing layered around it. Calling the hook here (one component per block)
// keeps the hook count stable across renders.
function RenderedBlock({ block }: { block: LessonBlock }) {
  const { content, personalization, isPersonalized } = usePersonalizedBlock(block.id, block);
  if (isPersonalized && personalization) {
    return (
      <PersonalizationLayer personalization={personalization}>
        {renderBlock(content)}
      </PersonalizationLayer>
    );
  }
  return renderBlock(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Lesson() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  useAuth(); // ensures auth context is wired (ProtectedRoute handles redirect)

  const rm = useReducedMotion() ?? false;
  const [lesson, setLesson] = useState<LessonReaderData | null>(null);
  const [order, setOrder] = useState<CurriculumLesson[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchLessonBySlug(slug), fetchCurriculum(), fetchCompletedLessonIds()]).then(
      ([lessonData, curriculum, done]) => {
        if (cancelled) return;
        setLesson(lessonData);
        setOrder(curriculum.lessons);
        setCompleted(done);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const index = order.findIndex((l) => l.slug === slug);
  const position = index >= 0 ? index + 1 : 0;
  const total = order.length;
  const prev = index > 0 ? order[index - 1] : undefined;
  const next = index >= 0 && index < order.length - 1 ? order[index + 1] : undefined;
  const isCompleted = lesson ? completed.has(lesson.id) : false;

  // The learner has opened a lesson they have not finished yet: that counts as
  // starting it. Fired once per session (the guard dedupes), so the Loops
  // "Day 2 nudge" journey knows the learner engaged.
  useEffect(() => {
    if (lesson && !isCompleted) {
      fireLoopsEventOnce("lesson_started");
    }
  }, [lesson, isCompleted]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "ArrowLeft" || e.key === "j") && prev) {
        window.location.href = `/lesson/${prev.slug}`;
      }
      if ((e.key === "ArrowRight" || e.key === "k") && next) {
        window.location.href = `/lesson/${next.slug}`;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next]);

  async function handleMarkComplete() {
    if (!lesson) return;
    setMarking(true);
    const res = await markLessonComplete(lesson.id);
    setMarking(false);
    if (res.ok) {
      setCompleted((prev) => new Set(prev).add(lesson.id));
      // Re-read the authoritative completed count and fire any milestone the
      // learner just crossed. Best-effort and deduped: never blocks the UX.
      try {
        const ids = await fetchCompletedLessonIds();
        const count = ids.size;
        if (count === 1) fireLoopsEventOnce("lesson_started");
        if (count === 5) fireLoopsEventOnce("lesson_5_milestone");
        if (count === 15) fireLoopsEventOnce("lesson_15_halfway");
        if (count === 30) fireLoopsEventOnce("lesson_30_complete");
      } catch {
        // ignore — milestone tracking is best-effort
      }
      if (!rm) {
        setShowConfetti(true);
        // The chime + full burst is reserved for milestones. Finishing the whole
        // course (no next lesson) earns it; a routine lesson gets a quieter, soft
        // burst and the toast, so the big moments stay distinct (Rubin).
        if (!next) playCompletionChime();
        setTimeout(() => setShowConfetti(false), 3000);
      }
      toast.success("Lesson marked complete.", {
        description: next
          ? `Next up: ${next.title}`
          : "You finished every lesson. Well done.",
        duration: 5000,
        style: { backgroundColor: C.paperHi, color: C.espresso, border: `1px solid ${C.hairline}` },
        action: {
          label: "Undo",
          onClick: async () => {
            await unmarkLessonComplete(lesson.id);
            setCompleted((prev) => {
              const nextSet = new Set(prev);
              nextSet.delete(lesson.id);
              return nextSet;
            });
          },
        },
      });
    }
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={720} topAccent={false} right={DashboardLink} />
        <div className="max-w-[720px] mx-auto px-6 pt-40">
          <div className="rounded animate-pulse mb-4" style={{ backgroundColor: C.hairline, height: 14, width: 180 }} />
          <div className="rounded animate-pulse mb-3" style={{ backgroundColor: C.hairline, height: 48, width: "80%" }} />
          <div className="rounded animate-pulse mb-8" style={{ backgroundColor: C.hairline, height: 28, width: "60%" }} />
          <div className="rounded animate-pulse mb-3" style={{ backgroundColor: C.hairline, height: 200 }} />
        </div>
      </div>
    );
  }

  // 404 state
  if (!lesson) {
    return (
      <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
        <BrandNav maxWidth={720} topAccent={false} right={DashboardLink} />
        <div className="max-w-[720px] mx-auto px-6 py-40 text-center">
          <p
            className="font-serif text-3xl"
            style={{ color: C.umber, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
          >
            Lesson not found.
          </p>
          <a href="/app" className={`inline-block mt-6 text-sm underline ${FOCUS_RING}`} style={{ color: C.orangeInk }}>
            ← Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100dvh", color: C.ink }}>
      <a href="#lesson-content" className={SKIP_LINK}>Skip to content</a>
      <BrandNav maxWidth={720} topAccent={false} right={DashboardLink} />

      {/* Scroll-progress bar */}
      {!rm && (
        <motion.div
          style={{
            scaleX,
            transformOrigin: "left",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: C.orange,
            zIndex: 50,
          }}
        />
      )}

      {/* Progress indicator strip */}
      <div
        className="pt-[66px]"
        style={{ borderBottom: `1px solid ${C.hairline}` }}
      >
        <div className="max-w-[720px] mx-auto px-6 py-4">
          <p
            className="text-[12px] uppercase tracking-[0.18em]"
            style={{ color: C.umber, fontFamily: FONT_MONO }}
          >
            {position > 0 ? `Lesson ${position} of ${total} · ` : ""}{lesson.module_title} · {lesson.estimated_minutes} min
          </p>
        </div>
      </div>

      {/* Article */}
      <motion.article
        id="lesson-content"
        initial={rm ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur.base, delay: 0.08, ease: ease.ink }}
        className="max-w-[720px] mx-auto px-6 py-16"
      >
        {/* Module label */}
        <div
          className="text-[12px] uppercase tracking-[0.18em] mb-3"
          style={{ color: C.umber, fontFamily: FONT_MONO }}
        >
          {lesson.module_title}
        </div>

        {/* Title */}
        <h1
          className="font-serif"
          style={{
            color: C.espresso,
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontVariationSettings: displayFV(144, DISPLAY_WEIGHT_SOFT),
          }}
        >
          {lesson.title}
        </h1>

        {/* Hook */}
        {lesson.hook && (
          <p
            className="mt-7 mb-8 font-serif text-2xl italic leading-snug"
            style={{ color: C.orangeInk, fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT) }}
          >
            {lesson.hook}
          </p>
        )}

        {/* Blocks (reading, exercise, ...) in order */}
        {lesson.blocks.map((block) => (
          <RenderedBlock key={block.id} block={block} />
        ))}

        {/* Key takeaway */}
        {lesson.key_takeaway && (
          <div
            className="mt-8 rounded-2xl px-6 py-5"
            style={{
              backgroundColor: C.orangeWash,
              border: `1px solid ${C.orangeWashBorder}`,
            }}
          >
            <div
              className="text-[12px] uppercase tracking-[0.18em] mb-2"
              style={{ color: C.orangeInk, fontFamily: FONT_MONO }}
            >
              Key takeaway
            </div>
            <p
              className="font-serif italic text-lg leading-relaxed"
              style={{
                color: C.espresso,
                fontVariationSettings: displayFV(72, DISPLAY_WEIGHT_SOFT),
              }}
            >
              {lesson.key_takeaway}
            </p>
          </div>
        )}

        {/* Complete button */}
        <div
          className="relative mt-12 pt-8"
          style={{ borderTop: `1px solid ${C.hairline}` }}
        >
          <AnimatePresence>
            {showConfetti && <ConfettiBurst soft={!!next} />}
          </AnimatePresence>
          {/* Persistent live region so completion is announced reliably (the badge
              below mounts via AnimatePresence and would not announce on its own). */}
          <p className="sr-only" aria-live="polite">
            {isCompleted ? `${lesson.title} marked complete.` : ""}
          </p>
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                initial={rm ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: dur.base, ease: ease.ink }}
                className="flex items-center gap-4 flex-wrap"
              >
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border"
                  style={{
                    color: C.forest,
                    borderColor: C.forest,
                    backgroundColor: "transparent",
                  }}
                >
                  Completed <span aria-hidden="true">✓</span>
                </span>
                {next && (
                  <a
                    href={`/lesson/${next.slug}`}
                    className={`inline-flex items-center gap-2 ${PILL} ${FOCUS_RING}`}
                    style={{ backgroundColor: C.orange, color: C.ink }}
                  >
                    Next: {next.title} →
                  </a>
                )}
                {!next && (
                  <a
                    href="/app"
                    className={`inline-flex items-center gap-2 ${PILL} ${FOCUS_RING}`}
                    style={{ backgroundColor: C.forest, color: C.paper }}
                  >
                    Back to dashboard →
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="mark-complete"
                onClick={handleMarkComplete}
                disabled={marking}
                whileTap={rm ? undefined : { scale: 0.97 }}
                className={`${PILL} disabled:opacity-50 cursor-pointer ${FOCUS_RING}`}
                style={{ backgroundColor: C.ink, color: C.paper }}
              >
                {marking ? "Saving…" : <>Mark complete <span aria-hidden="true">✓</span></>}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Lesson navigation */}
        <nav
          className="mt-8 flex items-center justify-between gap-4 flex-wrap"
          aria-label="Lesson navigation"
          aria-keyshortcuts="ArrowLeft ArrowRight j k"
        >
          {prev ? (
            <a
              href={`/lesson/${prev.slug}`}
              className="text-sm hover:underline"
              style={{ color: C.umber }}
            >
              ← {prev.title}
            </a>
          ) : (
            <span />
          )}

          {!prev && !next && (
            <a
              href="/app"
              className="mx-auto text-sm hover:underline"
              style={{ color: C.umber }}
            >
              ← Back to dashboard
            </a>
          )}

          {next ? (
            <a
              href={`/lesson/${next.slug}`}
              className="text-sm hover:underline ml-auto"
              style={{ color: C.umber }}
            >
              {next.title} →
            </a>
          ) : (
            <span />
          )}
        </nav>
        {(prev || next) && (
          <p
            className="hidden md:block mt-3 text-center"
            style={{ color: C.inkSoft, fontFamily: FONT_MONO, fontSize: 12 }}
          >
            Use your arrow keys to move between lessons
          </p>
        )}
      </motion.article>
    </div>
  );
}
