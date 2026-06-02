---
slug: performance-review-language-thats-specific-and-fair
module: industry-deep-dives
title: "Performance Review Language That's Specific and Fair"
level: growing
minutes: 8
hook: "Great team player, keep it up" helps no one. The hard part of a review is not the rating; it is turning what you observed into specific, fair, usable feedback.
key_takeaway: Feed AI your real examples and your honest assessment, and it drafts specific, behavior-based review language, so you replace vague praise with feedback an employee can act on.
order: 29
tags: [hr, writing, editing]
---

## reading

Performance reviews fail in a predictable way. Under time pressure, managers fall back on vague, recycled phrases, "strong communicator," "needs to be more proactive," "exceeds expectations." These feel safe and say nothing. The employee cannot act on them, they do not hold up if a decision is ever questioned, and they often smuggle in bias, because vague language is where unexamined impressions hide. The fix is specificity tied to observed behavior, and that is slow to write, which is exactly why it gets skipped.

This is where AI helps, with one firm condition: it works from your observations, never in place of them. You supply the real examples and your honest judgment. The model turns your rough notes into clear, specific, professionally worded feedback. "Here is what I observed about this person this quarter, in rough notes. Turn each point into specific, behavior-based feedback that names the example and its impact, written constructively. Keep my assessment intact; do not soften or inflate it."

What you get back reads like the review you wanted to write and did not have ninety minutes to phrase. The substance, the rating, the examples, the judgment, is entirely yours. The model did the wording.

Two guardrails matter here. First, never let the AI generate the assessment itself; feeding it "write a review for an average employee" produces generic, potentially unfair boilerplate detached from anything the person actually did. It must work from your specifics. Second, read for fairness and accuracy. Check that the feedback stays tied to behavior and results rather than personality, that the tone is consistent across your team rather than harsher for some people than others, and that the model did not invent an example you never gave it. Reviews carry real consequences for people's careers, so the words have to be both fair and true, and that is on you, not the tool.

## before_after [personalizable]

```json
{
  "question": "You want AI's help writing a review for a team member. Which prompt produces specific, fair feedback instead of vague boilerplate?",
  "before_prompt": "Write a performance review for a marketing coordinator who is a good employee but could improve a bit.",
  "after_prompt": "Turn my rough notes into specific, behavior-based review language. Keep my assessment intact; do not inflate or soften it, and do not add examples I did not give you. My notes: led the Q3 campaign launch, hit the deadline despite a vendor delay by reworking the timeline herself. Strong on execution. Growth area: tends to wait to be asked before sharing concerns, which meant a budget risk surfaced late. For each point, name the specific example and its impact, and phrase the growth area constructively as a forward action.",
  "changes": [
    "Supplies real observed examples instead of asking the AI to invent a review for a generic 'good employee.'",
    "Keeps the manager's assessment intact and bars the model from inflating, softening, or fabricating.",
    "Asks for example-plus-impact phrasing, which is what makes feedback specific and actionable.",
    "Frames the growth area as a constructive forward action rather than a vague personality label."
  ]
}
```

## multiple_choice

```json
{
  "stem": "A manager prompts AI with 'write a strong performance review for a solid employee' and pastes the result in. What is the core problem?",
  "options": [
    {
      "id": "a",
      "label": "The AI is generating the assessment itself, producing generic boilerplate detached from what the person actually did, which is neither specific nor fair.",
      "is_correct": true,
      "explanation": "Correct. AI must work from your real observations, not invent the evaluation. A review built from a generic prompt has no basis in the employee's actual behavior and can be both useless and unfair."
    },
    {
      "id": "b",
      "label": "Nothing, since AI writes more professionally than most managers and that is what matters.",
      "is_correct": false,
      "explanation": "Professional wording around an invented assessment is still an invented assessment. The substance has to come from the manager's observations; polish does not make fabricated feedback fair or accurate."
    },
    {
      "id": "c",
      "label": "The only issue is that the review should be longer to be thorough.",
      "is_correct": false,
      "explanation": "Length is not the problem. A longer generic review is still detached from the person's actual work. The fix is grounding it in specific observed examples, not adding words."
    }
  ]
}
```

## mini_project

Take a real review you need to write, or practice on one you wrote recently. Jot your honest, rough notes about the person: specific things they did, with the example and its impact, including at least one genuine growth area. Hand the AI your notes and ask it to turn each point into specific, behavior-based language without inflating, softening, or inventing anything. Then do the fairness pass: confirm every statement traces to something you actually observed, check the feedback targets behavior and results rather than personality, and compare the tone against how you would phrase the same thing for a different team member. Notice how much sharper and more useful the feedback is than the vague version you would have written under time pressure.
