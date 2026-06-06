---
slug: first-pass-market-and-competitive-research
module: industry-deep-dives
title: "First-Pass Market and Competitive Research"
level: growing
minutes: 15
hook: The slow part of a market scan is the blank page, not the thinking. AI gives you the map and the question list in minutes, as long as you treat every figure it produces as a lead to verify, never a fact to cite.
key_takeaway: Use AI to build the structure of your research fast: the questions, the categories, the comparison dimensions. Then confirm every fact, figure, and competitor claim against a primary source before it crosses into a memo or model.
order: 24
tags: [finance, research, hallucinations]
---

## reading

Picture a Tuesday afternoon. You are a corporate development analyst, and your VP just dropped a new industry on your desk: vertical software for the dental industry. The board wants a sizing memo by Friday. You have never looked at this market in your life. The slow, miserable part of this job is not the thinking. It is the blank page. What are the players? What dimensions even matter here? What questions should you be asking? Where do you start? That orientation work, the scaffolding of the research, is exactly what AI does well, and it can turn a paralyzed afternoon into a structured starting point in about ten minutes.

So let us be precise about what AI is genuinely good for here, because the line matters more in this lesson than almost anywhere else. AI is excellent at generating the structure of research. Ask it, "I am sizing the market for dental practice management software. What dimensions should a competitive comparison cover, what questions should I be asking the data, and what categories of source would answer each one?" and you will get back a real map. It will suggest you compare on pricing model, target practice size, feature depth, integrations, and switching costs. It will remind you to separate the small-practice segment from large dental service organizations. It will point you toward the kinds of sources that hold the answers: company pricing pages, industry reports, review platforms, regulatory filings. That map is worth keeping. It is the part that saves you the afternoon.

## multiple_choice

```json
{
  "stem": "An AI returns a strong research map for the dental software market: dimensions to compare, questions to ask, and the kinds of sources that hold the answers. According to the reading, what is this map best understood as?",
  "options": [
    {"id":"a","label":"The orientation scaffolding that AI does well, worth keeping because it saves you the blank-page afternoon.","is_correct":true,"explanation":"Correct. The reading frames structuring the research, the dimensions, questions, and source categories, as exactly what AI is good for, turning a paralyzed afternoon into a structured start in about ten minutes."},
    {"id":"b","label":"A set of facts about the market that you can quote directly once it looks detailed enough.","is_correct":false,"explanation":"The map is structure, not facts. Detail and polish do not make the underlying specifics true, and the reading is careful to keep structure separate from factual claims."},
    {"id":"c","label":"A waste of time, since orienting on an unfamiliar industry is the part you should do entirely by hand.","is_correct":false,"explanation":"The reading argues the opposite: orientation is the slow, miserable part, and it is precisely where AI helps most by building the scaffolding fast."}
  ]
}
```

## reading

Now here is the trap, and it is a quiet one. That same model will also hand you a clean table of five competitors with market shares, a total addressable market of some confident-looking dollar figure, and a growth rate quoted to one decimal place. It will name companies. It will attribute a statistic to "industry research." And a meaningful share of those specifics will be wrong, outdated, or invented outright. The model does not know it is guessing. It produces the shape of a fact because the shape is what it learned, not because it pulled the number from a real filing. A precise percentage is not a sourced percentage. A tidy table is not verified research. Specificity and clean formatting feel like evidence, and they are not.

This matters in finance in a way it does not matter for a casual question. If a fabricated market-size number travels from an AI scan into your board memo, and from your memo into a model that someone uses to justify a decision, you have laundered a guess into a citation. Nobody downstream can tell it was never real. The whole chain inherits the error, and your name is on the front page. That is the stakes. So the discipline is simple to state and requires actual spine to follow: treat every fact the AI gives you as a lead, not a finding.

## multiple_choice

```json
{
  "stem": "You ask an AI to scope the dental software market and it returns a clean table of five competitors with market shares and a total market size to the dollar. What is the single most useful way to think about that table?",
  "options": [
    {"id":"a","label":"As finished research, because it is specific, well organized, and reads like something from a real report.","is_correct":false,"explanation":"Specificity and tidy formatting are not evidence of accuracy. A model can produce a confident, polished table full of invented shares and a fabricated market size. Organized is not the same as verified."},
    {"id":"b","label":"As a lead list: the structure is useful, but every competitor, share, and figure must be confirmed against a primary source before any of it enters your memo.","is_correct":true,"explanation":"Correct. The map is worth keeping, but the specific facts can be wrong, stale, or invented. Each named player and number is a lead to confirm against filings or a named industry report, never a finding to cite as is."},
    {"id":"c","label":"As proof the market is exactly that size, since an AI would not invent a number that precise.","is_correct":false,"explanation":"A precise number is exactly the kind of thing models invent, because precision is the shape of a real fact and the model learned the shape. A clean figure is not a sourced figure."}
  ]
}
```

## reading

