---
slug: ai-in-finance-quick-p-l-analysis
module: industry-deep-dives
title: "AI in Finance: quick P&L analysis"
level: confident
minutes: 15
order: 5
hook: A P&L that gets filed and forgotten teaches nobody. Here is how to turn one into a fast, decision-driving analysis without handing your judgment to a model.
key_takeaway: Use AI to translate a P&L into a health signal, honest variance explanations, and sharp questions. The model surfaces patterns and frames questions well, but it has no company context, so every interpretation and every figure stays with you.
tags: [finance, data, workflows]
---

## reading

You already know the painful truth about most P&L analysis: it gets produced, it gets emailed, it gets skimmed in the first ninety seconds of a meeting, and then it gets filed and forgotten. The format is the problem. Dense tables, percentage changes with no context, and a narrative paragraph that restates the numbers instead of explaining what to do about them. As an FP&A analyst, a controller, or a finance manager, you are not short on data. You are short on a fast way to turn that data into the three or four things leadership actually needs to discuss. That is exactly where a careful AI workflow earns its place, and exactly where a careless one gets you into trouble.

Picture an FP&A analyst named Dana, prepping a board P&L review for a SaaS company. The board deck is due Thursday. Dana has the quarter close, she has the prior quarter, she has the plan, and she has about three hours. The instinct is to start writing commentary line by line. The better move is to let the model do the first pass of pattern-spotting so Dana can spend her three hours on judgment instead of formatting. The workflow has four moves, and the order matters.

The first move is to anonymize and paste the actual numbers. This sounds trivial and it is the step people skip, which is why their analysis drifts into fiction. If your data is sensitive, replace company identifiers and absolute figures with placeholders or scaled values, but paste the real structure: every line item, both periods, in a clean table the model can read. The reason is simple. A model that is summarizing from a pasted statement is constrained by that statement. A model that is asked to "analyze our Q3" with no numbers will invent a plausible-sounding quarter, and plausible-sounding is the most dangerous output in finance. Paste first, always, so that every figure the model mentions can be traced straight back to a cell you can point to.

The second move is to ask for a bounded, plain-language summary. Bounded is the key word. You are not asking for an essay. Dana might ask for a five-sentence summary covering the overall health signal, the two biggest contributors to the period's performance, any unusual line items, and the trend direction. The boundary forces prioritization. When a model can write as much as it wants, it writes everything, and everything is the same as nothing for a board that has eleven minutes for finance. A tight summary gives Dana a draft of the "so what" that she can then sharpen with the context only she has.

The third move is variance analysis, and this is where you have to frame the request carefully. A controller named Marcus is explaining a margin swing: gross margin dropped four points quarter over quarter and the CFO will ask why. The weak version is to ask the model "why did margin drop." It does not know why. It was not in the room. So Marcus asks instead for each significant variance to come back as two or three possible explanations, a read on whether the move is likely signal or noise, and one clarifying question he should go answer. Now the output is honest about its own limits. It hands Marcus a structured set of hypotheses to test against reality rather than a confident wrong answer he might repeat to the CFO.

The fourth move is decision framing, and the discipline here is to ask for questions, not recommendations. A finance manager named Priya is framing leadership decisions for the next thirty days. She asks the model for the three most important financial decisions leadership should be discussing, each phrased as a question rather than a recommendation. "Should we reallocate the unspent travel budget into demand generation before year end?" is a question Priya's leadership team is equipped to answer. "Reallocate the travel budget" is a recommendation the model has no business making, because it cannot see strategy, timing, cash position, or the conversation that happened in last week's leadership offsite. Questions invite the human judgment; recommendations pretend the judgment is already done.

Hold the whole workflow together with one principle: the model surfaces patterns and frames questions, and you do every interpretation. It can see that marketing rose while revenue stayed flat. It cannot know whether that was a deliberate brand investment with a lag, a one-time event, or a genuine problem. That gap is not a flaw to engineer away. It is the line between what the tool does and what you are paid to do. Used this way, the four moves give Dana, Marcus, and Priya a faster first draft and a sharper set of questions, while every figure still traces to the real statement and every judgment still belongs to a person who understands the business.

## multiple_choice

```json
{
  "stem": "Dana wants the model to draft board commentary from her closed-quarter P&L. What should she do first to keep the output trustworthy?",
  "options": [
    {"id":"a","label":"Describe the quarter in words and let the model reconstruct the likely numbers.","is_correct":false,"explanation":"This invites the model to invent plausible figures. In finance, plausible-but-fabricated is the most dangerous output, because it reads as real."},
    {"id":"b","label":"Paste the actual P&L table, both periods, anonymized if needed, so every figure the model cites traces back to a real cell.","is_correct":true,"explanation":"Correct. Pasting the real structure constrains the model to your data. You can anonymize identifiers and scale figures, but the line items and both periods must be real so nothing is invented."},
    {"id":"c","label":"Ask the model to estimate industry benchmarks and compare her company against them.","is_correct":false,"explanation":"Benchmarks the model recalls from memory are unverifiable and often wrong. That is a separate, riskier task and not the foundation of an honest summary of her own numbers."}
  ]
}
```

## reading

The workflow is simple, but there are a handful of ways confident users still walk it into a wall. Knowing them in advance is most of the protection.

The most common failure is treating the model's framing as a finding. Marcus runs his variance pass and the model writes, "Marketing spend rose forty percent while revenue was flat, a likely inefficiency to address." The phrase "likely inefficiency" feels like a conclusion, so it is tempting to drop it straight into the deck. But the model only saw two numbers move in opposite directions. It has no idea the spend was a deliberate brand campaign with a two-quarter payback. The fix is a habit: read every model conclusion as a question to investigate, never as a verdict to repeat. Detection is the model's job. Interpretation is yours.

