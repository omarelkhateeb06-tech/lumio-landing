---
slug: contract-summaries-with-ai
module: industry-deep-dives
title: "Drafting Contract Summaries with AI"
level: beginner
minutes: 15
order: 12
hook: Turn a dense 40-page agreement into a clear summary of what actually matters, in minutes.
key_takeaway: Paste the real contract text and ask for a plain-language summary of the specific terms you name, then verify each one against the document.
tags: [legal, summarizing, writing]
---

## reading

Reading contracts is slow work, and the parts that matter are buried in dense language across forty pages. AI can give you a fast, structured first read of an agreement, as long as you treat it as a first read and not the final word. Done right, this is one of the highest-value uses of AI in any legal job, whether you are a paralegal triaging incoming agreements or an attorney prepping for a client call.

The single most important move is this: work from the real pasted text, never from the AI's memory. If you type "summarize a standard NDA for me," the AI has no document in front of it, so it invents plausible terms. It will confidently describe a two-year confidentiality period, a mutual non-disclosure structure, and a carve-out for publicly available information, and none of that may match the NDA actually sitting on your desk. The output reads beautifully and describes a contract that does not exist. The danger is that an invented summary looks identical to an accurate one, so there is no warning sign on the page telling you it is wrong. That is why you always paste the actual contract or clause first, then ask for the summary you need from that text and nothing else. The text on the page is the only thing the AI should be summarizing.

Once the real text is in front of the AI, name the specific terms you care about. Do not ask for a vague overall summary. Tell it exactly what to pull. For a service agreement, you might write: "From the agreement below, summarize the termination terms, the payment schedule, the liability cap, the indemnification obligations, and any auto-renewal clause." Naming the terms focuses the output on what drives risk and money, instead of giving you a polite paragraph about the parties and the recitals that you did not need. The terms worth naming are almost always the same handful: how the contract ends, who pays what and when, how much each side can be on the hook for, who covers whom if something goes wrong, and whether the thing renews on its own. When you name them up front, the AI stops summarizing the boilerplate and starts summarizing the substance.

Ask for plain English a client could understand. A line like "explain each of these in plain language a non-lawyer client could read without a dictionary" turns dense legalese into something you can drop into a client email or a memo. This matters because translating contract language is a real part of the job, and a clear summary saves you from writing one from scratch.

Ask the AI to flag and quote, not to advise. The right instruction is: "Flag anything unusual or one-sided compared to a typical agreement of this type, and quote the exact clause for each thing you flag, but do not give legal advice." This keeps the AI doing what it is good at, which is surfacing places to look, while the legal judgment stays with you. Asking for the exact quote also makes your verification instant, because the AI shows you the source language right next to its flag.

Request a scannable format. A labeled bullet list or a table, with one row per term, makes the summary easy to read and easy to check against the document. "Format as a table with columns for the term, the plain-language summary, and the exact quoted clause" gives you something you can scan in seconds.

Here is how this plays out on real documents. Take a commercial lease. You paste the full lease text and ask for the rent and escalation terms, the termination conditions, and any auto-renewal clause, formatted as a labeled list with quoted clauses. The AI shows you a three percent annual escalation, a sixty-day termination notice requirement, and an auto-renewal that triggers unless the tenant gives ninety days written notice. Now you know exactly where to look in the document to confirm each one.

Take a service agreement between a marketing vendor and a client. You name the payment schedule, the liability cap, and the indemnification clause. The AI flags that the liability cap is set at one month of fees, which is unusually low, and quotes the exact sentence. That flag, with its quote, points you straight to a term worth negotiating.

Take an NDA a new hire is being asked to sign. You paste it and ask for the confidentiality period, the definition of confidential information, and any non-solicitation language. The AI flags a five-year confidentiality term and a non-solicit clause buried in the definitions section, and quotes both. You would have found these eventually, but the summary got you there in two minutes instead of twenty. In each of these three cases the AI did the same job: it read the text you gave it, pulled the terms you named, put them in plain language, and pointed you to the exact clauses with quotes you can confirm.

A full prompt that ties all of this together looks like this: "Here is the agreement: [paste text]. Using only this text, summarize the termination, payment schedule, liability cap, indemnification, and auto-renewal terms in plain language a client could understand. Format as a table with columns for the term, the summary, and the exact quoted clause. Flag anything unusual or one-sided for that type of agreement, but do not give legal advice." That one prompt covers the real text, the named terms, the plain English, the scannable format, and the flag-and-quote instruction at once.

Used this way, AI turns hours of dense reading into a focused review where you spend your attention on the clauses that actually need it.

## multiple_choice

```json
{
  "stem": "You need a summary of the indemnification and liability terms in a service agreement. What is the right way to use AI for this?",
  "options": [
    {
      "id": "a",
      "label": "Ask the AI to summarize a typical service agreement's indemnification and liability terms from its general knowledge.",
      "is_correct": false,
      "explanation": "The AI has no document in front of it, so it will invent plausible terms that may not match your actual agreement. The summary will read well and describe a contract that does not exist."
    },
    {
      "id": "b",
      "label": "Paste the actual agreement text, name the indemnification and liability terms you want, and ask for plain language with the exact clauses quoted.",
      "is_correct": true,
      "explanation": "Correct. Working from the real pasted text prevents invented terms, naming the specific terms focuses the output, and quoting the exact clauses makes verification fast."
    },
    {
      "id": "c",
      "label": "Describe the agreement to the AI in your own words and ask it to summarize what you described.",
      "is_correct": false,
      "explanation": "Your description is not the contract. The AI can only be accurate if it works from the real text, so paste the document rather than paraphrasing it."
    },
    {
      "id": "d",
      "label": "Ask the AI for its legal opinion on whether the indemnification terms are enforceable.",
      "is_correct": false,
      "explanation": "AI should flag unusual clauses and quote them, not give legal advice. The judgment on enforceability stays with a qualified attorney."
    }
  ]
}
```

