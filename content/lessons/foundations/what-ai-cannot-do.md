---
slug: what-ai-cannot-do
module: foundations
title: "What AI Cannot Do: Understanding the Limits"
level: beginner
minutes: 15
order: 6
hook: Knowing exactly where AI breaks down is what keeps you safe, in control, and out of trouble at work.
key_takeaway: AI predicts likely words; it has no live knowledge, no access to your private systems, no real judgment, and no accountability. Treat it as a fast first draft you always check, never a source of truth.
tags: [general, fundamentals, hallucinations]
---

## reading

People rarely get burned by AI because the tool is bad. They get burned because they hand it a job it was never built to do. Once you know where it genuinely breaks down, you can use it hard for the right things and stay out of trouble on everything else. Almost every limit traces back to one fact: a tool like ChatGPT does not look things up and does not know anything. It predicts the next most likely word based on patterns in the text it was trained on. That single fact explains every limit below.

It cannot reliably give you current facts. The model learned from text up to a cutoff date and has no live connection to the world. It does not know what happened this week, what your company's policy says today, or what a price is right now, unless you paste that information in yourself. Worse, when it does not know, it usually does not stop. It invents a confident answer, a hallucination, that looks exactly as polished as a real one. So when Tom, an office manager, asked it for "the current mileage reimbursement rate," he got a clean number that was two years out of date, with no warning at all.

It cannot do reliable math or counting on its own. This surprises people, because computers are supposed to be good at math. But ChatGPT is not calculating; it is predicting what the answer probably looks like. It can lay out the right steps and then quietly fumble the arithmetic, or miscount items in a list. When Dana, a bookkeeper, asked it to total a column of expenses, the steps were perfect and the sum was off by ninety dollars. Any number that matters must be checked, ideally in an actual calculator or spreadsheet.

It cannot know your private context. It does not know your client's name, your last email, your team's deadline, or what is in your files, unless you tell it. By default it is not connected to your inbox, your calendar, your shared drive, or your company systems. It is a stranger who is brilliant with words but knows nothing about your specific world until you brief it. This is also why pasting sensitive information into a public AI tool is risky: you are handing private details to an outside system.

It cannot exercise true judgment or take accountability. It can imitate the shape of advice, but it does not understand stakes, ethics, or consequences, and it cannot be held responsible when it is wrong. The responsibility never transfers to the tool. A nurse who uses AI to draft a patient note still signs that note and owns every word. A paralegal who uses AI to summarize a contract still owns the summary in front of the partner. A teacher who uses AI to write a parent email still answers for what it says. The accountability stays with the human, always.

It cannot verify its own claims. If you ask "are you sure?" it cannot actually go check. It will often just produce another confident-sounding answer, sometimes doubling down on a wrong one, sometimes flipping to a different wrong one. It has no way to look up whether what it just said is true. Verification has to come from you, against a real source, outside the tool. Picture Leah, a marketing coordinator, who got a campaign launch date from ChatGPT and typed back "are you certain about that date?" The model apologized and offered a completely different date, just as confidently. She had no way to know which one, if either, was right, because both were predictions, not lookups. The "are you sure" loop feels like quality control but produces nothing you can trust.

It cannot follow your evolving situation in real time. The model only knows what is in front of it in the current conversation. It does not remember that your project scope changed last Tuesday, that a teammate already handled the budget line, or that the client moved the meeting. If a detail is not in the chat, it is not in the model's head. Owen, a project lead, asked it to "update the plan we discussed," forgetting the model had no record of the new constraints from his call that morning. It produced a confident plan built on the old assumptions. Anything situational has to be supplied fresh, every time.

So what should you never fully delegate? Anything where being wrong has real consequences and the responsibility is yours: final medical, legal, or financial decisions; sending current facts you have not verified; math that money or safety depends on; and anything involving private or confidential information you would not hand to a stranger. Use AI to draft, explain, restructure, and brainstorm. Keep the judgment, the verification, and the final sign-off for yourself.

None of this makes AI weak. It makes it a brilliant first-draft engine and a poor final authority. The whole game is to let it get you to eighty percent fast, then bring your own judgment, your private context, and your verification to the last twenty percent. People who understand this get enormous value with very little risk. People who skip it end up explaining to their boss why the confident document they sent was wrong.

## multiple_choice

```json
{
  "stem": "Your boss asks for last quarter's exact revenue figure to put in a board deck. Why is ChatGPT the wrong place to get that number?",
  "options": [
    { "id": "a", "label": "It has no live access to your company's data and may invent a confident, wrong figure, so the number must come from your actual records.", "is_correct": true, "explanation": "Correct. AI cannot know your private, current data and will produce a plausible-looking number anyway. Pull it from your real financial records." },
    { "id": "b", "label": "ChatGPT refuses to answer questions about money.", "is_correct": false, "explanation": "It will happily produce a number. The problem is it cannot know your real figure and may fabricate one that looks legitimate." },
    { "id": "c", "label": "It is fine as long as you ask politely and clearly.", "is_correct": false, "explanation": "No phrasing gives the model access to your private financial data. It still cannot know your actual revenue." }
  ]
}
```

