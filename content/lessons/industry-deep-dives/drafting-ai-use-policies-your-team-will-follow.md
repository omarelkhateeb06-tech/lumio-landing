---
slug: drafting-ai-use-policies-your-team-will-follow
module: industry-deep-dives
title: "Drafting AI Use Policies Your Team Will Follow"
level: growing
minutes: 9
hook: A policy nobody reads is not a policy. It is a document that protects no one and changes nothing while everyone keeps doing what they were already doing.
key_takeaway: A usable AI policy is short, concrete, and example-driven: it names what is fine, what is off-limits, and where to ask, in language people actually follow.
order: 28
tags: [hr, planning, workflows]
---

## reading

Your employees are already using AI. The only question is whether they are doing it with guidance or guessing. HR often answers with a policy, and most AI policies fail the same way: they are long, abstract, fear-driven, and written in legal language nobody finishes reading. "Employees must use AI responsibly and in accordance with applicable policies" tells a person nothing about whether they can paste a customer email into a chatbot. So they decide for themselves, and the policy protects no one.

A policy people follow has different properties. It is short enough to read in two minutes. It is concrete, built on real examples from how your people actually work. And it is framed around enabling good use, not just forbidding everything, because a policy that says only no gets ignored the moment AI is genuinely useful. The goal is a document that changes behavior, not one that covers the company on paper while everyone improvises underneath it.

AI can help you draft this, and it is well suited to it, but the judgment is yours. The model can produce a clean structure and plain language fast. What it cannot do is know your specific risks, your data classifications, the tools you have approved, and the realities of your teams' work. A generic AI-generated policy that bans everything or permits everything has skipped exactly the part you exist to supply.

The pieces that make a policy stick are practical. Concrete green-light examples (drafting internal docs, brainstorming, summarizing public material) and red-light ones (pasting customer data, confidential figures, or personal information into unapproved tools). A named, easy way to ask when something is unclear, because the gray zone is where people most need a path that is not just guessing. And plain language a new hire could follow on day one. Get those right and the policy does its real job, which is shaping what people actually do.

## multiple_choice

```json
{
  "stem": "Two draft AI policies land on your desk. Which one is more likely to actually change how employees behave?",
  "options": [
    {
      "id": "a",
      "label": "A two-minute read with concrete green-light and red-light examples and a named way to ask when unsure.",
      "is_correct": true,
      "explanation": "Correct. Short, concrete, example-driven policies with a clear path for the gray zone get read and followed. The specificity is what turns a document into behavior."
    },
    {
      "id": "b",
      "label": "A comprehensive ten-page document in formal legal language covering every conceivable scenario.",
      "is_correct": false,
      "explanation": "Length and legalese are exactly what makes a policy go unread. If people do not finish it or cannot tell what applies to their task, they improvise, and the document protects no one."
    },
    {
      "id": "c",
      "label": "A one-line policy that simply bans all use of AI tools at work.",
      "is_correct": false,
      "explanation": "A blanket ban gets ignored the moment AI is genuinely useful, and it drives usage underground with no guidance. A usable policy enables good use and draws clear lines, rather than forbidding everything."
    }
  ]
}
```

## try_it_live

```json
{
  "instructions": "Ask the AI to draft a short, usable AI policy you can adapt. Give it your team, your approved tools, and your real do-not-touch data. Or use the sample: a small marketing team, an approved enterprise AI tool, and a rule that customer and personal data never goes into unapproved tools.",
  "system_prompt": "You are an HR policy partner helping draft a short, usable internal AI policy. Keep it to something readable in about two minutes, in plain language a new hire could follow on day one. Structure it as: a one-line purpose, three to five concrete green-light examples, three to five concrete red-light examples, and a named, easy way to ask when something is unclear. Avoid legal jargon and fear-based framing; frame it around enabling good use within clear lines. Remind the user that you do not know their specific risks, approved tools, or data classifications, so they must confirm the specifics. No em dashes.",
  "ideal_output": "Here is a short draft AI policy. Confirm the specifics, your approved tools, your data rules, against what your organization has actually decided, since I am working from what you told me.\n\nPurpose: Use AI to do better work faster, while keeping our customers' and company's data safe.\n\nGreen light, go ahead: drafting and editing internal documents and emails, brainstorming ideas, summarizing public or non-sensitive material, and learning how to do something. Use [your approved tool] for anything work-related.\n\nRed light, do not: paste customer data, personal information, confidential figures, or anything not yet public into any AI tool that is not on our approved list. Do not let AI make a final decision about a person, such as a hire or a termination.\n\nNot sure? Ask in the #ai-questions channel or message [named person] before you do it. Asking is always the right call, and you will never be penalized for checking.\n\nWant me to tailor the examples to a specific team's daily work?",
  "input_placeholder": "Describe your team, your approved tools, and the data that must never go into unapproved tools..."
}
```

## mini_project

Draft a real one-page AI policy for your organization or one team in it. Start with the judgment only you can supply: list your actual approved tools, your real do-not-touch data categories, and the two or three situations your people most often run into. Use AI to turn that into a two-minute read with concrete green-light and red-light examples and a clearly named way to ask in the gray zone. Then pressure-test it: hand it to someone on the team and ask them to tell you, for three real tasks, what the policy says they should do. If they cannot answer quickly, it is still too abstract. Revise until a new hire could follow it on day one.
