---
slug: the-5-minute-meeting-debrief-protocol
module: everyday-work
title: The 5-minute meeting debrief protocol
level: beginner
minutes: 5
order: 1
hook: Most action items from meetings disappear within 48 hours. Here's a protocol that takes 5 minutes and captures everything.
key_takeaway: Rough notes + a structured prompt immediately after the meeting captures everything and drafts the follow-up before you've even walked back to your desk.
tags: [general, meetings, summarizing, workflows]
---

## reading

The problem with meetings isn't the meeting: it's what happens in the 15 minutes after. People scatter. Action items get buried. By the next day, everyone remembers the discussion but not the decisions.

**The protocol:** Within 5 minutes of ending any meeting, open ChatGPT and paste or voice-type your rough notes. Use this prompt:

*"I just had a [type of meeting] with [who]. Here are my rough notes: [paste]. Please: 1) Summarize the key decisions made, 2) List action items with owners if mentioned, 3) Flag any open questions that weren't resolved, 4) Draft a 3-sentence follow-up message I can send to the group."*

The output becomes your meeting record and your follow-up email draft in under 2 minutes.

**Why rough notes work fine:** You don't need to clean up your notes before pasting: the model handles messy, stream-of-consciousness input well. Abbreviations, half-sentences, bullet fragments: all fine.

**The voice shortcut:** On mobile, use voice-to-text to dictate your notes immediately after hanging up. The raw transcript feeds directly into the prompt. No typing, no cleanup.

This protocol works because it forces you to extract the cognitive value while the meeting is still fresh, but outsources the formatting and drafting to the model.

## multiple_choice

```json
{
  "stem": "The protocol says to run your notes within 5 minutes of the meeting ending, and that rough, messy notes are fine. Why both?",
  "options": [
    {
      "id": "a",
      "label": "Running it immediately captures the decisions while the meeting is still fresh in your head, and rough notes work because the model handles messy, fragmentary input well.",
      "is_correct": true,
      "explanation": "Correct. The timing preserves the cognitive value before it fades, and you can hand over abbreviations and half-sentences because the model cleans up the formatting and drafting for you."
    },
    {
      "id": "b",
      "label": "You must clean up your notes into full sentences first, or the model will misread them, and the 5-minute window is just a productivity habit.",
      "is_correct": false,
      "explanation": "The lesson says the opposite: you do not need to clean notes up, because the model handles stream-of-consciousness input. And the 5-minute window matters because memory fades fast, not as an arbitrary habit."
    },
    {
      "id": "c",
      "label": "The 5 minutes is for the model to process, and rough notes are fine because the meeting was recorded anyway.",
      "is_correct": false,
      "explanation": "The window is about your memory, not processing time, and the protocol assumes no recording, just your own rough notes feeding the prompt."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: After your next meeting, write 5-10 rough bullet points of what happened. Run them through the protocol above. How does the output compare to your usual post-meeting notes?
