---
slug: the-iteration-loop
module: first-steps
title: "Getting Better Answers: The Iteration Loop"
level: beginner
minutes: 6
order: 9
hook: The first answer is rarely the best one, and the people who know that get far more out of AI.
key_takeaway: Do not start over when an answer misses, steer it: say what was wrong and what you want more of, and each reply gets closer to what you need.
tags: [general, prompting, framing]
---

## reading

Here is a habit that quietly separates confident AI users from frustrated ones. When the first answer is not quite right, beginners give up or start a whole new prompt. Skilled users keep the conversation going and steer.

AI tools remember what you said earlier in the same chat. That means you do not have to explain everything again. You just have to react to what you got, the same way you would coach a junior colleague.

The loop has three moves.

**1. React, do not restart.** Instead of opening a fresh prompt, reply to the answer you got. "Good start, but it is too formal" tells the AI exactly what to change while keeping everything that worked.

**2. Be specific about the gap.** Vague feedback gets vague fixes. "Make it better" does little. "Cut it to half the length and use plainer words" gives the AI something real to act on.

**3. Repeat until it fits.** Two or three rounds will usually get you there. Each round, you keep what works and fix one thing. The answer converges on what you actually wanted.

A quick example. First answer is too long. You say "Tighten this to three sentences." Now the tone is off. You say "Keep that length but make it warmer." Now it is close. You say "Perfect, just swap the last line for a clear next step." Done.

Stop treating the first answer as final. Treat it as round one of a short conversation, and your results jump immediately.

## try_it_live [personalizable]

```json
{
  "instructions": "Practice steering instead of restarting. Take a first-draft answer that is not quite right, or the sample below, and write the next message you would send to improve it. Name what worked, what is off, and the one change you want. Sample first draft: a thank-you note to a customer that came out stiff and too long.",
  "system_prompt": "You are a coach teaching the iteration loop to non-technical professionals. Given a draft that is not quite right, model a strong follow-up message that keeps what works, names the specific problem, and asks for one concrete change. Keep it natural and brief, the way someone would actually reply in a chat.",
  "ideal_output": "Good direction, the warmth is there. Two fixes: it is too long, cut it to four sentences, and the opening is stiff, so start with something more human like thanking them by name for their patience. Keep the closing line about reaching out anytime.",
  "input_placeholder": "Good start, but... change this one thing..."
}
```
