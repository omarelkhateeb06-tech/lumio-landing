---
slug: ask-for-less-beating-the-wall-of-text
module: first-steps
title: "Ask for Less: Beating the Wall of Text"
level: beginner
minutes: 5
order: 10
hook: You asked one question and got back six paragraphs you'll never read. The fix isn't a better question. It's a smaller one.
key_takeaway: AI defaults to long and exhaustive. Tell it how short you want the answer and in what shape, and you go from skimming a wall of text to getting exactly what you needed.
tags: [general, prompting]
---

## reading

Here's a frustration almost everyone hits early: you ask a simple question and get an essay. Five headings, a bulleted list, a summary, and a cheerful offer to go deeper. You wanted a sentence. This isn't AI being unhelpful, it's AI guessing that more is safer than less. The fix is in your hands, and it's almost embarrassingly simple.

**The default is "comprehensive." You have to ask for "brief."** Left to its own devices, the model pads. It would rather over-explain than risk leaving something out. So the single most useful instruction you can add is a limit: "in one sentence," "three bullets max," "just the answer, no preamble," "under 50 words." State the size you want and the wall of text disappears.

**Specify the shape, not just the length.** Length is half of it; format is the other half. Tell it *how* you want the answer arranged:
- "Just give me the bottom line first, then one line of why."
- "Answer with a yes or no, then a single sentence."
- "Give me three options as a short list, no explanations."
- "A table with two columns: option and main tradeoff."

The clearer the shape, the less you have to dig through to find what you actually came for.

**Ask for less, then ask for more.** It feels backwards, but it's faster. Start with the short version. If you want depth on one point, ask for it: "expand the second bullet." This beats receiving everything up front and hunting for the 10% you needed. You stay in control of how deep to go, instead of the AI deciding for you.

**Why this matters beyond annoyance:** a tight answer is one you'll actually read, check, and use. A wall of text gets skimmed, and skimming is exactly how wrong details slip past you. Short isn't just more pleasant; it's safer, because you can actually see what it said.

So next time the box fills with paragraphs, don't sigh and scroll. Add five words about length and shape, and ask again.

## before_after

```json
{
  "question": "Same question, but the second version controls the size and shape of the answer.",
  "before_prompt": "Should I use a subject line with a question or a statement for my newsletter?",
  "after_prompt": "Should I use a question or a statement in my newsletter subject line? Give me a one-line recommendation, then two short bullets on when to break that rule. Under 60 words total.",
  "changes": [
    "Sets a clear length cap (under 60 words) so the answer doesn't balloon into an essay.",
    "Specifies the shape: a one-line recommendation followed by two bullets, so the useful part is right up top.",
    "Leaves room to go deeper later by asking for more on either bullet, instead of getting everything at once."
  ]
}
```
