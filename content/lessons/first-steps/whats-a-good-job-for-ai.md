---
slug: whats-a-good-job-for-ai
module: first-steps
title: "What's a Good Job for AI?"
level: beginner
minutes: 6
order: 5
hook: The difference between people who love AI and people who give up is almost never skill. It's that one group points it at the right tasks.
key_takeaway: AI is strongest on first drafts, reshaping text, and explaining things, and weakest on facts, math, and anything where being wrong is expensive. Match the task to the tool.
tags: [general, fundamentals]
---

## reading

People who feel let down by AI usually aren't using it wrong; they're aiming it at the wrong targets. They ask it for a hard fact, get burned, and conclude it's useless. Meanwhile, the people who swear by it are quietly pointing it at the tasks it's genuinely built for. Here's how to tell those apart before you start, so you get a win instead of a letdown.

**Green-light tasks (reach for AI first):**
- **First drafts of anything.** Emails, posts, outlines, job descriptions, agendas. A rough draft in ten seconds beats a blank page every time, and editing is easier than creating.
- **Reshaping text you already have.** Make it shorter, warmer, more formal, simpler. Turn bullet points into prose or prose into bullets. This is its single best skill.
- **Explaining and simplifying.** "Explain this clause in plain English." "What does this error message mean?" Great for getting unstuck.
- **Brainstorming and getting unstuck.** Names, angles, counterarguments, twenty options to react to. It's a tireless thinking partner.
- **Summarizing long things you provide.** Paste a report, get the gist. (Provide the text; don't trust it to recall a document from memory.)

**Red-light tasks (don't trust it alone):**
- **Specific facts, figures, dates, and quotes.** It will sound certain and may be wrong. Verify at the source.
- **Math and precise calculations.** It fumbles arithmetic surprisingly often. Use a calculator or spreadsheet.
- **Anything high-stakes if wrong.** Medical, legal, financial, or safety decisions need a qualified human, not a confident guess.
- **Current events, unless it's browsing live.** Frozen training can't know this week.

**The underlying pattern:** AI is brilliant when you're the editor and it's the drafter, and risky when you're trusting it as the source of truth. If a mistake would just cost you a quick re-read, green-light it. If a mistake would cost you money, reputation, or someone's wellbeing, keep a human firmly in charge and use AI only for the parts you can check.

Match the task to the tool, and the disappointment mostly disappears.

## before_after

```json
{
  "question": "Same topic, two ways to use AI. One plays to its strengths; one walks into its weakness.",
  "before_prompt": "What were the exact attendance numbers for our industry's biggest conference last year?",
  "after_prompt": "Here are my rough notes from last year's conference [paste]. Turn them into a tight 5-bullet summary I can send my team, and flag anything that sounds like a specific number I should double-check.",
  "changes": [
    "Stops asking the AI to recall a precise fact from memory, which is a red-light task it will guess at.",
    "Switches to reshaping text you provide, which is its single strongest skill.",
    "Even builds in a verification habit by asking it to flag the numbers for you to confirm."
  ]
}
```
