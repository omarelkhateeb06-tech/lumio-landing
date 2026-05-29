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

## mini_project

Your 5-minute exercise: Find a messy spreadsheet. Pick one specific cleaning problem. Paste a sample and run the prompt above. Does it solve the problem?
