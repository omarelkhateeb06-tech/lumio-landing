---
slug: confidentiality-and-ai-legal
module: industry-deep-dives
title: "Confidentiality and AI: A Legal Professional's Guide"
level: beginner
minutes: 7
order: 16
hook: Client confidentiality and public AI tools do not mix. Here is how to use AI without ever crossing that line.
key_takeaway: Treat public AI tools as untrusted with confidential information, so genericize details or use an approved private tool, and never paste privileged client material into a free service.
tags: [legal, fundamentals]
---

## reading

For legal professionals, confidentiality is not a preference, it is a duty. And AI tools create a real risk to that duty if you are not careful, because what you type into a public tool can leave your control. This lesson is the guardrail that lets you use AI confidently without breaching it.

Start with how these tools handle your text. When you type into a free, public AI service, your input may be stored on the company's servers, reviewed by its staff, and used to improve future versions of the model. That is incompatible with privileged and confidential client information. Pasting a client's name, their matter details, or privileged communications into a public tool can be a breach, even if nothing visibly goes wrong.

So here are the rules that keep you safe.

**Treat public AI tools as untrusted with confidential data.** The mental model: a free public tool is like talking in a crowded room. Do not say anything there that is privileged or client-confidential.

**Genericize before you paste.** You can still get excellent help by removing the identifying and sensitive parts. Replace the client name with [client], the company with [a manufacturing company], specific figures with placeholders. The AI can draft and summarize just as well from the generic version.

**Use approved, private tools for sensitive work.** Many firms provide an enterprise AI tool with a contract that prohibits training on your data and stronger privacy protections. For anything confidential, use the approved tool, not a personal free account. If you do not know what your firm permits, ask before you paste.

**When unsure, keep it out.** If you are not certain whether something is safe to share, that hesitation is your answer. Genericize it or keep it offline.

**Know your obligations.** Confidentiality rules, and increasingly specific guidance on AI use, apply to you. The convenience of a tool never overrides your professional duty.

None of this means avoiding AI. It means being deliberate: generic inputs in public tools, sensitive work only in approved ones, and client confidentiality protected at every step.

## multiple_choice

```json
{
  "stem": "A paralegal wants to use a free public AI tool to help draft a memo summarizing issues in an active client matter. What is the appropriate way to proceed?",
  "options": [
    {
      "id": "a",
      "label": "Paste the full matter details and client name in, as long as the chat is deleted afterward.",
      "is_correct": false,
      "explanation": "Deleting the chat does not undo the disclosure. The confidential information was already sent to and possibly stored by an outside service the moment it was pasted, which can breach confidentiality."
    },
    {
      "id": "b",
      "label": "Remove the client name and identifying details and work from a genericized version, or use the firm's approved private tool for the confidential content.",
      "is_correct": true,
      "explanation": "Correct. Genericizing protects confidentiality while still getting AI help, and an approved private tool with proper data protections is the right place for genuinely confidential material."
    },
    {
      "id": "c",
      "label": "Paste everything but add an instruction telling the AI to keep the information confidential.",
      "is_correct": false,
      "explanation": "An instruction in the prompt does not control how the company stores or reviews your input. The tool's data policy governs that, not your request, so the confidential data is still exposed."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same memo request, two prompts. Notice which one keeps you inside your duty of confidentiality.",
  "before_prompt": "Help me draft a memo on the issues in Jennifer Walsh's employment dispute with Riverside Manufacturing, where she alleges she was fired after reporting safety violations on the night shift.",
  "after_prompt": "Help me draft an issue memo for an employment matter. The setup, genericized: [an employee] alleges termination shortly after [reporting workplace safety concerns] to [the employer]. Organize the likely issues to analyze and the questions to investigate. Use only this generic description; I will add the confidential specifics in our approved private tool.",
  "changes": [
    "Strips the real client name, the employer, and identifying facts before anything reaches a public tool, which is what keeps a privileged matter from leaving your control.",
    "Replaces specifics with bracketed placeholders so the AI can still produce a useful structure from the generic version.",
    "Reserves the confidential details for an approved private tool, treating the public tool like a crowded room where privileged information is never spoken."
  ]
}
```

## mini_project

Your 5-minute exercise: Take a real (or realistic) active matter and practice genericizing it for safe AI use. Write out the matter in one or two sentences as you normally would, then rewrite it replacing the client name with [client], the company with a generic descriptor like [a manufacturing company], and every figure, date, and identifying fact with a placeholder. Read the genericized version and confirm that nothing left in it could identify the client or the matter. Then note which parts of the work you could safely do in a public tool with the generic version, and which parts must wait for your firm's approved private tool.
