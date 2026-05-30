---
slug: data-cleaning-for-the-spreadsheet-phobic
module: business-workflows
title: Data cleaning for the spreadsheet-phobic
level: growing
minutes: 10
order: 3
hook: You don't need to know Excel formulas if you can describe what you want in plain English.
key_takeaway: Describe the data problem in plain English with a sample. You don't need formulas when you can tell the model exactly what the data should look like.
tags: [general, data, workflows]
---

## reading

Data cleaning (removing duplicates, standardizing formats, filling gaps, reshaping tables) is the part of analytics work that takes the most time and delivers the least insight. It's also the part AI handles remarkably well.

**The plain English approach:**

Instead of learning VLOOKUP or writing Python, describe what you want. Paste a sample of your data (10–20 rows is enough) and explain the problem:

*"I have a CSV with customer names in inconsistent formats (some 'First Last', some 'Last, First'). I need them all as 'First Last'. Here's a sample: [paste]. Give me: 1) An Excel formula to standardize column A, 2) A Python pandas snippet for batch processing, 3) A list of rows I need to manually review."*

**What this handles well:**
- Format standardization (dates, phone numbers, names)
- Duplicate detection logic
- Missing value imputation rules
- Table reshaping (wide to long, long to wide)

**What to verify:** Always spot-check 10 random rows after running any AI-generated formula. Edge cases (unusual characters, empty cells) can produce unexpected results.

You don't need to become a data analyst. You need to describe your data problem clearly.

## multiple_choice

```json
{
  "stem": "You ran an AI-generated formula to standardize a column of customer names. What does this lesson tell you to do before trusting the result?",
  "options": [
    {
      "id": "a",
      "label": "Spot-check about 10 random rows, because edge cases like unusual characters or empty cells can produce unexpected results.",
      "is_correct": true,
      "explanation": "Correct. AI handles the bulk transformation well, but odd inputs slip through. Checking a sample of rows is the safety net that catches the cases the formula mishandled."
    },
    {
      "id": "b",
      "label": "Nothing, because describing the problem in plain English means the formula is guaranteed correct.",
      "is_correct": false,
      "explanation": "Plain-English description makes the formula easy to generate, not guaranteed correct. Edge cases still need a spot-check before you rely on the output."
    },
    {
      "id": "c",
      "label": "Re-learn the underlying Excel or pandas syntax so you can audit every cell by hand.",
      "is_correct": false,
      "explanation": "The whole point is you do not need to master the syntax. A quick spot-check of a sample of rows is enough to catch the edge cases without auditing everything manually."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Find a messy spreadsheet. Pick one specific cleaning problem. Paste a sample and run the prompt above. Does it solve the problem?
