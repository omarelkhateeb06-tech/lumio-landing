---
slug: explain-it-in-plain-language-patient-communication
module: industry-deep-dives
title: "Explain it in plain language: patient communication"
level: beginner
minutes: 6
order: 9
hook: A patient who does not understand their discharge instructions is a patient who comes back. AI can translate clinical language into plain words at a reading level real people use, without dumbing down what matters.
key_takeaway: Give the tool the clinical content and the reading level you want, and it rewrites in plain language. You check that nothing important got lost in translation before it reaches the patient.
tags: [healthcare, customer-comms, writing, editing]
---

## reading

Health literacy is one of the quietest causes of readmission. We hand patients instructions written in language built for charts, not for kitchens, and then wonder why the medication was taken wrong or the warning sign was missed. The information was technically correct. It just was not understood.

Rewriting clinical language into plain language is a skill, and it is slow to do well under time pressure. This is where AI genuinely helps, because clear rewriting is one of the things it does most reliably.

**The rewrite prompt:**

*"Rewrite these discharge instructions in plain language at about a 6th-grade reading level. Keep every medical instruction exactly accurate, especially doses, timing, and warning signs. Use short sentences and everyday words. Do not remove any safety information. Do not add new advice."*

The constraints are the point. You are asking it to simplify the wording, not the substance.

**Use it for the moments that matter:** discharge instructions, explaining a new diagnosis in terms a worried family can follow, prepping a teach-back script, or translating a procedure explanation. You can even ask for it in another language, then have a qualified interpreter confirm it.

**Always read it back as the clinician.** Plain language can accidentally drop a nuance that changes meaning. You confirm the rewrite says exactly what the patient needs to do, then it goes out.

**Privacy:** keep instructions generic or de-identified unless your tool is approved for protected health information.

## multiple_choice

```json
{
  "stem": "The plain-language rewrite prompt says 'simplify the wording, not the substance.' What does that mean in practice?",
  "options": [
    {
      "id": "a",
      "label": "Use short sentences and everyday words, but keep every dose, time, and warning sign exactly as written and remove no safety information.",
      "is_correct": true,
      "explanation": "Correct. Plain language is about how it reads, not what it says. The medical instructions, especially doses, timing, and red flags, stay precise. You are changing vocabulary, not meaning."
    },
    {
      "id": "b",
      "label": "Drop the technical details so the patient is not overwhelmed.",
      "is_correct": false,
      "explanation": "Dropping details is simplifying the substance, which is exactly what you must not do. A patient who loses a dose or a warning sign is less safe, not less overwhelmed."
    },
    {
      "id": "c",
      "label": "Round the doses to easier numbers so they are simpler to remember.",
      "is_correct": false,
      "explanation": "Changing a dose changes the instruction. Doses stay exact; only the surrounding language gets simpler."
    },
    {
      "id": "d",
      "label": "Let the AI add general health advice to make the instructions more helpful.",
      "is_correct": false,
      "explanation": "The prompt says add no new advice. Adding content the clinician did not write is a different error from simplifying language, and it can mislead the patient."
    }
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Rewrite this discharge instruction in plain language at about a 6th-grade reading level. Keep the dose, timing, and warning signs exactly accurate, use short everyday sentences, and add no new advice. Instruction: 'Administer amoxicillin 500mg PO every 8 hours for 10 days. Return to the ED for fever exceeding 101F, worsening erythema, or purulent drainage at the incision site.'",
  "system_prompt": "You rewrite clinical instructions into plain language at about a 6th-grade reading level. Keep every dose, timing, and warning sign exactly accurate. Use short sentences and everyday words. Remove no safety information and add no new advice. No em dashes.",
  "ideal_output": "Take one amoxicillin pill (500 mg) by mouth every 8 hours. Take it for 10 full days, even if you feel better. Come back to the emergency room right away if you have: a fever over 101F, redness around the cut that is spreading, or yellow or green fluid leaking from the cut.",
  "input_placeholder": "Paste the clinical instruction you want rewritten in plain language..."
}
```

## mini_project

Your 5-minute exercise: Take a set of standard discharge instructions and run the rewrite prompt. Read both versions out loud as if to a nervous patient. Which one would you actually understand if you were scared and tired? Confirm every dose and warning survived the rewrite intact.
