---
slug: document-review-prep
module: industry-deep-dives
title: "AI for Document Review Preparation"
level: beginner
minutes: 15
order: 15
hook: Walk into a stack of documents already knowing what to look for and how to spot it fast.
key_takeaway: Use AI to build review checklists, organize what you find, and draft issue summaries, while the actual review judgment and confidentiality stay with you.
tags: [legal, summarizing, workflows]
---

## reading

Document review is slow, detailed work, and it is easy to lose the thread across hundreds of pages. The most important thing to understand before you start is this: AI does not do the review for you, and it should not. What it does is make you faster and more organized at every stage around the review. The reading, the comparing, the deciding what matters: that stays in your hands. AI handles the scaffolding so your trained attention goes where it counts.

Think of a document review job as three phases. There is the work before you open the first document, the work while you are reading, and the work after you have flagged everything. AI helps in all three, in different ways.

**Before you start: build a review framework.** The fastest way to fall behind is to open a stack of contracts and start reading with no plan. You end up noticing different things in document one than in document forty, and your review is inconsistent. Inconsistency is how real issues slip through, because the thing you would have caught on a fresh morning gets missed at the end of a long afternoon. Instead, tell AI the matter type and what you are reviewing for, and ask it to build you a checklist. Say you are a paralegal supporting a due diligence matter where your firm is reviewing a target company's employment contracts. You might prompt: "I am reviewing employment agreements in an M&A due diligence matter. Build me a checklist of clauses and red flags to look for in each one, including change-of-control provisions, non-compete terms, severance triggers, and assignment of inventions." Now you read every contract through the same clear lens. You are not hunting blind, and nothing slips because you were tired by document forty. The checklist is yours to edit, too: cross off what does not apply, add the items the AI did not know to include, and you have a tool you can reuse on the next matter of the same type.

**During: organize what you find.** As you read and flag, your notes pile up fast and lose shape. Here AI turns scatter into a record. Imagine you are reviewing a batch of commercial leases for a real estate acquisition, and across twelve leases you have flagged assorted clauses about renewal options, assignment restrictions, and early termination. Paste your flagged text in and prompt: "Here are the clauses I flagged across these twelve leases. Organize them into a table with columns for document name, clause type, and the issue I noted." In seconds you have a clean grid instead of a messy list, and you can see patterns, like three leases sharing the same problematic assignment clause, that were invisible in your running notes.

**After: draft the issue summary.** When the review is done, someone needs a memo. AI can give you the first structure. Picture a compliance review where you flagged data-handling problems across a set of vendor agreements. You prompt: "Based on the flagged issues below, draft an issue summary memo organized by severity, from highest risk to lowest." You get a clean skeleton organized the way the partner wants to read it, with the worst problems up top and the minor ones below. Then you edit every line and verify each point, but you did not start from a blank page. For a tired reviewer at the end of a long matter, that first structure is the difference between a memo that goes out tonight and one that waits until tomorrow.

Now the limits, and these are not optional in legal work.

**The review judgment is yours.** What counts as a problem, what is material to this deal, what needs to go up the chain for escalation: these are professional calls AI cannot make. The tool only sees the text you handed it. It has no view of the deal strategy, the client's risk appetite, or the leverage in a negotiation. It helps you prepare and organize. It does not decide what matters.

**Verify every organized item against the source.** Anything AI summarizes, tables, or restates must be checked against the actual document. A single misread clause can flip a meaning entirely. If a non-compete says the restriction does not apply after termination and the AI table drops the word "not," your memo now says the opposite of the truth. Always read the entry back against the source clause before you rely on it.

**Protect confidentiality.** Do not paste privileged or confidential material into a public AI tool. Privileged documents belong only in an approved, private tool your firm has cleared for sensitive content. Where you can, genericize: strip names, deal terms, and identifying facts, and work with the structure rather than the secrets.

The pattern, one more time: AI handles the checklists, the organizing, and the first-draft structure, and your trained judgment handles the review itself.

## multiple_choice

```json
{
  "stem": "What is the core thing AI does for document review?",
  "options": [
    {
      "id": "a",
      "label": "It performs the review and tells you which documents have problems so you can move on.",
      "is_correct": false,
      "explanation": "AI does not perform the review. It cannot weigh what is material to a matter, and trusting it to do so means relying on a tool that only sees the text you gave it."
    },
    {
      "id": "b",
      "label": "It makes you faster and more organized around the review by building checklists, structuring findings, and drafting summaries, while you keep the review judgment.",
      "is_correct": true,
      "explanation": "Correct. AI handles the scaffolding before, during, and after the review. The reading, the deciding what matters, and the verification stay with you."
    },
    {
      "id": "c",
      "label": "It replaces the need for a review checklist, since it already knows what to flag in any matter.",
      "is_correct": false,
      "explanation": "AI does not know your matter. You build the checklist with it precisely so your review is consistent and tuned to the specific matter type and risks."
    }
  ]
}
```

## reading

Most problems with AI in document review do not come from the tool being wrong. They come from leaning on it for the part that is supposed to be yours. Here are the mistakes that bite paralegals and small-firm attorneys most often.

