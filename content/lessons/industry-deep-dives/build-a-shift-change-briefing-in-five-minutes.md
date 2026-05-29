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

## mini_project

Your 5-minute exercise: Near the end of your next shift, gather your de-identified notes for the whole assignment and run the briefing prompt. Compare the AI's priority order to the order you would have reported in. Where do you disagree, and why does your clinical judgment override it?
