---
slug: trust-calibration-when-to-believe-ai
module: working-well-with-ai
title: "Trust Calibration: Knowing When to Believe AI"
level: growing
minutes: 7
order: 2
hook: AI is right most of the time and wrong with total confidence the rest. The whole skill is telling which is which.
key_takeaway: Match how hard you check to the type of claim, not your mood. Trust AI on shaping and explaining, verify it on specific facts, current events, and anything high-stakes.
tags: [general, hallucinations, fundamentals]
---

## reading

Most people use AI with one of two broken settings: trust everything, or trust nothing. Both waste the tool. The skill that sits in the middle is trust calibration, which just means deciding how much to believe a given answer based on what kind of answer it is.

Here is the useful truth: AI is not uniformly reliable. It is excellent at some things and shaky at others, and the line between them is fairly predictable. Once you can see the line, you stop double-checking the safe stuff and you stop getting burned by the risky stuff.

**The high-trust zone: shaping and explaining.** When AI rewrites your paragraph, organizes your messy notes, suggests a structure, brainstorms options, or explains a well-established general concept, it is on solid ground. You provided the substance, or the substance is common knowledge. Skim for tone and sense, then move on.

**The low-trust zone: specific, checkable claims.** Names, numbers, dates, statistics, quotes, citations, legal or medical specifics, anything about recent events, and anything about your own company's internal details. These are exactly where AI invents confident, clean-looking answers. The more specific and the more recent, the more you verify.

**The hard rule: stakes raise the bar.** A wrong word in a brainstorm costs nothing. A wrong dosage, a wrong contract figure, or a wrong number in a board deck costs a lot. When being wrong is expensive, verify even claims that feel safe.

A simple way to hold this: ask "could the AI actually know this, and what happens if it's wrong?" High knowability and low stakes means trust it. Low knowability or high stakes means check it. You are not being paranoid, you are aiming your attention where it pays off.

## multiple_choice

```json
{
  "stem": "An AI tool gives you four things in one reply. Which one deserves the most verification before you rely on it?",
  "options": [
    {
      "id": "a",
      "label": "A cleaner rewrite of a clunky paragraph you wrote.",
      "is_correct": false,
      "explanation": "Rewriting text you supplied is the high-trust zone. The substance is yours, so a quick read for tone is enough."
    },
    {
      "id": "b",
      "label": "The exact percentage a tax credit changed by this year, stated to the decimal.",
      "is_correct": true,
      "explanation": "Correct. A specific, recent, checkable number is the classic low-trust claim, and a tax figure is high-stakes. Confirm it against the official source before using it."
    },
    {
      "id": "c",
      "label": "A plain-language explanation of what a mortgage is.",
      "is_correct": false,
      "explanation": "Well-established general concepts are reliable. This is common knowledge the model has seen countless times."
    },
    {
      "id": "d",
      "label": "Three possible titles for your presentation.",
      "is_correct": false,
      "explanation": "Brainstorming is low-stakes and a strong use of AI. A weak title costs you nothing and you pick the one you like."
    }
  ]
}
```

## mini_project

Build a trust map for the AI work you actually do, so calibration becomes automatic instead of a fresh judgment each time. First, list six real things you have recently asked AI to do (for example: reword an email, summarize a report, look up a statistic, explain a concept, draft a contract clause, brainstorm names). Second, place each one on two axes: could the AI actually know this reliably, and what happens if it is wrong? Mark each as high-trust (skim and move on) or low-trust (verify before relying on it). Third, for every item you marked low-trust, write the one source you would check it against. Finally, circle any item where the stakes alone push it into verify-even-if-it-feels-safe territory, like a number headed for a board deck or a client. Keep the map nearby for a week and notice where your instinct was miscalibrated, then adjust it.
