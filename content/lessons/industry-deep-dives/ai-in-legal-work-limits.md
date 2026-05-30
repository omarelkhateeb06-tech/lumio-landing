---
slug: ai-in-legal-work-limits
module: industry-deep-dives
title: "AI in Legal Work: What's Permitted and What's Not"
level: beginner
minutes: 7
order: 11
hook: AI can save legal professionals real time, but only if you know the line you must not cross.
key_takeaway: AI is a capable assistant for drafting and organizing, never a source of legal authority, so you must verify every citation and keep a qualified human responsible for the work.
tags: [legal, fundamentals, hallucinations]
---

## reading

If you work in or around law, AI can take a lot of the grind out of your day: drafting, summarizing, organizing, and first-pass research. But the legal field has a hard line, and crossing it has real consequences. Let's be clear about what AI can do for legal work and what it absolutely cannot.

Start with the single most important rule. AI is not a source of legal truth. A tool like ChatGPT predicts likely text, it does not look up real law. It will invent case names, fabricate citations, and misstate rules with total confidence. This is not a rare glitch, it is how the tool works. Lawyers have been sanctioned for filing briefs with fake cases an AI made up. So no citation, rule, or precedent from AI goes anywhere until you confirm it in an actual legal source.

With that line drawn, here is where AI genuinely helps:

**Drafting first versions.** Routine correspondence, clause explanations, internal summaries. You edit and verify, but the blank page is gone.

**Summarizing and organizing.** Long documents, deposition notes, discovery material. AI is excellent at compressing and structuring text you provide.

**Explaining and reframing.** Turning dense legal language into plain English for a client, or vice versa.

**Brainstorming and checklists.** Issues to consider, questions to ask, points to research further.

And here is what stays firmly with a qualified human:

**Legal advice and judgment.** What a client should do is a professional decision, not an AI output.

**Final accuracy and authority.** Every fact, citation, and rule must be verified by a person.

**Anything filed or relied upon.** The responsibility, and the liability, never transfers to the tool.

The mindset that keeps you safe: AI is a fast junior assistant whose work you always check, never a substitute for professional judgment or verified legal sources.

## multiple_choice

```json
{
  "stem": "A paralegal asks an AI tool for cases supporting a legal argument, and it returns three case names with citations. What is the right next step?",
  "options": [
    {
      "id": "a",
      "label": "Include the cases in the draft, since the AI provided full citations.",
      "is_correct": false,
      "explanation": "AI invents realistic-looking case names and citations. People have faced sanctions for filing AI-fabricated cases. A full-looking citation is not evidence the case is real."
    },
    {
      "id": "b",
      "label": "Verify each case in an actual legal research database before relying on it, and discard any that do not check out.",
      "is_correct": true,
      "explanation": "Correct. AI is not a legal source. Every citation must be confirmed in a real legal database, because fabricated cases are a known and serious failure mode."
    },
    {
      "id": "c",
      "label": "Ask the AI to confirm that the cases are real and rely on its answer.",
      "is_correct": false,
      "explanation": "Asking the AI to verify itself does not help. It will often confidently confirm cases it invented. Verification has to come from a real legal source, not the same tool."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same research task, two prompts. Notice which one keeps the tool on the safe side of the line.",
  "before_prompt": "Find me three cases that support the argument that this non-compete is unenforceable, with citations.",
  "after_prompt": "Here is the rule and the two verified cases I pulled from our legal database on non-compete enforceability: [paste]. Using only this material, draft a plain-language explanation of how these authorities apply to my client's facts, and list the open questions I still need to research. Do not add any cases or citations of your own.",
  "changes": [
    "Stops asking the tool to supply legal authority, which is where it invents fake cases and citations, and instead feeds it authority the human already verified.",
    "Redirects the model to what it is genuinely good at: explaining and organizing verified material in plain language.",
    "Explicitly bars it from adding citations, so nothing unverified can slip into the work product."
  ]
}
```

## mini_project

Build your before-it-leaves-my-desk checklist. AI-assisted legal work is safe only when a verification step is built in, so write a short checklist you will run on anything AI helped produce before it is filed or sent. Include at minimum: every case, statute, and citation confirmed in an authoritative legal database (not the AI); every quoted rule checked against the primary source; a confirmation that no confidential client details were pasted into a public tool; and a named qualified human who takes responsibility for the final accuracy. Keep it to five or six lines you can actually run every time, and tape it somewhere you will see it.
