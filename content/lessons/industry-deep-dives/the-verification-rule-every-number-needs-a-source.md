---
slug: the-verification-rule-every-number-needs-a-source
module: industry-deep-dives
title: "The Verification Rule: Every Number Needs a Source"
level: growing
minutes: 15
hook: AI will hand you a confident, specific, wrong number. The finance professionals who trust AI are the ones who never trust a figure without a source behind it.
key_takeaway: Treat every figure AI produces as a claim to verify against a primary source, never as a fact. Build the cite-and-check habit into every AI-assisted finance task.
order: 21
tags: [finance, data, hallucinations]
---

## reading

Here is something that should worry you a little, in a useful way. An AI model does not know your numbers. It has never seen your ledger, your bank feed, or last quarter's audited statement. So when you ask it "what was our gross margin" and it answers "roughly 72 percent," it did not look anything up. It produced text that statistically resembles an answer. The frightening part is not that it guesses. It is that it guesses in the calm, precise, confident voice of something that checked. And in finance, a confident wrong number is far more dangerous than an obvious blank.

Picture Dana, an FP&A analyst building the quarterly board deck on a Sunday night. She is tired, the meeting is at eight, and she asks the AI to "summarize the revenue trend and give me the year-over-year growth figure." It hands her "revenue grew 18.4 percent year over year, driven by strong enterprise expansion." That sentence is perfect. It is specific, it sounds like her business, and it slots cleanly into slide four. The only problem is that the model invented 18.4 percent. The real figure, sitting in her actual export, is 11 percent. Nobody at the table will know the difference until a board member who runs the numbers asks a follow-up question Dana cannot answer, and suddenly the whole deck feels untrustworthy.

This is the core idea of the lesson, and it is worth saying plainly. Every number an AI gives you is a claim, not a fact. A claim is something you check. A fact is something you have already checked. The verification rule is simply this: no figure leaves your hands until you have traced it back to a real source, the actual statement, the actual ledger, the actual filing, the actual export. The number the AI asserted is a hypothesis. The number in your source document is the truth. You report the second one.

It helps to understand exactly how the failure happens, because it is not random. AI fabricates in three predictable ways, and once you can name them, you can catch them. The first is the hallucinated figure: a revenue number, a cash balance, a headcount cost that the model simply made up because you asked and it wanted to answer. The second is the invented benchmark: "a healthy current ratio for your industry is 1.8," stated as if it came from a study, when it came from nowhere in particular. The third is the quiet arithmetic error: you paste real numbers and ask the model to compute, and it transposes a digit, misapplies a formula, or sums a column wrong. That third one is the sneakiest, because the inputs were real, so the output feels real too.

Now, none of this means AI is useless with numbers. That would be the wrong lesson, and it would cost you a genuinely powerful tool. AI is excellent at the work around the numbers. It can explain why two figures might differ. It can draft the narrative that surrounds a table you already built. It can restructure data you pasted, walk you through a calculation method so you can apply it yourself, or help you write the commentary for a variance you have already verified. The line is clean once you see it. AI is wonderful at describing numbers and dangerous at being the place numbers come from.

So draw that line hard in your own workflow. Numbers that originate in a real source, your accounting system, a bank feed, an audited statement, a filing, are trustworthy, and AI can help you talk about them all day. Numbers the model produces from memory or estimation are drafts to verify, never values to report. And when you paste your own data and ask the AI to compute something, you still check the math by hand, because the model can transpose a digit as easily as it can write a clean sentence. The figure is yours to stand behind, which means it is yours to confirm.

Think about Marcus, a controller closing the month. He asks the AI to help reconcile an account and it tells him "the difference of 4,200 is explained by the timing of the vendor accrual." That might be true. It might also be a complete fabrication that happens to sound plausible. The disciplined move is the same every time: he opens the actual accrual entry, looks at the actual dollar amount, and confirms it himself. If it matches, great, the AI saved him time framing the explanation. If it does not, he just caught a number that would otherwise have gone into the close with a confident story attached to it.

