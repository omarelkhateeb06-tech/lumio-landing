---
slug: how-to-think-about-ai-in-your-work-the-whole-picture
module: building-with-ai
title: "How to Think About AI in Your Work: The Whole Picture"
level: confident
minutes: 14
order: 99
status: published
hook: After all the prompts and tools, the people who are genuinely good with AI aren't the ones who know the most features. They're the ones who hold one clear idea about who does what, and apply it everywhere.
key_takeaway: AI is a fast, fluent, context-blind drafting partner; you supply the judgment, the context, and the final call. A short, repeatable four-question loop turns that one idea into a habit you can use on any task.
tags: [general, fundamentals, workflows]
---

## reading

By now you have collected a fair number of tactics: how to write a prompt that gives the model something to work with, how to paste real material instead of describing it, how to set custom instructions, how to check an answer before you trust it. Tactics are useful, but they are not the thing that makes someone good with AI. The thing underneath all of them is a single idea about division of labor, and once you hold it clearly, you stop needing to memorize tricks.

Here is the whole idea on one line. AI is a fast, fluent, context-blind drafting partner. You bring judgment, context, and the final call. That is it. Everything taught across Lumio hangs on that one division. The model is fast: it produces a first draft in seconds that would take you twenty minutes. It is fluent: the writing reads smoothly and confidently, which is exactly why you have to stay alert. And it is context-blind: it was not in your meetings, it does not know your customer, it cannot see the politics of your team or the commitment you made last week. Your side of the partnership is the part the model structurally cannot do. You know what is at stake, you know what is true, and you are the one who signs off. Keep that picture in your head and most decisions about AI answer themselves.

## reading

The one-line model is easy to nod at and easy to forget under deadline pressure. So here is a loop you can actually run, four questions you ask before handing anything to a model. They take about thirty seconds and they work on any task in any job.

First: is this a pattern task or a facts-and-stakes task? Drafting an email, restructuring notes, and summarizing a document are pattern tasks, and the model is strong at them. Naming the right number, making a hiring call, or sending something a client will hold you to are facts-and-stakes tasks, where the model is a starting point at best. Second: what context must I give it? The model knows nothing about your situation that you do not paste in, so decide what it needs before you ask. Third: how will I verify the output? Decide your check before you read the fluent answer, because a confident draft is persuasive and you do not want to invent the standard after the fact. Fourth: what part stays mine no matter what? Name the piece you will not delegate, usually the final judgment, the relationship, or the sign-off. Four questions, asked quickly, and you have a plan instead of a guess.

## before_after [personalizable]

```json
{
  "question": "Two ways to approach the same new task. Notice which question actually gives you a plan.",
  "before_prompt": "Can AI do this for me?",
  "after_prompt": "What's the right division of labor here? Which parts are pattern work the model can draft (a first version, a restructure, a summary), what context do I need to give it, how will I check the result, and which part stays mine no matter what?",
  "changes": [
    "Replaces a yes/no question that stalls you with a question that produces an actual plan for the task.",
    "Splits the task into a part to hand over and a part to keep, instead of treating it as all-or-nothing.",
    "Builds the context step and the verification step into the plan up front, so you are not improvising trust after you see a confident draft."
  ]
}
```

## multiple_choice

```json
{
  "stem": "Maya, a team manager, has rough notes from three weeks of observations and needs to write a sensitive performance note for a struggling report. She wants AI to help. Which step is the one where her judgment is non-negotiable and cannot be handed to the model?",
  "options": [
    {"id":"a","label":"Turning her bullet notes into smoother, more readable sentences.","is_correct":false,"explanation":"This is pattern work, exactly what the model is good at. Tidying rough notes into clean prose is a safe thing to delegate, as long as Maya checks the result against what she meant."},
    {"id":"b","label":"Deciding what the note actually claims about this person, whether it is fair, and how it lands given their history and the relationship.","is_correct":true,"explanation":"Correct. This is the facts-and-stakes core. The model was not there, does not know the person, and cannot weigh fairness or consequences. The judgment about what is true and right has to stay with Maya."},
    {"id":"c","label":"Suggesting a clearer structure for the note, such as observation, impact, then next steps.","is_correct":false,"explanation":"Structure is pattern work and a reasonable thing to ask for. It shapes the format, not the substance. The substance, what the note asserts and whether it is fair, is still Maya's call."},
    {"id":"d","label":"Proposing a few neutral phrasings for one awkward sentence.","is_correct":false,"explanation":"Rewording a sentence is low-stakes drafting and fine to delegate. It does not decide what the note means or whether it is just, which is the part Maya cannot outsource."}
  ]
}
```

