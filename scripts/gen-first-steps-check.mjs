// One-off generator: emits a seed for the First Steps module mastery check.
// Mirrors scripts/gen-new-module-checks.mjs exactly: deterministic uuid v5 ids
// + ON CONFLICT upserts, so applying is idempotent. Standalone.

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const NAMESPACE = "0d3f6a2c-8b1e-4c7a-9f5d-2e6b1a4c8d90";
function uuidv5(name, namespace = NAMESPACE) {
  const nsHex = namespace.replace(/-/g, "");
  const buf = Buffer.concat([Buffer.from(nsHex, "hex"), Buffer.from(name, "utf8")]);
  const hash = createHash("sha1").update(buf).digest();
  const bytes = hash.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
const idFor = {
  module: (slug) => uuidv5(`module:${slug}`),
  check: (slug) => uuidv5(`mastery_check:${slug}`),
  question: (checkSlug, order) => uuidv5(`mastery_check_question:${checkSlug}:${order}`),
};

const dq = (s) => `$lum$${s}$lum$`;
const j = (obj) => `${dq(JSON.stringify(obj))}::jsonb`;

const CHECKS = [
  {
    slug: "first-steps-module-check",
    moduleSlug: "first-steps",
    title: "First steps: test out",
    description:
      "Already get a real win in your first session, frame a request well, steer a draft, and paste safely? Pass this and the whole First Steps module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "You open an AI tool for the very first time. What is the best way to spend your first five minutes?", options: [
        { id: "a", label: "Quiz it with trivia and ask it for a joke to see how clever it is", is_correct: false, explanation: "Testing it with trivia teaches you nothing about how it helps you. The win comes from real work." },
        { id: "b", label: "Pick one small, real task from your day and use AI to actually finish it", is_correct: true, explanation: "One small win on real work is what turns AI from a curiosity into a habit." },
        { id: "c", label: "Read through every settings menu before you type anything", is_correct: false, explanation: "You learn by doing a real task, not by studying menus first." } ] } },
      { type: "multiple_choice", content: { stem: "Which of these is the kind of task AI handles best?", options: [
        { id: "a", label: "Recalling the exact revenue figure for a company last quarter", is_correct: false, explanation: "Specific facts and figures are a red-light task. AI sounds certain and may be wrong, so verify at the source." },
        { id: "b", label: "Turning your rough notes into a clean first-draft summary", is_correct: true, explanation: "Reshaping text you provide is AI's single strongest skill: you are the editor, it is the drafter." },
        { id: "c", label: "Doing the precise math on your quarterly budget", is_correct: false, explanation: "Math and precise calculations are a red-light task. Use a calculator or spreadsheet." } ] } },
      { type: "multiple_choice", content: { stem: "The AI's first answer is close but too formal. What do skilled users do?", options: [
        { id: "a", label: "Open a brand-new prompt and start over from scratch", is_correct: false, explanation: "Restarting throws away what worked. The chat already remembers the context." },
        { id: "b", label: "Reply in the same chat, naming what is off and the one change they want, like 'good start, make it warmer'", is_correct: true, explanation: "That is the iteration loop: keep what works, fix one thing, and the answer converges." },
        { id: "c", label: "Accept it as final, since the first answer is usually the best one", is_correct: false, explanation: "The first answer is round one, not a verdict. Steering it gets you far better results." } ] } },
      { type: "multiple_choice", content: { stem: "Before pasting real text into a public AI tool, what is the core habit this module teaches?", options: [
        { id: "a", label: "Memorize the privacy regulations for your industry first", is_correct: false, explanation: "You do not need to memorize regulations. You need one quick reflex before pasting." },
        { id: "b", label: "Pause a few seconds and ask whether the text could identify a real person, breach a confidence, or cause harm if it leaked", is_correct: true, explanation: "That five-second check is the whole skill. If any answer is yes, strip the details or do not paste." },
        { id: "c", label: "Tell the AI to keep your input confidential before you paste it", is_correct: false, explanation: "An instruction does not control the service's data policy. The data is still exposed." } ] } },
      { type: "multiple_choice", content: { stem: "What most reliably turns a generic AI answer into a useful one?", options: [
        { id: "a", label: "Making the prompt as long as you possibly can", is_correct: false, explanation: "It is not about length. It is about framing: who you are, what you want, and the limits." },
        { id: "b", label: "Giving it your role, the specific output you want, and clear constraints", is_correct: true, explanation: "Role plus a specific task plus constraints is the three-part frame that lifts answer quality." },
        { id: "c", label: "Asking the same question several times until it improves on its own", is_correct: false, explanation: "Repeating an unchanged question adds no new context, so the answer does not improve." } ] } },
      { type: "multiple_choice", content: { stem: "You ask a simple question and get back six dense paragraphs you will not read. What is the fix?", options: [
        { id: "a", label: "Accept that AI answers are always long and skim for the useful part", is_correct: false, explanation: "Skimming is exactly how wrong details slip past. You can control the length." },
        { id: "b", label: "Add a limit and a shape, like 'one sentence, then two bullets, under 60 words'", is_correct: true, explanation: "The default is comprehensive, so you have to ask for brief and name the format you want." },
        { id: "c", label: "Upgrade to a paid plan to get shorter answers", is_correct: false, explanation: "Length is controlled by your instruction, not by the plan you are on." } ] } },
      { type: "fill_blank", content: { template: "When an AI states something false with total confidence, that is called a {{1}}, and it is the reason you {{2}} important facts at the source.", blanks: [ { id: "1", accept: ["hallucination", "hallucinations"], ideal: "hallucination" }, { id: "2", accept: ["verify", "check", "confirm"], ideal: "verify" } ], explanation: "Hallucination is a side effect of how the model works, which is why you confirm anything that matters." } },
      { type: "fill_blank", content: { template: "Setting up {{1}} instructions once means the AI remembers who you are and how you like responses, so you stop re-explaining your context in every new chat.", blanks: [ { id: "1", accept: ["custom"], ideal: "custom" } ], explanation: "Custom instructions are a one-time setup that makes every later conversation more useful." } },
    ],
  },
];

const checkRows = [];
const questionRows = [];
for (const c of CHECKS) {
  const checkId = idFor.check(c.slug);
  const moduleId = `${dq(idFor.module(c.moduleSlug))}::uuid`;
  checkRows.push(
    `  (${dq(checkId)}::uuid, ${dq(c.slug)}, $lum$module$lum$, NULL, ${moduleId}, NULL, ` +
      `${dq(c.title)}, ${dq(c.description)}, ${c.questions.length}, 0.8, 24, 'published')`,
  );
  c.questions.forEach((q, order) => {
    const qId = idFor.question(c.slug, order);
    questionRows.push(
      `  (${dq(qId)}::uuid, ${dq(checkId)}::uuid, ${order}, ${dq(q.type)}, ${j(q.content)}, NULL)`,
    );
  });
}

const sql = `-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: First Steps module mastery check. Generated by
-- scripts/gen-first-steps-check.mjs. Deterministic uuid v5 ids + ON CONFLICT
-- upserts, content only. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

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

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../supabase/migrations/20260530140000_seed_first_steps_check.sql");
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  checks:    ${checkRows.length}`);
console.log(`  questions: ${questionRows.length}`);
