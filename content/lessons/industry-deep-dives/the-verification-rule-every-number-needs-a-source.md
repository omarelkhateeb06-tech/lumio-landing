---
slug: the-verification-rule-every-number-needs-a-source
module: industry-deep-dives
title: "The Verification Rule: Every Number Needs a Source"
level: growing
minutes: 8
hook: AI will hand you a precise-looking figure with total confidence and no idea whether it is true. In finance, that is not a quirk. It is a liability.
key_takeaway: Treat every number an AI produces as unverified until you trace it to a real source. Use AI to draft and explain, never as the system of record for a figure.
order: 21
tags: [finance, data, hallucinations]
---

## reading

In most jobs, an AI that invents a plausible detail is annoying. In finance, it is dangerous. A model will tell you that revenue grew 14 percent, that a ratio is within covenant, or that a line item reconciles, and it will say all of it in the calm, exact voice of something that checked. It did not check. It predicted text that sounds like an answer.

The rule that keeps you safe is simple to state and hard to skip: every number gets traced to a source before it leaves your hands. Not the number the AI asserted, the number you confirmed against the ledger, the statement, the export, or the source document. The AI's figure is a hypothesis. Your source is the truth.

This does not mean AI is useless with numbers. It is excellent at the work around the numbers. It can explain why two figures might differ, draft the narrative that surrounds a table you built, restructure data you pasted, or walk you through a calculation method so you can apply it yourself. The danger is only when you let it be the place a figure comes from, rather than the place a figure gets described.

So draw a hard line. Numbers that originate in a real source, your accounting system, a bank feed, an audited statement, are trustworthy and AI can help you talk about them. Numbers the AI produces from memory or estimation are drafts to verify, never values to report. When you paste your own data and ask it to compute, you still check the math, because a model can transpose a digit or misapply a formula as easily as it can write a clean sentence. The figure is yours to stand behind, which means it is yours to confirm.

## before_after [personalizable]

```json
{
  "question": "You want AI's help reporting last quarter's gross margin. Which prompt keeps the numbers verifiable instead of invented?",
  "before_prompt": "What was our gross margin last quarter and is that good for a SaaS company?",
  "after_prompt": "I am pasting our actual Q3 figures from our accounting export: revenue 2,480,000, cost of revenue 690,000. First, calculate gross margin from these two numbers and show the formula so I can check it. Then explain, in two sentences, how this margin would generally be read for a SaaS business, and clearly label that part as general context, not a benchmark specific to my company. Do not introduce any figures I did not provide.",
  "changes": [
    "Supplies the real numbers from a source export instead of asking the AI to recall them, which it cannot.",
    "Asks it to show the formula so the calculation can be checked by hand, not trusted blind.",
    "Separates the verifiable math from general commentary, and labels the commentary as context.",
    "Forbids the model from adding figures, closing the door on invented benchmarks or totals."
  ]
}
```

## multiple_choice

```json
{
  "stem": "An analyst asks AI 'what was our cash position at year end' and pastes the figure straight into a board deck. Why does this lesson treat that as a mistake?",
  "options": [
    {
      "id": "a",
      "label": "The AI produced the figure from prediction, not from a source, so it is an unverified hypothesis that must be traced to the real ledger before it is reported.",
      "is_correct": true,
      "explanation": "Correct. A number that originates inside the model is a draft, not a value of record. In finance every figure must trace to a real source, the accounting system or statement, before it leaves your hands."
    },
    {
      "id": "b",
      "label": "Nothing is wrong, because modern AI tools have access to company financial systems by default.",
      "is_correct": false,
      "explanation": "A general AI tool has no live link to your ledger and is recalling or estimating. Assuming it 'knows' your cash position is exactly the trap that puts a fabricated number in front of the board."
    },
    {
      "id": "c",
      "label": "The only problem is that the analyst should have asked for more decimal places of precision.",
      "is_correct": false,
      "explanation": "Precision is not the issue. A confidently precise figure can still be entirely made up. The fix is sourcing the number, not formatting it to more decimals."
    }
  ]
}
```

## mini_project

Take one report or summary you produce regularly that contains figures. Go through it and mark, for every single number, where it actually came from: a system export, a statement, a feed, or, honestly, somewhere you are not sure. For the numbers with a real source, try using AI to draft the surrounding narrative, pasting the figures in rather than asking it to recall them, and check that it added no numbers of its own. For any figure you could not source, treat that as the real finding. The point of the exercise is to feel the difference between a number you can stand behind and one that merely sounds right.