The second failure is unbounded prompts. Ask for "a full analysis" and you get three pages that restate the table in sentences. The board does not have time for that, and neither do you on a Thursday. Bound everything: five sentences, three decisions, two to three explanations per variance. The constraint is what produces prioritization, and prioritization is the whole point.

The third failure is asking the model to decide. Priya is tired and types, "Tell me whether we should cut the contractor budget." The model will answer, confidently, and its answer will be a guess wearing the costume of analysis. It cannot see cash runway, the hiring plan, or the commitment leadership made to a client last month. When you ask for a verdict, you get a fluent one, and fluency is easy to mistake for being right. Keep the model framing questions and leave the deciding to the people with context.

The fourth failure is letting figures drift. Someone pastes a P&L, then asks a follow-up question, then a third, and three turns later the model is referencing a "twelve percent decline" that does not appear anywhere in the original statement. Models will paraphrase numbers and occasionally round or recombine them. Before any figure leaves your screen and enters a deck, trace it back to the actual statement. If you cannot point to the cell, the number does not ship.

The last failure is forgetting to anonymize when the data is genuinely sensitive, then over-correcting by pasting nothing at all. Both extremes break the workflow. Pasting raw confidential figures into a tool you do not control is a real risk; pasting a vague description instead is how you get fiction. The middle path is to scale or mask the sensitive parts while preserving the real structure and the real relationships between line items. Get that habit right once and the rest of the workflow stays both safe and honest.

## multiple_choice

```json
{
  "stem": "Marcus's variance pass returns: 'Marketing spend rose forty percent while revenue was flat, a likely inefficiency to address.' What is the right way to use that line?",
  "options": [
    {"id":"a","label":"Treat it as a question to investigate, because the model has no context on timing, strategy, or what the spend was for.","is_correct":true,"explanation":"Correct. A forty percent spend rise with flat revenue could be a deliberate brand investment with a lag, a one-time event, or a real problem. The model detects the pattern; Marcus supplies the context before anything reaches the CFO."},
    {"id":"b","label":"Put 'marketing is inefficient' in the deck, since the model already analyzed it.","is_correct":false,"explanation":"The model saw two numbers, not the strategy behind them. Repeating its framing as a finding is how good analysis turns into a wrong claim in front of leadership."},
    {"id":"c","label":"Drop the observation entirely, because models cannot read financial statements.","is_correct":false,"explanation":"Too far. Spotting that spend rose while revenue stayed flat is a legitimate, useful pattern. The limit is interpretation, not detection."},
    {"id":"d","label":"Ask the model to decide whether the spend was justified.","is_correct":false,"explanation":"It lacks company context, so its verdict would be a guess dressed as analysis. Use it to frame the question; Marcus and his team answer it."}
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same P&L, two prompts. Notice which one produces something a board can actually act on.",
  "before_prompt": "Analyze this P&L and tell me how we did.",
  "after_prompt": "Here is our P&L for Q3, figures anonymized: [paste full table, both periods]. First, write a five-sentence plain-language summary covering the overall health signal, the two biggest contributors, any unusual line items, and the trend direction. Then, for each significant variance, give two to three possible explanations, note whether it is likely signal or noise, and suggest one clarifying question. Finally, frame the three most important decisions leadership should discuss in the next thirty days as questions, not recommendations. Use only the numbers I pasted.",
  "changes": [
    "Pastes the actual data, both periods, and tells the model to use only those numbers, instead of a vague 'how did we do' with nothing to anchor to.",
    "Bounds every output: five sentences, two to three explanations per variance, three decisions, so the result prioritizes instead of restating the table.",
    "Asks for variances framed as signal versus noise plus clarifying questions, and decisions framed as questions, keeping the model out of judgments it has no context to make."
  ]
}
```

## multiple_choice

```json
{
  "stem": "Priya is framing leadership decisions from the P&L for the next thirty days. Which request best fits what the model can responsibly produce?",
  "options": [
    {"id":"a","label":"'Tell me whether we should cut the contractor budget this quarter.'","is_correct":false,"explanation":"This asks for a verdict. The model cannot see cash runway, the hiring plan, or prior commitments, so it returns a confident guess dressed as analysis."},
    {"id":"b","label":"'Recommend the three budget changes we should make based on these numbers.'","is_correct":false,"explanation":"Recommendations pretend the judgment is already done. The model has no strategy or context, so its picks are unanchored. Priya needs questions she can take to people who do have that context."},
    {"id":"c","label":"'Phrase the three most important financial decisions leadership should be discussing as questions, not recommendations.'","is_correct":true,"explanation":"Correct. Questions invite the human judgment and stay inside what the model can do well, which is framing. Priya's leadership team is equipped to answer them; the model is not equipped to decide them."}
  ]
}
```

## mini_project

Pick a real P&L you can work with: your own most recent monthly or quarterly close, or a public company's quarterly earnings release if you would rather not use internal data. Anonymize or scale anything sensitive, keep the structure intact, and run the full four-move workflow on it: paste, bounded summary, variance pass framed as signal versus noise with clarifying questions, and three decisions framed as questions. Then compare the model's framing against how the analysis was originally presented, and stress-test the output for the failures from this lesson.

- Trace every figure the model cites back to a specific line in the original statement, and flag any number you cannot locate.
- Rewrite at least one of the model's "findings" into the investigate-this question it should have been, noting the company context the model was missing.
- Decide which of the three framed questions you would actually put in front of leadership, and write one sentence on why the other two stay off the agenda for now.