## reading

It helps to be concrete about where the model reliably saves you time and where it quietly costs you. Think of Sam, an operations lead who uses AI across a normal week. The model earns its place when Sam is drafting: a first version of an announcement, a restructure of a messy process doc, a summary of a forty-page vendor contract into the points that matter, an explanation of a concept he half-remembers. These are pattern tasks. The draft is rarely final, but starting from something is far faster than starting from a blank page, and Sam can fix a draft in a fraction of the time it would take to write one.

The model costs Sam time, or worse, when he leans on it for the things it cannot see. Final facts are the clearest case: a specific figure, a date, a name, a clause that has to be exactly right. The model will produce a confident answer that is sometimes wrong, and a confident wrong fact is more expensive than no fact at all, because it slips through. Relationships are another: the message to an upset colleague, the apology, the negotiation, where tone and history matter more than fluent prose. And high-stakes decisions are the third: anything someone will be held to, where being plausibly reasonable is not the same as being right. The pattern is steady. Lean on the model for first passes; keep the final facts, the relationships, and the real decisions on your side of the line.

## fill_blank

```json
{
  "template": "The simplest version of the whole habit: trust AI for the {{1}} of the work, and verify it for the {{2}}.",
  "blanks": [
    {"id":"1","accept":["shape","draft","structure","first draft","form"],"ideal":"shape"},
    {"id":"2","accept":["facts","details","specifics","specific facts"],"ideal":"facts"}
  ],
  "explanation": "The model is strong at the shape of a piece of work, the draft, the structure, the first pass. It is unreliable on the specific facts, because it cannot check them against your reality. So you let it carry the shape and you personally verify the details before anything ships."
}
```

## reading

Once the loop feels natural, the next step is to stop solving the same setup problems over and over and build a small system instead. Most people run AI ad hoc: a fresh prompt every time, the same context re-typed, a different tool chosen at random. A personal workflow replaces that with three steady parts. The first is custom instructions, set once. If you keep telling the model who you are, what your role is, and how you like answers, write it into the settings and stop repeating yourself. The second is a verify habit you do not skip, a fixed move where you trace facts and check the substance before you trust an output, the same way every time, so trust is a routine and not a mood. The third is the right tool for the job, chosen on purpose rather than by default, because a quick rewrite and a long research task are not the same kind of work.

Set those three up and you have your own reliable system: instructions that carry your context automatically, a check you can count on, and a deliberate choice of tool. That is the difference between guessing each time and working from a method. It is not elaborate, and it is not something you buy. It is a handful of defaults you decide once and then lean on, so that the loop runs almost on its own and your attention goes to the judgment, where it belongs.

## try_it_live

```json
{
  "instructions": "Run the four-question loop on a real task you will actually do tomorrow. Write the task, then answer the four questions underneath it: is this pattern or facts-and-stakes work, what context must you give the model, how will you verify the output, and what part stays yours no matter what. The coach will pressure-test your answers and flag anything you are handing over that should stay with you.",
  "system_prompt": "You are a sharp, plain-spoken thinking partner helping someone apply a division-of-labor model to a real work task. The user gives you a task and their answers to four questions: (1) pattern or facts-and-stakes, (2) what context to give, (3) how they will verify, (4) what stays theirs. Check each answer: confirm what they got right, and challenge anything they are over-delegating (especially final facts, relationships, or high-stakes decisions) or leaving too vague. If they give only a task, walk them through the four questions instead. Keep it concrete and brief. No jargon, no em dashes, no hype.",
  "ideal_output": "Task I'll do tomorrow: Draft the kickoff email for new vendor onboarding to my team of eight. 1) Pattern or facts-and-stakes? Mostly pattern (drafting), with a few stakes facts: the start date, the vendor's name, and what each person owns. 2) Context to give it: who the team is, the vendor and what they do, the timeline, and a warm-but-brief tone. 3) How I'll verify: check the date, name, and each owner against the project doc before sending. 4) What stays mine: the final wording that goes out under my name, and who is assigned to what.",
  "input_placeholder": "Task I'll do tomorrow: [task]. 1) Pattern or facts-and-stakes? ... 2) Context? ... 3) How I'll verify? ... 4) What stays mine? ..."
}
```

