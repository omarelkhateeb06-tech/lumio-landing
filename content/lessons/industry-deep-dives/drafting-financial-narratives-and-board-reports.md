---
slug: drafting-financial-narratives-and-board-reports
module: industry-deep-dives
title: "Drafting Financial Narratives and Board Reports"
level: growing
minutes: 15
hook: The numbers took an hour to pull. The two pages explaining what they mean took the rest of the afternoon. That second part is where AI earns its place, as long as every figure still comes from you.
key_takeaway: Feed AI your verified figures and the story you see in them, and it drafts clear, board-ready prose, so you spend your time on judgment and not on wording. The numbers and the interpretation stay yours.
order: 22
tags: [finance, writing, summarizing]
---

## reading

A board report is not a table. The table is the easy part, because you already have the numbers and they live in your model. The hard, slow part is the narrative: turning a spreadsheet into a few paragraphs that tell the board what happened, why it matters, and what you are doing about it, in language a non-finance director can follow. That writing is where finance professionals lose whole afternoons, and it is exactly the kind of work AI is built to accelerate. The promise here is simple and worth saying plainly. You will keep doing the thinking. The AI will do the typing.

Picture Maya, an FP&A analyst who has to produce the quarterly board narrative every three months. She knows the quarter cold. Renewals came in strong, a couple of deals slipped, and margin softened because the team pulled hiring forward from Q4. She can explain all of this out loud in two minutes. But every quarter she sits in front of a blank document and the two minutes of clear thinking turn into three hours of rewriting sentences until they sound board-appropriate. That gap, between knowing the story and writing the story, is precisely the gap AI closes. Maya is not short on understanding. She is short on prose.

The order of operations is the whole discipline, so hold onto it. You verify the numbers first, against your source of truth, the close file, the system export, the reconciled model. Then you form your own read of what they mean, because the AI cannot tell you what the quarter means and must never try. Only then do you hand it the verified figures and your interpretation and ask it to write the narrative. The prompt Maya uses sounds like this. "Here are our Q3 actuals against budget. Revenue was 12.4 million versus a 11.8 million plan. Gross margin was 61 percent versus 64 percent planned. The story is that revenue beat on strong renewals, and margin slipped because we pulled forward some hiring. Draft a one-page board narrative with a short summary, the key drivers, and the outlook, written for directors who are not finance specialists." Notice what she gave it. The exact numbers, and the meaning she already assigned to them.

What comes back is a clean, structured draft built on her numbers and her judgment. She is not asking the AI what to think about the quarter. She is asking it to express, clearly and quickly, what she already concluded. That distinction is the entire game, and it is the line you must never let blur. The moment you ask the model "is this a good quarter?" or "what should the board take away?" you have handed it the one job that is yours. It will answer confidently, and it will sometimes be wrong, because it does not know your business, your covenants, or the conversation the board had last quarter.

Consider a second person, Devin, a controller writing variance commentary for the monthly package. His task is narrower than Maya's but the principle is identical. He has the variances in front of him, operating expense ran 340 thousand over budget, and he knows why, a one-time legal settlement plus higher cloud costs from a usage spike. The verified number is his. The explanation is his. What he hands the AI is both of those, and what he asks for is plain, neutral commentary that a director can read without a finance degree. He does not ask the AI to guess why the variance happened. If he did, it would invent a plausible-sounding reason, and a plausible-sounding wrong reason in a board document is far more dangerous than a clumsy sentence.

There is a reason this matters so much in finance specifically. A board narrative is a representation. People make decisions on it. If the AI invents a figure, rounds something in a flattering direction, or describes a 3 point margin decline as a "modest softening" when your board would call it a problem, the document now misrepresents reality, and your name is on it. So the rule is firm: the AI shapes language, never numbers, and never strategic meaning. Every figure in the final draft must trace back to a number you verified. If a number appears that you did not provide, that is a red flag, not a nice surprise, and you delete it and ask where it came from.

