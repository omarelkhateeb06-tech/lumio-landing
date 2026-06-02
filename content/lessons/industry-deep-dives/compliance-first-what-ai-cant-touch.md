---
slug: compliance-first-what-ai-cant-touch
module: industry-deep-dives
title: "Compliance First: What AI Can't Touch"
level: growing
minutes: 8
hook: The fastest way to turn a productivity win into a regulatory incident is to paste the wrong thing into a chat box. In finance, what you put in matters as much as what you get out.
key_takeaway: Before AI touches any task, know your data classifications and the line you cannot cross. Material non-public, client, and regulated data stay out of unapproved tools, no exceptions.
order: 23
tags: [finance, data, fundamentals]
---

## reading

Most AI guidance focuses on getting better output. In finance, the more urgent skill is knowing what you are allowed to put in. A public AI tool is, by default, a third party you are sharing data with. Paste a client's portfolio, a draft earnings figure before release, or personal financial information into the wrong tool, and you have not just made a mistake. You may have created a disclosure, a privacy breach, or an insider-information problem.

So the first move with any AI task is not the prompt. It is the classification question: what kind of data is involved, and where is it allowed to go? Material non-public information, the numbers before they are announced, never goes into a general tool. Client and customer data covered by privacy rules stays inside approved systems. Anything your firm classifies as confidential follows your firm's policy, not your convenience.

This is not a reason to avoid AI. It is the boundary that lets you use it safely. Enormous amounts of finance work involve no sensitive data at all: drafting a policy explanation, learning a concept, structuring a generic template, rephrasing public information. And where the data is sensitive, the answer is often to abstract it, work with the shape of the problem rather than the live figures, or to use an approved enterprise tool with the right data agreements in place.

The professional habit is to make this a reflex, not an afterthought. Before you open the chat box, you already know which bucket your data sits in and which tools are cleared for it. When you are unsure, you treat it as sensitive and check, because the cost of asking is a minute and the cost of guessing wrong can be your license. AI cannot make this judgment for you. It will cheerfully accept whatever you paste. The boundary is yours to hold.

## multiple_choice

```json
{
  "stem": "You want to use a public AI assistant to help analyze a client's investment portfolio before a meeting. What does a compliance-first approach require?",
  "options": [
    {
      "id": "a",
      "label": "Keep the client's identifiable and regulated data out of the public tool; either abstract the problem to its general shape or use an approved enterprise tool cleared for that data.",
      "is_correct": true,
      "explanation": "Correct. Client and regulated data does not belong in an unapproved third-party tool. You either work with the generic shape of the question or move to a system with the right data agreements in place."
    },
    {
      "id": "b",
      "label": "Paste the full portfolio in, since the AI needs the real holdings to give useful analysis.",
      "is_correct": false,
      "explanation": "That shares regulated client data with a third party by default and can breach privacy obligations. The need for 'useful analysis' never overrides the data boundary."
    },
    {
      "id": "c",
      "label": "Go ahead as long as you delete the chat history afterward.",
      "is_correct": false,
      "explanation": "Deleting your view of the chat does not undo the fact that the data was transmitted and processed by a third party. The breach happens on input, not on cleanup."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "You want help drafting talking points about a client's situation. Which prompt respects the data boundary while still getting useful help?",
  "before_prompt": "Help me prepare for a meeting with my client Janet Powell. Here are her account holdings and balances: [pastes full statement with name, account number, and positions].",
  "after_prompt": "I am preparing for a client meeting and want help structuring my talking points. Without any client identifiers, here is the general situation: a retiree with a moderate-risk portfolio that is currently overweight in a single sector and underweight in fixed income relative to their stated goals. Draft a clear, plain-language framework for discussing rebalancing trade-offs, the questions I should raise, and how to explain the reasoning. I will apply the specifics myself from our approved system.",
  "changes": [
    "Strips the client name, account number, and live holdings, so no identifiable or regulated data enters the tool.",
    "Describes the shape of the situation instead of the actual account, which is all the AI needs to help structure thinking.",
    "Keeps the specifics inside the approved system where they belong, applied by the professional.",
    "Turns the request into framework and reasoning, the safe part AI is genuinely good at."
  ]
}
```

## mini_project

Write your own one-page data map before your next AI task. List the categories of information you handle, for example public or general knowledge, internal but non-sensitive, confidential, client or personal data, and material non-public information. For each category, write the single rule: which tools, if any, it can go into. Then take three real tasks you might want AI's help with this week and sort each into a category using your map. For the sensitive ones, rewrite the task so it works on the abstract shape of the problem instead of the live data, or note which approved tool it would require. Keep the map somewhere you will see it before you open a chat box.
