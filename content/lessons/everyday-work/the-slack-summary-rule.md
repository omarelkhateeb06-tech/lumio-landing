---
slug: the-slack-summary-rule
module: everyday-work
title: The Slack summary rule
level: beginner
minutes: 5
order: 5
hook: You're spending 45 minutes a day reading Slack threads that could be summarized in 90 seconds.
key_takeaway: Paste, summarize, act. Never read a long thread linearly again; the model extracts signal from noise faster than you can scroll.
tags: [general, summarizing, workflows]
---

## reading

Slack is a river, not a document. By the time you get to a thread that happened while you were in meetings, there are 40 messages, three topic changes, and two decisions buried somewhere in the middle.

**The rule:** Never read a long Slack thread linearly. Copy and summarize.

Select all the messages in a thread, copy them, and paste into ChatGPT with: *"Summarize this Slack thread. What was discussed? What was decided? What action items or open questions remain? Keep it to bullet points, 5 max."*

This takes 15 seconds and gives you a better read of the thread than reading it yourself, because it surfaces the signal without the noise (the jokes, the "+1"s, the "sounds good" messages that make up 60% of most threads).

**Channel-level summaries:** If you've been away for a day and need to catch up on a busy channel, copy the last N messages and run the same prompt.

**The boundary:** This doesn't work for threads where you need to feel the emotional temperature of the conversation. For those, read. For everything else, summarize.

The rule works because it forces you to extract meaning rather than consume content.

## fill_blank

```json
{
  "template": "Never read a long Slack thread {{1}}. Copy the messages and ask AI to {{2}} them into five bullets, which surfaces the signal under the noise. The one exception is a thread where you need to feel the emotional {{3}} of the conversation: read that one yourself.",
  "blanks": [
    { "id": "1", "answer": "linearly", "alternatives": ["top to bottom", "in order"] },
    { "id": "2", "answer": "summarize", "alternatives": ["summarise"] },
    { "id": "3", "answer": "temperature", "alternatives": ["tone"] }
  ]
}
```

## mini_project

Your 5-minute exercise: Find the longest Slack thread from the past 48 hours. Copy all the messages and run the summary prompt. How long would reading it have taken vs. the 15 seconds this took?