Think of the AI as a fast, tireless writing partner who is excellent at structure and tone and completely ignorant of your company. It can take "revenue beat, margin slipped on timing, cash is fine" and turn it into three tight, readable paragraphs in seconds. It cannot tell you whether that is good news. You bring the figures and the judgment. It brings the words. Used that way, it gives you back the afternoon and takes nothing that should stay yours.

## multiple_choice

```json
{
  "stem": "Maya, an FP&A analyst, is about to draft her quarterly board narrative with AI. What does she do BEFORE she opens the AI tool?",
  "options": [
    {"id":"a","label":"Verify her figures against the close file and decide herself what the quarter means, then bring both to the AI.","is_correct":true,"explanation":"Correct. Verification and interpretation are the human's job and must happen first. The AI only gets involved once the numbers are confirmed and Maya has formed her own read of them."},
    {"id":"b","label":"Paste her raw system export into the AI and ask it to figure out what the headline story is.","is_correct":false,"explanation":"This hands the AI the one job only Maya can do. It does not know her business and may misread renewals strength as a warning sign, or invent a story that sounds clean but is wrong."},
    {"id":"c","label":"Ask the AI to write the narrative first, then check the numbers against her model afterward to save time.","is_correct":false,"explanation":"Drafting before verifying means the prose may be built on unconfirmed figures. If a number is wrong, the polished narrative just makes the error more convincing. Verify first, always."}
  ]
}
```

## reading

The failures in this work are quiet, which is what makes them dangerous. Nothing crashes. You get back a fluent, confident draft, and fluency reads like correctness even when it is not. Here is where it goes wrong, and how each finance professional catches it.

The first failure is the invented figure. You give the AI revenue and margin, and the draft comes back mentioning a "customer count of roughly 1,200" or a "year over year growth of 18 percent" that you never provided. The model filled a gap with a plausible number because prose flows better with specifics. Devin, the controller, learned to scan every figure in the draft and ask one question: did I give it this number? If the answer is no, it gets deleted, no matter how reasonable it looks. A made-up number in a board document is not a typo, it is a misrepresentation.

The second failure is softened truth. A finance manager named Priya was preparing an executive summary for the leadership team after a weak quarter. She told the AI margin had "declined significantly," and the draft rendered it as "experienced some normalization." That is not a summary, that is a euphemism, and it would have let leadership walk into the meeting underprepared. The model is trained to sound smooth and reassuring, so it sands the edges off bad news unless you stop it. Priya now reads every draft asking: does this say the hard thing as plainly as I would say it out loud? If the AI made a real problem sound comfortable, she puts the sharpness back.

The third failure is the AI sneaking in strategic interpretation. You ask for a narrative and the draft adds a sentence like "this positions the company well for an aggressive Q4 expansion." You never said that. That is the model guessing at strategy, and strategy is not its call. Delete the editorializing and keep only the meaning you actually own.

The fourth failure is putting confidential or material non-public information into a public tool. Maya almost pasted live, unannounced quarterly figures into a consumer chatbot to save a few minutes. The fix is policy, not cleverness: use your company's approved enterprise tool for real figures, or describe the shape of the story without the live numbers and add the real numbers yourself in the final document.

The pattern across all four is the same. The AI is excellent at language and indifferent to truth. It does not know which number is right, which problem is real, or which strategy is yours. Your edit pass is not optional polish, it is the control that keeps the document honest. Read the draft as the person accountable for it, because that is exactly who you are.

## multiple_choice

