---
slug: explain-it-in-plain-language-patient-communication
module: industry-deep-dives
title: "Explain it in plain language: patient communication"
level: beginner
minutes: 15
order: 9
hook: A patient who does not understand their discharge instructions is a patient who comes back. AI can translate clinical language into plain words at a reading level real people use, without dumbing down what matters.
key_takeaway: Give the tool the clinical content and the reading level you want, and it rewrites in plain language. You check that nothing important got lost in translation before it reaches the patient.
tags: [healthcare, customer-comms, writing, editing]
---

## reading

Health literacy is one of the quietest causes of readmission. The Joint Commission has estimated that low health literacy contributes to up to 80 percent of medical errors related to misunderstood instructions. We hand patients paperwork written in language built for charts and EMR fields, not for a kitchen table at 10 pm when someone is tired and scared and trying to understand what they are supposed to do next.

The problem is not that clinicians write poorly. It is that clinical language serves a different audience than the patient. "Amoxicillin 500 mg PO q8h x10d, RTC ED for fever exceeding 101F, worsening erythema, or purulent drainage" is precise. A nurse or a physician reads it in seconds. But a patient with a 6th-grade reading level, or a patient whose first language is not English, or a patient who just heard a scary diagnosis thirty minutes ago may read that sentence and walk out not knowing what PO means, what erythema looks like, or how to measure a fever at home.

This is where AI-assisted rewriting earns its place in clinical work. Clear plain-language rewriting is something current AI tools do reliably and quickly, and the time savings matter most in the busiest moments of a shift.

## multiple_choice

```json
{
  "stem": "According to the reading, what is the root reason patients fail to understand discharge paperwork?",
  "options": [
    {
      "id": "a",
      "label": "Clinicians are careless and write poorly.",
      "is_correct": false,
      "explanation": "The reading explicitly says the problem is not that clinicians write poorly. The mismatch is about audience, not writing skill."
    },
    {
      "id": "b",
      "label": "Patients do not pay attention when they are discharged.",
      "is_correct": false,
      "explanation": "The reading does not blame patient attention. It points to the language itself being built for charts and EMR fields rather than for the patient."
    },
    {
      "id": "c",
      "label": "Clinical language serves a different audience than the patient: it is precise for clinicians but opaque for someone reading at a 6th-grade level or in a second language.",
      "is_correct": true,
      "explanation": "Correct. The reading states clinical language serves a different audience than the patient, which is why a precise note like the amoxicillin example reads in seconds to a clinician but leaves the patient lost."
    },
    {
      "id": "d",
      "label": "Discharge paperwork is always too long for anyone to read.",
      "is_correct": false,
      "explanation": "Length is not the cause the reading identifies. The issue is the vocabulary and audience mismatch, not the page count."
    }
  ]
}
```

## reading

**The core prompt structure**

A plain-language rewrite prompt has three parts: what to rewrite, how to rewrite it, and what never to touch. Here is a template you can adapt:

"Rewrite these discharge instructions in plain language at about a 6th-grade reading level. Keep every medical instruction exactly accurate, especially doses, timing, and warning signs. Use short sentences and everyday words. Do not remove any safety information. Do not add any new advice."

The last two constraints are the load-bearing ones. Do not remove safety information means the AI cannot shorten instructions by leaving out a red flag. Do not add new advice means the AI cannot fill in what it thinks is helpful general health guidance. You wrote the clinical instructions. The AI only changes how those instructions read.

**Clinical example 1: A post-procedure antibiotic course**

A patient is discharged after incision and drainage of a skin abscess. The chart note reads: "Amoxicillin 500 mg PO every 8 hours for 10 days. Return to ED if fever over 101 degrees F, increasing redness around wound, or purulent drainage from site."

Run that through the prompt above and the output should read something like: "Take one amoxicillin pill (500 mg) by mouth every 8 hours. Take it for 10 full days, even if you feel better. Come back to the emergency room right away if you have any of these: a fever over 101 degrees, redness around the wound that is getting worse or spreading, or any pus or cloudy fluid leaking from the wound."

