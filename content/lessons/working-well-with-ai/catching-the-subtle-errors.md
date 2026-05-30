---
slug: catching-the-subtle-errors
module: working-well-with-ai
title: "Catching the Subtle Errors AI Slips In"
level: confident
minutes: 7
order: 3
hook: The dangerous AI mistakes are not the obvious ones. They are the small, plausible ones that read perfectly and are quietly wrong.
key_takeaway: Make the AI expose its own weak points by asking it to flag uncertainty, separate fact from inference, and show its sources, so the subtle errors surface before you ship them.
tags: [general, editing, hallucinations]
---

## reading

The errors that hurt you are not the wild ones. A glaringly wrong answer gets caught instantly. The damage comes from the subtle error: a date that is off by a year, a statistic that sounds right, a "summary" that quietly adds a claim your document never made. It reads smoothly, it fits your expectations, and it sails straight into your final draft.

These slip through because we read AI output for tone, not for truth. The text is fluent, so our guard drops. The fix is to stop relying on your own re-reading alone and instead make the AI surface its own uncertainty.

**Ask it to mark confidence.** After any answer with facts in it, say: "Mark each claim as confident, uncertain, or guess, and list anything I should independently verify." The model is often surprisingly honest about which parts are shaky once you ask it to separate them out.

**Force fact apart from inference.** When you ask for a summary or analysis, add: "Only state what is explicitly in the source. Put anything you inferred in a separate list labeled inference." This catches the most common subtle error, where AI helpfully fills a gap your document never filled.

**Demand the source, then check it.** "For each factual claim, tell me where it comes from." A real claim has a checkable origin. A hallucinated one often comes back with a vague "general knowledge" or a citation that does not exist when you look.

The point is not to distrust every word. It is to convert a smooth, undifferentiated wall of text into a labeled one, where the risky 10 percent is pulled out and waiting for your eyes instead of hiding in the other 90 percent.

## before_after [personalizable]

```json
{
  "question": "Both prompts ask for a summary of the same report. The second one forces the subtle errors into the open. Notice what you gain.",
  "before_prompt": "Summarize the attached quarterly report in five bullet points.",
  "after_prompt": "Summarize the attached quarterly report in five bullet points. Only include what is explicitly stated in the report. After the summary, add two short lists: (1) Verify these: any numbers, dates, or named figures I should confirm against the source. (2) Inference, not stated: anything you concluded that the report does not directly say. If a bullet relies on a figure, quote the figure exactly as written.",
  "changes": [
    "Pins the summary to what the document actually says, which stops the AI from quietly inventing a tidy conclusion the report never reached.",
    "Pulls every checkable number and name into a Verify list, so the risky claims are gathered in one place instead of buried in fluent prose.",
    "Separates inference from fact, exposing the single most common subtle error: a helpful-sounding claim that was added, not found."
  ]
}
```

## multiple_choice

```json
{
  "stem": "You asked AI to summarize a report whose only relevant line says 'revenue grew in Q3.' The summary reads: 'Revenue grew 12% in Q3, driven by strong international sales.' What is the subtle error to catch?",
  "options": [
    {
      "id": "a",
      "label": "The summary added a specific figure (12%) and a cause (international sales) the source never stated, which is invented detail dressed as fact.",
      "is_correct": true,
      "explanation": "Correct. This is the classic subtle error: the AI filled a gap the document left open, turning a vague 'grew' into a precise number and a reason. Forcing fact apart from inference would have caught it."
    },
    {
      "id": "b",
      "label": "Nothing, since the summary is more detailed and therefore more useful than the original.",
      "is_correct": false,
      "explanation": "Extra detail the source does not support is not useful, it is fabricated. A summary should never contain claims the original did not make."
    },
    {
      "id": "c",
      "label": "The summary is too short to be trustworthy.",
      "is_correct": false,
      "explanation": "Length is not the issue. The problem is that specific, plausible-sounding claims were added, which is exactly the kind of smooth error that sails into a final draft."
    }
  ]
}
```
