---
slug: ai-in-legal-work-limits
module: industry-deep-dives
title: "AI in Legal Work: What's Permitted and What's Not"
level: beginner
minutes: 15
order: 11
hook: AI can save legal professionals real time, but only if you respect the one line you must never cross.
key_takeaway: AI is a capable assistant for drafting and organizing, never a source of legal authority, so you must verify every citation in a real legal source and keep a qualified human responsible for the work.
tags: [legal, fundamentals, hallucinations]
---

## reading

If you work in or around law, AI can take a lot of the grind out of your day. It can draft routine correspondence, summarize a long deposition transcript, organize discovery, and give you a rough first pass at research. Used well, it clears the busywork so you can spend your hours on the parts of the job that actually need a trained legal mind. But the legal field has a hard line, and crossing it has real consequences for clients, for your firm, and for you. So let's be precise about what AI can do for legal work and what it absolutely cannot.

Start with the single most important fact, because everything else follows from it. AI is not a source of legal authority. A tool like ChatGPT predicts likely text one word at a time. It does not look anything up in a law library. It does not check a real reporter or a real docket. When you ask it for a case, it produces something that looks exactly like a case, with a plausible name, a plausible court, and a plausible citation, because it has seen thousands of real citations and learned the pattern. The pattern is real. The case may be completely invented. This is not a rare glitch you can engineer around. It is how the tool works.

Here is the most famous version of what happens when people forget that. In a 2023 federal case in New York, two attorneys filed a brief that cited several court decisions to support their argument. The cases did not exist. An AI tool had fabricated them, complete with quotations and citations, and when one of the lawyers asked the tool whether the cases were real, it cheerfully confirmed that they were. They were not. The judge sanctioned the attorneys, ordered them to pay a fine, and required them to notify the real judges whose names had been falsely attached to the fake opinions. The lesson is blunt. A citation that looks perfect tells you nothing about whether it is real. Nothing AI produces is legal authority until you confirm it in an actual legal source like Westlaw, Lexis, or an official reporter.

With that line drawn clearly, here is where AI genuinely earns its keep in a legal workflow.

Consider a paralegal drafting routine correspondence. A status-update letter to a client, an engagement-letter first draft, a cover note for a document production. These are templated, low-stakes documents where most of the words are the same every time and only the details change. AI can produce a clean first version in seconds. The paralegal then edits for accuracy, tone, and the specifics of the matter, fills in the facts of the actual file, and a supervising attorney reviews anything that goes out the door. The blank page is gone, but a human still owns every word that leaves the office.

Consider summarizing deposition notes. You have three hundred pages of transcript and you need the key admissions, the timeline, and the topics that came up. AI is genuinely strong at compressing and structuring text you give it. It can pull a rough summary and a topic list you can scan in minutes. You still read the passages that matter in the original transcript before you rely on them, because a summary can flatten a crucial qualifier, but the first pass saves real time.

Consider explaining a clause to a client. A non-compete provision or an indemnification clause written in dense legal language can be reframed into plain English a client can actually follow. AI is good at that translation. The attorney confirms the explanation is correct for this contract and this jurisdiction before sending it, because the plain-language version is only as good as the human who checks it.

And here is what stays firmly with a qualified human, no exceptions. Legal advice and judgment, meaning what a client should actually do, is a professional decision and never an AI output. Final accuracy and authority, meaning every fact, every quoted rule, and every citation, must be verified by a person against a primary source. Anything filed with a court or relied upon in a transaction carries responsibility and liability that never transfers to the tool. If it goes out the door, a licensed human owns it.

The mindset that keeps you safe is simple. Treat AI as a fast, fluent junior assistant whose work you always check. It is wonderful for the first draft and the rough summary. It is never a stand-in for professional judgment, and it is never a substitute for verified legal sources. The fluency is exactly the trap. The more confident and polished an AI answer sounds, the more it tempts you to skip the verification step, and the verification step is the whole job.

## multiple_choice

```json
{
  "stem": "A paralegal asks an AI tool for cases supporting a legal argument, and it returns three case names with full citations. What is the right next step?",
  "options": [
    {
      "id": "a",
      "label": "Include the cases in the draft, since the AI provided complete citations.",
      "is_correct": false,
      "explanation": "AI invents realistic-looking case names and citations. Attorneys have been sanctioned for filing AI-fabricated cases. A complete-looking citation is not evidence the case is real."
    },
    {
      "id": "b",
      "label": "Ask the AI to confirm that the cases are real and rely on its answer.",
      "is_correct": false,
      "explanation": "Asking the AI to verify itself does not help. In the famous New York sanctions case, the tool confidently confirmed cases it had invented. Verification must come from a real legal source, not the same tool."
    },
    {
      "id": "c",
      "label": "Verify each case in an actual legal research database before relying on it, and discard any that do not check out.",
      "is_correct": true,
      "explanation": "Correct. AI is not a legal source. Every citation must be confirmed in a real database like Westlaw or Lexis, because fabricated cases are a known and serious failure mode."
    }
  ]
}
```

## reading

Knowing the rule is one thing. The mistakes that actually get legal workers in trouble come from forgetting it under deadline pressure, when an answer looks finished and the clock is running. Here are the ones that show up again and again, so you can spot them before they cost you.

