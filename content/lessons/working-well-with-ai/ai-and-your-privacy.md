---
slug: ai-and-your-privacy
module: working-well-with-ai
title: "AI and Your Privacy: Where Your Data Goes"
level: growing
minutes: 6
order: 1
hook: One simple rule keeps you out of trouble: never paste anything you would not want on a billboard.
key_takeaway: Public AI tools may store and review what you type, so strip out names and confidential details, or use an approved private tool, before you paste real work in.
tags: [general, fundamentals]
---

## reading

AI tools are useful because you can paste real work into them. That is also exactly where people get into trouble. So let's set a clear line you can actually follow.

When you type into a free, public AI tool, your text may be saved on the company's servers and, in some cases, reviewed by people or used to train future versions. That is fine for a generic question. It is a real problem for a patient record, a client contract, an unreleased product plan, or a colleague's salary.

The safest mental model is simple. **Treat a public AI tool like a postcard, not a sealed letter.** Do not write anything on it that would cause harm if a stranger read it.

Here is how to stay safe without slowing down.

**Strip the identifiers.** You can still get great help by removing the sensitive parts. Replace "patient Maria Lopez, room 4" with "the patient." Replace "Acme Corp's Q3 layoffs" with "a client's confidential plan." The AI can summarize and rewrite just as well with the names removed.

**Know your tools.** Many workplaces offer an approved, private version of an AI tool that does not store your data the same way. If yours does, use it for anything sensitive. If you are not sure what is approved, ask before you paste.

**When in doubt, leave it out.** If you are unsure whether something is safe to share, that hesitation is your answer. Genericize it or keep it offline.

Privacy is not about avoiding AI. It is about being deliberate with what you feed it.

## multiple_choice

```json
{
  "stem": "You want AI to help summarize a confidential client contract, but you only have access to a free public AI tool. What is the safest way to proceed?",
  "options": [
    {
      "id": "a",
      "label": "Paste the full contract in, since you will delete the chat afterward.",
      "is_correct": false,
      "explanation": "Deleting the chat does not undo the fact that the confidential text was already sent to and possibly stored on an outside server. The risk happens at the moment you paste."
    },
    {
      "id": "b",
      "label": "Remove the client name and any identifying details first, then ask for a summary of the generic terms.",
      "is_correct": true,
      "explanation": "Correct. Stripping the identifiers lets you get real help while keeping the confidential parts off a public tool. The AI summarizes the terms just as well without the names."
    },
    {
      "id": "c",
      "label": "Paste it in but add a line telling the AI to keep it private.",
      "is_correct": false,
      "explanation": "An instruction in the chat does not control how the company stores or reviews your text. The tool's data policy, not your request, decides what happens to it."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same goal, summarizing a sensitive document, two prompts for a free public tool. Notice which one keeps the confidential parts off the server.",
  "before_prompt": "Summarize this performance review for me: 'Maria Lopez, Senior Analyst, has missed three deadlines this quarter and her manager David Chen is recommending a performance improvement plan before her March 15 review.'",
  "after_prompt": "Help me summarize a performance review. Genericized: an employee has missed several deadlines this quarter and their manager is recommending a performance improvement plan before an upcoming review. Give me a clear, neutral summary and suggest how to phrase the concerns constructively. I'll add the real names and dates myself, offline.",
  "changes": [
    "Strips the employee name, the manager name, and the specific date before anything reaches a public tool, so no identifiable personnel record leaves your control.",
    "Replaces the specifics with a generic description the AI can summarize and improve just as well.",
    "Reserves the confidential details for offline work, treating the public tool like a postcard a stranger could read rather than a sealed letter."
  ]
}
```
