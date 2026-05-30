---
slug: summarizing-long-documents
module: everyday-work
title: "Summarizing Long Documents in Seconds"
level: beginner
minutes: 6
order: 6
hook: The 40-page report you have been avoiding can become a clear one-page brief before your coffee gets cold.
key_takeaway: Tell the AI who the summary is for and what you need to decide, and it turns a long document into exactly the few points that matter to you.
tags: [general, summarizing, workflows]
---

## reading

You know the feeling. A 30-page policy update, a long contract, a dense research report lands in your inbox, and you do not have an hour to read it. This is one of the things AI does genuinely well, if you ask the right way.

The mistake is asking for a plain "summarize this." That gives you a shorter version of the document, which is still generic and still not aimed at what you actually need. A good summary is shaped by your purpose.

Here is the better approach. Tell the AI three things along with the document: who you are, what you are trying to decide or do, and how you want the answer shaped.

For example, paste the document and add: "I am an office manager deciding whether this new policy changes how we book travel. Pull out only the parts about travel and expenses, in five plain bullet points, and flag anything that needs my action."

That single framing does three things. It filters out everything irrelevant. It surfaces the parts tied to your decision. And it formats the answer so you can act on it immediately.

A few moves that make summaries far more useful:

**Ask for the decision, not just the content.** "What should I do differently after reading this?" is often more valuable than a neutral recap.

**Request the structure you want.** Bullet points, a one-paragraph overview, a table of pros and cons. Name it and you will get it.

**Ask what is missing or unclear.** "What questions should I ask before agreeing to this?" turns the AI into a thinking partner, not just a shrinker of text.

One caution: for anything important, spot-check the summary against the real document, especially specific numbers and dates. The AI is giving you a fast first read, not the final word.

## before_after [personalizable]

```json
{
  "question": "Same document, two requests. See how the second one does the thinking for you.",
  "before_prompt": "Summarize this report. [pastes a 30-page quarterly report]",
  "after_prompt": "I am a team lead and I need to know if anything in this quarterly report affects my team's budget next quarter. From the report below, give me five plain bullet points covering only budget and headcount, and flag anything I need to act on. [pastes the report]",
  "changes": [
    "States who you are and what you need to decide, so the summary is aimed at your job, not the whole document.",
    "Narrows the focus to budget and headcount, filtering out everything that does not matter to you.",
    "Asks for a clear format and an action flag, so you can move on the result instead of re-reading it."
  ]
}
```