## reading

Here is the reframe that the whole arc has been building toward. It is easy to feel behind with AI, as though there is a vast, ever-growing body of tools and features that everyone else has mastered and you have not. That feeling is mostly an illusion created by the noise around the technology. Real competence with AI is not encyclopedic tool knowledge. It is a small set of habits, and if you have worked through the practical lessons, you already hold them.

Name them and they stop looking like a mountain. You give the model real material instead of describing it. You write down your context once, in custom instructions, instead of re-explaining yourself. You ask the four questions before you hand a task over. You verify facts before you trust them. You keep the judgment, the relationships, and the final call on your side. That is the list. It is short, it is learnable, and none of it depends on knowing the newest feature that shipped last week. The tools will keep changing; these habits will not. So the honest version of where you stand is not that you are behind and need to catch up on tools. It is that you have learned a small, durable method, and the method is what good actually is.

## multiple_choice

```json
{
  "stem": "Four tasks land on your desk. Three are reasonable to draft with AI. Which one is a genuinely bad fit for it?",
  "options": [
    {"id":"a","label":"Turning your messy meeting notes into a clean, structured summary for the team.","is_correct":false,"explanation":"This is squarely pattern work. The model is good at restructuring and summarizing material you give it, and you can check the summary against your notes. A fine fit."},
    {"id":"b","label":"Stating your company's exact Q3 revenue figure from memory for a board slide.","is_correct":true,"explanation":"Correct. This is a final-fact, high-stakes task. The model cannot know your real number and will produce a confident, possibly wrong figure that someone will be held to. The fact has to come from your records, not the model."},
    {"id":"c","label":"Drafting a first version of an announcement you'll edit before it goes out.","is_correct":false,"explanation":"A first draft you will revise is exactly what the model is for. It saves you the blank page, and your editing pass keeps the judgment yours. Good fit."},
    {"id":"d","label":"Explaining a concept you half-remember so you can refresh your understanding.","is_correct":false,"explanation":"Explaining a general concept is a reasonable use, especially as a starting point you then sanity-check. It is low-stakes and pattern-shaped, not a bad fit."}
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Two ways of relating to AI across your whole job. Notice which one actually scales.",
  "before_prompt": "Figure out each new task from scratch: a fresh prompt every time, guess which tool to use, decide in the moment whether to trust whatever comes back.",
  "after_prompt": "Run the same mental checklist on everything: is this pattern or facts-and-stakes, what context does it need, how will I verify it, and what stays mine? Then use my standing setup (custom instructions, a fixed verify habit, a deliberate tool choice) to carry it out.",
  "changes": [
    "Replaces ad-hoc, tool-by-tool guessing with one repeatable loop that applies to any task, so you are not reinventing your approach each time.",
    "Moves trust from a mood you decide in the moment to a verify habit you run the same way every time.",
    "Turns scattered effort into a method, so your attention goes to judgment instead of to re-solving setup on every task."
  ]
}
```

## reading

That is the practical arc complete: you can now use AI well. There is one more thing that separates competent from trustworthy, and it is a different question than any you have asked so far. Everything up to here has been about using AI effectively. The final module is about using it honestly. When you lean on a model, when do you say so? How do you notice the bias that can ride along in a fluent, confident answer? Where does your own judgment carry weight that no tool can stand in for? Those are not efficiency questions, and they do not have prompt-shaped answers. Responsibility and Judgment, the capstone module, takes them up directly. You have the skill; next comes using it in a way you would be glad to put your name to.

## mini_project

Write your own one-paragraph "AI operating rules" in plain language. In a few sentences, set down when you reach for AI in your work, what you always verify before you trust an output, and what you never delegate no matter how busy you are. This is not an essay or a policy document; it is a short personal standard you could actually keep, written in words a colleague could read and immediately understand. Aim for something you would be comfortable taping next to your monitor.

- Base it on a real task you did this week, so the rules describe how you actually work rather than how you imagine you might.
- Keep it to plain language a colleague could follow without any explanation from you.
- Plan to revisit it after your next few AI tasks, and adjust the line between what you hand over and what you keep until it matches reality.
