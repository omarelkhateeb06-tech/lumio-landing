---
slug: building-simple-workflows
module: business-workflows
title: "Building a Simple AI Workflow"
level: growing
minutes: 7
order: 6
hook: Stop reinventing the same task every week. Turn it into a repeatable AI routine.
key_takeaway: A workflow is just a repeatable task broken into clear steps with a reusable prompt for each, so you set it up once and run it on autopilot every time.
tags: [general, workflows, automation]
---

## reading

Most people use AI one question at a time, starting fresh each time. That is fine for one-off tasks. But the real time savings come from building a workflow: a repeatable routine for a task you do over and over.

A workflow is not complicated. It is just a job broken into steps, with a reliable prompt for each step, that you can run the same way every time. Think of a recipe you do not have to reinvent.

Here is how to build one. Pick a task you repeat, say, processing incoming customer feedback. Break it into the steps you actually take:

**Step 1:** Sort each piece of feedback into a category (bug, feature request, praise, complaint).

**Step 2:** Summarize the main point in one sentence.

**Step 3:** Draft a suggested response.

Now write a clear prompt for each step, and save those prompts somewhere you can reuse them. Each week, you paste in the new feedback and run the same three prompts. The task that used to take an hour now takes ten minutes, and the output is consistent every time.

The key habits that make workflows reliable:

**Make each step do one thing.** Small, single-purpose steps are easier to get right than one giant prompt that tries to do everything.

**Save your prompts.** A workflow only saves time if you do not rewrite it each time. Keep your prompts in a doc, a note, or the tool's saved-prompts feature.

**Keep a checkpoint.** Build in a moment where you review the output before it goes anywhere. The workflow speeds up the work, but you still approve the result.

Start with one task you do every week. Turn it into a workflow once, and it pays you back every week after.

## before_after [personalizable]

```json
{
  "question": "Same recurring task, two approaches. Notice why the second one keeps paying off.",
  "before_prompt": "Help me deal with this week's customer feedback. [pastes a pile of feedback and improvises a new prompt every week]",
  "after_prompt": "I run the same three steps on customer feedback each week, so here is my saved workflow. Step 1: sort each item into bug, feature request, praise, or complaint. Step 2: summarize each in one sentence. Step 3: draft a suggested reply for the complaints. Here is this week's feedback: [paste]. Run step 1 first and wait for me to confirm before moving on.",
  "changes": [
    "Breaks the task into clear, single-purpose steps instead of one vague request, so each step is reliable.",
    "Reuses the same saved prompt every week rather than improvising, so the work gets faster and more consistent over time.",
    "Builds in a checkpoint to confirm before continuing, keeping you in control of the output."
  ]
}
```

## multiple_choice

```json
{
  "stem": "This lesson lists the habits that make an AI workflow reliable. Which best captures them?",
  "options": [
    {
      "id": "a",
      "label": "Make each step do one thing, save your prompts so you do not rewrite them, and keep a checkpoint where you review the output before it goes anywhere.",
      "is_correct": true,
      "explanation": "Correct. Small single-purpose steps are easier to get right than one giant prompt, saved prompts are what make the workflow actually save time, and the checkpoint keeps you approving the result."
    },
    {
      "id": "b",
      "label": "Combine every step into one large prompt so the AI can do the whole task in a single pass.",
      "is_correct": false,
      "explanation": "The lesson advises the opposite. One giant prompt that tries to do everything is harder to get right than small, single-purpose steps you can check along the way."
    },
    {
      "id": "c",
      "label": "Rewrite the prompts fresh each week so they stay tailored to that week's data.",
      "is_correct": false,
      "explanation": "Rewriting each time defeats the purpose. A workflow only pays you back if you save the prompts and reuse them, dropping in the new data each run."
    }
  ]
}
```
