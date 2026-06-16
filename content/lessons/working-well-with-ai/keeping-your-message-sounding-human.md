---
slug: keeping-your-message-sounding-human
module: working-well-with-ai
title: "Editing AI Output to Sound Like You"
level: growing
minutes: 6
order: 10
hook: Everyone can now spot AI writing: the throat-clearing intros, the tidy lists, the words no human says out loud. Here is how to scrub it out.
key_takeaway: AI writing has a recognizable generic sound, so strip the filler openings, the inflated vocabulary, and the over-tidy structure, and add a specific human detail, so your message reads like a person wrote it.
tags: [general, writing, editing]
---

## reading

There is a sound that AI writing makes, and more people can hear it every month. The polished but empty opening. The phrase "in today's fast-paced world." The relentless symmetry of three neat bullet points. The word "delve." When a reader catches that sound in your message, two things happen: they trust it less, and they feel a little less respected, because you clearly did not write it to them.

Good news: the AI sound is easy to remove once you know what produces it. Most of it comes from a few habits.

**Cut the throat-clearing.** AI loves to warm up before saying anything. "I hope this email finds you well. In an increasingly complex landscape, it is more important than ever to..." Delete it. Start with the actual point. Real people get to it.

**Swap inflated words for plain ones.** AI reaches for "utilize," "leverage," "facilitate," "delve into," "robust." Change them to "use," "use," "help," "look at," "strong." If you would not say the word out loud to the person, do not write it.

**Break the perfect symmetry.** AI output is suspiciously balanced: every list has three items, every paragraph is the same length. Human writing is lumpy. Vary your sentence lengths, let one point be longer than the others, and do not force everything into a list.

**Add one specific, human detail.** The fastest way to sound human is to include something only you would know: a reference to last week's conversation, a small aside, an actual name. Generic text has no fingerprints. One real detail puts yours on it.

The fix is not to write everything from scratch. It is to let AI draft, then spend sixty seconds removing the tells and adding yourself back in. That small edit is the difference between a message that sounds like a person and one that sounds like a machine wearing a tie.

## before_after [personalizable]

```json
{
  "question": "The same message before and after a sixty-second human pass. Notice exactly which AI tells get removed.",
  "before_prompt": "Hi team, I hope this message finds you well. In today's rapidly evolving business landscape, it is more important than ever to leverage our collective strengths. I wanted to take a moment to delve into three key priorities for the upcoming quarter: first, enhancing operational efficiency; second, fostering cross-functional collaboration; and third, optimizing our customer engagement strategies. I am confident that by working together, we can achieve robust results.",
  "after_prompt": "Hi team, quick note on where we're focused next quarter. The big one is getting our turnaround time down, since that's what customers keep raising. I also want us talking across teams more, the marketing and support handoff has been rough lately. Beyond that, let's keep doing what's working. Thanks for the strong push this last stretch, the Henderson launch especially. Tom",
  "changes": [
    "Deletes the empty opening and the 'today's evolving landscape' filler, so the message starts with the actual point.",
    "Replaces inflated words like leverage, delve, foster, and robust with plain language a person would actually say.",
    "Breaks the rigid three-part symmetry and adds a specific human detail, the Henderson launch, that gives the message a real fingerprint."
  ]
}
```

## fill_blank

```json
{
  "template": "To strip the AI sound, delete the throat-clearing {{1}} so you start with the actual point, swap inflated words like 'utilize' and 'leverage' for {{2}} ones, and add one specific human {{3}} that only you would know.",
  "blanks": [
    { "id": "1", "accept": ["opening", "intro", "introduction"], "ideal": "opening" },
    { "id": "2", "accept": ["plain", "simple", "plainer"], "ideal": "plain" },
    { "id": "3", "accept": ["detail", "fact"], "ideal": "detail" }
  ],
  "explanation": "The three biggest AI tells: a warm-up opening, inflated vocabulary, and a total absence of specific human detail. Cut the first two and add the third to sound like a person."
}
```