Think of it as two completely separate jobs the AI is doing in the same answer, and you keep them apart on purpose. Job one is structuring: the questions, the categories, the comparison dimensions, the rough orientation on how the industry hangs together. You keep that. Job two is factual claims: every named competitor, every market size, every growth rate, every statistic. Each of those is something you go confirm against a primary source before it enters anything you produce. The competitor list gets checked against the companies' own sites and filings. The market size gets checked against a reputable industry report you can actually name and cite. The growth rate gets checked against a real source with a real date on it. Only the confirmed version crosses the wall into your deliverable.

Two habits make this safe and fast. First, ask the AI for its reasoning and its source categories, not just its answers. Instead of "what is this market worth," ask "what would I need to find, and where, to size this market credibly?" That turns the AI into a research planner instead of a fake encyclopedia, and it hands you a to-do list of things to verify rather than a number to be tempted by. Second, keep a hard wall between the draft and the deliverable. The AI's scan organizes your search. Only sourced, confirmed facts cross into the memo or the model.

Done this way, you get the best of both. A strategy analyst orienting on an unfamiliar industry gets a usable framework in minutes instead of a day. An analyst building a competitive comp set gets a complete list of dimensions to compare and a checklist of where to look. Someone sizing a market for a board memo gets the full question list before they have read a single report. The speed is real. You just never let the AI's confidence substitute for the verification step, because that step is the entire reason anyone trusts the memo at the end.

## multiple_choice

```json
{
  "stem": "The reading describes two separate jobs the AI does in the same answer. Which split correctly matches each job to how you should handle it?",
  "options": [
    {"id":"a","label":"Job one is structuring, which you keep; job two is factual claims, every one of which you confirm against a primary source before it enters your work.","is_correct":true,"explanation":"Correct. Structuring covers the questions, categories, and comparison dimensions, and you keep that. Factual claims, named competitors, market sizes, growth rates, statistics, each get confirmed against a primary source first."},
    {"id":"b","label":"Job one is the factual claims, which you keep as is; job two is the structure, which you can safely discard.","is_correct":false,"explanation":"This reverses the reading. The factual claims are exactly what you must verify, and the structure is the part worth keeping."},
    {"id":"c","label":"Both jobs are factual, so you can let confirmed and unconfirmed material cross into the deliverable together.","is_correct":false,"explanation":"The reading insists on a hard wall: only sourced, confirmed facts cross into the memo or model. Structure and unverified claims are not the same thing and are not treated the same way."}
  ]
}
```

## reading

The failure modes here are predictable, so you can guard against each one. The most common is laundering. You ask the AI for a quick scan, it hands you a market size, the number looks plausible, and because you are busy and the deadline is Friday, it slides straight into the memo. Two weeks later someone on the deal team asks for the source, and you realize you never had one. The number came from a model that does not cite. By then it has been quoted in two more documents. The fix is the hard wall: nothing crosses from the AI scan into the deliverable until you can name the primary source next to it.

A second trap is anchoring. Once the AI tells you the market is "roughly twelve billion dollars," that number lodges in your head. When you go find the real report, you unconsciously look for figures near twelve billion and wave past the ones that disagree. The AI did not just give you a lead, it gave you a bias. Protect yourself by treating the AI's number as a range to disprove, not a target to confirm. If the real sources cluster far from the AI's guess, trust the sources and notice that the AI was simply wrong.

## fill_blank

```json
{
  "template": "The most common failure mode is {{1}}, where an unsourced AI number slides into the memo and gets quoted again before anyone asks for a source. The fix is a hard wall: nothing crosses into the deliverable until you can name the {{2}} next to it.",
  "blanks": [
    {"id":"1","accept":["laundering","laundering a guess","money laundering"],"ideal":"laundering"},
    {"id":"2","accept":["primary source","source","primary source you can name","real source"],"ideal":"primary source"}
  ],
  "explanation": "Laundering is when a guess from a model that does not cite slides into your deliverable and gets requoted as if it were sourced. The hard wall stops it: nothing crosses until you can name the primary source beside it."
}
```

## reading

A third one is fake authority. Models love to attribute things: "according to industry research," "analysts estimate," "a leading report found." These phrases are almost always decoration, not real citations. There is frequently no specific report behind them. When you see attribution language, do not relax. Treat it as a flashing sign that says "go find the actual document," because the AI cannot hand you the document and often cannot even name it correctly.

A fourth is the stale roster. You ask for the competitor set and get a list that was accurate two or three years ago. A company on it got acquired. A major new entrant is missing entirely. The AI's training has a horizon, and markets move past it. Always pull the current competitor list from a live source, and use the AI's list only to make sure you have not missed an obvious category of player.

The last mistake is the subtlest: asking the AI for facts at all when you should be asking it for structure. The moment your prompt is "what is this market worth," you have pointed the tool at the one thing it is worst at. Point it at what it is best at instead. Ask "what would I need to find, and where, to size this credibly?" You will get a research plan you can execute and verify, rather than a number you will be tempted to trust. Keep the AI on the map, and keep yourself on the sources.

