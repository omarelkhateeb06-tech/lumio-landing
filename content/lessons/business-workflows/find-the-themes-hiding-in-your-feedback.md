---
slug: find-the-themes-hiding-in-your-feedback
module: business-workflows
title: "Finding the Themes Hiding in Your Feedback"
level: growing
minutes: 7
order: 9
hook: A hundred survey comments or support tickets are impossible to read for patterns by hand. AI finds the themes and counts them in seconds.
key_takeaway: Paste a pile of open-ended feedback and ask AI to group it into themes with counts and example quotes, turning a wall of comments into a clear, prioritized picture of what people are actually saying.
tags: [general, data, summarizing]
---

## reading

You have a pile of unstructured feedback: 200 survey responses, a quarter of support tickets, exit interview notes, comments from a town hall. Somewhere in there is the signal your team needs, but reading it all and holding the patterns in your head is genuinely impossible past a couple dozen entries. So most feedback gets skimmed, summarized by gut feel, and quietly wasted. AI is excellent at exactly this job: reading a large volume of text and surfacing the themes.

Here is how to do it well.

**Paste the raw feedback and ask for themes, not a summary.** "Here are 150 open-ended survey responses. Group them into the main recurring themes. For each theme, give it a short name, tell me roughly how many responses mention it, and include two or three representative quotes." The counts turn vague impressions into something you can prioritize, and the quotes keep it grounded in real voices.

**Ask it to separate the signal from the noise.** "Which themes are most common, and which are rare but serious?" A complaint that shows up twice but describes a safety problem matters more than a minor gripe mentioned fifty times. Ask the AI to flag both, so frequency does not bury severity.

**Push for the actionable cut.** "Based on these themes, what are the top three things we should consider changing, and what would each address?" This moves you from "here is what people said" to "here is what to do about it," which is the point of gathering feedback in the first place.

**Mind the limits.** Two cautions. First, anonymize: strip names and identifying details before pasting feedback into a public tool, especially anything sensitive like HR or health comments. Second, the AI's counts are estimates, not exact tallies; if a precise number matters, treat its grouping as the map and verify the count yourself. The value is the pattern-finding, which would have taken you a full day, not perfect arithmetic.

Done this way, a backlog of feedback that was too big to use becomes a clear, prioritized picture of what people actually think, in the time it takes to read this lesson.

## multiple_choice

```json
{
  "stem": "When grouping a pile of feedback into themes, why does this lesson tell you to ask the AI which themes are rare but serious, not just which are most common?",
  "options": [
    {
      "id": "a",
      "label": "Because frequency can bury severity. A complaint mentioned twice that describes a safety problem matters more than a minor gripe mentioned fifty times.",
      "is_correct": true,
      "explanation": "Correct. Asking it to flag both common and rare-but-serious themes keeps a low-frequency, high-stakes issue from being drowned out by volume."
    },
    {
      "id": "b",
      "label": "Because the rare themes are always the most important and the common ones can be ignored.",
      "is_correct": false,
      "explanation": "The lesson does not say rare always beats common. It says to surface both, so you weigh frequency and severity together rather than letting one hide the other."
    },
    {
      "id": "c",
      "label": "Because the AI's counts are exact, so the rare themes are guaranteed to be the real priorities.",
      "is_correct": false,
      "explanation": "The lesson is clear that the counts are estimates, not exact tallies. The reason to ask about rare-but-serious themes is severity, not precision of the numbers."
    }
  ]
}
```

## mini_project

Turn a real pile of feedback you have access to into a themed, actionable summary. First, gather a batch of open-ended text, survey comments, support tickets, reviews, or meeting notes, and remove names or identifying details if you are using a public tool. Second, paste it in and ask the AI to group it into named themes, each with a rough count and two or three representative quotes. Third, ask it which themes are most common and which are rare but serious, so frequency does not hide severity. Finally, ask for the top three changes the feedback suggests and what each would address, then sanity-check the groupings against a quick skim of the raw text to make sure nothing important was flattened. The deliverable is a one-page theme summary with counts, quotes, and recommended actions, built from feedback you would otherwise never have fully read.
