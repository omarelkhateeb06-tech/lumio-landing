---
slug: the-3-step-framing-technique
module: first-steps
title: The 3-step framing technique
level: beginner
minutes: 7
order: 3
hook: One extra sentence before your prompt doubles the quality of every answer you'll ever get.
key_takeaway: Role + specific task + constraints: three seconds of framing changes the answer from generic to actually useful.
tags: [general, framing, prompting]
---

## reading [personalizable]

The difference between a mediocre prompt and a great one isn't length: it's framing. And framing has exactly three components.

**Step 1: Role.** Tell the model who it's talking to. Not "pretend you're an expert". Tell it *your* context. "I'm a marketing manager at a 50-person SaaS company" shapes the vocabulary, level of detail, and assumptions the model makes.

**Step 2: Task.** Be specific about the output you want, not just the topic. "Help me with my email" is a topic. "Write a 3-paragraph email to my manager explaining the Q3 delay, without making it sound like I'm making excuses, ending with a proposed solution" is a task.

**Step 3: Constraints.** Tell it what *not* to do, what format you want, and what length. These are the instructions most people skip, and they're what separate a generic paragraph from something you can actually use.

Assembled: **"I'm a [role]. I need [specific output]. Keep it [constraints]."**

Example: "I'm a product manager at a fintech startup preparing for a board meeting. Write a 5-bullet executive summary of our Q3 results, focusing on user growth and revenue, in a tone that's confident but acknowledges we missed our retention target."

That's it. Three seconds of framing, 10x better output.

## mini_project [personalizable]

Your 5-minute exercise: Take a prompt you've used recently that gave you a mediocre result. Apply all three steps: role, specific task, constraints, and run it again. Compare the outputs side by side.

## multiple_choice

```json
{
  "stem": "Which part of a prompt does \"Keep it to three bullet points, no jargon\" provide?",
  "options": [
    {
      "id": "a",
      "label": "Role",
      "is_correct": false,
      "explanation": "Role is about who the model is talking to and your context, like \"I'm a marketing manager.\" This line is about format and length instead."
    },
    {
      "id": "b",
      "label": "Task",
      "is_correct": false,
      "explanation": "The task is the specific output you want. This line shapes how that output should look, which is a constraint."
    },
    {
      "id": "c",
      "label": "Constraints",
      "is_correct": true,
      "explanation": "Exactly. Format, length, and what to avoid are all constraints, and they are the part most people skip."
    }
  ]
}
```

## fill_blank

```json
{
  "template": "A complete frame names your {{1}}, states the specific {{2}} you want, and adds the {{3}} that shape the output.",
  "blanks": [
    { "id": "1", "accept": ["role", "context"], "ideal": "role" },
    { "id": "2", "accept": ["task", "output", "result"], "ideal": "task" },
    { "id": "3", "accept": ["constraints", "constraint", "limits", "rules"], "ideal": "constraints" }
  ],
  "explanation": "Role plus task plus constraints: three seconds of framing turns a generic answer into a useful one."
}
```

## before_after

```json
{
  "question": "Same goal, two prompts. Notice how much the second one tells the model.",
  "before_prompt": "Help me with my email.",
  "after_prompt": "I'm a product manager at a fintech startup. Write a 3-paragraph email to my manager explaining the Q3 delay without sounding like I'm making excuses, ending with a proposed solution. Keep the tone confident and direct.",
  "changes": [
    "Adds a role and context: product manager at a fintech startup.",
    "Names a specific task: a 3-paragraph email about the Q3 delay.",
    "Sets clear constraints: no excuses, end with a solution, confident and direct tone."
  ]
}
```

## try_it_live

```json
{
  "instructions": "Reframe this weak prompt using all three steps. Start from \"Write something about our new feature\" and rewrite it with a role, a specific task, and at least two constraints.",
  "system_prompt": "You are a helpful writing coach. Given a vague prompt, rewrite it to include a clear role, a specific task, and concrete constraints.",
  "ideal_output": "I'm a product marketer at a B2B software company. Write a 100-word announcement for our new scheduling feature, aimed at busy operations managers. Lead with the time it saves, use plain language, and end with a single call to action to try it.",
  "input_placeholder": "I'm a [role]. Write [specific task]. Keep it [constraints]..."
}
```
