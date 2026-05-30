---
slug: structural-editing-rewrite-without-losing-voice
module: creation
title: Structural editing: rewrite without losing voice
level: growing
minutes: 8
order: 1
hook: The reason AI-edited text sounds generic isn't the AI: it's that you're asking it to rewrite instead of restructure.
key_takeaway: Ask for structural feedback, not a rewrite. The model can tell you what's wrong without replacing your voice with its own.
tags: [general, editing, writing]
---

## reading

There's a critical difference between asking AI to *rewrite* something and asking it to *restructure* it. Rewriting replaces your words with the model's words. Restructuring keeps your language but reorganizes the logic, the flow, and the hierarchy.

**The structural edit prompt:**
*"I've written this [piece]. Don't rewrite the language: I want to keep my voice. Instead: 1) Tell me if the structure makes logical sense, 2) Identify where I've buried the lede, 3) Suggest a better order for the sections, 4) Flag any paragraphs that repeat an idea I already made. Keep my exact wording unless I specifically ask you to change it."*

This gives you editorial feedback without homogenizing your writing.

**When to let it rewrite:** Sections you've already identified as weak. Not the whole piece. Say: "Paragraph 3 is clunky. Rewrite it in the same general voice as paragraph 1."

**The voice preservation trick:** Before editing, paste a sample of writing you love (your own or someone else's). Say: "Keep edits consistent with this voice: [paste]." The model uses it as a style anchor.

**What to watch for:** AI has a reflex toward parallel structure and clean transitions. These can smooth out the intentional roughness that makes writing interesting. Read the output critically before accepting.

## before_after [personalizable]

```json
{
  "question": "You have a blog post draft you like the wording of but the flow feels off. One prompt erases your voice, the other keeps it. Notice the difference between rewrite and restructure.",
  "before_prompt": "Here's my draft. Rewrite it so it flows better and reads more professionally. [pastes the draft]",
  "after_prompt": "Here is a draft I have written. Do not rewrite the language, I want to keep my voice. Instead: tell me if the structure makes logical sense, point out where I have buried the lede, suggest a better order for the sections, and flag any paragraph that repeats a point I already made. Keep my exact wording unless I specifically ask you to change a section. [pastes the draft]",
  "changes": [
    "Asks for structural feedback instead of a rewrite, so the model diagnoses the flow without replacing your words with its own.",
    "Names the specific structural problems to look for, like a buried lede and repeated points, so the feedback is concrete and actionable.",
    "Tells it to keep your exact wording unless asked, which preserves the voice that a full rewrite would homogenize away."
  ]
}
```

## mini_project

Your 5-minute exercise: Take something you've written in the past month. Run the structural edit prompt above. Focus only on the structure feedback. Does it surface something you already half-knew wasn't working?
