---
slug: drafting-professional-emails
module: everyday-work
title: "Drafting Professional Emails with AI"
level: beginner
minutes: 6
order: 7
hook: Stop staring at the blank reply box. Give the AI the gist and let it handle the wording.
key_takeaway: Feed the AI the situation, the key points, and the tone you want, and it produces a solid email draft you can send after a quick read and tweak.
tags: [general, email, writing]
---

## reading

The hardest part of most emails is not the writing. It is starting. You know roughly what you want to say, but turning it into something that sounds professional and clear takes more energy than it should. This is exactly where AI saves you time every single day.

The key is to give the AI the raw material, not a vague request. "Write a professional email" gives you a hollow template. The good stuff comes from feeding it your specifics.

Give it four things:

**The situation.** Who is this to, and what is going on? "This is to a client who is unhappy that their order is late."

**The points to make.** The two or three things that must be in the email. "Apologize, explain it ships Friday, offer a 10 percent discount."

**The tone.** How you want to come across. "Warm and accountable, not defensive."

**The constraints.** Length and format. "Keep it under 120 words, no corporate jargon."

Put together: "Write an email to a client who is upset their order is late. Apologize sincerely, tell them it ships Friday, and offer a 10 percent discount. Tone: warm and accountable, not defensive. Under 120 words."

The draft that comes back will be 90 percent of the way there. Read it once, fix anything that does not sound like you, and send. What used to take 15 minutes of agonizing now takes two.

One habit worth keeping: always read before you send. The AI does not know your relationship history with this person or the one detail that changes everything. You do. The AI drafts, you decide.

## try_it_live [personalizable]

```json
{
  "instructions": "Turn a messy situation into a clean email draft. Describe a real email you need to write, or use the sample, giving the situation, the key points, and the tone. Sample: you need to tell a colleague you cannot take on the project they asked you to join, but you want to stay on good terms.",
  "system_prompt": "You are an assistant that drafts clear, professional emails for non-technical workers. Given a situation, the key points to convey, and a desired tone, write a concise email draft (under 130 words) in plain language. No jargon, no em dashes. Leave it easy to personalize.",
  "ideal_output": "Subject: About the Henderson project\n\nHi Sam, thank you for thinking of me for the Henderson project. I want to be straight with you: with my current workload I would not be able to give it the attention it deserves, so I need to pass this time. I really value working with you and I would love to jump in on something down the road when my plate is clearer. Happy to suggest a couple of people who might be a great fit if that helps. Thanks for understanding. Best, [your name]",
  "input_placeholder": "Situation, key points, and the tone you want..."
}
```
