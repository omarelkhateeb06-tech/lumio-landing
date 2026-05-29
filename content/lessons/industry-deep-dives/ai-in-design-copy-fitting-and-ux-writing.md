---
slug: ai-in-design-copy-fitting-and-ux-writing
module: industry-deep-dives
title: AI in Design: copy-fitting and UX writing
level: confident
minutes: 9
order: 3
hook: UI copy is often treated as an afterthought, which is why most products sound like error message generators.
key_takeaway: Set the tone system prompt once, then use AI to generate, fit, and audit UX copy. The model is faster at 32-character constraints than any human.
tags: [general, writing, editing, workflows]
---

## reading

UX writing (the words inside product interfaces) is disproportionately impactful and disproportionately neglected. Button labels, error messages, empty states, onboarding copy: these are often written in 10 minutes by the engineer who built the component.

**AI for UX writing:**

**Tone system prompt:** *"You are a UX writer for [product]. Our voice is [3 adjectives]. We speak to [audience]. We never use [banned phrases]. Use these principles for every output."*

**Copy-fitting:** When space is constrained: *"I need this copy to fit in 32 characters: '[current copy]'. The message must convey [key meaning]. Give me 5 options."*

**Error messages:** *"Write 3 options for an error message when a user's payment fails. Each should: say what happened in plain language, tell them what to do next, and not make them feel stupid. Under 2 lines."*

**Empty states:** *"Write copy for an empty state when a user first lands on their dashboard with no data. Should be friendly, explain what they'll see here, and give one clear action."*

**Consistency audit:** *"Here are all the button labels from our product: [paste]. Flag any that are inconsistent in verb tense, length, or formality."*

Good UX copy is invisible when it's right and painful when it's wrong.

## mini_project

Your 5-minute exercise: Find 5 UI strings in a product you use or work on. Run them through the consistency audit prompt. How many fail the check?
