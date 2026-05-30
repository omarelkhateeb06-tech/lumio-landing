---
slug: client-communication-legal
module: industry-deep-dives
title: "Client Communication Templates for Legal Professionals"
level: beginner
minutes: 7
order: 14
hook: Build clear, reassuring client messages once, then reuse them for the updates you send all the time.
key_takeaway: Use AI to build reusable, plain-language templates for routine client communication, with the specifics and legal judgment left to you and the confidential details kept out of public tools.
tags: [legal, customer-comms, writing]
---

## reading

Clients often feel anxious and in the dark. Clear, timely communication is one of the most valued things a legal professional offers, and also one of the most repetitive: status updates, document requests, appointment confirmations, explanations of next steps. AI can help you build strong templates for these so the routine messages are fast and consistent, while you keep control of the substance.

The approach is to template the recurring messages, not to hand over individual client matters.

**Build the template, not the case.** Ask AI to create a reusable structure. "Create a plain-language template for a client status update letter. It should reassure the client, summarize where things stand in general terms, explain the next step, and set expectations for timing. Mark the parts I fill in with brackets." You get a clear, warm, professional shell to reuse.

**Prioritize plain language.** Clients are not lawyers. A real strength of AI is turning legal concepts into language a client understands. "Rewrite this explanation of the discovery process for a client with no legal background, in a calm and clear tone."

**Keep the tone reassuring and honest.** Legal news is often uncertain. Ask for templates that set realistic expectations without false promises. "Write a template for telling a client about an unexpected delay, that is honest, calm, and does not over-promise."

Now the rules that protect you and your client:

**Never paste confidential client details into a public AI tool.** Use generic placeholders in the template, like [client name] and [matter description]. The confidential specifics get filled in offline or in an approved, private tool, never typed into a free public one.

**The legal substance is yours.** AI shapes the wording. What you actually tell a client about their matter is a professional judgment that you make and verify.

Build a small library of these templates once, and routine client communication becomes faster and more consistent, while the care and judgment that clients actually value stay firmly with you.

## before_after [personalizable]

```json
{
  "question": "Same status update, two prompts. Notice which one keeps client confidentiality intact.",
  "before_prompt": "Write a status update for my client Maria Chen about her wrongful termination case against Acme Corp, where we just received their settlement offer of $85,000 and I need to advise her to counter.",
  "after_prompt": "Create a reusable, plain-language template for a client status update letter. It should reassure the client, summarize where things stand in general terms, explain the next step, and set realistic expectations for timing. Mark every fill-in part with brackets like [client name] and [next step], and use no real names or case details.",
  "changes": [
    "Builds a reusable template instead of pasting a real client's name, opponent, and settlement figure into a public tool, which would breach confidentiality.",
    "Uses bracketed placeholders so the confidential specifics are filled in offline or in an approved tool, never typed into the AI.",
    "Keeps the legal substance (whether to counter, and at what number) out of the prompt entirely, since that is the professional's judgment, not a templating task."
  ]
}
```

## multiple_choice

```json
{
  "stem": "You want AI's help writing a delay notice for a specific client matter. What is the safe way to do it?",
  "options": [
    {
      "id": "a",
      "label": "Ask for a template using generic placeholders like [client name] and [matter], then fill in the confidential specifics yourself offline.",
      "is_correct": true,
      "explanation": "Correct. Template the recurring message, not the individual matter. The AI shapes the wording from generic placeholders, and the confidential details never enter a public tool."
    },
    {
      "id": "b",
      "label": "Paste the full matter details so the message is accurate, then delete the chat.",
      "is_correct": false,
      "explanation": "Deleting the chat does not undo the disclosure. The confidential details were already sent to an outside service the moment you pasted them."
    },
    {
      "id": "c",
      "label": "Let the AI decide what to tell the client about the delay and why.",
      "is_correct": false,
      "explanation": "What you tell a client about their matter is legal substance and professional judgment. AI shapes wording; it does not make the call about what the client is told."
    },
    {
      "id": "d",
      "label": "Include the client's name but nothing else, since a name alone is harmless.",
      "is_correct": false,
      "explanation": "A client name tied to the existence of a legal matter is itself confidential. Use a placeholder; identifying details stay out of public tools."
    }
  ]
}
```

## mini_project

Build a starter client communication library. Pick the three messages you send clients most often, such as a status update, a document request, and a notice of a delay or schedule change. For each, ask AI to create a plain-language, reassuring template with the fill-in parts marked in brackets, using only generic placeholders and no real client details. Review each template, adjust the tone and wording to match how your firm communicates, and confirm it sets honest expectations without over-promising. Save the three templates somewhere you can reuse them, and remember to fill in confidential specifics offline or in an approved private tool rather than a public one.
