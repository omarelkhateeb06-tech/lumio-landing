---
slug: learn-new-software-or-a-new-concept-fast
module: everyday-work
title: "Learning New Software or a New Concept Fast"
level: beginner
minutes: 6
order: 16
hook: Stop hunting through help docs and unwatchable tutorial videos. Ask AI your exact question and get the answer at your exact level.
key_takeaway: Treat AI as a patient on-demand tutor: tell it what you are trying to do and what you already know, ask follow-ups until it clicks, and verify any step-by-step instructions against the real tool.
tags: [general, research]
---

## reading

Learning something new at work used to mean digging through help documentation written for someone who already understands it, or sitting through a 20-minute video to find the 30 seconds you needed. AI changes the shape of learning, because you can ask your exact question, in your own words, and get an answer pitched to where you actually are.

Whether it is a new software tool, an unfamiliar concept, or a process you have never run, the approach is the same: treat AI as a patient tutor who never makes you feel slow.

**State your goal and your starting point.** "I need to set up an automatic email rule in Outlook. I am not technical and I have never used the rules feature. Walk me through it step by step." Telling it your level gets you instructions you can follow instead of jargon you cannot.

**Ask for it the way you learn.** "Give me the steps as a simple numbered list." "Explain the concept with an everyday analogy first." "Just tell me the fastest way to do this one thing, skip the background." You control the format, so ask for the one that works for your brain.

**Keep asking follow-ups until it clicks.** This is the real advantage over a static tutorial. "I do not see that menu, where is it?" "What does that setting actually do?" "Can you explain that last step again, simpler?" A tutorial cannot answer you. The AI will go around as many times as you need, without judgment.

**Learn the why, not just the steps.** When you have time, ask "why does it work this way?" Understanding the logic means you can handle the next, slightly different version of the problem yourself instead of coming back for every variation.

One honest caution for software especially: tools change their menus and features constantly, and the AI's knowledge has a cutoff date, so it may describe an older version or an option that moved. Use its instructions as a strong guide, but if a step does not match what you see on screen, trust the screen and ask the AI to help you find the current location. For facts and concepts, verify anything important the same way you would from any single source. A tutor that is right most of the time and instantly available still beats hunting through docs, as long as you keep your eyes open.

## try_it_live [personalizable]

```json
{
  "instructions": "Practice using AI as a patient tutor. Pick something you want to learn (a software feature, a work concept, a process) and write the prompt that gets you a beginner-level, step-by-step answer. Or use the sample: you need to create a pivot table in Excel to total sales by month, and you've never made one.",
  "system_prompt": "You are a patient, encouraging tutor for non-technical professionals. Given a learner's goal and their stated experience level, give clear step-by-step instructions in plain language at that level, using a short everyday analogy if it helps, and invite follow-up questions. For software steps, note that menus may differ by version and tell them what to do if a step doesn't match their screen. No jargon without a plain definition, no em dashes.",
  "ideal_output": "A pivot table is just a way to let Excel total things up for you automatically, like asking a clerk to sort a stack of receipts into monthly piles and add each pile. Here's how, step by step: (1) Click any cell inside your sales data. (2) In the top menu, click Insert, then click PivotTable. (3) In the box that appears, confirm it selected your data range, and choose to put the table in a New Worksheet, then click OK. (4) A panel opens on the right with your column names. Drag your date or month column into the Rows area. (5) Drag your sales amount column into the Values area. Excel now shows a total of sales for each month. If your menu looks different, tell me which version of Excel you have and what you see, and I'll point you to the right spot. Want me to show how to switch it to show each month as a percentage of the year?",
  "input_placeholder": "What do you want to learn, and what's your starting level?..."
}
```

## multiple_choice

```json
{
  "stem": "You're following AI's step-by-step instructions for a software feature, but step 3 mentions a menu you don't see on your screen. What does this lesson tell you to do?",
  "options": [
    {
      "id": "a",
      "label": "Trust the screen over the AI, since tools change menus and the model's knowledge has a cutoff date, then ask the AI to help you find the current location.",
      "is_correct": true,
      "explanation": "Correct. Software menus and features move, and the AI may describe an older version. When a step doesn't match, trust what you see and ask the AI to help you relocate the option."
    },
    {
      "id": "b",
      "label": "Trust the AI's instructions and keep clicking until the menu appears, since it read the documentation.",
      "is_correct": false,
      "explanation": "The AI hasn't read your current version's screen. Forcing its outdated steps onto a changed interface leads you in circles. The live screen is the authority."
    },
    {
      "id": "c",
      "label": "Abandon the task, since the AI's instructions are outdated and can't be trusted at all.",
      "is_correct": false,
      "explanation": "Overcorrection. The instructions are a strong guide; you just reconcile them with the live screen and ask the AI to point you to where the option moved."
    }
  ]
}
```
