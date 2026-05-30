---
slug: the-brainstorming-loop-getting-past-version-1
module: creation
title: The brainstorming loop: getting past version 1
level: growing
minutes: 7
order: 2
hook: Version 1 of anything is almost never good. And AI can get you to version 5 in the time it used to take to get to version 2.
key_takeaway: Run 4 rounds: diverge → interrogate → constrain → combine; the best idea is almost never in the first output.
tags: [general, brainstorming, workflows]
---

## reading

Brainstorming with AI works best when you treat it as an iterative loop rather than a single prompt. The first output is almost always too generic. The value comes from what you do with it next.

**The loop:**

**Round 1: Diverge:** Ask for 10 options, not 3. More options means more raw material. Prompt: "Give me 10 different angles on [problem]. Make them genuinely different from each other, not variations on the same theme."

**Round 2: Interrogate:** Pick the 2-3 that have something interesting. Ask: "Why does option 7 work? What's the underlying insight? What would make it stronger?"

**Round 3: Constrain:** Add a constraint that forces creativity. "Give me 5 more options, but each one has to be framed around [a constraint you haven't tried]."

**Round 4: Combine:** "Take the tension from option 3 and the specificity from option 8 and create something new." Combination is often where the best ideas live.

The whole loop takes 15 minutes and produces something genuinely yours, because you made every curatorial decision. The AI generated the clay; you shaped it.

## multiple_choice

```json
{
  "stem": "What is the core reason brainstorming with AI works better as a multi-round loop than as a single prompt?",
  "options": [
    {
      "id": "a",
      "label": "The first output is almost always too generic, so the value comes from interrogating, constraining, and combining the raw options across rounds, with you making every curatorial decision.",
      "is_correct": true,
      "explanation": "Correct. The AI generates the clay and you shape it. Asking for ten options, probing the interesting ones, adding a constraint, then combining is where the genuinely good, genuinely yours idea emerges."
    },
    {
      "id": "b",
      "label": "Because running more prompts uses the model harder, and a tired model eventually produces better ideas.",
      "is_correct": false,
      "explanation": "That is not how it works. The loop helps because each round adds your judgment and a new angle, not because of any effect on the model itself."
    },
    {
      "id": "c",
      "label": "Because the best idea is reliably in the first batch, and the later rounds just confirm it.",
      "is_correct": false,
      "explanation": "The lesson says the opposite: the best idea is almost never in the first output. The combine round, where you fuse the tension of one option with the specificity of another, is often where it lives."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Pick a problem you've been stuck on. Run all 4 rounds above, spending about 2 minutes per round. What did you arrive at that you didn't have going in?
