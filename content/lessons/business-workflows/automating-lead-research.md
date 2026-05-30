---
slug: automating-lead-research
module: business-workflows
title: Automating lead research
level: growing
minutes: 9
order: 1
hook: Your sales team is spending 40% of their time on research that could be done in 10 minutes per lead.
key_takeaway: Context dump + research prompt + personalization brief: 10 minutes of structured AI research outperforms 30 minutes of manual tab-switching.
tags: [general, research, workflows]
---

## reading

Lead research before an outreach or discovery call typically involves: checking the company website, skimming the LinkedIn profile, reading recent news, and trying to find a hook. Manually, this takes 20–30 minutes per lead. With a structured AI workflow, it takes 8–10.

**The lead research stack:**

**Step 1: Context dump.** Paste what you know: the company name, the contact's LinkedIn bio, any recent news you found.

**Step 2: Research prompt.** *"I'm preparing for an outreach to [contact] at [company]. Based on the context provided: 1) What are the likely pain points for someone in this role? 2) What business context should I know? 3) What are 3 potential hooks? 4) What one question would be most valuable to understand before this call?"*

**Step 3: Personalization brief.** *"Now write a 3-sentence opening for an outreach email that references the most specific and relevant point above. Don't be generic."*

The full workflow takes 10 minutes per lead. At 20 leads/week, that's 3–4 hours saved, hours that go back into actual relationship-building.

## before_after [personalizable]

```json
{
  "question": "You are prepping outreach to a prospect. One prompt invites the model to guess, the other grounds it in what you found. Notice what you paste in.",
  "before_prompt": "Tell me about Jordan Lee, the VP of Operations at Northwind Logistics, and write me an outreach email.",
  "after_prompt": "I'm preparing outreach to Jordan Lee, VP of Operations at Northwind Logistics. Here is what I gathered: [paste their LinkedIn bio, the company about page, and a recent news item]. Based only on this context: 1) What are the likely pain points for someone in this role? 2) What business context should I know? 3) Give me three potential hooks. 4) What one question would be most valuable to understand before a call? Then write a three-sentence opening that references the most specific point and is not generic.",
  "changes": [
    "Pastes in real gathered material instead of asking the model to recall facts about a specific person, which it would otherwise invent.",
    "Structures the research into role pain points, context, hooks, and the key question, so ten minutes of AI work replaces thirty of tab-switching.",
    "Asks for a personalized opening anchored to a specific point, so the outreach lands as researched rather than mass-produced."
  ]
}
```

## mini_project

Your 5-minute exercise: Pick a real prospect you're planning to reach out to. Run the 3-step research stack above. How does the output compare to what you'd have found in 20 minutes of manual research?
