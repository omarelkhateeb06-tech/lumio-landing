// One-off generator: emits a seed for the 2 new module mastery checks
// (working-well-with-ai, responsibility-and-judgment). Mirrors
// scripts/gen-module-checks.mjs exactly: deterministic uuid v5 ids +
// ON CONFLICT upserts, so applying is idempotent. Standalone.

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
    slug: "working-well-with-ai-module-check",
    moduleSlug: "working-well-with-ai",
    title: "Working well with AI: test out",
    description:
      "Already verify AI output, protect privacy, and use AI with integrity at work? Pass this and the whole Working well with AI module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "AI gives you a confident answer with a specific statistic and a source. What is the right move before you use it?", options: [
        { id: "a", label: "Trust it, since it named a source", is_correct: false, explanation: "AI invents plausible sources and numbers. A named source is not proof the fact is real." },
        { id: "b", label: "Verify the statistic and the source against the original before relying on it", is_correct: true, explanation: "Confident and specific is exactly when to check. Confirm it against the real source." },
        { id: "c", label: "Assume it is wrong and discard it", is_correct: false, explanation: "Too far. The point is to verify, not to reject everything out of hand." } ] } },
      { type: "multiple_choice", content: { stem: "Which kind of AI output most deserves your scrutiny because the error is easy to miss?", options: [
        { id: "a", label: "An obviously garbled sentence", is_correct: false, explanation: "An obvious mistake trips your alarm. It is the subtle one that slips through." },
        { id: "b", label: "A fluent, plausible answer with one wrong detail buried in it", is_correct: true, explanation: "A confident wrong answer is more dangerous than an obvious one, because it does not look wrong." },
        { id: "c", label: "A response that says it is not sure", is_correct: false, explanation: "An honest hedge is a signal to check, which is helpful, not the hidden risk." } ] } },
      { type: "multiple_choice", content: { stem: "You want help with a sensitive document at work. What is the safe way to use a public AI tool?", options: [
        { id: "a", label: "Paste it in as is, since the chat is private to you", is_correct: false, explanation: "A public tool is an outside service. Sensitive details should not go in raw." },
        { id: "b", label: "Remove names and identifying details first, or use a tool your organization has approved", is_correct: true, explanation: "Genericize for public tools, or keep confidential work in an approved tool." },
        { id: "c", label: "Paste it and tell the AI to keep it confidential", is_correct: false, explanation: "An instruction does not control the service's data policy. The data is still exposed." } ] } },
      { type: "multiple_choice", content: { stem: "Your colleague wrongly accuses your genuinely human-written report of being AI-generated. What is the strongest response?", options: [
        { id: "a", label: "Run it through an AI-detector and accept whatever it says", is_correct: false, explanation: "AI detectors are unreliable and flag real human writing. They are not proof." },
        { id: "b", label: "Show your process: drafts, version history, notes, and your ability to explain the content", is_correct: true, explanation: "Evidence of how you made it, plus deep familiarity with it, is the real defense." },
        { id: "c", label: "Rewrite the whole thing to sound less polished", is_correct: false, explanation: "Dumbing down your work to dodge a false accusation is the wrong fix." } ] } },
      { type: "multiple_choice", content: { stem: "What is the difference between using AI authentically and using it lazily?", options: [
        { id: "a", label: "Authentic use means you stay the author: you direct it, edit it, and stand behind the result as your own", is_correct: true, explanation: "Integrity is about ownership and judgment, not about whether a tool was involved." },
        { id: "b", label: "Authentic use means never editing what the AI produces", is_correct: false, explanation: "The opposite. Pasting raw output unread is the lazy version." },
        { id: "c", label: "There is no difference as long as the output is good", is_correct: false, explanation: "Whether you actually engaged with and own the work is exactly the difference." } ] } },
      { type: "multiple_choice", content: { stem: "Your team wants consistent quality from AI across everyone. What helps most?", options: [
        { id: "a", label: "Let each person invent their own prompts privately every time", is_correct: false, explanation: "That produces wildly varied quality. Shared, saved prompts keep output consistent." },
        { id: "b", label: "Agree on shared prompts and a light policy for what is and is not okay to use AI for", is_correct: true, explanation: "Shared standards and saved prompts make a team's AI use consistent and safe." },
        { id: "c", label: "Ban AI entirely so no one uses it differently", is_correct: false, explanation: "A blanket ban throws away the value. Consistency comes from shared practice." } ] } },
      { type: "fill_blank", content: { template: "Before relying on a specific fact, statistic, or source from AI, you should always {{1}} it against a real source, because the tool can state a wrong answer with full confidence.", blanks: [ { id: "1", accept: ["verify", "check", "confirm"], ideal: "verify" } ], explanation: "Verification is the core habit of working well with AI: confident does not mean correct." } },
      { type: "fill_blank", content: { template: "To use AI with integrity, you stay the {{1}} of the work: you direct it, edit it, and stand behind the result as your own.", blanks: [ { id: "1", accept: ["author", "owner"], ideal: "author" } ], explanation: "Ownership is what separates authentic use from lazy pasting." } },
    ],
  },
  {
    slug: "responsibility-and-judgment-module-check",
    moduleSlug: "responsibility-and-judgment",
    title: "Responsibility & judgment: test out",
    description:
      "Already keep your judgment in charge, disclose AI use appropriately, and own the results? Pass this and the whole Responsibility & judgment module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "You notice the AI agrees with almost everything you propose, even weak ideas. What is happening, and what should you do?", options: [
        { id: "a", label: "It is sycophancy: the model tends to agree with you, so ask it to argue the opposite case", is_correct: true, explanation: "Models lean toward agreeing. Deliberately asking for the counter-case restores real pressure-testing." },
        { id: "b", label: "It means your ideas are all genuinely strong, so proceed", is_correct: false, explanation: "Agreement from AI is not validation. It often just mirrors what you want to hear." },
        { id: "c", label: "It is broken and should be ignored entirely", is_correct: false, explanation: "It is a known tendency you can work around, not a malfunction." } ] } },
      { type: "multiple_choice", content: { stem: "What does it mean to avoid outsourcing your thinking to AI?", options: [
        { id: "a", label: "Never using AI to help you think through anything", is_correct: false, explanation: "AI can help you think. The risk is letting it think instead of you." },
        { id: "b", label: "Forming your own view and using AI to test and sharpen it, not to hand over the decision", is_correct: true, explanation: "You stay the one reasoning. AI is a sounding board, not a substitute for your judgment." },
        { id: "c", label: "Always doing the opposite of what the AI suggests", is_correct: false, explanation: "Reflexively disagreeing is just outsourcing in reverse. The point is to keep your own judgment active." } ] } },
      { type: "multiple_choice", content: { stem: "You used AI to help write a board memo. When should you disclose that you used it?", options: [
        { id: "a", label: "Always, in full detail, for every routine email", is_correct: false, explanation: "Blanket disclosure of routine help is usually unnecessary. Context and norms matter." },
        { id: "b", label: "When it matters to the audience or is expected: authorship claims, graded work, or where AI use changes how the work should be judged", is_correct: true, explanation: "Disclose where it affects trust, authorship, or the rules you are operating under." },
        { id: "c", label: "Never, since how you made it is nobody's business", is_correct: false, explanation: "In contexts where AI use is material or expected, hiding it breaks trust." } ] } },
      { type: "multiple_choice", content: { stem: "An AI-assisted report you sent out contained an error. Who is responsible?", options: [
        { id: "a", label: "The AI, since it produced the mistake", is_correct: false, explanation: "Accountability does not transfer to a tool. You sent it, you own it." },
        { id: "b", label: "You, because you put your name on it and chose to send it", is_correct: true, explanation: "You own the output you release, regardless of how it was drafted. Own the error and fix it." },
        { id: "c", label: "No one, since AI mistakes are unavoidable", is_correct: false, explanation: "The mistake is avoidable through your review, and the responsibility is yours." } ] } },
      { type: "multiple_choice", content: { stem: "Why set personal limits on where you will and will not use AI?", options: [
        { id: "a", label: "Because AI is too dangerous to use for anything important", is_correct: false, explanation: "Limits are about judgment, not fear. AI is useful within the right boundaries." },
        { id: "b", label: "Because some tasks demand your own judgment, values, or human presence, and naming those lines keeps you in control", is_correct: true, explanation: "Deciding your boundaries ahead of time keeps you deliberate rather than drifting." },
        { id: "c", label: "Because your employer requires you to never think about it again", is_correct: false, explanation: "Personal limits are your own considered choices, not a one-time rule to forget." } ] } },
      { type: "multiple_choice", content: { stem: "How should you watch for bias in AI output?", options: [
        { id: "a", label: "Assume the AI is perfectly neutral because it is a machine", is_correct: false, explanation: "AI reflects patterns in its training data and can carry bias. Neutrality is not guaranteed." },
        { id: "b", label: "Stay alert that its output can reflect skewed assumptions, and check important decisions against other perspectives", is_correct: true, explanation: "Treating AI as potentially biased and cross-checking keeps your judgment in charge." },
        { id: "c", label: "Trust it more on sensitive topics than on simple ones", is_correct: false, explanation: "Sensitive topics are exactly where hidden bias does the most harm. Scrutinize them more, not less." } ] } },
      { type: "fill_blank", content: { template: "When AI keeps agreeing with you, called {{1}}, a good fix is to ask it to make the strongest case against your idea.", blanks: [ { id: "1", accept: ["sycophancy", "agreement"], ideal: "sycophancy" } ], explanation: "Naming the tendency lets you counter it by forcing the opposing view." } },
      { type: "fill_blank", content: { template: "No matter how a document was drafted, you are {{1}} for the work you put your name on and send.", blanks: [ { id: "1", accept: ["responsible", "accountable"], ideal: "responsible" } ], explanation: "Accountability stays with the human, never the tool." } },
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
-- Seed: 2 net-new module mastery checks (working-well-with-ai,
-- responsibility-and-judgment). Generated by scripts/gen-new-module-checks.mjs.
-- Deterministic uuid v5 ids + ON CONFLICT upserts, content only. Idempotent.
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
const outPath = resolve(__dirname, "../supabase/migrations/20260530130000_seed_new_module_checks.sql");
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  checks:    ${checkRows.length}`);
console.log(`  questions: ${questionRows.length}`);
