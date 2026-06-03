---
slug: compliance-first-what-ai-cant-touch
module: industry-deep-dives
title: "Compliance First: What AI Can't Touch"
level: growing
minutes: 15
hook: The fastest way to turn a productivity win into a regulatory incident is to paste the wrong thing into a chat box. In finance, what you put in matters as much as what you get out, and some things must never go in at all.
key_takeaway: Before AI touches any task, know what is categorically off-limits. Material non-public information, client data, licensed professional judgment, and the system of record are lines you do not cross, because no convenience is ever worth a compliance breach.
order: 23
tags: [finance, data, fundamentals]
---

## reading

Most AI guidance focuses on getting better output. In finance, the more urgent skill is knowing what you are never allowed to put in, and what AI is never allowed to do. A public AI tool is, by default, a third party you are sharing data with. When you type something into a general chatbot, that text leaves your control. Treat it the way you would treat reading a document aloud in a crowded elevator. Some documents you can read aloud safely. Some you absolutely cannot. The whole discipline of compliance-first AI is learning to tell the difference before you open the chat box, not after.

Start with the line that ends careers: material non-public information. Picture an analyst named Priya who has the unreleased quarterly earnings sitting in a spreadsheet. The numbers are strong, the beat is real, and the press release goes out in two days. She wants AI to help her draft a clean summary, so she is tempted to paste the figures in. Stop. Those numbers are material non-public information. Feeding them into a public tool is sharing them with an outside party before the public has them, which is exactly the conduct insider-trading and Regulation FD rules exist to prevent. It does not matter that Priya has no intent to trade. The exposure is in the act of disclosure, not in her motive. The same logic applies to a controller, call him David, staring at a draft 10-Q. That filing contains the company's unreleased financial position. Pasting the draft into a chatbot to "tighten the language" is not a copy-edit. It is moving confidential, market-moving information outside the company before it is filed. The convenience is real. The risk is your firm's reputation and your own standing.

Next comes client data and personally identifiable information. An accountant named Marcus is doing tax returns and has a stack of W-2s, Social Security numbers, and account balances. He wants AI to help explain a deduction to a client, so the temptation is to paste the client's actual return. Stop again. SSNs, account numbers, names tied to financial details, and similar personal data are protected, and a public tool is not an approved home for them. The fix is almost always available: work with the shape of the problem, not the live data. Marcus can ask AI to explain how a particular deduction works in general, then apply it to the real return himself inside his secured software. The AI never needs to see a single SSN to be useful.

Now the part people miss most often. There are tasks AI is not allowed to do even when no sensitive data is involved, because they require a licensed professional's judgment and authority. AI cannot sign an audit opinion. AI cannot take a tax position and stand behind it. AI cannot be the authority on a regulatory filing. These are not formatting tasks. They are professional acts that carry legal weight and require a credentialed human to own them. AI can help you think, draft, and check. It cannot be the one accountable. When an auditor relies on an opinion, when a client relies on a tax position, when a regulator receives a filing, a named professional is standing behind that work. A chatbot cannot stand anywhere. It has no license to lose and no duty to uphold, which is precisely why it can never hold the authority.

The fourth boundary ties the others together: AI output is never the system of record. Whatever the tool gives you is a draft, a suggestion, a starting point. The official numbers live in your ledger, your tax software, your filing system, your approved enterprise platform. If a figure matters, it gets verified against the real source and recorded in the real system, every time. AI is a thinking aid sitting beside your work, never the place the truth lives. The moment you treat its output as the authoritative record, you have handed a machine a responsibility that belongs to a person and a controlled system.

So the first move with any AI task is not the prompt. It is the classification question: what kind of data is involved, what kind of judgment does the task require, and where does the answer have to live? Run that check and the boundaries become obvious. Material non-public information stays out. Client and personal data stays out. Anything requiring a licensed professional's sign-off stays with the professional. And the system of record stays the system of record.

This is not a reason to avoid AI. It is the boundary that lets you use it with confidence. Huge amounts of finance work involve none of these traps: explaining a concept, structuring a generic template, rephrasing public information, drafting a policy summary, learning a standard. The professional habit is to make the check a reflex. Before you open the chat box, you already know which bucket your data sits in, whether the task needs a license, and where the real answer must be stored. When you are unsure, you treat it as off-limits and confirm, because the cost of asking is a minute and the cost of guessing wrong can be your license. AI will cheerfully accept whatever you paste and confidently answer whatever you ask. The boundary is yours to hold.

## multiple_choice

```json
{
  "stem": "An analyst has unreleased quarterly earnings figures and wants a public AI assistant to help draft a summary. What does a compliance-first approach require?",
  "options": [
    {
      "id": "a",
      "label": "Paste the figures in, since the AI needs the real numbers to write an accurate summary.",
      "is_correct": false,
      "explanation": "Those figures are material non-public information. Putting them into a public tool discloses them to an outside party before release, which is exactly the exposure insider-trading and Regulation FD rules exist to prevent."
    },
    {
      "id": "b",
      "label": "Keep the unreleased numbers out of the public tool entirely; use AI only for the general structure or wording and apply the real figures yourself after release or inside an approved system.",
      "is_correct": true,
      "explanation": "Correct. Material non-public information never enters a public tool. You can still get help with structure and language using the generic shape of the task, then add the real figures in a cleared environment."
    },
    {
      "id": "c",
      "label": "Paste the figures in but ask the AI to keep them confidential.",
      "is_correct": false,
      "explanation": "A chatbot has no duty or ability to keep your data confidential, and the breach happens the moment the data is transmitted. Asking the tool to be discreet does not undo the disclosure."
    }
  ]
}
```

## reading

The mistakes here rarely come from bad intent. They come from a convenient moment overriding a quiet rule, so it helps to see the exact shapes the trouble takes.

