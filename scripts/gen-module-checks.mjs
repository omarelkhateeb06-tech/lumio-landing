// One-off generator: emits a migration seeding the 5 module mastery checks that
// were missing (everyday-work, creation, business-workflows, industry-deep-dives,
// building-with-ai). Mirrors scripts/generate-gamification-seed.ts conventions:
// deterministic uuid v5 ids + ON CONFLICT upserts, so applying is idempotent.
// Standalone (does not touch the existing seed file or the question-rewrite migration).

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

// $lum$-delimited dollar quote, matching the existing seed file.
const dq = (s) => `$lum$${s}$lum$`;
const j = (obj) => `${dq(JSON.stringify(obj))}::jsonb`;

const CHECKS = [
  {
    slug: "everyday-work-module-check",
    moduleSlug: "everyday-work",
    title: "Everyday work: test out",
    description:
      "Already use AI smoothly for meetings, email, and documents? Pass this and the whole Everyday work module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "You want AI to summarize a long report. What makes the summary genuinely useful to you?", options: [
        { id: "a", label: "Asking simply to summarize it, so you get a neutral shorter version", is_correct: false, explanation: "A plain summary is still generic and not aimed at your decision. Telling the AI your purpose is what makes it useful." },
        { id: "b", label: "Telling the AI who you are and what you need to decide, so it pulls only the relevant parts", is_correct: true, explanation: "A good summary is shaped by your purpose. Naming your role and decision filters out the noise." },
        { id: "c", label: "Asking for the longest possible summary so nothing is missed", is_correct: false, explanation: "Length is not the goal. A focused summary aimed at your decision beats an exhaustive one." } ] } },
      { type: "multiple_choice", content: { stem: "What is the strongest way to use AI before an important meeting?", options: [
        { id: "a", label: "Ask it to attend the meeting for you", is_correct: false, explanation: "AI prepares you, it does not replace your presence or judgment in the room." },
        { id: "b", label: "Have it draft an agenda, surface questions you should be ready for, and name likely objections", is_correct: true, explanation: "Using AI to think through the meeting ahead of time is where the value is." },
        { id: "c", label: "Ask it who will be the most difficult person in the room", is_correct: false, explanation: "AI does not know the people in your meeting. It helps with structure and likely objections, not office politics." } ] } },
      { type: "multiple_choice", content: { stem: "When drafting a professional email with AI, what produces the best result?", options: [
        { id: "a", label: "Asking it to write a professional email with no other detail", is_correct: false, explanation: "That gives a hollow template. The good material comes from your specifics." },
        { id: "b", label: "Giving it the situation, the key points to make, the tone, and a length limit", is_correct: true, explanation: "Feeding it the raw material is what turns a generic draft into something close to ready." },
        { id: "c", label: "Letting it send the email automatically once written", is_correct: false, explanation: "You always read before sending. The AI does not know the one detail that may change everything." } ] } },
      { type: "multiple_choice", content: { stem: "Why does splitting writing into a brain-dump then an AI cleanup work so well?", options: [
        { id: "a", label: "Because the AI writes better when it has no input from you", is_correct: false, explanation: "The opposite is true. The AI needs your raw thinking to keep the result yours." },
        { id: "b", label: "Because the hard part is having the ideas, so you do that and let AI handle the arranging", is_correct: true, explanation: "Separating thinking from polishing removes the blank-page freeze and keeps your meaning." },
        { id: "c", label: "Because it lets you avoid reading the final result", is_correct: false, explanation: "You still read the result to confirm the AI did not change your meaning." } ] } },
      { type: "multiple_choice", content: { stem: "You used AI to get oriented on a new regulation. Which part most needs verifying before you rely on it?", options: [
        { id: "a", label: "The plain-language overview of the topic", is_correct: false, explanation: "General orientation is a fine starting map and exactly what AI does well." },
        { id: "b", label: "The exact dates, dollar thresholds, and citations it provided", is_correct: true, explanation: "Hard specifics are the most likely to be invented. Confirm each against an official source." },
        { id: "c", label: "The list of questions it suggested you research", is_correct: false, explanation: "Surfacing questions to investigate is a strong, low-risk use of AI." } ] } },
      { type: "multiple_choice", content: { stem: "What is the point of using rough, messy notes as input to an AI debrief?", options: [
        { id: "a", label: "Messy notes always produce better answers than clear ones", is_correct: false, explanation: "Clear notes are fine too. The point is you do not have to clean them up first." },
        { id: "b", label: "AI handles fragments and abbreviations well, so you can capture value while it is fresh", is_correct: true, explanation: "You extract the value quickly and let the AI handle the formatting." },
        { id: "c", label: "You must always format notes perfectly before pasting them", is_correct: false, explanation: "That defeats the time savings. The AI can work from rough input." } ] } },
      { type: "fill_blank", content: { template: "A useful AI summary is shaped by your {{1}}, so tell it who you are and what you need to decide.", blanks: [ { id: "1", accept: ["purpose", "goal", "need"], ideal: "purpose" } ], explanation: "Purpose is what turns a generic recap into a summary aimed at your decision." } },
      { type: "fill_blank", content: { template: "Before you send any AI-drafted email, you should always {{1}} it, because the AI does not know your full context.", blanks: [ { id: "1", accept: ["read", "review", "check"], ideal: "read" } ], explanation: "The AI drafts, you decide. A quick read catches the detail only you know." } },
    ],
  },
  {
    slug: "creation-module-check",
    moduleSlug: "creation",
    title: "Creation: test out",
    description:
      "Comfortable drafting, editing in your voice, repurposing, and making images with AI? Pass this and the whole Creation module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "Why is generating a first draft with AI so valuable even when the draft is only a B-minus?", options: [
        { id: "a", label: "Because editing something rough is far easier than starting from a blank page", is_correct: true, explanation: "A B-minus you can edit beats an A-plus you never start. AI removes the hardest part." },
        { id: "b", label: "Because the first draft is always good enough to publish as is", is_correct: false, explanation: "It rarely is. The value is that you now have something to shape." },
        { id: "c", label: "Because it means you no longer have to think about the topic", is_correct: false, explanation: "Your thinking is exactly what makes the draft worth editing. You stay involved." } ] } },
      { type: "multiple_choice", content: { stem: "What is the most reliable way to get AI to write in your voice?", options: [
        { id: "a", label: "Ask it to be more creative", is_correct: false, explanation: "Vague requests do not teach it your voice. It needs examples and specifics." },
        { id: "b", label: "Paste samples of your own writing and name your style traits for it to copy", is_correct: true, explanation: "Showing real examples plus naming your traits steers the output hard toward you." },
        { id: "c", label: "Use the longest possible prompt", is_correct: false, explanation: "Length is not the point. Concrete examples of your writing are what matter." } ] } },
      { type: "multiple_choice", content: { stem: "What makes content repurposing with AI work so well?", options: [
        { id: "a", label: "AI invents brand new ideas for each format", is_correct: false, explanation: "The ideas stay the same. Only the format and tone change." },
        { id: "b", label: "AI is good at preserving your meaning while changing the form for a new audience", is_correct: true, explanation: "You did the hard part. Reshaping the same ideas for a new channel is the easy part." },
        { id: "c", label: "It removes the need to consider the audience at all", is_correct: false, explanation: "Different audiences need different things, so each version still deserves a quick check." } ] } },
      { type: "multiple_choice", content: { stem: "How do you keep an AI-assisted presentation from looking generic and AI-made?", options: [
        { id: "a", label: "Let AI generate the whole finished deck from a one-line topic", is_correct: false, explanation: "That produces vague bullets and filler. It is exactly the look you want to avoid." },
        { id: "b", label: "Use AI for the structure and wording, but supply your own real numbers, examples, and proof", is_correct: true, explanation: "Structure from AI, substance from you. That combination is fast and authentic." },
        { id: "c", label: "Cram each slide with as much text as possible", is_correct: false, explanation: "Crammed slides are the most common deck mistake. Strong slides make one clear point." } ] } },
      { type: "multiple_choice", content: { stem: "When editing your own writing with AI, what is the key thing to protect?", options: [
        { id: "a", label: "Your voice and meaning, so the edit improves the writing without making it sound like a stranger", is_correct: true, explanation: "Structural editing should tighten and clarify while keeping it unmistakably yours." },
        { id: "b", label: "The original word count, no matter what", is_correct: false, explanation: "Length is flexible. Voice and meaning are what matter." },
        { id: "c", label: "Every sentence exactly as you first wrote it", is_correct: false, explanation: "Editing means changing things. The goal is to keep your voice, not every word." } ] } },
      { type: "multiple_choice", content: { stem: "You want a strong image from a single sentence. What helps most?", options: [
        { id: "a", label: "Describing the subject, the style, the mood, and key details rather than a bare noun", is_correct: true, explanation: "Specific, layered descriptions guide the result far better than a single word." },
        { id: "b", label: "Typing one word and hoping for the best", is_correct: false, explanation: "One word leaves almost everything to chance. Detail steers the output." },
        { id: "c", label: "Asking for the most complicated image possible", is_correct: false, explanation: "Complexity is not the goal. A clear, specific description is." } ] } },
      { type: "fill_blank", content: { template: "To get AI to write in your voice, the most reliable move is to paste real {{1}} of your own writing for it to copy.", blanks: [ { id: "1", accept: ["samples", "examples"], ideal: "samples" } ], explanation: "Examples teach the AI your voice better than any description alone." } },
      { type: "fill_blank", content: { template: "A first draft from AI is usually a starting {{1}}, not a finished piece, so your job is to shape it.", blanks: [ { id: "1", accept: ["point", "block", "draft"], ideal: "point" } ], explanation: "The draft gets you past the blank page. The shaping is where your judgment turns it into something good." } },
    ],
  },
  {
    slug: "business-workflows-module-check",
    moduleSlug: "business-workflows",
    title: "Business workflows: test out",
    description:
      "Already build repeatable AI workflows, templates, and research routines? Pass this and the whole Business workflows module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "What is an AI workflow, in plain terms?", options: [
        { id: "a", label: "A single giant prompt that tries to do an entire job at once", is_correct: false, explanation: "That is the opposite. A workflow breaks the job into clear, single-purpose steps." },
        { id: "b", label: "A repeatable task broken into clear steps with a reusable prompt for each", is_correct: true, explanation: "Set it up once, then run the same steps every time. Like a recipe you do not reinvent." },
        { id: "c", label: "A one-time question you never use again", is_correct: false, explanation: "The value of a workflow is reuse. A one-off question is not a workflow." } ] } },
      { type: "multiple_choice", content: { stem: "Which task is the best first candidate to hand to AI?", options: [
        { id: "a", label: "A high-stakes legal filing where an undetected error is costly", is_correct: false, explanation: "High cost of error and hard to catch makes a task a poor solo fit for AI." },
        { id: "b", label: "A repetitive, text-based task that follows a pattern and whose output you can quickly check", is_correct: true, explanation: "Repetitive, text-heavy, pattern-following, and easy to verify is the sweet spot." },
        { id: "c", label: "A sensitive HR conversation requiring real judgment", is_correct: false, explanation: "Genuine human judgment and relationship work stays with you." } ] } },
      { type: "multiple_choice", content: { stem: "What is the right way to use AI for competitive analysis?", options: [
        { id: "a", label: "Ask the AI to recall facts about a competitor from memory", is_correct: false, explanation: "It will confidently invent prices and features. Never rely on its recall for specifics." },
        { id: "b", label: "Gather real material yourself, then have AI organize and find patterns in it", is_correct: true, explanation: "You bring the facts, AI brings the structure and pattern-spotting." },
        { id: "c", label: "Trust whatever comparison it produces without checking", is_correct: false, explanation: "Organized does not mean accurate. Sanity-check standout claims against your source." } ] } },
      { type: "multiple_choice", content: { stem: "Why build reusable AI templates for your team's common messages?", options: [
        { id: "a", label: "So routine writing becomes quick fill-in-the-blank work and stays consistent", is_correct: true, explanation: "Templating frequent messages saves time and keeps quality steady even on a busy day." },
        { id: "b", label: "So the team never has to read what they send", is_correct: false, explanation: "Templates speed up writing, they do not remove the need to review." },
        { id: "c", label: "So every message sounds completely different each time", is_correct: false, explanation: "Templates aim for consistency, not random variation." } ] } },
      { type: "multiple_choice", content: { stem: "What keeps an AI workflow reliable over time?", options: [
        { id: "a", label: "Making each step do one thing, saving the prompts, and keeping a review checkpoint", is_correct: true, explanation: "Small single-purpose steps, reusable prompts, and a human checkpoint make a workflow dependable." },
        { id: "b", label: "Rewriting every prompt from scratch each time you run it", is_correct: false, explanation: "Then it saves no time. The point is to reuse saved prompts." },
        { id: "c", label: "Removing every point where a human reviews the output", is_correct: false, explanation: "You still approve the result. The workflow speeds the work, it does not replace your sign-off." } ] } },
      { type: "multiple_choice", content: { stem: "What makes a team template one people will actually use?", options: [
        { id: "a", label: "It is clever and complex so it shows off what AI can do", is_correct: false, explanation: "Adoption beats cleverness. A complex template tends to sit unused." },
        { id: "b", label: "It solves a frequent shared pain, has obvious blanks, and lives where the team already works", is_correct: true, explanation: "Build for the busy Tuesday user and make using it easier than not." },
        { id: "c", label: "It is stored somewhere private only you can find", is_correct: false, explanation: "A template no one can find does not get used. Put it where work happens." } ] } },
      { type: "fill_blank", content: { template: "For competitive analysis, you gather the real material yourself and let AI {{1}} it into a clear comparison.", blanks: [ { id: "1", accept: ["organize", "organise", "structure"], ideal: "organize" } ], explanation: "You bring the facts, AI brings the organization and pattern-spotting." } },
      { type: "fill_blank", content: { template: "A workflow only saves time if you {{1}} your prompts so you do not rewrite them every run.", blanks: [ { id: "1", accept: ["save", "store", "reuse"], ideal: "save" } ], explanation: "Saved, reusable prompts are what make a workflow pay off week after week." } },
    ],
  },
  {
    slug: "industry-deep-dives-module-check",
    moduleSlug: "industry-deep-dives",
    title: "Industry deep dives: test out",
    description:
      "Confident applying AI safely in a professional field, with the right accuracy and privacy guardrails? Pass this and the whole Industry deep dives module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "In regulated fields like healthcare and law, what is AI's correct role?", options: [
        { id: "a", label: "A source of authority you can cite directly", is_correct: false, explanation: "AI is never a source of professional authority. It invents citations and misstates rules." },
        { id: "b", label: "A capable assistant for drafting and organizing, with a qualified human responsible for the work", is_correct: true, explanation: "AI assists; the professional verifies and stays accountable." },
        { id: "c", label: "A replacement for professional judgment", is_correct: false, explanation: "Judgment and accountability never transfer to the tool." } ] } },
      { type: "multiple_choice", content: { stem: "An AI returns case citations to support a legal argument. What must you do?", options: [
        { id: "a", label: "Use them, since the citations look complete", is_correct: false, explanation: "AI fabricates realistic citations. People have been sanctioned for filing fake ones." },
        { id: "b", label: "Verify each case in a real legal database and discard any that do not check out", is_correct: true, explanation: "Every citation must be confirmed in an authoritative source, not the same AI tool." },
        { id: "c", label: "Ask the AI to confirm they are real and trust its answer", is_correct: false, explanation: "It will often confirm cases it invented. Verification must come from a real source." } ] } },
      { type: "multiple_choice", content: { stem: "How should you handle confidential client or patient details with a public AI tool?", options: [
        { id: "a", label: "Paste them in, then delete the chat afterward", is_correct: false, explanation: "Deleting does not undo the disclosure. The data was already sent to an outside service." },
        { id: "b", label: "Genericize the details, or use an approved private tool for sensitive content", is_correct: true, explanation: "Strip identifiers for public tools, and keep truly confidential work in an approved private tool." },
        { id: "c", label: "Paste them but instruct the AI to keep them private", is_correct: false, explanation: "An instruction does not control the company's data policy. The data is still exposed." } ] } },
      { type: "multiple_choice", content: { stem: "What is the safe way to summarize a contract with AI?", options: [
        { id: "a", label: "Ask it to summarize a standard contract from memory", is_correct: false, explanation: "It will invent plausible terms. Always work from the real pasted text." },
        { id: "b", label: "Paste the actual text, ask for specific terms in plain language, then verify against the document", is_correct: true, explanation: "Work from the real text and confirm each summarized term, since a misread can flip the meaning." },
        { id: "c", label: "Trust the summary without rereading the clauses", is_correct: false, explanation: "A misread 'shall not' as 'shall' changes everything. Verify against the source." } ] } },
      { type: "multiple_choice", content: { stem: "How does AI best help with document review in a professional setting?", options: [
        { id: "a", label: "By making the final judgment about what is material", is_correct: false, explanation: "The review judgment is yours. AI helps you prepare and organize, it does not decide." },
        { id: "b", label: "By building a review checklist beforehand and organizing your findings afterward", is_correct: true, explanation: "AI handles the checklist and the structuring; your trained judgment handles the review." },
        { id: "c", label: "By reviewing the documents entirely on its own", is_correct: false, explanation: "It should not. The professional judgment and accountability stay with you." } ] } },
      { type: "multiple_choice", content: { stem: "Why is AI well suited to turning clinical or technical jargon into plain language?", options: [
        { id: "a", label: "Because rephrasing and reframing text is one of its core strengths", is_correct: true, explanation: "Translating dense language into plain terms for patients or clients is a strong, low-risk use." },
        { id: "b", label: "Because it always knows the patient's full history", is_correct: false, explanation: "It only knows what you give it. It does not have private context by default." },
        { id: "c", label: "Because it can make medical decisions for you", is_correct: false, explanation: "It cannot. Clinical decisions stay with the qualified professional." } ] } },
      { type: "fill_blank", content: { template: "In legal and clinical work, every citation, rule, or specific from AI must be {{1}} against an authoritative source before you rely on it.", blanks: [ { id: "1", accept: ["verified", "confirmed", "checked"], ideal: "verified" } ], explanation: "AI is not a source of authority, so the specifics always get confirmed against the real source." } },
      { type: "fill_blank", content: { template: "Before using a public AI tool on sensitive work, remove the identifying details, a practice called making the input {{1}}.", blanks: [ { id: "1", accept: ["generic", "anonymous"], ideal: "generic" } ], explanation: "Genericizing lets you get help while keeping confidential details off a public tool." } },
    ],
  },
  {
    slug: "building-with-ai-module-check",
    moduleSlug: "building-with-ai",
    title: "Building with AI: test out",
    description:
      "Already chain prompts, keep a personal toolkit, and build templates your team adopts? Pass this and the whole Building with AI module leaves your path, marked complete.",
    questions: [
      { type: "multiple_choice", content: { stem: "What is prompt chaining?", options: [
        { id: "a", label: "Writing one enormous prompt that asks for everything at once", is_correct: false, explanation: "That is the overloaded approach chaining replaces. Each goal gets done only half-well." },
        { id: "b", label: "Breaking a task into focused steps where each step's output feeds the next", is_correct: true, explanation: "Like an assembly line, each prompt does one thing well and passes the result along." },
        { id: "c", label: "Asking the same question repeatedly until you like the answer", is_correct: false, explanation: "Chaining is a sequence of different focused steps, not the same question repeated." } ] } },
      { type: "multiple_choice", content: { stem: "What is the main advantage of a checkpoint between chain steps?", options: [
        { id: "a", label: "You catch and fix problems before they get baked into a long final output", is_correct: true, explanation: "Reviewing the outline before drafting saves you from compounding errors." },
        { id: "b", label: "It lets the AI work without any input from you", is_correct: false, explanation: "Checkpoints are exactly where you steer. They keep you involved, not removed." },
        { id: "c", label: "It makes the task take longer for no reason", is_correct: false, explanation: "It saves time overall by preventing rework on a flawed foundation." } ] } },
      { type: "multiple_choice", content: { stem: "What belongs in your personal AI toolkit?", options: [
        { id: "a", label: "Saved go-to prompts, custom instructions, and documented reusable routines", is_correct: true, explanation: "A toolkit turns your best discoveries into reusable assets instead of one-off wins." },
        { id: "b", label: "A single prompt you delete after each use", is_correct: false, explanation: "The whole point is to keep what works, not throw it away." },
        { id: "c", label: "Other people's passwords", is_correct: false, explanation: "That is not part of a toolkit and is unsafe. The toolkit is prompts and setups." } ] } },
      { type: "multiple_choice", content: { stem: "What do custom instructions let you do?", options: [
        { id: "a", label: "Set standing context once so every conversation starts already tuned to you", is_correct: true, explanation: "Who you are, your preferred format, and your tone, applied to every chat automatically." },
        { id: "b", label: "Make the AI browse the live web", is_correct: false, explanation: "That is a separate capability. Custom instructions are persistent personal context." },
        { id: "c", label: "Avoid ever writing a prompt again", is_correct: false, explanation: "You still write prompts. Custom instructions just give them a better starting point." } ] } },
      { type: "multiple_choice", content: { stem: "When should you chain prompts instead of using a single one?", options: [
        { id: "a", label: "When the task has distinct stages, the output is long, or getting it wrong is expensive", is_correct: true, explanation: "Distinct stages and high stakes are exactly when chaining pays off." },
        { id: "b", label: "Only for the very shortest, simplest questions", is_correct: false, explanation: "Simple one-shot questions do not need a chain. Complex multi-stage work does." },
        { id: "c", label: "Never, since one prompt is always better", is_correct: false, explanation: "One overloaded prompt produces mediocre results on complex tasks." } ] } },
      { type: "multiple_choice", content: { stem: "What is the guiding principle for building team templates?", options: [
        { id: "a", label: "Adoption beats cleverness: build for the busy user and make using it easier than not", is_correct: true, explanation: "A simple template people use daily delivers more value than a brilliant one left unused." },
        { id: "b", label: "Complexity beats simplicity, since complex templates look more impressive", is_correct: false, explanation: "Complex templates tend to go unused. Simplicity drives adoption." },
        { id: "c", label: "Quantity beats quality: launch with thirty templates at once", is_correct: false, explanation: "Start small with a few strong ones and iterate based on what people ask for." } ] } },
      { type: "fill_blank", content: { template: "Prompt chaining works because each focused step does one thing well, and the output of one becomes the {{1}} to the next.", blanks: [ { id: "1", accept: ["input"], ideal: "input" } ], explanation: "Connecting steps so each feeds the next is what makes a chain more than a list." } },
      { type: "fill_blank", content: { template: "A team template gets used when its fill-in parts are obvious, so mark them clearly with {{1}}.", blanks: [ { id: "1", accept: ["brackets", "placeholders"], ideal: "brackets" } ], explanation: "Clear bracketed blanks make a template fill-in-the-blank rather than interpret-the-intent." } },
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
-- Seed: the 5 module mastery checks that were missing (generated by
-- scripts/gen-module-checks.mjs). Mirrors 20260529120001_seed_gamification.sql:
-- deterministic uuid v5 ids + ON CONFLICT upserts, content only. Idempotent.
-- Run AFTER the gamification schema + base lesson/module seeds.
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
const outPath = resolve(__dirname, "../supabase/migrations/20260530120000_seed_module_checks.sql");
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  checks:    ${checkRows.length}`);
console.log(`  questions: ${questionRows.length}`);
