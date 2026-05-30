---
slug: which-ai-tool-and-is-it-online
module: foundations
title: "Which AI Tool, and Is It Online?"
level: beginner
minutes: 6
order: 3
hook: There are a dozen AI tools and they all look the same in the box. Two questions tell you which one you actually need today.
key_takeaway: For most knowledge work, one mainstream chat assistant is plenty, and the single setting that matters most is whether it can browse the live web.
tags: [general, fundamentals, tool-selection]
---

## reading

The AI landscape looks overwhelming: ChatGPT, Claude, Gemini, Copilot, and a new logo every week. The good news is that for everyday work, the differences between the big chat assistants are smaller than the marketing suggests. You do not need to pick the perfect one. You need to pick one and learn it well. Here's how to cut through the noise.

**The big chat assistants are broadly interchangeable for beginners.** ChatGPT, Claude, and Gemini all draft, summarize, explain, and brainstorm at a high level. If your workplace already provides one (Copilot and Gemini often come bundled with email and documents), start there: it's free to you and already connected to your work. Otherwise, pick the one your colleagues use so you have people to ask. Switching later is easy; the skills transfer.

**The one setting that changes the answer: is it online?** This matters more than which brand you chose. Some AI tools answer only from what they learned during training, which has a cutoff date in the past. Others can browse the live web and cite current sources. The difference is enormous:

- **Offline mode** is fine for timeless tasks: rewriting, explaining a concept, drafting from information you provide.
- **Online mode** is what you need for anything current: today's news, recent prices, a company's latest announcement, "what changed this year."

If you ask an offline tool about a recent event, it won't say "I don't know." It will confidently make something up. So before you trust an answer about anything recent, ask yourself: *could this tool actually have seen this?* Many assistants now browse automatically and show source links; when you see real, clickable citations, you're in online mode. When you don't, assume the answer is frozen in the past.

**The practical rule:** one mainstream assistant, learned well, covers the vast majority of your work. Just stay aware of whether it's drawing on live information or its frozen training, because that's the line between a useful answer and a confident fiction.

## fill_blank

```json
{
  "template": "If a task depends on {{1}} information, you need a tool in {{2}} mode; for timeless tasks like rewriting, an {{3}} tool is fine.",
  "blanks": [
    { "id": "1", "accept": ["current", "recent", "live", "up-to-date", "new"], "ideal": "current" },
    { "id": "2", "accept": ["online", "browsing", "web", "connected"], "ideal": "online" },
    { "id": "3", "accept": ["offline", "frozen"], "ideal": "offline" }
  ],
  "explanation": "Whether the tool can reach the live web is the setting that decides if an answer about anything recent can be trusted."
}
```

## mini_project

Your 3-minute exercise: open whichever assistant you have access to and ask it one current-events question, like "what major thing happened in the news this week?" Look at the answer. Does it show real source links you can click? If yes, it's browsing live. If it gives a vague or oddly dated answer with no links, it's working from frozen training, and now you know the difference for everything you ask next.
