---
slug: ai-assisted-patient-handoffs-the-sbar-method
module: industry-deep-dives
title: "AI-assisted patient handoffs: the SBAR method"
level: beginner
minutes: 6
order: 6
hook: A rushed handoff is where details fall through the cracks. AI can turn your scattered notes into a clean SBAR in under a minute, so nothing gets lost between you and the next clinician.
key_takeaway: Paste your rough notes, ask for SBAR format, and you get a structured handoff that the next nurse can act on immediately. You stay in charge of the clinical judgment; the tool handles the structure.
tags: [healthcare, summarizing, workflows]
---

## reading

Handoffs are where care continuity breaks. You know the patient. The next nurse does not. Everything they need has to cross that gap in a few hurried minutes, and the standard format for that is SBAR: Situation, Background, Assessment, Recommendation.

The problem is that your working notes are never in SBAR. They are fragments: a vital sign here, a med change there, a worry you have not had time to write down properly. Reformatting that into clean SBAR by hand is exactly the kind of task that gets skipped when the unit is busy.

**The workflow:** Open your AI tool and paste your rough notes. Use this prompt:

*"Reformat these shift notes into an SBAR handoff for the oncoming nurse. Situation: current status and why. Background: relevant history and admission reason. Assessment: my clinical read. Recommendation: what to watch and what to do next. Keep it tight and use only what I gave you. Do not add clinical details I did not state."*

That last sentence matters. You are asking the tool to organize your words, not to invent findings.

**Critical: protect patient privacy.** Do not paste real names, dates of birth, or medical record numbers into a consumer AI tool. Use initials or "the patient," or use a tool your organization has approved for protected health information.

**Then read it back.** You are the clinician. The AI gives you a clean draft; you confirm every line is accurate before it becomes the handoff.

## before_after [personalizable]

```json
{
  "question": "Same shift notes, two prompts. Notice which one protects the patient from invented findings.",
  "before_prompt": "Turn my notes into an SBAR handoff: 72yo, hip surgery, BP a bit low this afternoon, seemed more confused at 1500, family worried.",
  "after_prompt": "Reformat these de-identified shift notes into an SBAR handoff for the oncoming nurse: 72yo post-op day 1, left hip ORIF, BP 96/58 at 1500 (baseline ~130/80), new confusion noted 1500, family at bedside expressing concern. Situation, Background, Assessment, Recommendation. Use only what I gave you. Do not add clinical details, vitals, or interventions I did not state.",
  "changes": [
    "Gives concrete de-identified facts (values, baseline, timing) so the SBAR is built on what actually happened, not vague impressions.",
    "Adds the critical constraint to use only the stated facts and invent nothing, which stops the tool from fabricating a med, a vital, or an intervention.",
    "Keeps the clinical read in the nurse's words, so the tool organizes the handoff rather than authoring findings it never witnessed."
  ]
}
```

## multiple_choice

```json
{
  "stem": "Why does the SBAR prompt end with 'Use only what I gave you. Do not add clinical details I did not state'?",
  "options": [
    {
      "id": "a",
      "label": "Because the tool will otherwise fill gaps with plausible-sounding findings that were never observed, and a handoff with an invented detail is dangerous.",
      "is_correct": true,
      "explanation": "Correct. Without that constraint the model 'completes the picture' with realistic but fabricated vitals or interventions. In a handoff, an invented finding can drive the next nurse to the wrong action."
    },
    {
      "id": "b",
      "label": "Because it makes the SBAR shorter.",
      "is_correct": false,
      "explanation": "Brevity is a side effect, not the reason. The point is preventing fabricated clinical content from entering the handoff."
    },
    {
      "id": "c",
      "label": "Because the tool is not allowed to use the SBAR format otherwise.",
      "is_correct": false,
      "explanation": "The format is set by the rest of the prompt. This sentence is about accuracy: organize my words, do not invent new findings."
    },
    {
      "id": "d",
      "label": "Because it speeds up the model's response time.",
      "is_correct": false,
      "explanation": "It has nothing to do with speed. It is the guardrail that keeps the tool organizing your facts instead of inventing its own."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Take the rough notes from one patient on your next shift (de-identified). Run them through the SBAR prompt above. Compare the output to how you would have given that handoff verbally. What did the structure surface that you might have glossed over?