**Treating the AI's "material" labels as a real materiality assessment.** This is the big one. You ask AI to organize flagged clauses and it helpfully marks some as "material" or "high risk." It feels authoritative. But the tool only sees the text you pasted. It has no idea that this acquisition hinges on retaining two key engineers, so a weak non-compete is the single most material issue in the stack, while a typo in the governing-law clause is noise. Materiality depends on strategy, stakes, and context the AI never had. Use its labels as a rough sort at most, then apply your own judgment.

**Pasting privileged documents into a public tool.** A quick paste into a free, public chatbot can put privileged client material onto a third party's servers. That is a confidentiality and privilege problem, and it does not un-happen. Use only a tool your firm has approved for sensitive material, and genericize whatever you can before it goes anywhere near AI.

**Skipping verification of organized entries against the source.** When AI produces a clean table, it looks finished, and a finished-looking thing is tempting to trust. But organizing involves restating, and restating can drift. A clause about a 90-day cure period might land in the table as "30-day cure period." Always read each entry back against the actual clause before it goes in a memo or a deal point.

**Treating review judgment as mechanical.** It is easy to talk yourself into believing the review is just pattern-matching that AI can do. It is not. Deciding what is a real problem, what needs escalation, and what to advise on is the trained, professional core of the work. That is the part you do not outsource.

**Trusting an AI-drafted issue memo without checking each cited clause.** The memo may read beautifully and cite "Section 7.2." Before it goes out, open the document and confirm Section 7.2 says what the memo claims. A confident, well-written memo built on one misread clause is more dangerous than messy notes, because no one questions it.

The thread through all of these: AI is excellent at structure and terrible at significance. Keep it on the structure.

## fill_blank

```json
{
  "template": "The most common mistake is treating the AI's {{1}} labels as a real assessment, when the tool only sees the text you gave it; the professional {{2}} about what actually matters to the matter stays with you.",
  "blanks": [
    { "id": "1", "accept": ["material", "materiality", "high-risk", "risk"], "ideal": "material" },
    { "id": "2", "accept": ["judgment", "judgement", "decision"], "ideal": "judgment" }
  ],
  "explanation": "AI can sort and organize, but it has no view of the matter's strategy or stakes, so its 'material' labels are guesses. Deciding what is truly material is a judgment that remains a human responsibility, verified against the source."
}
```

## before_after [personalizable]

```json
{
  "question": "You are a paralegal about to review a set of commercial leases in a real estate acquisition. Rewrite a prompt that hands the judgment to the AI into one that keeps the judgment with you.",
  "before_prompt": "Review these commercial leases and tell me which clauses are material to the acquisition.",
  "after_prompt": "Build me a red-flag checklist for commercial leases in a real estate acquisition. List the clause types and specific terms I should examine in each lease, such as assignment and change-of-control restrictions, renewal and termination options, and estoppel requirements. I will apply the materiality judgment myself as I review.",
  "changes": [
    "Stops asking the AI to decide what is material and asks it to build a review framework instead.",
    "Names the real scenario, commercial leases in a real estate acquisition, so the checklist is tuned to the matter.",
    "States explicitly that the materiality judgment stays with you, which is the part the tool cannot do."
  ]
}
```

## multiple_choice

```json
{
  "stem": "You used AI to build a red-flag checklist for employment agreements in a due diligence matter, then had it organize your flagged clauses into a table marking some as 'material.' What is the right next step before you write your memo?",
  "options": [
    {
      "id": "a",
      "label": "Apply your own materiality judgment to the matter and verify each table entry against the actual source clause, then write the memo.",
      "is_correct": true,
      "explanation": "Correct. The AI's structure is a starting point. You decide what is truly material given the deal, and you confirm every organized entry against the source before relying on it."
    },
    {
      "id": "b",
      "label": "Copy the AI's 'material' labels straight into the memo, since the table already reviewed all the clauses together.",
      "is_correct": false,
      "explanation": "The table did not review anything. The tool only sees the text you pasted and has no view of the deal's stakes, so its labels are guesses you must replace with your own judgment."
    },
    {
      "id": "c",
      "label": "Have the AI draft the full memo and send it once it reads cleanly, to save time.",
      "is_correct": false,
      "explanation": "A clean-reading memo can be built on a misread clause. Before anything goes out, you must check each cited clause against the source and supply the materiality judgment yourself."
    },
    {
      "id": "d",
      "label": "Discard the table and re-sort everything by hand, since AI output cannot be used in review work.",
      "is_correct": false,
      "explanation": "That throws away a legitimate, useful step. Organizing findings is exactly what AI is good for. You just add the judgment and verify against the source rather than starting over."
    }
  ]
}
```

## mini_project

Pick one real review task you actually do, name the matter type and what you are reviewing for, and use AI to build a reusable review checklist for it. Then put the checklist and the tool through a real test: feed it a few genericized sample clauses, have it organize them, and watch for the spot where its judgment is wrong and yours has to correct it. The deliverable is one checklist you can use again plus a short note on where your judgment beat the tool.

- Prompt AI to build a clause-and-red-flag checklist for your chosen matter (for example, employment agreements in an M&A due diligence review), then mark what it missed and what it surfaced that you would not have listed.
- Paste in a few genericized sample clauses and ask AI to organize them into a table by document, clause type, and issue, then verify each entry against the source text.
- Write a one-paragraph note identifying at least one place where the AI's labeling or organizing was wrong and your review judgment had to override it.
