---
slug: paste-a-document-give-it-a-role-save-the-output
module: first-steps
title: "Paste a Document, Give It a Role, Save the Output"
level: beginner
minutes: 7
order: 8
hook: Three small habits separate people who get real work done with AI from people who just chat with it. None of them take more than a few seconds.
key_takeaway: Paste the actual material instead of describing it, tell the AI who to be, and keep the good outputs. These three moves turn AI from a toy into a workhorse.
tags: [general, prompting, writing]
---

## reading

Once you're past your first few chats, three habits do most of the heavy lifting. They're simple, they stack, and almost nobody does all three at first. Build them in now and everything downstream gets easier.

**1. Paste the actual material.** The single biggest upgrade to your results: stop describing your document and just paste it in. Don't say "I have a long email from a client who's unhappy about a delay" when you can paste the email itself. The AI can only work with what it can see. Real text in means specific, grounded answers out, instead of generic guesses about what your situation might be. Reports, emails, notes, a job posting, a contract clause: paste first, ask second.

**2. Give it a role.** One short line at the front of your request reshapes the entire answer. "You are a careful copy editor." "Act as a skeptical financial reviewer." "You're a friendly customer support rep." A role tells the AI what perspective, vocabulary, and priorities to bring. "Edit this" gets you a generic pass; "you are a copy editor focused on clarity and cutting filler, edit this" gets you a focused, professional one. It costs you five words.

**3. Save the outputs that work.** When AI nails something, don't let it vanish into a scroll of old chats. Copy the prompt that produced it into a note, a doc, anywhere you'll find it again. The request that wrote a great status update last week will write this week's too, with small edits. Over a month you build a personal library of prompts that just work, and you stop reinventing the same instruction every time. This is how AI compounds instead of resetting every session.

**Stacked together** they look like this: paste the messy meeting notes, prefix "you are an executive assistant writing a crisp recap for busy leaders," get a clean summary, and save that prompt as your "meeting recap" template. Three habits, one smooth workflow, and you've just built something reusable.

## try_it_live

```json
{
  "instructions": "Practice all three habits in one request. Imagine you have a document to work with (or use the sample). Write a prompt that (1) assigns the AI a clear role, (2) references the pasted material, and (3) asks for an output clean enough to save and reuse. Sample document: messy bullet-point notes from a team meeting.",
  "system_prompt": "You are a coach teaching a beginner three AI habits: paste real material, assign a role, and produce reusable output. Given a task, write an example prompt that opens with a specific role, clearly works from pasted material, and requests a clean, reusable result. Plain language, no jargon, no em dashes.",
  "ideal_output": "You are an executive assistant who writes crisp meeting recaps for busy leaders. Here are my raw notes from today's team meeting: [paste notes]. Turn them into a recap with three sections: Decisions, Action items with owners, and Open questions. Keep it under 150 words and use plain language so I can paste it straight into an email.",
  "input_placeholder": "You are a [role]. Here is my [document]: [paste]. Turn it into..."
}
```
