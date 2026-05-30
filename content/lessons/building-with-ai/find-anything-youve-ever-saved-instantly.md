---
slug: find-anything-youve-ever-saved-instantly
module: building-with-ai
title: Find anything you've ever saved, instantly
level: confident
minutes: 14
order: 4
hook: You've written thousands of documents, taken thousands of notes, and read thousands of articles. Almost none of it is retrievable when you need it.
key_takeaway: Centralize → enrich with AI retrieval → capture consistently. A searchable body of your own knowledge is the most underrated productivity investment.
tags: [general, research, automation]
---

## reading

Knowledge workers have a retrieval problem. We produce enormous volumes of notes, highlights, saved articles, meeting summaries, and documents. We can search within each tool. But we can't search *across* them, and we can't ask natural language questions of our own body of knowledge.

**The personal knowledge base (PKB) stack:**

**Step 1: Centralize input:** Pick one place where everything flows in. Notion (most flexible), Obsidian (most powerful for linking), or Roam (most opinionated). The right answer is the one you'll actually maintain.

**Step 2: Add AI retrieval:**
- **NotebookLM (Google, free):** Upload PDFs, docs, notes. Ask questions, get answers with citations.
- **Mem.ai:** Takes notes and resurfaces them contextually, with AI synthesis.

**Step 3: Capture habit:** A PKB is only as good as what goes into it. The sustainable minimum: one capture per day. Consistency beats completeness.

**Step 4: Query it:** Once populated, ask questions you couldn't ask before: "What did I think about remote work 2 years ago?", "What notes do I have about pricing strategy?", "What was the argument in that article about decision-making?"

This is your second brain, queryable.

## multiple_choice

```json
{
  "stem": "You set up a personal knowledge base but keep forgetting to add things, so it stays nearly empty and useless. Which fix does this lesson point to?",
  "options": [
    {
      "id": "a",
      "label": "A sustainable capture habit, like one capture per day, since a PKB is only as good as what goes into it and consistency beats completeness.",
      "is_correct": true,
      "explanation": "Correct. The capture habit is the load-bearing step. A modest, consistent input beats an ambitious system you stop feeding."
    },
    {
      "id": "b",
      "label": "Switch to a more powerful note-taking app, since the tool is the real problem.",
      "is_correct": false,
      "explanation": "The lesson says the right tool is the one you'll actually maintain. Swapping apps doesn't fix an empty base; a capture habit does."
    },
    {
      "id": "c",
      "label": "Wait until you've built up a large backlog, then import everything in one big session.",
      "is_correct": false,
      "explanation": "A big one-time import is the opposite of the sustainable minimum. Daily consistency is what keeps the base alive and useful."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Upload 5 documents to NotebookLM. Ask it 3 questions that require synthesizing across all 5. What did it surface that you'd forgotten?