## reading

The most common mistake is treating AI as a search engine for current facts. People ask it for today's prices, this week's news, or what their policy says now, and accept the confident reply. Because it cannot know recent or private facts, it fills the gap with a hallucination that looks identical to a real answer. The fix is to never ask the model for a fact it cannot know. Get current and private facts from the real source, then paste them in so the model only has to do the wording.

The second mistake is trusting its math. People assume a computer is automatically good with numbers and copy its totals straight into invoices or reports. But it is predicting what the answer looks like, not calculating, so it can be quietly off. The fix is to treat any number that matters as unverified until you confirm it in a real calculator or spreadsheet, and to never let AI be the final arithmetic on anything involving money or safety.

The third mistake is assuming the tool shares the blame when something goes wrong. It does not. "The AI told me" has never protected anyone whose name was on the document. Consider an accountant who lets ChatGPT classify a client's expenses and files the return without reviewing the categories. When the deduction is challenged, the tax authority does not write to the chatbot. It writes to the accountant, whose license and reputation are on the line. The model felt like a colleague sharing the work, but accountability never left the human chair. The fix is to mentally keep ownership of everything you send: if your name signs it, you verified it, and you stand behind it, no matter how much AI helped draft it.

The fourth mistake is asking the AI to check itself. When something feels off, people type "are you sure?" and trust the reply. The model cannot actually verify its own claims; it just generates more plausible text and may confidently repeat or replace the error. The fix is to verify outside the tool, against a real source, every time the stakes are real.

The last mistake is the most expensive: pasting confidential information into a public AI tool. People drop in client names, patient details, or internal data to get a better draft, forgetting they just sent private information to an outside system. The fix is to strip or anonymize sensitive details before you paste, or use an approved tool your organization has vetted.

## fill_blank

```json
{
  "template": "AI cannot reliably do {{1}}, so any number that matters should be confirmed in a real calculator or spreadsheet. And when something goes wrong, the responsibility stays with the {{2}}, never the tool.",
  "blanks": [
    { "id": "1", "accept": ["math", "arithmetic", "counting", "calculations"], "ideal": "math" },
    { "id": "2", "accept": ["human", "person", "you", "user"], "ideal": "human" }
  ],
  "explanation": "AI predicts what answers look like rather than calculating, so it can be quietly wrong on numbers, and accountability for any AI-assisted work always stays with the human who signs it."
}
```

## before_after [personalizable]

```json
{
  "question": "Same task, two ways of using AI. Notice which one respects what AI cannot do and keeps you safe.",
  "before_prompt": "What is our company's current refund policy deadline? Write a reply telling the customer when their refund must be requested. (then pasting the answer straight into a customer email)",
  "after_prompt": "Here is our current refund policy text, copied from our official page: [paste the real policy]. Using only this text, write a clear, friendly two-sentence reply telling the customer the deadline to request their refund.",
  "changes": [
    "Stops asking the AI to recall a current fact it cannot know, which is exactly how a hallucination slips into a customer email.",
    "Gives the AI the real, verified policy text so it summarizes from your source instead of inventing one.",
    "Keeps you as the source of truth and lets the AI handle only the wording, which is the part it is actually good at."
  ]
}
```

## multiple_choice

```json
{
  "stem": "In the strong version above, the policy text is pasted in and the AI is told to use only that text. Which limit of AI does this directly work around?",
  "options": [
    { "id": "a", "label": "That AI cannot know your current, private facts on its own, so you supply the verified source and let it only do the writing.", "is_correct": true, "explanation": "Correct. The model has no access to your live policy, so giving it the real text removes the chance to invent one and uses it only for wording." },
    { "id": "b", "label": "That AI is bad at being polite to customers.", "is_correct": false, "explanation": "Tone is something AI handles well. The real issue is that it cannot know your current policy, which pasting the text solves." },
    { "id": "c", "label": "That AI cannot write in two sentences.", "is_correct": false, "explanation": "Length is not the limit being addressed. The fix targets the model's inability to know your current, private facts." }
  ]
}
```

## mini_project

Make a one-page "never delegate" list for your own job, so you have a clear line between what you hand to AI and what you keep. This becomes a quick reference you actually use before you trust an AI draft.

- Step one: List the tasks in your real role that AI must never finish on its own, the ones where being wrong has real consequences and the responsibility is yours. Be specific to your work: for a nurse that might be final dosing or anything in a signed patient note; for a paralegal, final legal citations and filings; for an HR manager, anything involving an employee's confidential record. For each, write one sentence on why.
- Step two: Next to that, list the tasks where AI genuinely helps as a first draft you will check, such as rewording an email, explaining a concept, structuring a document, or brainstorming options. For each, note the one verification step you will always do before it leaves your desk (confirm the numbers, check the source, strip private details). Keep the page where you can glance at it.