```json
{
  "stem": "Priya, a finance manager, told the AI that margin 'declined significantly,' but the executive-summary draft came back describing it as 'experienced some normalization.' What kind of failure is this, and what should she do?",
  "options": [
    {"id":"a","label":"It is a confidentiality breach, so she should switch to an enterprise tool before continuing.","is_correct":false,"explanation":"Nothing about confidential data is at issue here. The problem is tone, not data handling. The enterprise-tool rule matters, but it does not address a softened message."},
    {"id":"b","label":"It is an invented figure, so she should delete the number and re-enter the correct one.","is_correct":false,"explanation":"No figure was fabricated here. The issue is that a real, accurate decline was described with a comforting euphemism that hides its severity. The wording, not a number, is the problem."},
    {"id":"c","label":"It is softened truth, so she should put the plain wording back and say the hard thing as directly as she would out loud.","is_correct":true,"explanation":"Correct. The model smoothed a real problem into something reassuring. Priya owns the honesty of the summary, so she restores the directness so leadership is not underprepared."}
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Hand the AI your verified figures and your own honest read of them, then ask for a board-ready narrative. Or use this sample: Q3 revenue was 12.4 million versus an 11.8 million plan, gross margin was 61 percent versus 64 percent planned, the revenue beat came from strong renewals, the margin slipped because hiring was pulled forward from Q4, and cash runway is comfortable.",
  "system_prompt": "You are a finance communications partner helping a finance professional write a board narrative. The user supplies verified figures and their own interpretation of what the numbers mean. Express their interpretation clearly. Never invent analysis and never add any figure the user did not provide. Use only the numbers given to you. Produce a one-page structure: a two to three sentence summary, a short key drivers section, and a brief outlook section, written for intelligent directors who are not finance specialists. Keep it honest and plain. If the user's narrative glosses over a weak spot, surface it neutrally rather than smoothing it away. Do not add strategic conclusions the user did not state. No jargon without a plain-language gloss. No em dashes.",
  "ideal_output": "Here is a one-page board narrative built on the figures and read you gave me. I used only your numbers and added none of my own.\n\nSummary: Q3 revenue came in at 12.4 million against an 11.8 million plan, driven by stronger than expected renewals. Gross margin was 61 percent versus a planned 64 percent, the result of a deliberate decision to pull hiring forward from Q4. Cash runway remains comfortable.\n\nKey drivers: The revenue beat was concentrated in renewals rather than new logos, which points to retention strength and is worth watching as a growth signal. The 3 point margin movement was a timing choice and not a cost overrun, because the new hires were planned for Q4 and brought forward.\n\nOutlook: We expect margin to move back toward plan as the new hires reach productivity, assuming renewal strength holds. One item for the board to note: because the beat came from renewals, new-logo growth is the metric to track next quarter.\n\nWant me to tighten this to half a page, or hold the wording while you confirm the figures against your close file?",
  "input_placeholder": "Paste your verified figures and your own read of what the quarter means..."
}
```

## multiple_choice

```json
{
  "stem": "Devin, a controller, gets back a variance-commentary draft that includes the line: 'this overspend positions us for an aggressive expansion next quarter.' He never said anything about expansion. What is the right call?",
  "options": [
    {"id":"a","label":"Keep it, because the AI may have spotted a strategic angle he missed and the board will appreciate the forward view.","is_correct":false,"explanation":"The AI does not know Devin's strategy and cannot spot a real angle in his business. This is the model guessing at meaning it was never given, and trusting that guess in a board document is exactly the risk to avoid."},
    {"id":"b","label":"Delete the line, because strategic interpretation he did not provide is the AI overstepping, and that judgment stays with the human.","is_correct":true,"explanation":"Correct. The AI shapes language, not strategy. Any conclusion Devin did not state himself is editorializing he does not own, so he removes it and keeps only the meaning he actually verified."},
    {"id":"c","label":"Ask the AI to expand the expansion idea into a full paragraph so the board has more context.","is_correct":false,"explanation":"This doubles down on a conclusion that originated with the model, not with Devin. Building more narrative on an unowned strategic claim makes the document less honest, not more useful."}
  ]
}
```

## mini_project

Take a recurring report you actually write, a board update, a monthly close summary, or a variance commentary, and run it through the full discipline once. Pull your verified figures from your source of truth and confirm them. Write two or three rough sentences of your own honest read: what happened, why, and what is next. Hand the AI the figures and your read, ask for a structured narrative aimed at your real audience, then edit it as the person accountable for the document.

When you edit, run these three checks before you accept a single word.

- Trace every figure in the draft back to a number you provided, and delete anything the AI added on its own.
- Read each sentence about a problem and ask whether it says the hard thing as plainly as you would out loud, then restore any sharpness the model smoothed away.
- Confirm the draft contains no strategic conclusion you did not state yourself, and cut any meaning the AI invented.
