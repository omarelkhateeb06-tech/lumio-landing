---
slug: ai-in-product-management-spec-writing
module: industry-deep-dives
title: AI in Product Management: spec writing
level: confident
minutes: 8
order: 1
hook: The PRD that used to take a PM two days to write now takes two hours: if you know which parts to delegate.
key_takeaway: Write the problem statement yourself, delegate the scaffolding. AI is excellent at structure and edge-case generation, terrible at identifying the actual problem.
tags: [general, writing, planning, workflows]
---

## reading

Product specs (PRDs, feature briefs, technical requirements) are the highest-leverage documents a PM writes. They're also the most time-consuming. The good news: they're almost entirely structured, which makes them excellent candidates for AI assistance.

**The spec writing workflow:**

**Step 1: Problem statement.** Write this yourself. AI is bad at identifying problems; it's good at everything that comes after. Your 3-sentence problem statement should describe: who has the problem, what they currently do, and what makes that inadequate.

**Step 2: AI-assisted scaffolding.** *"I'm writing a PRD for [feature]. The problem: [your statement]. Generate: 1) 3 user stories, 2) A draft success metrics section, 3) Potential edge cases, 4) A list of dependencies."*

**Step 3: Scope definition.** *"What's the minimum viable version? What am I including that could be cut for v1? What would make this scope creep?"*

**Step 4: Review checklist.** *"What critical sections are typically in a PRD that aren't yet in this draft?"*

The judgment calls stay with you. The scaffolding, structure, and completeness checks become fast.

## multiple_choice

```json
{
  "stem": "In the spec-writing workflow, which single part should you write yourself rather than delegate to AI?",
  "options": [
    {
      "id": "a",
      "label": "The problem statement: who has the problem, what they do now, and why that is inadequate.",
      "is_correct": true,
      "explanation": "Right. AI is good at everything downstream of the problem, but it cannot identify the actual problem worth solving. A scaffolding generated on top of a wrong problem statement is a polished spec for the wrong thing."
    },
    {
      "id": "b",
      "label": "The list of potential edge cases.",
      "is_correct": false,
      "explanation": "Edge-case generation is exactly what AI is strong at. Give it a clear problem statement and it will surface cases you would have missed."
    },
    {
      "id": "c",
      "label": "The draft success-metrics section.",
      "is_correct": false,
      "explanation": "Drafting a metrics section is structured scaffolding work, a good delegation. You still edit it, but AI gives you a solid starting frame."
    },
    {
      "id": "d",
      "label": "The list of dependencies.",
      "is_correct": false,
      "explanation": "Dependency lists are structural and well-suited to AI. The judgment call you cannot delegate is naming the real problem."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same feature, two ways to ask for scaffolding. Notice what the second prompt brings that the first cannot.",
  "before_prompt": "Write me a PRD for a new in-app notifications feature.",
  "after_prompt": "I'm a PM at a B2B scheduling tool. The problem: admins miss last-minute booking changes because we only notify by email, which they check a few times a day, so they show up unprepared. Using that problem statement, generate: 1) three user stories, 2) a draft success-metrics section, 3) likely edge cases, 4) a dependency list. Do not restate the problem; build on it.",
  "changes": [
    "Leads with a real problem statement written by the PM, so the scaffolding is built on the actual problem instead of an invented one.",
    "Names the concrete artifacts to produce (user stories, metrics, edge cases, dependencies) rather than asking for a vague whole PRD.",
    "Keeps the judgment call (what problem we are solving) with the human and delegates only the structure to the tool."
  ]
}
```

## mini_project

Your 5-minute exercise: Think of the last feature you were involved in specifying. Run step 2 above for it. Does the model surface edge cases that weren't in the original spec?
