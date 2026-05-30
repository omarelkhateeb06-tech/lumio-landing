---
slug: fact-checking-ai-output
module: working-well-with-ai
title: "Fact-Checking AI: A Practical Method"
level: growing
minutes: 7
order: 0
hook: A 60-second checking habit is the difference between looking sharp and getting caught out.
key_takeaway: Treat every AI claim as a draft fact: scan for names, numbers, and dates, verify those against a real source, and never paste an unchecked specific.
tags: [general, hallucinations, research]
---

## reading

AI gives you confident answers. Confidence is not the same as correct. The skill that separates people who use AI well from people who get embarrassed by it is a simple checking habit.

You do not need to verify every word. You need to verify the parts that can actually be wrong and that matter if they are. Those are almost always the specifics: names, numbers, dates, quotes, and direct claims about how something works.

Here is a method you can run in under a minute.

**1. Highlight the specifics.** Read the answer and mentally flag anything concrete: a statistic, a person's name, a law, a date, a price, a step in a process that has real consequences.

**2. Ask where it came from.** For anything flagged, ask yourself: could the AI actually know this, or is it likely guessing? Current events, internal policies, and exact figures are guess-prone.

**3. Verify against one real source.** Check the flagged item against something you trust: the actual document, a quick search, the official site, or a colleague who knows. One good source beats the AI's confidence every time.

**4. Watch for the too-clean answer.** When an answer is suspiciously tidy, with a perfect quote or a round statistic, slow down. Invented details, called hallucinations, often look more polished than real ones.

The goal is not to distrust everything. It is to know exactly which 10 percent to check so you can trust the other 90 percent and move fast.

## try_it_live [personalizable]

```json
{
  "instructions": "Paste an AI answer you recently received, or the one below, and turn it into a checking plan. List every specific claim that needs verifying and name the single best source to check each one against. Sample: \"The new overtime rule took effect in January and applies to anyone earning under 55,000 a year.\"",
  "system_prompt": "You are a careful fact-checking coach for non-technical professionals. Given an AI answer, extract every verifiable specific (names, numbers, dates, legal or policy claims) and, for each one, name a concrete real-world source the person should check it against. Be brief and practical. Do not invent facts.",
  "ideal_output": "Claims to verify before you use this: (1) The date the rule took effect, January, check the official labor department page for the rule's effective date. (2) The salary threshold of 55,000, check the same official page, since this number changes and is often misquoted. (3) Who it applies to, confirm the exact category of workers in the official text, not a summary. Do not send or act on any of these numbers until the official source confirms them.",
  "input_placeholder": "Paste an AI answer and I'll list what to check and where..."
}
```