## reading

The fastest way to get burned by an AI contract summary is to trust it without checking each term against the actual clause. The classic failure is a flipped negation. The AI summarizes a clause as "the tenant may terminate with thirty days notice," but the lease actually says the tenant "shall not terminate" within the first year. A single dropped "not" inverts the legal meaning, and the summary reads just as smoothly either way. In a contract, "shall" and "shall not" are the difference between an obligation and a prohibition, so you check the source clause every time before you rely on the summary.

A second mistake is a confidentiality breach. Pasting a privileged or confidential contract into a public AI tool can expose client information and waive privilege. Before any document goes into a tool, confirm it is approved for that use, or genericize the text by stripping party names, dollar figures, and identifying details first. Many firms have specific rules here, and a convenient summary is not worth a privilege problem.

A third mistake is asking the AI to summarize a contract from memory. If you reference "the Acme master services agreement" without pasting it, the AI does not have it and will invent terms that sound right. Always paste the text you want summarized.

A fourth mistake is accepting "usually right" on the details that carry the most risk: numbers, dates, and negations. An AI summary that gets a liability cap off by a zero, a notice period off by thirty days, or a renewal date off by a month is worse than no summary, because it reads with full confidence. These are exactly the items you verify character by character against the document.

A fifth mistake is re-summarizing until two outputs agree and treating that agreement as proof. Two AI summaries can both make the same misread and confirm each other, especially on a tricky negation or a poorly worded clause. The authority is never another summary. The authority is the clause in the contract, so verification means reading the source text, not comparing AI outputs against each other. If you find yourself asking the AI "are you sure?" three times, stop and open the document instead.

The pattern across all five is the same. The summary is a fast way to find the clauses that matter, and the contract itself is the only thing you trust for what those clauses say.

## fill_blank

```json
{
  "template": "Before relying on an AI contract summary, check each term against the actual {{1}} in the document, paying special attention to negations like 'shall not,' which the AI can flip; and never paste a confidential or {{2}} contract into a public AI tool.",
  "blanks": [
    {"id": "1", "accept": ["clause", "text", "source", "wording", "language"], "ideal": "clause"},
    {"id": "2", "accept": ["privileged", "confidential", "sensitive", "protected"], "ideal": "privileged"}
  ],
  "explanation": "Verification means reading the actual clause, because the AI can invert a negation without the summary looking wrong. And privileged or confidential documents must never go into a public tool, since that can expose client information and waive privilege."
}
```

## before_after [personalizable]

```json
{
  "question": "Same commercial lease, two prompts. Notice which one protects you from invented terms and makes verification fast.",
  "before_prompt": "Summarize a standard commercial lease for me.",
  "after_prompt": "Here is the lease agreement text: [paste the actual lease]. Using only this text, summarize the rent and escalation terms, the termination conditions, the liability provisions, and any auto-renewal clause, in plain language a client could understand. Format it as a table with columns for the term, the plain-language summary, and the exact quoted clause. Flag anything unusual or one-sided compared to a typical commercial lease, but do not give legal advice.",
  "changes": [
    "Works from the real pasted lease text instead of asking the AI to recall a generic lease, which is how invented terms creep in.",
    "Names the specific terms to summarize and asks for plain language and a scannable table, so the output is focused and easy to check.",
    "Asks the AI to flag and quote the exact clause rather than advise, keeping legal judgment with the human and making verification against the source instant."
  ]
}
```

## multiple_choice

```json
{
  "stem": "An AI summary of a lease reads: 'The tenant may terminate with 30 days notice.' The actual clause says the tenant 'shall not terminate' within the first year. What does this teach you about using AI summaries?",
  "options": [
    {
      "id": "a",
      "label": "The AI is usually right, so you can trust the summary and skip re-reading the clause.",
      "is_correct": false,
      "explanation": "In contracts, 'usually right' is not safe enough. A flipped negation changes the legal effect entirely, and only checking the source catches it."
    },
    {
      "id": "b",
      "label": "You should ask the AI to re-summarize until two summaries agree, then trust them.",
      "is_correct": false,
      "explanation": "Two summaries can agree and both be wrong. The authority is the contract clause itself, so verification means reading the source, not comparing AI outputs."
    },
    {
      "id": "c",
      "label": "The model can misread a negation like 'shall not' as 'shall,' flipping the meaning, so every summarized term must be checked against the exact clause before you rely on it.",
      "is_correct": true,
      "explanation": "Correct. A single dropped 'not' inverts a contract term, and the summary still reads smoothly. The summary is a fast way to find the right clauses, never a substitute for reading them."
    },
    {
      "id": "d",
      "label": "It means AI should never be used for contracts at all.",
      "is_correct": false,
      "explanation": "Too far. AI is genuinely useful for a fast first read. The discipline is verifying each summarized term against the actual text, not abandoning the tool."
    }
  ]
}
```

## mini_project

Take a real contract or clause from your work, and if it is confidential, genericize it first by stripping party names, dollar figures, and identifying details. Run the focused summary prompt: paste the real text, name the specific terms you care about, ask for plain language with a labeled list or table, and ask the AI to quote the exact clause for anything it flags. Then verify each summarized term against the source line by line, watching negations, dates, and dollar figures most closely, and note how long verification took compared to reading the whole document cold.

- Paste the real (or genericized) contract text and run a prompt naming the specific terms you need, asking for the exact clause quoted next to each one.
- Check every summarized term against the source clause line by line, flagging any "shall" versus "shall not," wrong date, or wrong figure you find.
- Write one or two plain-language sentences per key term that you could send to a client, and note where the summary and the actual clause diverged.