Every piece of the original is still there. The dose is 500 mg. The interval is every 8 hours. The duration is 10 days. The return criteria are all three: fever threshold, worsening erythema described as spreading redness, and purulent drainage described as pus or cloudy fluid. The vocabulary changed. The instructions did not.

## multiple_choice

```json
{
  "stem": "A medical assistant uses the plain-language rewrite prompt on discharge instructions for a patient taking warfarin. The original instructions say 'Avoid NSAIDs, including ibuprofen and naproxen, due to increased bleeding risk.' The AI rewrite says 'Be careful with pain medicine.' What is the problem?",
  "options": [
    {
      "id": "a",
      "label": "The AI simplified the substance, not just the wording. The specific drug names and the reason were removed, which changes what the patient knows to avoid.",
      "is_correct": true,
      "explanation": "Correct. 'Be careful with pain medicine' does not tell the patient which medicines, and removes the bleeding-risk reason that makes the instruction meaningful. A patient on warfarin who takes ibuprofen for a headache has been failed by that rewrite."
    },
    {
      "id": "b",
      "label": "The rewrite is fine because shorter is always better for low-literacy patients.",
      "is_correct": false,
      "explanation": "Shorter is better only when the meaning survives. Here, critical safety content was dropped. A shorter instruction that is missing a drug name and a warning reason is not better. It is dangerous."
    },
    {
      "id": "c",
      "label": "The rewrite is fine because ibuprofen and naproxen are too technical for a 6th-grade reading level.",
      "is_correct": false,
      "explanation": "Brand familiarity does not reduce readability in this case. Most patients know the word ibuprofen from over-the-counter packaging. More importantly, the safety rule requires the names stay. The fix is: 'Do not take ibuprofen (Advil, Motrin) or naproxen (Aleve). These medicines can cause serious bleeding when you take warfarin.'"
    },
    {
      "id": "d",
      "label": "The problem is that the AI used a passive sentence structure.",
      "is_correct": false,
      "explanation": "Sentence structure is not the issue here. The issue is missing content. The names of the drugs and the reason for the warning were removed, not rephrased."
    }
  ]
}
```

## reading

**Clinical example 2: A new diabetes diagnosis**

A coordinator is preparing education materials for a patient newly diagnosed with Type 2 diabetes. The physician note says: "Initiate metformin 500 mg PO BID with meals. Monitor fasting BG daily. RTC if BG consistently greater than 250 or signs of hypoglycemia: diaphoresis, tremor, altered mental status."

The plain-language version should read: "Start taking metformin, 500 mg, twice a day. Take it with breakfast and with dinner. Check your blood sugar every morning before you eat and write the number down. Call your doctor or go to the emergency room if your blood sugar is over 250 several days in a row, or if you feel shaky, sweaty, or confused."

Notice that the AI needs to know BID means twice a day, that "with meals" maps to breakfast and dinner as the two named meal anchors, and that the three signs of hypoglycemia need to stay present. If you run this and the output drops "altered mental status" from the hypoglycemia list, the rewrite failed and you correct it before it reaches the patient.

**Clinical example 3: A teach-back script for a wound care procedure**

Nurses and medical assistants often need to talk patients through a dressing change they will do at home. The teach-back script lives in the instructions but also needs to be rehearsed. You can prompt: "Rewrite this wound care procedure as a spoken script I can read aloud to a patient at a 6th-grade level. Include a teach-back question at the end. Keep every step exact."

For a wound that requires twice-daily normal saline irrigation and non-adhesive dressing: the output should walk through wash your hands first, use plain saline solution, irrigate gently, apply the non-stick dressing, and end with a teach-back like "Can you tell me in your own words what you will do if the wound starts looking red or starts leaking?" That teach-back line confirms the patient retained the red-flag knowledge, not just the mechanical steps.

**Why AI handles this task well and what limits it**

AI tools are genuinely good at substituting everyday words for clinical terms, breaking long compound sentences into short sequential ones, and turning passive constructions into direct instructions. These changes raise readability without altering clinical meaning.

