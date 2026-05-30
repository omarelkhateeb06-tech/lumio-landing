---
slug: ai-in-marketing-campaign-drafting
module: industry-deep-dives
title: AI in Marketing: campaign drafting
level: confident
minutes: 8
order: 2
hook: Marketing teams that still write every asset from scratch are losing to competitors running 10x the copy variations.
key_takeaway: Positioning brief first, then copy at volume. Your job shifts from writing every word to making the curatorial decisions machines can't.
tags: [general, writing, customer-comms, workflows]
---

## reading

Marketing is the function where AI has the most immediate, measurable impact. The reason is simple: marketing is about volume plus quality. And AI allows you to hit quality at volume for the first time.

**The campaign drafting system:**

**Positioning brief first:** Before touching AI, write: target audience (1 specific person), primary pain point (1 sentence), your solution (1 sentence), key proof point (1 statistic). This takes 10 minutes and makes everything downstream 5x better.

**Copy variants:** *"I'm running a campaign targeting [audience] with this positioning: [brief]. Write: 3 subject lines, 3 headline variants, 2 full email body versions, 5 CTA button options. Each should feel genuinely different."*

**Channel adaptation:** *"Take the winning headline. Adapt it for: a LinkedIn post (150 words), a Twitter opener, a paid ad headline (under 40 characters)."*

**Iteration signal:** When you run A/B tests, feed results back: *"Version A won with 34% higher open rate. Why might X have won? Give me 5 more headline variations that push further in that direction."*

This isn't replacing your creative judgment: it's removing the blank page problem across every channel simultaneously.

## before_after [personalizable]

```json
{
  "question": "Same campaign, two prompts. Notice what the positioning brief does to the output.",
  "before_prompt": "Write me 3 subject lines and a marketing email for our new feature.",
  "after_prompt": "I'm running a campaign targeting operations managers at 200-person logistics firms. Positioning: they lose hours reconciling delivery exceptions by hand; our tool auto-flags exceptions in real time; teams using it cut reconciliation time 60%. Write 3 subject lines, 3 headline variants, and 2 full email bodies, each genuinely different in angle.",
  "changes": [
    "Front-loads a four-part positioning brief (audience, pain, solution, proof) so the copy speaks to one specific person instead of everyone.",
    "Names a concrete proof point (60% time cut) the model can build hooks around, instead of leaving it to invent vague benefits.",
    "Asks for distinct variants at volume, turning the model into a draft engine while the curatorial pick stays with the marketer."
  ]
}
```

## multiple_choice

```json
{
  "stem": "AI lets a marketing team produce copy at 10x the volume. Which part of the work becomes MORE important as a result, not less?",
  "options": [
    {
      "id": "a",
      "label": "The curatorial judgment: choosing which variants are on-brand and on-strategy, and killing the ones that are not.",
      "is_correct": true,
      "explanation": "Correct. When drafting is cheap, the bottleneck moves to selection. Your value shifts from writing every word to deciding which of the many machine-generated options actually deserve to ship."
    },
    {
      "id": "b",
      "label": "Typing speed, since you now have far more copy to produce by hand.",
      "is_correct": false,
      "explanation": "The whole point is that the model produces the volume. You are not typing more; you are choosing more."
    },
    {
      "id": "c",
      "label": "Nothing changes; AI simply does the same job faster with no shift in what you focus on.",
      "is_correct": false,
      "explanation": "The job does change. Removing the blank-page problem moves your effort from generation to positioning and curation."
    },
    {
      "id": "d",
      "label": "Writing the positioning brief becomes optional once the model can generate freely.",
      "is_correct": false,
      "explanation": "The opposite. A weak brief multiplied across 10x the output just produces 10x the off-target copy. The brief matters more, not less."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Write a 4-sentence positioning brief for any current campaign. Run the copy variants prompt. Pick the strongest 3 and note why they work.
