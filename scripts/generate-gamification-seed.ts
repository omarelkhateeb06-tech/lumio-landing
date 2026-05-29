// ─────────────────────────────────────────────────────────────────────────────
// Seed generator: badges + mastery checks for the Phase B/C gamification layer.
// Emits a paste-ready, dollar-quoted SQL file for badge_definitions,
// mastery_checks, and mastery_check_questions.
//
// Run:  pnpm tsx scripts/generate-gamification-seed.ts
// Out:  supabase/migrations/20260529120001_seed_gamification.sql
//
// Idempotent: deterministic uuid v5 ids + ON CONFLICT upserts. Content only;
// never touches user tables. Run AFTER 20260529120000_gamification_schema.sql.
//
// No em dashes in any user-facing string (titles, stems, options, explanations).
// ─────────────────────────────────────────────────────────────────────────────

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { uuidv5 } from "./uuid.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── id derivation (extends scripts/uuid.ts idFor with the new content kinds) ───
const idFor = {
  module: (slug: string) => uuidv5(`module:${slug}`),
  lesson: (slug: string) => uuidv5(`lesson:${slug}`),
  badge: (slug: string) => uuidv5(`badge:${slug}`),
  check: (slug: string) => uuidv5(`mastery_check:${slug}`),
  question: (checkSlug: string, order: number) =>
    uuidv5(`mastery_check_question:${checkSlug}:${order}`),
};

// ── dollar-quoting helpers (same TAG as generate-seed.ts) ──────────────────────
const TAG = "lum";
const dq = (v: string) => `$${TAG}$${v}$${TAG}$`;
const jsonbLit = (v: unknown) => `${dq(JSON.stringify(v))}::jsonb`;
const sqlText = (v: string | null) => (v == null ? "NULL" : dq(v));

// ── Badge definitions ──────────────────────────────────────────────────────────
type Badge = {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  tier: "bronze" | "silver" | "gold";
  criteria_type: string;
  criteria_config: Record<string, unknown>;
  points_reward: number;
};

const BADGES: Badge[] = [
  {
    slug: "first-steps",
    name: "First Steps",
    description: "You finished your first lesson. The hard part is starting, and you just did it.",
    icon: "footprints",
    tier: "bronze",
    criteria_type: "lessons_completed_total",
    criteria_config: { count: 1 },
    points_reward: 0,
  },
  {
    slug: "foundations-cleared",
    name: "Foundations Cleared",
    description: "Every lesson in Foundations, done. You have the base the rest of the course builds on.",
    icon: "flag",
    tier: "silver",
    criteria_type: "module_completed",
    criteria_config: { module_slug: "foundations" },
    points_reward: 100,
  },
  {
    slug: "module-master",
    name: "Module Master",
    description: "You tested out of a whole module with a check. You earned the skip.",
    icon: "crown",
    tier: "gold",
    criteria_type: "module_mastered_via_check",
    criteria_config: {},
    points_reward: 50,
  },
  {
    slug: "test-out-ace",
    name: "Test-Out Ace",
    description: "A perfect score on a placement check. Not a single question missed.",
    icon: "sparkles",
    tier: "gold",
    criteria_type: "check_aced",
    criteria_config: {},
    points_reward: 50,
  },
  {
    slug: "week-one",
    name: "Week One",
    description: "Seven days in a row. You are building a habit, not just taking a course.",
    icon: "flame",
    tier: "bronze",
    criteria_type: "streak_days",
    criteria_config: { days: 7 },
    points_reward: 25,
  },
  {
    slug: "consistent",
    name: "Consistent",
    description: "A thirty day streak. This is what mastery actually looks like.",
    icon: "flame",
    tier: "silver",
    criteria_type: "streak_days",
    criteria_config: { days: 30 },
    points_reward: 100,
  },
  {
    slug: "quick-study",
    name: "Quick Study",
    description: "Five lessons in a single day. Someone is on a roll.",
    icon: "zap",
    tier: "silver",
    criteria_type: "lessons_completed_in_day",
    criteria_config: { count: 5 },
    points_reward: 25,
  },
  {
    slug: "polymath",
    name: "Polymath",
    description: "You completed lessons across all six modules. A genuinely broad foundation.",
    icon: "compass",
    tier: "gold",
    criteria_type: "lessons_in_distinct_modules",
    criteria_config: { count: 6 },
    points_reward: 100,
  },
  {
    slug: "centurion",
    name: "Centurion",
    description: "One thousand points earned. Real, measurable progress.",
    icon: "gem",
    tier: "gold",
    criteria_type: "total_points",
    criteria_config: { points: 1000 },
    points_reward: 0,
  },
  {
    slug: "credentialed",
    name: "Credentialed",
    description: "You earned a verifiable Lumio certificate. The top of the ladder.",
    icon: "badge-check",
    tier: "gold",
    criteria_type: "cert_earned",
    criteria_config: {},
    points_reward: 0,
  },
];