The most common is the "just this once" paste. David, the controller, is on deadline with the draft 10-Q and the language is clunky. He tells himself a single paste to tighten a paragraph is harmless. It is not. The filing is unreleased, market-moving information, and moving it into a public tool is the breach, full stop. Deadlines do not change data classifications. The fix is to copy only the non-sensitive structure of what he needs, or to use an approved enterprise tool with the right agreements in place.

The second mistake is believing cleanup fixes a leak. People think deleting the chat, or turning on a "do not train" setting, makes a sensitive paste safe after the fact. It does not. The data was already transmitted to and processed by a third party the instant you hit enter. The breach happens on input, not on cleanup. The only safe move is to never put the protected data in to begin with.

The third is mistaking partial redaction for safety. Marcus removes the client's name from the tax return but leaves the SSN, the account balances, and the employer. Stripping one identifier while leaving others is not anonymization. Account numbers, SSNs, and specific financial details can re-identify a person on their own. If you cannot fully separate the data from the individual, treat the whole thing as off-limits and work on the abstract shape instead.

The fourth is letting AI quietly become the authority. An accountant asks AI whether a deduction is allowed, likes the confident answer, and puts it straight on the return without checking the actual rule. Now a machine has effectively taken a tax position, and a credentialed human is supposed to own that. AI can help you understand and draft, but the professional must verify against the real authority and stand behind the position. The same goes for audit opinions and regulatory filings: AI assists, the licensed human decides.

The fifth is treating AI output as the record. Someone asks AI to total a set of figures, likes the number, and pastes it into a report as final. AI can make arithmetic and citation errors that look completely confident. The official number has to come from, and be verified against, the real system of record, every time. AI sits beside your ledger. It never becomes your ledger.

The thread through all five is the same. The convenience feels small and the rule feels abstract, right up until it does not. Knowing the line in advance, and holding it even when you are rushed, is the entire skill.

## fill_blank

```json
{
  "template": "Pasting unreleased earnings or a draft filing into a public AI tool is a breach the moment you hit enter, because the harm happens on {{1}}, not on cleanup, and AI output must never be treated as the {{2}}, which always lives in your verified, approved system.",
  "blanks": [
    {"id":"1","accept":["input","the input","transmission","sending"],"ideal":"input"},
    {"id":"2","accept":["system of record","record","source of truth","official record"],"ideal":"system of record"}
  ],
  "explanation": "The breach occurs on input, the moment protected data is transmitted to a third party, so deleting the chat afterward does not help. And AI output is never authoritative: the system of record is the verified, approved place where the real numbers live."
}
```

## before_after [personalizable]

```json
{
  "question": "You want help drafting talking points about a client's situation. Which prompt respects the data boundary while still getting useful help?",
  "before_prompt": "Help me prepare for a meeting with my client Janet Powell. Here are her account holdings and balances: [pastes full statement with name, account number, SSN, and positions].",
  "after_prompt": "I am preparing for a client meeting and want help structuring my talking points. With no client identifiers, account numbers, or personal data, here is the general situation: a retiree with a moderate-risk portfolio that is currently overweight in a single sector and underweight in fixed income relative to their stated goals. Draft a clear, plain-language framework for discussing rebalancing trade-offs, the questions I should raise, and how to explain the reasoning. I will apply the specifics and confirm any figures myself inside our approved system, which stays the system of record.",
  "changes": [
    "Strips the client name, account number, SSN, and live holdings, so no identifiable or regulated data ever enters the tool.",
    "Describes the abstract shape of the situation instead of the real account, which is all the AI needs to help structure the thinking.",
    "Keeps the specifics and final figures inside the approved system, applied and verified by the licensed professional rather than the chatbot."
  ]
}
```

## multiple_choice

```json
{
  "stem": "AI gives you a confident answer about whether a specific tax deduction is allowed for a client. What is the compliance-first way to handle it?",
  "options": [
    {
      "id": "a",
      "label": "Use the AI explanation to understand the concept, then verify the position against the real tax authority and take it yourself, because AI cannot hold a tax position or be the system of record.",
      "is_correct": true,
      "explanation": "Correct. AI can help you understand and draft, but a licensed professional must verify against the actual rule and own the position. The official record lives in your approved system, never in the chatbot's answer."
    },
    {
      "id": "b",
      "label": "Put the AI's answer straight on the return, since it sounded confident and detailed.",
      "is_correct": false,
      "explanation": "Confidence is not authority. AI can be confidently wrong, and letting it set a tax position hands a credentialed professional's responsibility to a machine that has no license and no accountability."
    },
    {
      "id": "c",
      "label": "Ask the AI to confirm it is completely sure, then rely on that confirmation.",
      "is_correct": false,
      "explanation": "A tool reassuring you about its own answer is not verification. The position must be checked against the real authority and owned by the licensed human, not by the AI's self-assessment."
    }
  ]
}
```

## mini_project

Build your own one-page off-limits map before your next AI task, so the boundary is a reflex rather than a judgment call made under deadline pressure. List the categories of information and tasks you handle, then write the single rule for each: what can go into AI, what must never, and where the real answer has to live. Take three real things you might want AI's help with this week and run each through the map, rewriting the off-limits ones so they work on the abstract shape of the problem instead of the live data or the licensed decision. Keep the map somewhere you will see it before you open a chat box.

- For each category (material non-public information, client and personal data, licensed-judgment tasks like audit opinions or tax positions, and general or public work), write one plain rule: out, out, professional-only, or fine to use.
- Take three real tasks from your week, sort each into a category, and for every off-limits one rewrite it to use the generic shape of the problem or name the approved tool it would require.
- For any task that produces a number or position, write down where the verified system of record lives, so AI output is never mistaken for the official answer.
