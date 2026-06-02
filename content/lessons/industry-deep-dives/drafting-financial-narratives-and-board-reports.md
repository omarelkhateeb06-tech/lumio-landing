---
slug: drafting-financial-narratives-and-board-reports
module: industry-deep-dives
title: "Drafting Financial Narratives and Board Reports"
level: growing
minutes: 9
hook: The numbers took an hour to pull. The two pages explaining what they mean took the rest of the afternoon. That second part is where AI earns its place.
key_takeaway: Feed AI your verified figures and the story you see in them, and it drafts a clear, audience-ready narrative, so you spend your time on judgment and not on prose.
order: 22
tags: [finance, writing, summarizing]
---

## reading

A board report is not a table. The table is the easy part; you already have the numbers. The hard, slow part is the narrative: turning a spreadsheet into a few paragraphs that tell the board what happened, why it matters, and what you are doing about it, in language a non-finance director can follow. That writing is where finance professionals lose hours, and it is exactly the kind of work AI is built to accelerate.

The order of operations matters. You verify the numbers first and form your own read of them, because the AI cannot tell you what the quarter means. Then you hand it the verified figures and your interpretation and ask it to write the narrative. "Here are our Q3 actuals against budget. The story is that revenue beat plan on strong renewals but margin slipped because we pulled forward some hiring. Draft a one-page board narrative: a short summary, the key drivers, and the outlook, written for directors who are not finance specialists."

What comes back is a clean, structured draft built on your numbers and your judgment. You are not asking the AI what to think. You are asking it to express what you already concluded, clearly and quickly. That distinction is the whole game.

Two cautions specific to this work. Never paste material non-public information or confidential figures into a public AI tool; if your data is sensitive, use an approved enterprise tool or describe the shape of the story without the live numbers. And read the draft hard for tone and accuracy, because a model can smooth a real problem into something that reads better than the truth. A board narrative has to be honest, and the honesty is your responsibility, not the model's.

## try_it_live

```json
{
  "instructions": "Hand the AI your verified figures and your read of them, and ask for a board-ready narrative. Or use the sample: Q3 revenue beat budget on strong renewals, gross margin slipped a few points because hiring was pulled forward, and cash runway is comfortable.",
  "system_prompt": "You are a finance communications partner helping a finance professional write a board narrative. The user supplies verified figures and their own interpretation of what the numbers mean. Your job is to express their interpretation clearly, never to invent analysis or add figures they did not provide. Produce a one-page structure: a two to three sentence summary, a short 'key drivers' section, and a brief 'outlook' section, written for intelligent directors who are not finance specialists. Keep it honest and plain. If the user's narrative glosses over a weak spot, surface it neutrally rather than smoothing it away. No jargon without a plain-language gloss, no em dashes.",
  "ideal_output": "Here is a one-page board narrative built on the figures and read you gave me. I kept it plain and did not add any numbers beyond yours.\n\nSummary: Q3 revenue came in ahead of budget, driven by stronger than expected renewals. Gross margin slipped a few points against plan, the result of a deliberate decision to pull forward hiring. Cash runway remains comfortable.\n\nKey drivers: The revenue beat was concentrated in renewals rather than new logos, which speaks to retention strength but is worth watching as a growth signal. The margin movement was a timing choice, not a cost overrun, since the new hires were planned for Q4 and brought forward.\n\nOutlook: We expect margin to normalize as the new hires reach productivity, assuming renewal strength holds. One thing for the board to note: because the beat came from renewals, new-logo growth is the metric to track next quarter.\n\nWant me to tighten this to half a page, or expand the outlook into specific quarterly targets you provide?",
  "input_placeholder": "Paste your verified figures and your own read of what the quarter means..."
}
```

## multiple_choice

```json
{
  "stem": "What is the right division of labor when using AI to write a board report?",
  "options": [
    {
      "id": "a",
      "label": "You verify the numbers and decide what they mean; the AI expresses your interpretation clearly in audience-appropriate prose.",
      "is_correct": true,
      "explanation": "Correct. The judgment about what the quarter means is yours and cannot be outsourced. AI is fast at turning your verified figures and conclusions into a clean narrative, which is the slow part you can hand off."
    },
    {
      "id": "b",
      "label": "You give the AI raw exports and let it decide both what the numbers mean and how to present them.",
      "is_correct": false,
      "explanation": "Letting the model interpret the results hands it the one thing only you can do. It can misread the story or smooth a real problem. You form the read; the AI writes it up."
    },
    {
      "id": "c",
      "label": "The AI does everything end to end, so you can skip verifying the figures if the writing looks polished.",
      "is_correct": false,
      "explanation": "Polished prose is not evidence of correct numbers. Figures must be verified against sources first, and the interpretation must be yours, before any drafting begins."
    }
  ]
}
```

## mini_project

Take a recurring report you write, a board update, a monthly close summary, or a variance commentary. Pull your verified figures and write two or three rough sentences of your own honest read: what happened, why, and what is next. Hand the AI the figures and your read, and ask for a structured narrative aimed at your real audience. Then edit it as the person accountable for it: confirm it added no numbers of its own, check that it did not soften anything that should stay sharp, and make the voice yours. Compare the time against writing it cold. Notice that the thinking still took you the same effort, and only the prose got faster.
