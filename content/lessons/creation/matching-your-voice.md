---
slug: matching-your-voice
module: creation
title: "Getting AI to Write in Your Voice"
level: growing
minutes: 7
order: 7
hook: Stop sounding like a robot. Teach the AI how you actually write, and it will follow your lead.
key_takeaway: Show the AI samples of your real writing and name the traits of your style, and it stops producing generic text and starts sounding like you.
tags: [general, writing, custom-instructions]
---

## reading

The most common complaint about AI writing is fair: it sounds like AI. Flat, over-formal, full of phrases no human would actually say. The good news is that this is a fixable problem, and the fix is simple once you know it.

AI writes generically by default because you have not told it whose voice to use. Give it your voice to copy, and the difference is night and day.

There are two ways to do this, and they work best together.

**Show, do not just tell.** Paste two or three samples of your own writing, then say: "This is how I write. Study the tone, sentence length, and word choices. Now write the new piece in this same voice." Examples teach the AI more than any description could.

**Name your style traits.** Describe what makes your writing yours. "I write in short sentences. I avoid corporate buzzwords. I use the occasional dry joke. I never start with 'In today's fast-paced world.'" Specifics like these steer the output hard.

If you write a lot in one place, save your voice description in the tool's custom instructions or memory so you do not retype it every time. Then every draft starts closer to you.

One more move that helps: after a draft comes back, point at what is off. "This second paragraph sounds too corporate, rewrite it the way I would actually say it." The AI adjusts, and you have taught it one more thing about your voice.

The goal is not to hand your writing over to a machine. It is to get a first draft that already sounds like you, so the editing is light and the result is unmistakably yours.

## before_after [personalizable]

```json
{
  "question": "Same task, but the second prompt teaches the AI your voice. Notice what you have to give it.",
  "before_prompt": "Write a LinkedIn post announcing that I'm starting a new job as operations lead.",
  "after_prompt": "Here are two things I've written before so you can learn my voice: [paste two short samples]. My style: short sentences, plain words, a bit of warmth, no buzzwords, and I never use phrases like 'thrilled to announce' or 'humbled.' Now write a LinkedIn post announcing I'm starting a new job as operations lead, in that exact voice.",
  "changes": [
    "Gives the AI real samples of your writing to copy, which teaches it your voice better than any description alone.",
    "Names specific style traits and banned phrases, so it avoids the generic announcement tone everyone recognizes as AI.",
    "Turns a generic request into one anchored to how you actually sound, so the draft needs only light editing."
  ]
}
```