The habit you are building is a reflex, and reflexes are simple by design. Every time a number appears in something AI wrote for you, a quiet alarm goes off, and you ask one question: where did this come from. If you can point to the source document, the number stays. If you cannot, the number is a draft, and a draft does not go into a board deck, a filing, a covenant calculation, or a client email. That single question, asked every time, is what separates the finance professionals who use AI safely from the ones who get burned by it.

## multiple_choice

```json
{
  "stem": "Dana, an FP&A analyst, asks AI for the year-over-year revenue growth figure and pastes its answer of 18.4 percent straight into the board deck. Why does this lesson treat that as a serious mistake?",
  "options": [
    {
      "id": "a",
      "label": "The AI produced that figure from prediction, not from any source, so it is an unverified claim that must be traced to her real revenue export before it can be reported.",
      "is_correct": true,
      "explanation": "Correct. The model never saw Dana's numbers. A figure that originates inside the AI is a hypothesis, not a value of record, and in finance every reported number must trace back to a real source first."
    },
    {
      "id": "b",
      "label": "The figure is fine to use because modern AI tools connect to company financial systems automatically.",
      "is_correct": false,
      "explanation": "A general AI tool has no live link to Dana's ledger or export. Assuming it knows her actual revenue is exactly the trap that puts an invented number in front of the board."
    },
    {
      "id": "c",
      "label": "The only issue is that she should have asked the AI for more decimal places to make the growth rate more precise.",
      "is_correct": false,
      "explanation": "Precision is not the problem. A confidently precise figure like 18.4 percent can be entirely fabricated. The fix is sourcing the number against her export, not formatting it more finely."
    },
    {
      "id": "d",
      "label": "Board decks should never contain growth figures at all, so any number here would be wrong.",
      "is_correct": false,
      "explanation": "Growth figures absolutely belong in a board deck. The lesson is not to remove numbers, it is to verify each one against a real source before it appears."
    }
  ]
}
```

## reading

The verification rule sounds obvious on a calm afternoon. It breaks down in the exact moments it matters most, so it helps to know where it usually goes wrong.

The first failure is the deadline override. When the meeting is in twenty minutes and the AI hands you a clean, specific number, the temptation to just use it is enormous. The figure looks right, it fits the slide, and checking it feels like a luxury you cannot afford. This is precisely when an unverified number slips through, because pressure is the enemy of the cite-and-check habit. The fix is to make verification non-negotiable rather than optional, the same way you would never skip tying out a control just because you were busy.

The second failure is trusting the math because the inputs were real. A bookkeeper named Priya pastes her actual receivables aging into the AI and asks it to total the over-90-day bucket. The inputs came from her real system, so when the model returns a sum, it feels sourced. It is not. The model could have added a column wrong or dropped a row. Real inputs do not make the output verified. You still re-add the bucket yourself, because the arithmetic is a separate claim from the data.

The third failure is the invented benchmark dressed up as authority. The AI tells you "a current ratio above 2.0 is considered healthy for your sector" and it sounds researched, so you repeat it to a client as if it were established fact. The model did not consult a study. If a benchmark matters to a decision, it needs a real source you can name, not a confident sentence from a tool that cannot cite where the number came from.

The fourth failure is the silent edit. You give the AI your real figures and ask it to write the narrative, and it quietly adds a number you never provided, a percentage, a total, a comparison, woven so smoothly into the prose that you read right past it. The defense is to instruct the model never to introduce figures you did not supply, and then to scan its output specifically for any number you do not recognize.

The thread running through all four is the same. The danger is never that AI is obviously wrong. It is that AI is plausibly, confidently, specifically wrong, in your own language, at the worst possible moment. Verification is the one habit that holds up under all of it.

## fill_blank

