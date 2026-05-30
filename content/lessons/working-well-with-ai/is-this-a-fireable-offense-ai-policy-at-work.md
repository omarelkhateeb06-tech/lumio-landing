---
slug: is-this-a-fireable-offense-ai-policy-at-work
module: working-well-with-ai
title: "Is This a Fireable Offense? Reading AI Policy at Work"
level: growing
minutes: 7
order: 5
hook: The scariest question about workplace AI is the one nobody asks out loud: am I allowed to use this, and could it get me in trouble?
key_takeaway: Most AI trouble at work comes from data and disclosure, not the tool itself. Know your employer's policy, never paste confidential or personal data into unapproved tools, and when there is no policy, act as if there is one.
tags: [general, fundamentals]
---

## reading

A lot of people use AI at work in a nervous gray zone, half-hiding it, unsure if they are being resourceful or breaking a rule they have not read. Let's replace the anxiety with a clear picture of what actually gets people in trouble, because it is rarely the thing they worry about.

What almost never gets you fired: using AI to draft an email, clean up your notes, or think through a problem. That is using a tool, the same as using a spreadsheet or a search engine.

What genuinely can: two things. **Data leaks and dishonesty.**

**Data.** Pasting confidential, regulated, or personal information into a public AI tool is the real risk. Customer records, patient data, unreleased financials, someone's salary, source code. The tool may store or review what you paste, so this can breach a contract, a privacy law, or your company's security rules in one click. This is the line that matters most.

**Disclosure and honesty.** Passing off AI work as something it is not, when honesty was expected, is the other risk. Submitting AI-written content where original work was required, or hiding AI use from a client or manager who would care, is a trust problem, not a tooling problem.

Here is how to stay safe:

**Find the policy.** Many employers now have an AI policy or an approved, private tool. Search the intranet, or just ask your manager or IT. Asking is not admitting guilt, it is being professional.

**When there is no policy, assume a strict one.** Absence of a rule is not permission. Default to: no confidential or personal data in public tools, and be transparent about AI use when it would matter to someone.

**Ask before, not after.** A two-minute question to your manager beats explaining a mistake later. "I'd like to use AI to help draft these, with no client data pasted in. Any concerns?" is a sentence that protects you.

The honest summary: the tool is almost never the problem. What you feed it and whether you are straight about using it are the things that carry real consequences.

## multiple_choice

```json
{
  "stem": "Your workplace has no written AI policy. You want to use a free public chatbot to help with your work. Which approach keeps you safest?",
  "options": [
    {
      "id": "a",
      "label": "Since there's no rule against it, paste in whatever you need, including client details, to get the best help.",
      "is_correct": false,
      "explanation": "No policy is not permission. Pasting client details into a public tool is the exact action that can breach privacy rules or a client contract, regardless of whether an internal memo exists."
    },
    {
      "id": "b",
      "label": "Use it for general drafting with no confidential or personal data pasted in, and ask your manager whether an approved tool or any limits exist.",
      "is_correct": true,
      "explanation": "Correct. You get the benefit while avoiding the two real risks: you keep sensitive data out, and you surface the question to your manager, which is professional, not incriminating."
    },
    {
      "id": "c",
      "label": "Avoid AI entirely until someone writes an official policy.",
      "is_correct": false,
      "explanation": "Overcautious and unnecessary. Generic, non-confidential drafting is low-risk and a normal use of the tool. You can be safe without opting out completely."
    }
  ]
}
```

## fill_blank

```json
{
  "template": "Using AI at work almost never gets you in trouble for the tool itself. The two real risks are leaking {{1}} or personal data into a public tool, and being dishonest by hiding your AI {{2}} when it would matter to someone. When no policy exists, assume a {{3}} one.",
  "blanks": [
    { "id": "1", "accept": ["confidential", "sensitive"], "ideal": "confidential" },
    { "id": "2", "accept": ["use", "usage"], "ideal": "use" },
    { "id": "3", "accept": ["strict"], "ideal": "strict" }
  ],
  "explanation": "The lesson's core: trouble comes from data leaks and dishonesty, not the tool. With no policy, default to strict, no confidential or personal data in public tools, and be transparent about AI use when it matters."
}
```
