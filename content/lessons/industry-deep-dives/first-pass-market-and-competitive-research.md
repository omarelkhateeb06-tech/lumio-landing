---
slug: first-pass-market-and-competitive-research
module: industry-deep-dives
title: "First-Pass Market and Competitive Research"
level: growing
minutes: 9
hook: Staring at a blank page before a market scan is the slow part. AI gives you a structured first draft in minutes, as long as you treat it as a lead list, not a fact sheet.
key_takeaway: Use AI to scaffold and structure research fast, then verify every claim against a primary source. It is a research accelerator, never the citation.
order: 24
tags: [finance, research, hallucinations]
---

## reading

A first-pass market or competitive scan is mostly structure and starting points: who the players are, what dimensions to compare, which questions to ask, where to look. That scaffolding is slow to build from scratch and fast for AI to draft. Used well, it can turn a blank afternoon into a structured starting point in ten minutes.

The trap is treating that output as the research itself. A model will name competitors, cite market sizes, quote growth rates, and attribute statistics, and a meaningful share of those specifics can be wrong, outdated, or invented outright. It does not know it is guessing. In finance, a fabricated market figure that travels into a model or a memo is not a small error.

So separate the two jobs the AI is doing. The structuring is genuinely useful: "I am sizing the market for SMB payroll software. What dimensions should a competitive comparison cover, what questions should I be asking, and what categories of source would answer them?" That is the part you keep. The factual claims are leads, not findings: every named competitor, every number, every market-size estimate is something you confirm against a primary source, a filing, a reputable industry report, a company's own disclosures, before it enters anything you produce.

Two habits make this safe. Ask the AI for its reasoning and its source categories rather than just answers, so you know what to go verify. And keep a hard wall between the draft and the deliverable: the AI's scan organizes your search, and only sourced, confirmed facts cross into the work product. Done this way, you get the speed of an instant structure with none of the risk of citing a number that was never real.

## try_it_live

```json
{
  "instructions": "Use the AI to scaffold a research scan, not to supply the facts. Describe the market or competitor question, and ask for structure, questions, and source categories. Or use the sample: a first-pass competitive scan of the small-business payroll software market.",
  "system_prompt": "You are a research planning partner for a finance professional doing a first-pass market or competitive scan. Your role is to structure the research, not to supply facts. Provide: the dimensions a comparison should cover, the key questions to investigate, and the categories of primary source that would answer each question. If you mention any specific company, market size, or statistic, explicitly label it as 'unverified, confirm against a primary source' because your figures may be outdated or wrong. Never present a number as established fact. Encourage the user to treat every specific as a lead to verify. No jargon, no em dashes.",
  "ideal_output": "Here is a structure for a first-pass scan of the SMB payroll software market. I have kept this to a research plan. Treat any company or figure I mention as an unverified lead to confirm against a primary source.\n\nDimensions to compare: pricing model and per-employee cost, target business size, core features versus add-ons, integrations with accounting tools, compliance and tax-filing coverage, and customer support model.\n\nKey questions to investigate: How large is the SMB segment specifically, versus mid-market and enterprise? What is the realistic growth rate, and from which source? Where do incumbents lose customers, and why? What does it cost a new entrant to meet payroll-tax compliance across jurisdictions?\n\nSource categories that would answer these: company pricing pages and filings for the players, recognized industry research reports for sizing and growth, review platforms for switching reasons, and regulatory or tax-authority sites for compliance scope.\n\nA few names often associated with this space exist, but I am not listing them as fact here. Pull the current set from a reputable industry source. Want me to turn this into a comparison template you can fill with verified data?",
  "input_placeholder": "Describe the market or competitor you are researching..."
}
```

## multiple_choice

```json
{
  "stem": "Your AI scan returns a tidy table of five competitors with market shares and growth rates. How should you treat it?",
  "options": [
    {
      "id": "a",
      "label": "As a lead list to verify: confirm each competitor, share, and growth figure against a primary source before any of it enters your work product.",
      "is_correct": true,
      "explanation": "Correct. The structure is useful, but the specific facts can be wrong, stale, or invented. Every named player and number is a lead to confirm against filings or reputable reports, never a finding to cite as is."
    },
    {
      "id": "b",
      "label": "As finished research, since the table is specific and well organized.",
      "is_correct": false,
      "explanation": "Specificity and tidy formatting are not evidence of accuracy. A model can produce a confident, well-structured table full of fabricated shares. Organized is not the same as verified."
    },
    {
      "id": "c",
      "label": "As proof the market is exactly that size, because the AI would not invent precise percentages.",
      "is_correct": false,
      "explanation": "Precise percentages are exactly the kind of thing models invent. A clean number is not a sourced number. It still requires confirmation against a primary source."
    }
  ]
}
```

## mini_project

Pick a real market or competitor question you need to scope. Ask the AI only for structure: the comparison dimensions, the questions to investigate, and the categories of source that would answer them, with any specific name or figure flagged as unverified. Now build a two-column working doc: on the left, the AI's structure and any leads it surfaced; on the right, the same items only after you have confirmed them against a primary source you can name. Notice how fast you got to a usable research plan, and how many of the AI's confident specifics changed, vanished, or needed correction once you checked them against the real source.