The first is filing AI-fabricated citations without checking them. This is not hypothetical. In the 2023 New York case, real attorneys filed real briefs built on cases that an AI simply made up, and they were sanctioned for it. Since then, judges across multiple jurisdictions have caught and penalized the same mistake, and some courts now require lawyers to certify whether AI was used in a filing. The failure is always the same shape. The citation looked perfect, so nobody pulled it up to confirm it existed.

The second is pasting privileged or confidential client material into a public tool. When you drop a client's contract, settlement terms, medical records, or case strategy into a free consumer chatbot, that information may be stored, may be used to train the model, and is no longer under your control. That can breach client confidentiality and waive privilege, which is one of the most serious things a legal professional can do. Sensitive client material does not belong in a public tool, period. If your firm has an approved, contractually protected legal AI platform, use that and follow its rules instead.

The third is treating a fluent AI answer as legal authority. The tool writes in a calm, confident, professional voice. It sounds like a senior associate. That tone has nothing to do with accuracy. AI will state a rule that was repealed years ago, or describe the law of the wrong state, with exactly the same confidence it uses when it is right. Fluency is not authority, and a polished paragraph is not a verified one.

The fourth is asking the AI to verify its own work. When you ask a tool whether the cases it gave you are real, you are asking the same prediction engine that invented them to grade itself. It will often say yes. Self-confirmation proves nothing. The check has to come from outside the tool, from a real legal database or the primary source itself.

The fifth ties them all together. Using AI output without a qualified human reviewing it. Even when every citation is real and no confidential data was exposed, a licensed professional still has to own the legal judgment, the accuracy, and anything that gets filed or sent. The responsibility never transfers to the software. If you remember one thing, remember that AI can speed up the work but it can never sign off on it.

## multiple_choice

```json
{
  "stem": "A legal assistant is on deadline and wants AI help summarizing a sensitive client settlement agreement. Which action creates the most serious problem?",
  "options": [
    {
      "id": "a",
      "label": "Pasting the full agreement, including client names and settlement terms, into a free public chatbot.",
      "is_correct": true,
      "explanation": "Correct. Confidential client material in a public tool can be stored, used for training, and exposed, which may breach confidentiality and waive privilege. Sensitive client data does not belong in a public tool."
    },
    {
      "id": "b",
      "label": "Reading the AI summary and then checking the key terms against the original agreement.",
      "is_correct": false,
      "explanation": "This is the safe approach. The summary is a first pass, and a human verifies the terms against the source before relying on them."
    },
    {
      "id": "c",
      "label": "Using a firm-approved, contractually protected legal AI platform that follows the firm's confidentiality rules.",
      "is_correct": false,
      "explanation": "This is a reasonable option when the platform is approved and protected. The danger is the public tool, not careful use of an approved one."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same non-compete research task, two prompts. Notice which one keeps the tool on the safe side of the line.",
  "before_prompt": "Find me three cases that support the argument that this non-compete is unenforceable, with citations.",
  "after_prompt": "Here is the governing rule and the two cases I already pulled and confirmed in our legal database on non-compete enforceability: [paste rule and verified cases]. Using only this material and no outside cases, draft a plain-language explanation of how these authorities apply to my client's facts, and list the open questions I still need to research. Do not add any cases, statutes, or citations of your own.",
  "changes": [
    "Stops asking the tool to supply legal authority, which is exactly where it invents fake cases and citations, and instead feeds it authority the human already verified.",
    "Redirects the model to what it is genuinely good at, which is explaining and organizing verified material in plain language.",
    "Explicitly bars it from adding its own cases or citations, so nothing unverified can slip into the work product."
  ]
}
```

## multiple_choice

```json
{
  "stem": "Why is the rewritten prompt safer for legal work than the original one?",
  "options": [
    {
      "id": "a",
      "label": "It asks the AI for more cases, so there is more authority to choose from.",
      "is_correct": false,
      "explanation": "More AI-supplied cases means more fabrication risk, not more safety. Asking the tool for authority is the dangerous part."
    },
    {
      "id": "b",
      "label": "It gives the AI already-verified authority and forbids it from adding cases, so it only explains material a human confirmed.",
      "is_correct": true,
      "explanation": "Correct. The human supplies the verified law, and the tool is restricted to explaining it. The fabrication failure mode is removed because the AI is never asked to produce authority."
    },
    {
      "id": "c",
      "label": "It is longer, and longer prompts always produce more accurate legal results.",
      "is_correct": false,
      "explanation": "Length is not what makes it safe. What makes it safe is feeding the tool verified authority and barring it from inventing its own."
    }
  ]
}
```

## mini_project

Build your before-it-leaves-my-desk verification checklist. AI-assisted legal work is only safe when a verification step is built into the process, so write a short checklist you will run on anything AI helped produce before it is filed with a court or sent to a client. Keep it to a few lines you can actually run every time, and tape it where you will see it. At minimum, your checklist should make you do the following.

- Confirm every case, statute, and citation in an authoritative legal database like Westlaw or Lexis, not in the AI, and delete anything that does not check out.
- Verify that no confidential or privileged client information was pasted into a public tool, and that any AI use went through a firm-approved platform.
- Name the qualified, licensed human who reviewed the work and takes responsibility for its legal accuracy before it goes out.
