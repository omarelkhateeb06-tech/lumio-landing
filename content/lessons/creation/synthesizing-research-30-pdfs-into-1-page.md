---
slug: synthesizing-research-30-pdfs-into-1-page
module: creation
title: Synthesizing research: 30 PDFs into 1 page
level: growing
minutes: 10
order: 4
hook: The report that used to take two weeks of reading now takes two hours, if you know how to feed documents to a model.
key_takeaway: Extract first, synthesize second. The model finds cross-document patterns you'd miss reading them one at a time.
tags: [general, research, summarizing, workflows]
---

## reading

Research synthesis is one of the highest-value things AI can do for knowledge workers. But most people approach it wrong: they paste one document at a time and lose the cross-document threads that are the actual value.

**The synthesis workflow:**

**Step 1: Chunk strategically.** Group documents by theme or argument. Process related documents together so the model can surface agreements and contradictions.

**Step 2: Extract before synthesizing.** For each chunk: *"What are the 3 most important claims in this document? What evidence does it use? What does it assume?"* Build an extraction document before asking for synthesis.

**Step 3: Cross-document synthesis.** With your extractions: *"Here's what each document says about [topic]. Where do they agree? Where do they contradict? What question do they collectively fail to answer?"*

**Step 4: The 1-pager.** *"Write a 1-page executive summary of the above synthesis. Structure: key finding, three supporting points, one major caveat, one open question."*

**What the model can't do:** Evaluate the *quality* of sources or the credibility of methodology. That's your job. Use the model to handle volume; use your judgment to handle quality.

## multiple_choice

```json
{
  "stem": "In the synthesis workflow, why does the lesson tell you to extract claims from each document before asking for a synthesis?",
  "options": [
    {
      "id": "a",
      "label": "Building an extraction document first lets the model compare structured claims across sources, surfacing the agreements and contradictions you would miss reading one document at a time.",
      "is_correct": true,
      "explanation": "Correct. The cross-document threads are the real value, and they only appear when you extract each document's claims, evidence, and assumptions first, then synthesize from those extractions."
    },
    {
      "id": "b",
      "label": "Extraction is just a formality, and you would get the same result by pasting all the documents in at once and asking for a summary.",
      "is_correct": false,
      "explanation": "Pasting everything at once loses the cross-document threads, which is exactly the mistake the lesson warns against. The extraction step is what makes patterns comparable."
    },
    {
      "id": "c",
      "label": "Because the model can judge which sources are credible once it has the extractions side by side.",
      "is_correct": false,
      "explanation": "Evaluating source quality and methodology is your job, not the model's. Extraction is about volume and pattern-finding; credibility stays with your judgment."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Find 3 documents about the same topic. Run steps 1–3 above. What thread across all three did you miss when reading them individually?
