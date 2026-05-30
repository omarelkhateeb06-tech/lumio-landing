---
slug: build-a-shift-change-briefing-in-five-minutes
module: industry-deep-dives
title: Build a shift-change briefing in five minutes
level: growing
minutes: 7
order: 10
hook: At shift change you are handing off a whole assignment, not one patient. AI can turn your running notes for the group into a prioritized briefing, so the oncoming team knows who needs them first.
key_takeaway: Feed the tool your notes for the full assignment and ask for a triage-ordered briefing. It surfaces who is unstable, what is pending, and what is due, and you confirm the priorities match your clinical read.
tags: [healthcare, summarizing, planning, workflows]
---

## reading

A single patient handoff is hard. A shift-change report on four, five, or six patients is harder, because now you are not just transferring facts, you are transferring priorities. The oncoming nurse needs to know, in order, who could go bad, what is still pending, and what is due in the next hour. Get the order wrong and the sickest patient waits.

Most end-of-shift notes are organized by room number, which is the least useful order for the person taking over. AI can re-sort them by what actually matters.

**The briefing prompt:**

*"Here are my de-identified notes for my full assignment this shift. Build a shift-change briefing for the oncoming nurse. Order it by clinical priority, not room number: least stable or highest-risk patients first. For each, give one line on status, what is pending (labs, consults, results), and what is due in the next two hours. Flag anything time-sensitive at the top. Use only what I provided."*

**Why priority order changes everything.** When the report leads with the patient who needs watching, the oncoming nurse builds the right mental model from the first sentence. A room-number list buries the lede.

**You own the triage call.** The tool orders based on the words you gave it. If it ranks two patients wrong, you reorder them, because you saw them and it did not.

**Privacy:** de-identify the full set before pasting, or use an approved tool. A whole-assignment note is dense with identifiers.

## before_after [personalizable]

```json
{
  "question": "Same assignment, two prompts. Notice which one builds the right mental model for the oncoming nurse.",
  "before_prompt": "Summarize my notes for my five patients so I can hand off at shift change.",
  "after_prompt": "Here are my de-identified notes for my full assignment. Build a shift-change briefing for the oncoming nurse. Order it by clinical priority, not room number: least stable or highest-risk first. For each, give one line on status, what is pending (labs, consults, results), and what is due in the next two hours. Flag anything time-sensitive at the top. Use only what I provided.",
  "changes": [
    "Asks for priority order instead of a flat summary, so the report leads with the patient who could go bad rather than burying them at room 4.",
    "Specifies the three things the oncoming nurse needs per patient: status, what is pending, and what is due soon.",
    "Pulls time-sensitive items to the top, so the most urgent handoff information lands in the first sentence."
  ]
}
```

## multiple_choice

```json
{
  "stem": "The AI briefing ranks Patient C (stable, awaiting a routine discharge) above Patient A (new-onset chest pain, troponin pending). You saw both. What do you do?",
  "options": [
    {
      "id": "a",
      "label": "Reorder it so Patient A leads. You assessed them; the tool only ranked the words you typed, and it got the triage wrong.",
      "is_correct": true,
      "explanation": "Correct. The tool orders based on the language you gave it, not a clinical exam. You own the triage call, so when its order does not match your read of who is least stable, you fix it."
    },
    {
      "id": "b",
      "label": "Leave it; the AI processed all your notes and likely weighed something you missed.",
      "is_correct": false,
      "explanation": "The tool cannot see the patient or weigh acuity the way you can. Pending troponin on new chest pain outranks a routine discharge, and your judgment overrides the model's ordering."
    },
    {
      "id": "c",
      "label": "Ask the AI to explain its ranking and adopt whatever reasoning it gives.",
      "is_correct": false,
      "explanation": "Its explanation will be a plausible rationalization of a flawed order. The fix is your clinical judgment, not the model's justification."
    },
    {
      "id": "d",
      "label": "Re-sort the whole list by room number to be safe.",
      "is_correct": false,
      "explanation": "Room-number order is the least useful for a handoff; it buries the sickest patient. Reorder by clinical priority using your own read."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Near the end of your next shift, gather your de-identified notes for the whole assignment and run the briefing prompt. Compare the AI's priority order to the order you would have reported in. Where do you disagree, and why does your clinical judgment override it?