The tool is only as accurate as the instructions you give it. The prompt constraints are not formalities. They are the guardrails that make the output safe. After the rewrite, read it back as the clinician, aloud, not skimming. That step catches drops and additions that a quick visual scan misses.

Plain-language rewriting is most useful for: post-procedure discharge instructions, new-diagnosis education sheets, medication reconciliation summaries, and procedure explanations before consent. It also helps with interpreter-assisted communication, because starting with a plain-language version reduces the chance that a clinical term creates ambiguity in the target language.

## multiple_choice

```json
{
  "stem": "In the diabetes example, the physician note lists three signs of hypoglycemia: diaphoresis, tremor, and altered mental status. The reading says that if the rewrite drops 'altered mental status,' the rewrite failed. Why?",
  "options": [
    {
      "id": "a",
      "label": "Because 'altered mental status' is the only sign that needs a clinical term, so it must be kept verbatim.",
      "is_correct": false,
      "explanation": "The reading does not require keeping the clinical term verbatim. 'Confused' is offered as the plain-language version. What matters is that the sign itself is not dropped."
    },
    {
      "id": "b",
      "label": "Because dropping any one of the three warning signs leaves the patient without a complete list of when to seek help, even though the others survived.",
      "is_correct": true,
      "explanation": "Correct. All three signs of hypoglycemia need to stay present. Losing 'altered mental status' (rendered as 'confused') means the patient is missing a warning sign, which is exactly the kind of substance change the prompt constraints are meant to prevent."
    },
    {
      "id": "c",
      "label": "Because the rewrite should have kept the term 'hypoglycemia' rather than describing the symptoms.",
      "is_correct": false,
      "explanation": "The plain-language version intentionally describes the symptoms (shaky, sweaty, confused) instead of using the word hypoglycemia. The failure is the missing third sign, not the choice to describe rather than name the condition."
    },
    {
      "id": "d",
      "label": "Because BID was incorrectly translated to twice a day.",
      "is_correct": false,
      "explanation": "Twice a day is the correct translation of BID, and the reading presents it as accurate. The failure is dropping a warning sign, not the dosing translation."
    }
  ]
}
```

## reading

Even with a clear prompt and a reliable AI tool, the same four mistakes appear in clinical settings. Knowing them by name makes them easier to catch before they reach a patient.

**Mistake 1: Pasting identifiable patient instructions into a non-approved tool**

Most consumer AI tools are not cleared for protected health information. The default assumption is: this tool is not HIPAA-compliant unless your IT or compliance officer has confirmed it. A nurse who copies a discharge summary including the patient's name, date of birth, and MRN into a public chatbot has committed a privacy violation even if the rewrite itself is excellent.

What to do instead: strip the document before pasting. Replace the patient name with "the patient" or "you," and remove all identifiers. The clinical content, the medication, the dose, the warnings, does not need an identity attached to be rewritten. If you are not sure whether your facility's tool is approved for PHI, strip it first. That takes thirty seconds.

**Mistake 2: Letting the AI simplify by removing a dose or a warning sign**

This is the most clinically dangerous mistake. The AI compresses for readability and in doing so drops the detail that actually matters. The 10-day course becomes "for several days." The fever threshold of 101 degrees F disappears from the return-to-ED criteria. The instruction to take metformin with food becomes "take your diabetes medicine."

Each of those changes is technically a rewrite. None of them is acceptable.

The way to catch this is not to trust the prompt alone. Read the output against the original line by line. Every dose should appear with the same number. Every timing instruction should appear with the same interval. Every warning sign should appear by name, even if the name is now a plain description. If anything is missing, correct it manually before using the document.

## multiple_choice

