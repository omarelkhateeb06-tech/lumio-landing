---
slug: competitive-research
module: business-workflows
title: "AI-Assisted Research and Competitive Analysis"
level: growing
minutes: 7
order: 8
hook: Turn scattered facts about a competitor into a clear, structured picture you can actually act on.
key_takeaway: Give the AI the raw information you have gathered and a clear framework, and it organizes it into a comparison you can use, as long as you verify the facts yourself.
tags: [general, research, automation]
---

## reading

Understanding your competition or a new market usually means drowning in scattered information: a website here, a review there, a pricing page, a few articles. The work of turning that mess into a clear picture is exactly what AI is good at, if you feed it real material and give it a structure.

The most important rule first: do not ask AI to tell you facts about a specific competitor from memory. It will confidently invent prices, features, and claims that are simply wrong. Instead, gather the real information yourself, then use AI to organize and analyze it.

Here is the workflow that works:

**Gather first.** Collect the raw material: paste in a competitor's pricing page, their about page, a handful of customer reviews, a product description. Real text, not the AI's recollection.

**Give it a framework.** Tell the AI how to organize it. "Based only on the text I pasted, build a comparison of these three competitors across price, target customer, key features, and what customers praise or complain about. Put it in a table."

**Ask for the insight.** Once it is organized, push further. "Based on this, where is there a gap none of them are filling? What do customers consistently complain about across all three?" This is where AI earns its keep, spotting patterns across the material.

The division of labor is clear. You bring the real facts. AI brings the organization and pattern-spotting. And because you gathered the source material, you can trust the analysis far more than if you had let the AI invent it.

Always sanity-check the standout claims against your source material before you put the analysis in front of anyone. Organized does not automatically mean accurate, and you are the one who knows what is real.

## try_it_live [personalizable]

```json
{
  "instructions": "Turn raw competitor material into a structured comparison. Paste real text you have gathered about two or three competitors, or use the sample, and ask for an organized analysis with a framework. Sample: short descriptions of three meal-kit services with their prices and a few customer comments each.",
  "system_prompt": "You are a research analyst helping a non-technical professional. Using only the source text the user provides, organize it into a clear comparison across sensible dimensions (price, target customer, key features, common praise and complaints) and then identify patterns and gaps. Do not add facts that are not in the provided text. If something is not stated, say so. No em dashes.",
  "ideal_output": "Here is a comparison based only on the text you provided.\n\nPrice: A is the cheapest at the entry tier, B sits in the middle, C is premium.\nTarget customer: A targets budget-conscious families, B targets busy couples, C targets foodies who want gourmet options.\nKey features: all three offer weekly boxes; only C offers a chef-designed premium line; only B offers a flexible skip-a-week option mentioned in the text.\nCommon praise: across all three, customers praise ingredient freshness.\nCommon complaints: A and B both get complaints about packaging waste; C gets complaints about price.\n\nPattern and gap: every service is praised for freshness and several are criticized for packaging waste, so an eco-friendly packaging angle is a gap none of them clearly fills based on this text. Note: none of the source text mentions delivery speed, so I cannot compare that.",
  "input_placeholder": "Paste real competitor text and I'll organize and analyze it..."
}
```
