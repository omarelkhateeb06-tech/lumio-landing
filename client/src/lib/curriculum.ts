// ─────────────────────────────────────────────────────────────────────────────
// Curriculum types — mirror the Phase 2 DB schema (20260528120000_phase2_schema.sql).
// The lesson reader is data-driven from these shapes, not hardcoded per lesson.
// ─────────────────────────────────────────────────────────────────────────────

export type LessonLevel = "beginner" | "growing" | "confident";
export type LessonStatus = "draft" | "published" | "archived";

export type BlockType =
  | "reading"
  | "multiple_choice"
  | "fill_blank"
  | "try_it_live"
  | "before_after"
  | "mini_project";

// ── Per-type content payloads (the jsonb stored in lesson_blocks.content) ──────

export interface ReadingContent {
  markdown: string;
  key_takeaway?: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  is_correct: boolean;
  explanation?: string;
}
export interface MultipleChoiceContent {
  stem: string;
  options: MultipleChoiceOption[];
}

export interface FillBlankSlot {
  id: string;
  accept: string[]; // keyword/regex strings matched case-insensitively
  ideal: string;
}
export interface FillBlankContent {
  template: string; // contains {{1}}, {{2}} ... placeholders matching blank ids
  blanks: FillBlankSlot[];
  explanation?: string;
}

export interface TryItLiveContent {
  instructions: string;
  system_prompt: string;
  ideal_output: string;
  input_placeholder?: string;
}

export interface BeforeAfterContent {
  before_prompt: string;
  after_prompt: string;
  changes: string[];
  question?: string;
}

export interface MiniProjectPart {
  id: string;
  prompt: string;
}
export interface MiniProjectContent {
  brief: string;
  parts: MiniProjectPart[];
  grading_rubric?: string;
}

// ── Discriminated union: a block carries the payload matching its type ─────────

export type LessonBlock =
  | (LessonBlockBase & { type: "reading"; content: ReadingContent })
  | (LessonBlockBase & { type: "multiple_choice"; content: MultipleChoiceContent })
  | (LessonBlockBase & { type: "fill_blank"; content: FillBlankContent })
  | (LessonBlockBase & { type: "try_it_live"; content: TryItLiveContent })
  | (LessonBlockBase & { type: "before_after"; content: BeforeAfterContent })
  | (LessonBlockBase & { type: "mini_project"; content: MiniProjectContent });

export interface LessonBlockBase {
  id: string;
  lesson_id: string;
  order_index: number;
  personalizable: boolean;
}

// ── Row types ──────────────────────────────────────────────────────────────--

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order_index: number;
}

export interface Lesson {
  id: string;
  slug: string;
  module_id: string;
  title: string;
  hook: string | null;
  key_takeaway: string | null;
  level: LessonLevel;
  estimated_minutes: number;
  order_index: number;
  status: LessonStatus;
}

// A lesson with its module joined and its ordered blocks attached — the shape
// the lesson reader consumes.
export interface LessonWithBlocks extends Lesson {
  module: Pick<Module, "slug" | "title" | "order_index">;
  blocks: LessonBlock[];
}