## multiple_choice

```json
{
  "stem": "Your AI scan says the market is 'roughly twelve billion dollars, according to industry research.' You later find a real report that puts it closer to seven billion. What went wrong, and what should you do?",
  "options": [
    {"id":"a","label":"Trust the real report and treat the AI's twelve billion as a guess that was simply wrong; the 'according to industry research' line was decoration, not a real citation.","is_correct":true,"explanation":"Correct. Attribution phrases like 'industry research' are usually filler, not a real source. The named report you actually found is the primary source. Update your number to the verified figure and do not let the AI's anchor pull you back."},
    {"id":"b","label":"Average the two numbers, since the truth is probably somewhere in between.","is_correct":false,"explanation":"Averaging a sourced number with an unsourced guess just contaminates the good number. The AI figure has no source behind it, so it gets no weight. Use the verified report."},
    {"id":"c","label":"Keep twelve billion, because the AI cited industry research and the report you found might be narrower in scope.","is_correct":false,"explanation":"The AI's 'industry research' is almost certainly not a real, nameable source, so it cannot outweigh a report you can actually read and cite. If scope differs, reconcile the scope from the real document, not from the AI's guess."}
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Practice pointing the AI at structure instead of facts. Describe a market or competitor question you actually need to scope, and ask only for the comparison dimensions, the questions to investigate, and the categories of primary source that would answer each one. Or use this sample: a first-pass competitive scan of dental practice management software for small and mid-size practices.",
  "system_prompt": "You are a research planning partner for a finance professional doing a first-pass market or competitive scan. Your job is to structure the research, not to supply facts. Provide three things: the dimensions a comparison should cover, the key questions to investigate, and the categories of primary source that would answer each question. If you mention any specific company, market size, growth rate, or statistic, you must explicitly label it 'unverified, confirm against a primary source,' because your figures may be outdated or invented. Never present a number or a competitor as established fact. Encourage the user to treat every specific as a lead to verify. Use plain language. No em dashes.",
  "ideal_output": "Here is a structure for a first-pass scan of dental practice management software for small and mid-size practices. This is a research plan, not a set of facts. Treat any company or figure I mention as an unverified lead to confirm against a primary source.\n\nDimensions to compare: pricing model and per-provider cost, target practice size, core features versus paid add-ons, integrations with imaging and accounting tools, insurance and claims handling, and the customer support model.\n\nKey questions to investigate: How large is the small and mid-size practice segment specifically, separate from large dental service organizations? What is the realistic growth rate, and which dated source supports it? Where do incumbents lose customers, and why? What does it cost a new entrant to handle claims and compliance across states?\n\nSource categories that would answer these: company pricing pages and any public filings for the players, recognized industry research reports for sizing and growth, review platforms for switching reasons, and regulatory or insurance-authority sites for claims and compliance scope.\n\nThere are companies commonly associated with this space, but I am not listing them as fact here because my roster may be stale. Pull the current set from a live, reputable source and use my dimensions to check you have not missed a category. Want me to turn this into a two-column comparison template you can fill with verified data?",
  "input_placeholder": "Describe the market or competitor set you need to scope..."
}
```

## multiple_choice

```json
{
  "stem": "You want the AI to help most with a first-pass scan of an unfamiliar industry without tempting you to cite a fabricated figure. Which prompt is the strongest?",
  "options": [
    {"id":"a","label":"'What is this market worth, and who are the top five players by share?'","is_correct":false,"explanation":"This points the tool at exactly what it is worst at. It will hand you a confident size and a stale roster, both of which you will be tempted to trust. You have asked for facts the AI cannot source."},
    {"id":"b","label":"'Give me a finished market summary I can paste into my board memo.'","is_correct":false,"explanation":"This asks the AI to produce the deliverable, which collapses the wall between draft and memo. Anything it invents goes straight into the document. The AI should organize your search, not write your conclusions."},
    {"id":"c","label":"'What dimensions should I compare, what questions should I investigate, and what categories of primary source would answer each one?'","is_correct":true,"explanation":"Correct. This points the AI at structure, the thing it does well, and hands you a verifiable research plan instead of a number to trust. You keep the map and go confirm every specific against a real source yourself."}
  ]
}
```

## mini_project

Pick a real market or competitor question you actually need to scope this month: an industry you are orienting on, a comp set you are building, or a market you are sizing for a memo. Ask the AI only for structure, never for the answer. Get the comparison dimensions, the questions to investigate, and the categories of primary source that would answer each, with any specific name or figure flagged as unverified. Then build a two-column working doc and watch how many of the AI's confident specifics survive contact with a real source.

- On the left column, capture the AI's structure and every lead it surfaced: each competitor name, each market-size guess, each growth rate, each statistic.
- On the right column, copy an item over only after you have confirmed it against a primary source you can name and date, and write that source next to it.
- At the end, count how many left-column specifics changed, vanished, or needed correction once you checked them, and note how fast you still reached a usable research plan.
