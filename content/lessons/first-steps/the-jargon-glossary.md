---
slug: the-jargon-glossary
module: first-steps
title: "The Jargon Glossary"
level: beginner
minutes: 6
order: 6
hook: Half of feeling behind on AI is just not knowing the words. Here are the ten that actually come up, in plain English.
key_takeaway: The vocabulary is smaller than it looks. Learn ten terms and most articles, settings menus, and colleagues suddenly make sense.
tags: [general, fundamentals]
---

## reading

A lot of the intimidation around AI is just unfamiliar words thrown around as if everyone already knows them. They're not complicated once someone defines them plainly. Here are the ten that actually matter for everyday use. Skim it now, come back when a term trips you up.

**Prompt.** What you type into the box. Your question, instruction, or request. That's all "writing a prompt" means.

**Model.** The underlying AI engine doing the work. "GPT," "Claude," "Gemini" are model families. Newer or "bigger" models are generally more capable. You're usually picking one from a dropdown.

**LLM (Large Language Model).** The technical name for the kind of AI behind chat assistants. It predicts likely text. When someone says "LLM," they mean the thing powering ChatGPT and its cousins.

**Token.** The unit AI reads and writes in, roughly a chunk of a word. It matters mostly because limits ("context window," usage caps) are measured in tokens. You rarely need to count them.

**Context window.** How much text the model can "hold in mind" at once, your prompt plus its reply plus the conversation so far. Hit the limit and it starts forgetting the start of a long chat.

**Hallucination.** When AI states something false with total confidence. Not a glitch; a side effect of how it works. The reason you verify facts.

**Training data / cutoff.** The pile of text the model learned from, frozen at a certain date. Anything after the cutoff is unknown to it unless it can browse the live web.

**Fine-tuning.** Extra training that specializes a model for a particular job or style. Mostly a behind-the-scenes term; good to recognize, rarely something you do.

**Prompt engineering.** A fancy phrase for "writing your request clearly and specifically." You're already learning it in this module. Don't be intimidated by the label.

**Custom instructions / system prompt.** Standing directions you set once so the AI remembers your role and preferences across chats. There's a whole lesson on this.

That's the core ten. You don't need to memorize them. You need to stop flinching when you see them, because none of them are hiding anything complicated.

## fill_blank

```json
{
  "template": "When AI states something false with total confidence, that's called a {{1}}. The text you type to it is a {{2}}, and the frozen date its knowledge stops at is its {{3}}.",
  "blanks": [
    { "id": "1", "accept": ["hallucination", "hallucinations"], "ideal": "hallucination" },
    { "id": "2", "accept": ["prompt"], "ideal": "prompt" },
    { "id": "3", "accept": ["cutoff", "training cutoff", "knowledge cutoff", "cut-off"], "ideal": "cutoff" }
  ],
  "explanation": "Hallucination, prompt, and cutoff are three of the ten terms that unlock most AI conversations and settings menus."
}
```