```json
{
  "template": "Every number an AI produces should be treated as a {{1}} to verify against a real source, never as a {{2}} you can report without checking.",
  "blanks": [
    {"id":"1","accept":["claim","hypothesis","draft","guess"],"ideal":"claim"},
    {"id":"2","accept":["fact","truth","value of record","source of truth"],"ideal":"fact"}
  ],
  "explanation": "The heart of the verification rule is the distinction between a claim and a fact. A figure the AI generates is a claim you must trace to a primary source. Only after you confirm it against the actual ledger, statement, or export does it become a fact you can stand behind."
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Practice writing a prompt that keeps the numbers verifiable instead of invented. Imagine you want AI's help reporting last quarter's gross margin. The wrong move is to ask the AI to recall or estimate the figure. The right move is to supply your own real numbers from a source export and ask it only to compute and explain, with the formula shown so you can check it by hand. Try this sample: you have revenue of 2,480,000 and cost of revenue of 690,000 from your accounting export, and you want gross margin plus a short, clearly labeled note on how that margin reads for a SaaS business.",
  "system_prompt": "You are a careful finance assistant helping a non-technical professional report a figure safely. Never recall, estimate, or invent any financial number. Use only the figures the user explicitly provides. When asked to calculate, show the full formula and the steps so the user can verify the math by hand. If you add any general commentary, clearly label it as general context and not a benchmark specific to the user's company. Never introduce a number the user did not supply. Be warm, plain, and brief. No em dashes.",
  "ideal_output": "Here is your gross margin from the figures you provided. Formula: gross margin = (revenue minus cost of revenue) divided by revenue. Steps: revenue 2,480,000 minus cost of revenue 690,000 equals gross profit of 1,790,000. Then 1,790,000 divided by 2,480,000 equals 0.7218, or about 72.2 percent. You can re-run those two steps yourself to confirm them. General context, not a benchmark for your company: a gross margin in this range is often read as strong for a software business, where the cost to serve each customer tends to be low. Treat that as a rough frame only and check any real benchmark against a named source. I have not added any figures beyond the two you gave me.",
  "input_placeholder": "Paste your real revenue and cost of revenue, then ask for the margin and the formula..."
}
```

## multiple_choice

```json
{
  "stem": "Priya, a bookkeeper, pastes her actual receivables aging from her real accounting system into the AI and asks it to total the over-90-day bucket. The inputs were real, so what should she do with the total the AI returns?",
  "options": [
    {
      "id": "a",
      "label": "Report it as final, since the data came straight from her real system and was not invented by the AI.",
      "is_correct": false,
      "explanation": "Real inputs do not make the output verified. The arithmetic is a separate claim from the data, and the model can add a column wrong or drop a row even when the source numbers are genuine."
    },
    {
      "id": "b",
      "label": "Re-add the over-90-day bucket herself, because the calculation is a separate claim that needs checking even though the input data was sourced.",
      "is_correct": true,
      "explanation": "Correct. Sourcing the inputs is only half the job. The total is its own claim, and a model can transpose a digit or misadd a column as easily as it writes clean prose, so the math gets checked by hand."
    },
    {
      "id": "c",
      "label": "Ask the AI a second time and trust the answer if both totals match.",
      "is_correct": false,
      "explanation": "Two passes from the same model can repeat the same error confidently. Agreement between AI runs is not verification. The only reliable check is re-doing the arithmetic against the real data herself."
    },
    {
      "id": "d",
      "label": "Trust it because totaling a column is too simple for an AI to get wrong.",
      "is_correct": false,
      "explanation": "Simple arithmetic is exactly where quiet errors hide. A dropped row or transposed digit in a long aging report is easy to miss, which is why the bucket gets re-added by hand."
    }
  ]
}
```

## mini_project

Take one report or summary you produce regularly that contains figures, a board slide, a month-end memo, a client update, anything with numbers in it. Your job is to run the verification rule across it from top to bottom and feel the difference between a number you can stand behind and one that merely sounds right.

- For every single number in the document, mark exactly where it came from: a system export, a statement, a feed, or honestly "not sure," and treat every "not sure" as the real finding worth fixing.
- For the numbers that do have a real source, try using AI to draft the surrounding narrative by pasting the figures in rather than asking it to recall them, and then scan its output for any number you did not provide.
- Re-do by hand at least one calculation the AI performed for you, even a simple total, so you experience checking arithmetic as a separate step from sourcing the data.