```json
{
  "stem": "A clinical coordinator runs discharge instructions through an AI rewriting tool. The original says 'Return to ED for fever over 101.5 F, shortness of breath, or chest pain.' The rewrite says 'Come back if you feel unwell or have trouble breathing.' What type of mistake is this?",
  "options": [
    {
      "id": "a",
      "label": "The AI simplified the substance by removing the fever threshold and collapsing three specific warning signs into vague language.",
      "is_correct": true,
      "explanation": "Correct. 'Feel unwell' does not tell a patient at what temperature to return. Chest pain disappeared entirely. 'Trouble breathing' is closer to shortness of breath but loses precision. Every one of those three specific criteria matters and each must survive the rewrite."
    },
    {
      "id": "b",
      "label": "This is a privacy mistake because the original instruction contained clinical detail.",
      "is_correct": false,
      "explanation": "Privacy concerns involve identifiable patient information, not clinical content. The problem here is accuracy: specific warning signs were removed or diluted, not that the patient's identity was exposed."
    },
    {
      "id": "c",
      "label": "The rewrite is acceptable because 'trouble breathing' and 'shortness of breath' mean the same thing.",
      "is_correct": false,
      "explanation": "They are close but the fever threshold and chest pain are both completely absent. A rewrite that drops two of three warning signs is not acceptable even if one survived in a near-equivalent form."
    },
    {
      "id": "d",
      "label": "The rewrite is acceptable because the AI was trying to be concise.",
      "is_correct": false,
      "explanation": "Conciseness does not justify removing safety criteria. The acceptable rewrite is: 'Come back to the emergency room right away if you have a fever over 101.5 degrees, any trouble breathing, or any chest pain.' That is both concise and complete."
    }
  ]
}
```

## reading

**Mistake 3: Sending the rewrite to the patient without a clinician reading it back**

The rewrite step is preparation, not the final step. A clinician must review the plain-language version before it leaves the building. That review catches two things the prompt cannot catch on its own: content that was dropped, and content that was added.

The added-content problem is subtler than missing content. An AI tool may add "check your blood pressure at home twice a day" to a hypertension instruction the physician wrote without that monitoring frequency. That is new clinical advice delivered under the appearance of physician guidance. Reading the output sentence by sentence catches both gaps and additions before the patient sees them.

**Mistake 4: Accepting a rewrite that passes the reading-level test but fails the comprehension test**

Some plain-language rewrites produce sentences that score well on readability formulas but that a scared or distracted patient would still misunderstand. "Take the medicine as prescribed" is short and simple and completely useless for a patient who does not remember what prescribed means. "Monitor your incision daily" uses a short sentence but "monitor" and "incision" are still clinical words for many patients.

After the AI rewrites, read the output aloud the way you would read it at the bedside, to a real person who is anxious, who may not have slept well, and who is about to go home without a nurse nearby. If a sentence would stop you at the bedside because you would need to explain it, it is not plain enough yet. Ask for another revision with the specific word or phrase replaced.

## multiple_choice

```json
{
  "stem": "An AI rewrite of a hypertension instruction adds the line 'check your blood pressure at home twice a day,' a monitoring frequency the physician never wrote. Which mistake does this illustrate, and why is it dangerous?",
  "options": [
    {
      "id": "a",
      "label": "It is a privacy mistake, because home blood pressure readings are protected health information.",
      "is_correct": false,
      "explanation": "Nothing identifiable was exposed here. The problem is invented clinical advice, not a privacy breach. Privacy mistakes involve identifiers like name, date of birth, or MRN."
    },
    {
      "id": "b",
      "label": "It is the comprehension mistake, because the added sentence is too clinical for the patient.",
      "is_correct": false,
      "explanation": "The comprehension mistake is about wording a patient cannot understand. This sentence is plain enough; the danger is that it is new advice the physician never gave, not that it is hard to read."
    },
    {
      "id": "c",
      "label": "It is the dropped-content mistake, because the rewrite left out part of the original.",
      "is_correct": false,
      "explanation": "This is the opposite of dropping content. Nothing was removed; something was added. The reading flags added content as a separate and subtler problem than missing content."
    },
    {
      "id": "d",
      "label": "It is the added-content problem, which a clinician must catch on read-back because it delivers new clinical advice under the appearance of physician guidance.",
      "is_correct": true,
      "explanation": "Correct. The reading describes this as the added-content problem, subtler than missing content. Reading the output sentence by sentence is what catches advice the physician never authorized before the patient sees it."
    }
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Read the discharge instruction below. Rewrite it in plain language at about a 6th-grade reading level. Keep the dose, timing, and all warning signs exactly accurate. Use short sentences and everyday words. Do not remove any safety information. Do not add any new advice. Do not use em dashes.",
  "system_prompt": "You rewrite clinical discharge instructions into plain language at about a 6th-grade reading level. Rules you must follow: keep every dose, timing interval, and warning sign exactly as written in the original. Use short sentences and everyday words. Do not remove any safety information. Do not add any new advice that was not in the original. Do not use em dashes.",
  "ideal_output": "Take one amoxicillin pill (500 mg) by mouth every 8 hours. Take it for 10 full days, even if you start to feel better. Come back to the emergency room right away if you have any of these: a fever over 101 degrees, redness around the cut that is spreading or getting worse, or any pus or cloudy fluid leaking from the cut.",
  "input_placeholder": "Administer amoxicillin 500mg PO every 8 hours for 10 days. Return to the ED for fever exceeding 101F, worsening erythema, or purulent drainage at the incision site."
}
```

