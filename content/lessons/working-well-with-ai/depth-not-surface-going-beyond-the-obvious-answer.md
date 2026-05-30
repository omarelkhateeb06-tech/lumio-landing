---
slug: depth-not-surface-going-beyond-the-obvious-answer
module: working-well-with-ai
title: "Depth, Not Surface: Getting Past the Obvious Answer"
level: confident
minutes: 7
order: 12
hook: AI's first answer is almost always the average answer: safe, generic, and forgettable. The good stuff is two prompts deeper.
key_takeaway: AI defaults to the most common, surface-level response, so push past it by asking for the non-obvious angle, demanding specifics over generalities, and making it argue against itself.
tags: [general, prompting, research]
---

## reading

Ask AI a question and you get a competent, reasonable, deeply average answer. That is not a flaw, it is how the tool works: it produces the most statistically likely response, which is by definition the most common one. The first answer is the consensus view, the thing everyone already knows. If you stop there, you get writing and thinking that sounds like everyone else's.

The people who get genuinely useful output have learned to treat the first answer as a warm-up, not a result. Here is how to push past the surface.

**Ask for what's non-obvious.** After the first answer, say: "That's the obvious take. What's the angle most people miss? What would an expert say that a beginner wouldn't?" This forces the model off the well-worn path toward something with more edge.

**Demand specifics over generalities.** Generic answers hide in abstraction. "Improve communication" means nothing. Push: "Give me the exact sentence I'd say, the specific number, the concrete example." Specificity is where surface-level advice either becomes useful or falls apart.

**Make it argue with itself.** "Now give me the strongest case against what you just said." A single answer is a sales pitch. Forcing the counterargument surfaces the trade-offs and assumptions the first response quietly skipped, and you end up with a real picture instead of a tidy one.

**Ask why, repeatedly.** Like a curious child, keep asking the model to go one level deeper. "Why is that true? And why is that?" Three rounds in, you reach the actual mechanism instead of the slogan.

The mindset shift is to stop treating the conversation as one question and one answer. The first reply is the cost of entry. The depth comes from the follow-ups, where you refuse the generic and keep pressing until the answer earns its place.

## try_it_live [personalizable]

```json
{
  "instructions": "Practice pushing past the surface. Take any first answer from an AI, or use the sample below, and write the follow-up prompts that force it deeper. Sample first answer: 'To improve employee retention, focus on competitive pay, good management, clear growth paths, and a positive culture.' Your job is to make it non-obvious and specific.",
  "system_prompt": "You are a coach who teaches people to extract depth from AI. Given a generic, surface-level AI answer, write three sharp follow-up prompts the user could send to push past it: one that asks for the non-obvious angle, one that demands a concrete specific, and one that forces a counterargument. Make each follow-up directly about the sample content, not generic. No jargon, no em dashes.",
  "ideal_output": "Three follow-ups to push that retention answer deeper: (1) Non-obvious angle: 'Those are the standard four everyone lists. What's the retention lever that companies consistently underestimate, and why does it get missed?' (2) Force a specific: 'Pick the single highest-impact one for a 30-person team with a tight budget, and give me the exact first action I'd take next week, including what I'd say.' (3) Counterargument: 'Now make the strongest case that focusing on pay and perks actually hurts retention compared to something else, and tell me what that something is.' Run these in order and the answer goes from a generic list to a specific, defensible plan.",
  "input_placeholder": "Paste a generic AI answer and I'll write the prompts that dig past it..."
}
```
