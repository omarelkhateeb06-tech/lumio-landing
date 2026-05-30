---
slug: the-outline-method-for-long-form-content
module: creation
title: The outline method for long-form content
level: growing
minutes: 8
order: 5
hook: The blank page problem disappears the moment you separate structure from writing. Here's how.
key_takeaway: Separate structure from writing. Let AI give you 5 structural options, pick one, then write section-by-section instead of into the void.
tags: [general, writing]
---

## reading

Long-form content fails at the outline stage 90% of the time. Either there's no outline (you're writing into the void) or the outline is too vague to be useful. The result is writing that meanders, repeats itself, and doesn't build toward anything.

**The AI outline method:**

**Phase 1: Brain dump.** Tell the model everything you know and think about the topic in 200 words of stream-of-consciousness. Don't edit. Don't organize. Just dump.

**Phase 2: Structure extraction.** *"Based on my brain dump, give me 5 possible structural approaches. For each: a title, a 3-sentence description of the argument arc, and who it's best for."* Pick one.

**Phase 3: Section breakdown.** *"Now break this into sections. For each section: a heading, 2-sentence summary of what it covers, and what the reader should feel or know by the end."*

**Phase 4: Write section by section.** Now you're not writing a 2,000-word piece: you're writing 8 chunks of 250 words each, each with a clear purpose. That's a completely different and much easier task.

The outline is where you make the decisions. The writing is where you execute them.

## fill_blank

```json
{
  "template": "The blank page problem disappears when you separate {{1}} from writing. After the outline, you are no longer writing one 2,000-word piece into the void. You are writing eight chunks of about 250 words, each with a clear {{2}}, which is a much easier task.",
  "blanks": [
    { "id": "1", "answer": "structure", "alternatives": ["the structure", "structuring"] },
    { "id": "2", "answer": "purpose", "alternatives": ["job", "point"] }
  ]
}
```

## mini_project

Your 5-minute exercise: Pick a piece of content you've been avoiding. Do phases 1 and 2 above. Does having 5 structural options change how you think about the piece?