## multiple_choice

```json
{
  "stem": "You run your amoxicillin discharge instructions through the AI rewriter. The output reads: 'Take your antibiotic three times a day for 10 days. Go to the ER if you get a fever, if the wound looks red, or if anything leaks from it.' You compare this to the original. What needs to be corrected before this goes to the patient?",
  "options": [
    {
      "id": "a",
      "label": "The dose (500 mg) is missing, and 'a fever' should specify 'a fever over 101 degrees' to match the original return criterion.",
      "is_correct": true,
      "explanation": "Correct. 'Three times a day' is accurate for every-8-hours dosing, but the 500 mg dose was dropped entirely. 'A fever' without a threshold is vague: a patient who normally runs 98 degrees and hits 100 degrees might not go to the ED, when the instruction said 101 degrees is the line. Both must be corrected before this reaches the patient."
    },
    {
      "id": "b",
      "label": "Nothing needs to be corrected. The rewrite is close enough to the original.",
      "is_correct": false,
      "explanation": "A missing dose and a vague fever threshold are not close enough. Dose and return criteria are the two most clinically important pieces of information in this instruction. Both must survive exactly."
    },
    {
      "id": "c",
      "label": "The word 'antibiotic' should be changed back to 'amoxicillin' because patients need to know the drug name.",
      "is_correct": false,
      "explanation": "Using both is better: 'Take your antibiotic (amoxicillin), 500 mg.' But the primary problems are the missing dose and the vague fever number. Those are the corrections to make first."
    },
    {
      "id": "d",
      "label": "The word 'leaks' should be changed back to 'purulent drainage' so it is medically precise.",
      "is_correct": false,
      "explanation": "Plain-language rewrites intentionally replace clinical terms like purulent drainage with everyday language like pus or fluid leaking. That substitution is correct. The dose and fever threshold are the real gaps here."
    }
  ]
}
```

## mini_project

Take a set of discharge instructions your unit or clinic actually uses, either a printed template or a standard after-visit summary you hand patients. Run the full rewrite prompt on that document, keeping the prompt constraints: keep every dose, timing, and warning sign exact; add no new advice; use short sentences and everyday words. Then read both versions aloud at a normal speaking pace, the way you would at the bedside with a patient who is tired, nervous, and about to go home. Compare them sentence by sentence to confirm every dose, interval, and warning sign survived.

- Write down any dose, timing reference, or warning sign that appeared in the original but was missing or changed in the AI version. Note how you corrected each one.
- Write one sentence describing the biggest readability difference between the two versions and why that difference matters for the specific patient population your unit serves.
- Identify one sentence in the AI rewrite that still sounds clinical or confusing to a non-medical reader, and rewrite that sentence yourself in plain language without changing the meaning.