// ── Mastery checks ───────────────────────────────────────────────────────────--
type MCQ = {
  type: "multiple_choice";
  stem: string;
  options: { id: string; label: string; is_correct: boolean; explanation?: string }[];
};
type FillBlank = {
  type: "fill_blank";
  template: string;
  blanks: { id: string; accept: string[]; ideal: string }[];
  explanation?: string;
};
type Question = MCQ | FillBlank;

type Check = {
  slug: string;
  scope: "lesson" | "module" | "level";
  moduleSlug?: string;
  lessonSlug?: string;
  level?: "beginner" | "growing" | "confident";
  title: string;
  description: string;
  pass_threshold: number;
  questions: Question[];
};

const CHECKS: Check[] = [
  {
    slug: "foundations-module-check",
    scope: "module",
    moduleSlug: "foundations",
    title: "Foundations: test out",
    description:
      "Already comfortable with the basics? Answer these and the whole Foundations module leaves your path, marked complete.",
    pass_threshold: 0.8,
    questions: [
      {
        type: "multiple_choice",
        stem: "You need to know today's exact interest rate to quote a client. Which tool fits?",
        options: [
          { id: "a", label: "Google, because it is a fact with a verifiable source", is_correct: true, explanation: "Facts that exist in the world and change in real time are Google's job, not a language model's." },
          { id: "b", label: "ChatGPT, because it is faster than searching", is_correct: false, explanation: "A model has a knowledge cutoff and cannot check live values. You would risk a confident wrong number." },
          { id: "c", label: "Either one works equally well", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "Which task is the better fit for ChatGPT than for Google?",
        options: [
          { id: "a", label: "Finding what a specific regulation says word for word", is_correct: false },
          { id: "b", label: "Restructuring a messy paragraph into a clear one", is_correct: true, explanation: "Reasoning, synthesis, and generation are what a model is for." },
          { id: "c", label: "Checking yesterday's closing stock price", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "An AI answer cites a study with a precise journal, year, and percentage. What is the right move?",
        options: [
          { id: "a", label: "Trust it, the specificity proves it is real", is_correct: false, explanation: "Invented citations are often precise in the wrong way. Specificity is not proof." },
          { id: "b", label: "Verify the citation before using it", is_correct: true, explanation: "Suspiciously specific detail is one of the four hallucination tells. Always verify." },
          { id: "c", label: "Assume it is false and discard the whole answer", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "Why is hallucination described as structural rather than a bug?",
        options: [
          { id: "a", label: "The model predicts plausible-sounding text, so it will invent a plausible answer even when it does not know", is_correct: true, explanation: "It is how the model works, which is why you verify rather than expect a future fix." },
          { id: "b", label: "The servers are overloaded and make mistakes", is_correct: false },
          { id: "c", label: "It only happens with old models", is_correct: false },
        ],
      },
      {
        type: "fill_blank",
        template: "The three parts of the framing technique are role, {{1}}, and constraints.",
        blanks: [{ id: "1", accept: ["task", "specific task"], ideal: "task" }],
        explanation: "Role plus a specific task plus constraints turns a generic answer into a useful one.",
      },
      {
        type: "multiple_choice",
        stem: "What mainly separates a brief from a prompt?",
        options: [
          { id: "a", label: "A brief is just a longer prompt", is_correct: false },
          { id: "b", label: "A brief adds context, stakes, examples, and rejection criteria", is_correct: true, explanation: "You would not hand a collaborator one sentence and expect professional work." },
          { id: "c", label: "A brief must always be written by the AI", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "What belongs in custom instructions?",
        options: [
          { id: "a", label: "A one-off request for today's specific task", is_correct: false, explanation: "Task-specific instructions do not belong in persistent settings." },
          { id: "b", label: "Persistent identity: who you are, how you want responses, your tone", is_correct: true, explanation: "Custom instructions are a permanent brief injected before every conversation." },
          { id: "c", label: "Your password so the model can log in for you", is_correct: false },
        ],
      },
      {
        type: "fill_blank",
        template: "Adding good {{1}} criteria to a brief, the things that would make the output bad, is as important as the instructions themselves.",
        blanks: [{ id: "1", accept: ["rejection", "reject"], ideal: "rejection" }],
        explanation: "Telling the model what bad looks like is what cuts revision rounds.",
      },
    ],
  },
  {
    slug: "beginner-level-check",
    scope: "level",
    level: "beginner",
    title: "Beginner level: test out",
    description:
      "Confident with the beginner material across modules? Clear every beginner lesson at once by passing this check.",
    pass_threshold: 0.8,
    questions: [
      {
        type: "multiple_choice",
        stem: "What is the fastest test for whether to use Google or ChatGPT?",
        options: [
          { id: "a", label: "Ask whether the answer already exists in the world, or needs to be created", is_correct: true, explanation: "Exists and verifiable goes to Google; created or reasoned through goes to ChatGPT." },
          { id: "b", label: "Always start with Google and switch only if it fails", is_correct: false },
          { id: "c", label: "Pick whichever tab is already open", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "You get an AI answer about a very recent event with no hedging. What does that suggest?",
        options: [
          { id: "a", label: "It is likely fabricated or outdated, since recent events sit past the training cutoff", is_correct: true, explanation: "Confident claims about recent events are one of the four tells." },
          { id: "b", label: "It is definitely accurate because it sounds sure", is_correct: false },
          { id: "c", label: "Recent events are the model's strongest area", is_correct: false },
        ],
      },
      {
        type: "fill_blank",
        template: "Before pasting AI output into a document with your name on it, you should {{1}} anything you would stake your reputation on.",
        blanks: [{ id: "1", accept: ["verify", "check", "confirm"], ideal: "verify" }],
        explanation: "Use AI for synthesis where mostly right is fine, but verify the high-stakes claims." ,
      },
      {
        type: "multiple_choice",
        stem: "Which prompt is framed best?",
        options: [
          { id: "a", label: "Help me with my email", is_correct: false },
          { id: "b", label: "I am a PM at a fintech startup. Write a 5 bullet board summary of Q3, confident in tone but acknowledging the missed retention target.", is_correct: true, explanation: "Role plus specific task plus constraints." },
          { id: "c", label: "Write something about Q3", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "In email triage, which type should you usually write entirely yourself?",
        options: [
          { id: "a", label: "Routine status updates and meeting confirmations", is_correct: false },
          { id: "b", label: "A difficult conversation or a negotiation where nuance is everything", is_correct: true, explanation: "Tier 3 work is where the nuance matters and AI should not sign off for you." },
          { id: "c", label: "Standard follow-ups", is_correct: false },
        ],
      },
      {
        type: "fill_blank",
        template: "A monthly calendar {{1}} reveals whether how you actually spend your time matches your stated priorities.",
        blanks: [{ id: "1", accept: ["audit", "review"], ideal: "audit" }],
        explanation: "Most people find a sizable gap between stated priorities and real time spent.",
      },
      {
        type: "multiple_choice",
        stem: "Why do rough, messy notes work fine as input to the meeting debrief protocol?",
        options: [
          { id: "a", label: "The model handles abbreviations and fragments well, so you do not need to clean up first", is_correct: true, explanation: "You extract the value while it is fresh and outsource the formatting." },
          { id: "b", label: "You must always format notes perfectly before pasting", is_correct: false },
          { id: "c", label: "Messy notes give better answers than clear ones", is_correct: false },
        ],
      },
      {
        type: "multiple_choice",
        stem: "What is the point of setting up custom instructions once?",
        options: [
          { id: "a", label: "So you stop re-establishing the same context at the start of every conversation", is_correct: true, explanation: "A one-time setup makes every later conversation more useful with no extra effort." },
          { id: "b", label: "So the model can browse the web for you", is_correct: false },
          { id: "c", label: "So you never have to write prompts again", is_correct: false },
        ],
      },
    ],
  },
];

// ── Build SQL rows ─────────────────────────────────────────────────────────────
const badgeRows = BADGES.map((b, i) =>
  `  (${dq(idFor.badge(b.slug))}::uuid, ${dq(b.slug)}, ${dq(b.name)}, ${dq(b.description)}, ` +
  `${dq(b.icon)}, ${dq(b.tier)}, ${dq(b.criteria_type)}, ${jsonbLit(b.criteria_config)}, ` +
  `${b.points_reward}, ${i}, true)`,
);

const checkRows: string[] = [];
const questionRows: string[] = [];

for (const c of CHECKS) {
  const checkId = idFor.check(c.slug);
  const lessonId = c.lessonSlug ? `${dq(idFor.lesson(c.lessonSlug))}::uuid` : "NULL";
  const moduleId = c.moduleSlug ? `${dq(idFor.module(c.moduleSlug))}::uuid` : "NULL";
  const level = c.level ? dq(c.level) : "NULL";

  checkRows.push(
    `  (${dq(checkId)}::uuid, ${dq(c.slug)}, ${dq(c.scope)}, ${lessonId}, ${moduleId}, ${level}, ` +
    `${dq(c.title)}, ${sqlText(c.description)}, ${c.questions.length}, ${c.pass_threshold}, 24, 'published')`,
  );

  c.questions.forEach((q, order) => {
    const qId = idFor.question(c.slug, order);
    const { type, ...content } = q;
    questionRows.push(
      `  (${dq(qId)}::uuid, ${dq(checkId)}::uuid, ${order}, ${dq(type)}, ${jsonbLit(content)}, NULL)`,
    );
  });
}

// ── Assemble SQL ──────────────────────────────────────────────────────────────--
const sql = `-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: badges + mastery checks (generated by scripts/generate-gamification-seed.ts).
-- Run AFTER 20260529120000_gamification_schema.sql. Idempotent: deterministic
-- uuid v5 ids + ON CONFLICT upserts. Content only; never touches user tables.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

insert into badge_definitions
  (id, slug, name, description, icon, tier, criteria_type, criteria_config, points_reward, sort_order, is_published) values
${badgeRows.join(",\n")}
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  tier = excluded.tier,
  criteria_type = excluded.criteria_type,
  criteria_config = excluded.criteria_config,
  points_reward = excluded.points_reward,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into mastery_checks
  (id, slug, scope, lesson_id, module_id, level, title, description, question_count, pass_threshold, cooldown_hours, status) values
${checkRows.join(",\n")}
on conflict (slug) do update set
  scope = excluded.scope,
  lesson_id = excluded.lesson_id,
  module_id = excluded.module_id,
  level = excluded.level,
  title = excluded.title,
  description = excluded.description,
  question_count = excluded.question_count,
  pass_threshold = excluded.pass_threshold,
  cooldown_hours = excluded.cooldown_hours,
  status = excluded.status;

insert into mastery_check_questions
  (id, check_id, order_index, type, content, source_block_id) values
${questionRows.join(",\n")}
on conflict (id) do update set
  check_id = excluded.check_id,
  order_index = excluded.order_index,
  type = excluded.type,
  content = excluded.content,
  source_block_id = excluded.source_block_id;

commit;
`;

const outPath = resolve(__dirname, "../supabase/migrations/20260529120001_seed_gamification.sql");
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  badges:    ${badgeRows.length}`);
console.log(`  checks:    ${checkRows.length}`);
console.log(`  questions: ${questionRows.length}`);
