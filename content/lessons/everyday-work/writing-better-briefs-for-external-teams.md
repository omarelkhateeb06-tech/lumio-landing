---
slug: writing-better-briefs-for-external-teams
module: everyday-work
title: Writing better briefs for external teams
level: beginner
minutes: 7
order: 3
hook: The reason external agencies and freelancers deliver the wrong thing isn't their fault: it's yours.
key_takeaway: A brief that explains the why and defines what bad looks like cuts revision rounds in half. AI drafts it in 60 seconds, you just need to fill in what you know.
tags: [general, writing, framing]
---

## reading

A bad brief produces a bad deliverable. This is true for design agencies, copywriters, developers, and any external collaborator. The problem is that most people write briefs that describe what they want without explaining why they want it or what bad looks like.

**The AI-assisted brief template:**

1. **Background:** What's the context? What exists already?
2. **Objective:** What does success look like in one measurable sentence?
3. **Audience:** Who is this for? What do they know? What do they care about?
4. **Deliverables:** Exact list of outputs with specs (format, length, deadline)
5. **Constraints:** What's off-limits? What tone/style to avoid?
6. **Examples:** Links or pastes of things you like (and briefly why)
7. **Questions:** Things you need answered before work can start

Explain your situation to ChatGPT and ask it to draft a brief using this structure. The model will produce a first draft in 60 seconds. You edit it. The resulting brief is 3x more detailed than what most people send, which means 3x fewer revision rounds.

**The meta-benefit:** Writing the brief often reveals that you haven't made the decisions yet. Better to find out before the kickoff call than during the third revision.

## multiple_choice

```json
{
  "stem": "According to this lesson, what separates a brief that cuts revision rounds from the one most people send?",
  "options": [
    {
      "id": "a",
      "label": "It explains why you want the thing and defines what 'bad' looks like, not just a description of what you want.",
      "is_correct": true,
      "explanation": "Correct. Most briefs describe the desired output but skip the reasoning and the constraints. Spelling out the why and the off-limits gives the collaborator enough to make good calls without guessing, which is what cuts revision rounds."
    },
    {
      "id": "b",
      "label": "It is as long as possible, so the collaborator has every detail spelled out and nothing is left to interpretation.",
      "is_correct": false,
      "explanation": "Length is not the point. A brief that explains intent and constraints can be concise; padding it with detail does not help if the why is still missing."
    },
    {
      "id": "c",
      "label": "It leaves the objective open so the external team can bring their own creative direction.",
      "is_correct": false,
      "explanation": "An open objective is exactly what produces the wrong deliverable. The template asks for success defined in one measurable sentence so everyone is aiming at the same target."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Pick an upcoming project with an external collaborator. Use ChatGPT to draft a brief using the 7-part template. Share it and note how the quality of the first questions back changes.
