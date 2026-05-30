---
slug: what-ai-cannot-do
module: foundations
title: "What AI Cannot Do: Understanding the Limits"
level: beginner
minutes: 6
order: 6
hook: Knowing where AI breaks down is what keeps you safe and in control.
key_takeaway: AI predicts likely words, it does not know facts, so treat it as a fast first draft you always check, never a source of truth.
tags: [general, fundamentals, hallucinations]
---

## reading

Most people get burned by AI not because the tool is bad, but because they ask it to do things it was never built to do. So let's be clear about the limits before you trust it with real work.

A tool like ChatGPT does not look things up. It predicts the next most likely word based on patterns in the text it was trained on. That single fact explains almost every mistake it makes.

Here is what that means in practice.

**It cannot reliably give you current facts.** It does not know what happened this week, what your company's policy says, or what the price is today, unless you paste that information in. When it does not know, it often invents a confident answer anyway. That invented answer is called a hallucination, and it looks exactly as polished as a correct one.

**It cannot do reliable math or counting on its own.** It can write the steps to solve a problem, but it can quietly get the arithmetic wrong. Check any number that matters.

**It cannot know your private context.** It does not know your client's name, your last email, or your team's deadline unless you tell it. It is not connected to your files or your calendar by default.

**It cannot take responsibility.** A nurse who uses AI to draft a patient note still signs that note. A paralegal who uses AI to summarize a contract still owns the summary. The accountability stays with you.

None of this makes AI useless. It makes AI a brilliant first-draft engine and a poor final authority. Use it to get to 80 percent fast, then bring your judgment to the last 20 percent. That is the whole game.

## before_after [personalizable]

```json
{
  "question": "Same question, two ways of trusting the answer. Notice which one keeps you safe.",
  "before_prompt": "What is the current refund policy deadline for my company? (then pasting the answer straight into a customer email)",
  "after_prompt": "Here is our refund policy text: [paste the real policy]. Using only this text, write a clear two-sentence reply telling the customer their refund deadline.",
  "changes": [
    "Stops asking the AI to recall a fact it cannot know, which is how hallucinations slip in.",
    "Gives the AI the real policy text to work from, so it summarizes instead of inventing.",
    "Keeps the human in charge of the source of truth, and lets the AI handle only the wording."
  ]
}
```
