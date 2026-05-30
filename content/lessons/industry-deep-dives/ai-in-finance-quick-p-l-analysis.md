---
slug: ai-in-finance-quick-p-l-analysis
module: industry-deep-dives
title: AI in Finance: quick P&L analysis
level: confident
minutes: 10
order: 5
hook: Most finance reports get read once, skimmed, and filed. Here's how to make them actually drive decisions.
key_takeaway: Use AI to translate numbers into decisions. The model is excellent at surfacing patterns and framing questions, which is what P&L analysis should produce.
tags: [finance, data, workflows]
---

## reading

Financial reports exist to drive decisions, but most P&L analyses are produced in a format that doesn't support decision-making: dense tables, percentage changes with no context, and a narrative section that restates the numbers instead of explaining what to do about them.

**The AI-assisted P&L analysis workflow:**

**Step 1: Anonymize and paste.** Take your P&L data (replace sensitive figures with placeholders if needed). Paste it in table format.

**Step 2: Plain language summary.** *"Here's a P&L for [period]. Write a 5-sentence plain-language summary of: the overall health signal, the two biggest contributors to performance, any unusual line items, and the trend direction."*

**Step 3: Variance analysis.** *"Compare period A to period B. For each significant variance: suggest 2–3 possible explanations, note whether this is likely signal or noise, and suggest one clarifying question."*

**Step 4: Decision framing.** *"Based on this P&L, what are the 3 most important financial decisions leadership should be discussing in the next 30 days? Frame each as a question, not a recommendation."*

The model won't know your company-specific context, so the output always requires your interpretation. But it structures the questions in ways that make board prep much faster.

## before_after [personalizable]

```json
{
  "question": "Same P&L, two prompts. Notice which one produces something leadership can act on.",
  "before_prompt": "Analyze this P&L and tell me how we did.",
  "after_prompt": "Here is our P&L for Q3 (figures anonymized): [paste table]. First, give a 5-sentence plain-language summary covering the overall health signal, the two biggest contributors, any unusual line items, and the trend direction. Then frame the 3 most important decisions leadership should discuss in the next 30 days as questions, not recommendations.",
  "changes": [
    "Pastes the actual data and asks the model to work only from it, instead of a vague 'how did we do' with nothing to analyze.",
    "Specifies the exact output: a bounded plain-language summary plus decision framing, so the result drives a conversation rather than restating the numbers.",
    "Asks for questions rather than recommendations, keeping the model out of company-specific judgments it cannot make."
  ]
}
```

## multiple_choice

```json
{
  "stem": "AI reads your P&L and writes: 'Marketing spend rose 40% while revenue was flat, a likely inefficiency to address.' What is the right response?",
  "options": [
    {
      "id": "a",
      "label": "Treat it as a question to investigate, since the model has no context on timing, strategy, or what the spend was for.",
      "is_correct": true,
      "explanation": "Correct. The model only sees the numbers. A 40% spend rise with flat revenue could be a deliberate brand investment with a lag, a one-time event, or a real problem. It surfaces the variance; you supply the context."
    },
    {
      "id": "b",
      "label": "Cut marketing spend, since the AI identified it as inefficient.",
      "is_correct": false,
      "explanation": "Acting on a variance the model flagged, without the business context behind it, is how good analysis turns into bad decisions. Investigate before you act."
    },
    {
      "id": "c",
      "label": "Discard the observation; AI cannot read financial statements reliably.",
      "is_correct": false,
      "explanation": "Too far. Spotting that spend rose while revenue stayed flat is a legitimate, useful pattern. The limit is interpretation, not detection."
    },
    {
      "id": "d",
      "label": "Ask the AI to decide whether the spend was justified.",
      "is_correct": false,
      "explanation": "The model lacks your company context, so its verdict would be a guess dressed as analysis. Use it to frame the question; you and your team answer it."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Find a public company's quarterly earnings release. Run step 2 and step 4 above. How does the AI framing compare to how the report was originally presented?
