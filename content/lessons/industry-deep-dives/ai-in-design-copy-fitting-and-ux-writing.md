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

## multiple_choice

```json
{
  "stem": "A user's payment fails. Which error message best follows the rules in this lesson (say what happened, what to do next, do not make them feel stupid)?",
  "options": [
    {
      "id": "a",
      "label": "\"Your payment didn't go through. Check your card details or try another card, and we'll keep your cart saved.\"",
      "is_correct": true,
      "explanation": "Correct. It says what happened in plain language, gives a clear next action, and reassures rather than blames. The saved-cart line removes the fear of losing progress."
    },
    {
      "id": "b",
      "label": "\"Error 402: Transaction declined.\"",
      "is_correct": false,
      "explanation": "A status code tells the user nothing they can act on and feels cold. Plain language and a next step are missing."
    },
    {
      "id": "c",
      "label": "\"Payment failed. Please ensure you entered everything correctly this time.\"",
      "is_correct": false,
      "explanation": "\"This time\" subtly blames the user. The rule is to never make them feel stupid; a failed payment is usually not their mistake."
    },
    {
      "id": "d",
      "label": "\"Something went wrong.\"",
      "is_correct": false,
      "explanation": "Too vague. It names neither what happened nor what to do, which leaves the user stuck."
    }
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Copy-fit under a hard constraint. Rewrite this empty-state heading so it fits in 32 characters, stays friendly, and still tells a first-time user what this screen is for. Original: 'You don't have any projects yet, but you can create one to get started.'",
  "system_prompt": "You are a UX writer. Rewrite UI copy to fit a strict character limit while keeping it warm, plain, and clear about what the user should do. Count characters carefully and never exceed the limit. Offer a few options. No em dashes.",
  "ideal_output": "Here are three options, each at 32 characters or fewer:\n1. \"No projects yet. Create your first\" (33, trim to \"No projects yet. Add your first\" = 31)\n2. \"Start your first project\" (24)\n3. \"Nothing here yet. Make one\" (26)\nOption 2 is the cleanest: it is an action, it is friendly, and it fits comfortably.",
  "input_placeholder": "Paste the UI string and the character limit it has to fit..."
}
```

## mini_project

Your 5-minute exercise: Find 5 UI strings in a product you use or work on. Run them through the consistency audit prompt. How many fail the check?
