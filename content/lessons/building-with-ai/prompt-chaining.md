---
slug: prompt-chaining
module: building-with-ai
title: "Prompt Chaining: Linking Steps Into a Workflow"
level: confident
minutes: 7
order: 6
hook: Stop cramming everything into one giant prompt. Break the job into a chain and the quality jumps.
key_takeaway: Splitting a complex task into a sequence of focused prompts, where each step feeds the next, produces far better results than one overloaded prompt trying to do everything at once.
tags: [general, prompting, workflows]
---

## reading

When a task is complex, the instinct is to write one enormous prompt that asks for everything at once. The result is usually mediocre, because the AI is juggling too many goals and does each one half-well. The fix is prompt chaining: break the job into a sequence of focused steps, where the output of one becomes the input to the next.

Think of it like an assembly line instead of a single overworked station. Each prompt does one thing well, and you pass the result along.

Here is a concrete example. Say you want to write a detailed article. Instead of "write me a complete, well-researched, well-structured 1,500-word article on X," you chain:

**Step 1, outline.** "Create a detailed outline for an article on X, with section headings and the key point of each."

**Step 2, review the outline.** You adjust it, reorder, cut a weak section. This checkpoint is the whole advantage. You catch problems before they get baked into 1,500 words.

**Step 3, draft section by section.** "Write the first section based on this outline point." Then the next. Each section gets the AI's full attention.

**Step 4, refine.** "Review this full draft for flow and tighten any weak transitions."

The benefits are real. Each step is higher quality because it is focused. You get checkpoints where you can steer before errors compound. And when something goes wrong, you fix one step instead of regenerating everything.

When to chain rather than use a single prompt: any time the task has distinct stages, any time the output is long, and any time getting it wrong is expensive. Analysis then recommendation. Research then draft. Draft then critique then revise.

One practical note: because each step builds on the last, keep the chain in a single conversation so the AI retains the context, or paste the previous output into the next step explicitly. The connection between steps is what makes a chain more than a list.

## before_after [personalizable]

```json
{
  "question": "Same goal, two strategies. Notice why breaking it into steps wins.",
  "before_prompt": "Write me a complete, well-researched, persuasive 1,500-word proposal to convince leadership to adopt a four-day work week, with data, counterarguments, and an implementation plan.",
  "after_prompt": "Let's build this in steps. Step 1: create a detailed outline for a persuasive proposal on adopting a four-day work week, with section headings and the key point of each, including a counterarguments section and an implementation section. Wait for me to approve the outline before we draft anything.",
  "changes": [
    "Breaks one overloaded request into a chain, starting with just the outline, so the AI gives each part its full attention.",
    "Adds a checkpoint to approve the structure before drafting, catching problems before they get baked into 1,500 words.",
    "Sets up a sequence where each step feeds the next, which produces higher quality than a single giant prompt and is easier to fix when one step goes wrong."
  ]
}
```

## multiple_choice

```json
{
  "stem": "In the outline-then-draft chain, what is the single biggest advantage of pausing to review the outline before any drafting happens?",
  "options": [
    {
      "id": "a",
      "label": "It's a checkpoint where you catch structural problems and steer before they get baked into 1,500 words.",
      "is_correct": true,
      "explanation": "Correct. The lesson calls this checkpoint the whole advantage: fixing a weak structure at the outline stage is far cheaper than after the full draft is written."
    },
    {
      "id": "b",
      "label": "It makes the AI write the later sections faster.",
      "is_correct": false,
      "explanation": "Speed isn't the point of the checkpoint. The value is catching and correcting problems early, before errors compound through a long draft."
    },
    {
      "id": "c",
      "label": "It lets you skip the drafting step entirely.",
      "is_correct": false,
      "explanation": "The outline doesn't replace drafting. It improves it, by letting you approve the structure before each section is written with full attention."
    }
  ]
}
```
