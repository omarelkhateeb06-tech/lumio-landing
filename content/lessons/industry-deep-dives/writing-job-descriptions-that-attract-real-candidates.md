---
slug: writing-job-descriptions-that-attract-real-candidates
module: industry-deep-dives
title: "Writing Job Descriptions That Attract Real Candidates"
level: growing
minutes: 8
hook: Most job descriptions are a wishlist copied from the last one, written for the company and not the candidate. AI can help you write one that the right person actually wants to answer.
key_takeaway: Give AI the real role, the must-haves versus nice-to-haves, and your audience, and it drafts a clear, inclusive posting you refine, so you stop scaring off the candidates you want.
order: 26
tags: [hr, hiring, writing]
---

## reading

Job descriptions tend to be written backwards. Someone opens the last version for a similar role, swaps a few lines, and posts it. The result is a list of demands aimed at the company's convenience, twenty bullet points, a decade of required experience for a mid-level job, jargon only an insider would parse. The strong, qualified candidate reads it, decides they only meet eight of the twenty bullets, and does not apply. The posting did its job too well: it filtered out the people you wanted.

AI is good at this exact rewrite, because the problem is one of clarity, framing, and tone, not facts you have to supply from outside. You bring the substance, what the role actually does, which requirements are genuine must-haves versus nice-to-haves, what makes the team worth joining, and the model turns it into a posting written for the reader.

A strong prompt names the audience and the goal. "Draft a job description for a mid-level operations analyst. Here is what the role really does day to day. These three things are true must-haves; everything else is nice-to-have. Write it to attract a capable candidate who may not tick every box, in plain language, and keep the requirements honest and short." The shift from a wishlist to a clear, inviting description is exactly the kind of move AI makes fast.

Two cautions. Watch for inflated or exclusionary requirements the model may import from generic templates, like an unnecessary degree or an inflated years-of-experience figure, because those quietly shrink and skew your applicant pool. And review the language for inclusivity and accuracy: the posting has to honestly describe the real job, and it has to invite the broadest qualified pool rather than coded language that narrows it. You decide what the role truly requires. AI just helps you say it in a way the right person wants to answer.

## before_after [personalizable]

```json
{
  "question": "You need a posting for a mid-level operations analyst. Which prompt produces a description that attracts strong candidates instead of filtering them out?",
  "before_prompt": "Write a job description for an operations analyst.",
  "after_prompt": "Draft a job description for a mid-level operations analyst. Day to day, the role pulls weekly performance data, builds simple dashboards, and flags process bottlenecks to the ops team. The genuine must-haves are comfort with spreadsheets, clear written communication, and one to two years in an analytical role. Everything else, SQL, a specific tool, a degree, is a nice-to-have, not a requirement. Write it in plain language to attract a capable candidate who may not tick every box, keep the requirements list short and honest, and avoid jargon or inflated experience asks. Lead with what makes the work interesting.",
  "changes": [
    "Describes what the role actually does, so the posting reflects the real job rather than a generic template.",
    "Separates true must-haves from nice-to-haves, which stops the requirement list from filtering out strong applicants.",
    "Names the audience and goal: attract a capable candidate who may not meet every line.",
    "Explicitly bars jargon and inflated experience asks that quietly shrink and skew the pool."
  ]
}
```

## multiple_choice

```json
{
  "stem": "The AI-drafted posting lists 'bachelor's degree required' and '7+ years experience' for a role you know a strong two-year candidate could do. Why does this lesson treat that as a problem to fix?",
  "options": [
    {
      "id": "a",
      "label": "Inflated or unnecessary requirements quietly shrink and skew the applicant pool, filtering out qualified people the role does not actually need to exclude.",
      "is_correct": true,
      "explanation": "Correct. Generic templates import demands that are not real must-haves. Left in, they discourage strong candidates from applying. You decide what the role truly requires and cut the rest."
    },
    {
      "id": "b",
      "label": "It is fine, because higher requirements always produce higher-quality applicants.",
      "is_correct": false,
      "explanation": "Higher bars do not mean better hires; they mean fewer and narrower applicants. An inflated requirement screens out capable people the job did not actually need to exclude."
    },
    {
      "id": "c",
      "label": "The only issue is that the posting should list even more requirements to be thorough.",
      "is_correct": false,
      "explanation": "More requirements make the problem worse. The goal is an honest, short list of genuine must-haves, not an exhaustive wishlist that deters the right candidates."
    }
  ]
}
```

## mini_project

Take a real job description you use, ideally one for a role you struggle to fill. Before touching the AI, mark each requirement as a genuine must-have or a nice-to-have, and be honest about which inflated lines crept in from old templates. Feed the AI the real day-to-day of the role, your honest must-have list, and what makes the team worth joining, and ask for a plain-language posting aimed at a capable candidate who may not tick every box. Then review the draft for any requirement that would wrongly exclude someone and any coded or exclusionary language. Compare it to your original and notice how many strong applicants the old version was quietly turning away.
