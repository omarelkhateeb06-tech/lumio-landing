---
slug: stop-writing-prompts-start-writing-briefs
module: first-steps
title: Stop writing prompts (start writing briefs)
level: beginner
minutes: 15
order: 4
hook: Every disappointing AI answer has the same root cause: you gave it a question when it needed a brief.
key_takeaway: A brief costs you 60 extra seconds and saves 20 minutes of revisions, because it tells the AI everything a capable assistant would need to know before starting.
tags: [general, framing, prompting]
---

## reading

There is a habit almost everyone brings to AI from years of using Google: you type the shortest possible thing and expect the tool to figure out the rest. Search engines trained us to do this. AI is not a search engine, and that habit is the single biggest reason people get mediocre results.

Here is the shift. A prompt is a question. A brief is a set of instructions. The difference is the same as the difference between turning to a brand-new assistant and saying "write the newsletter" versus sitting them down and explaining what the newsletter is for, who reads it, what tone the company uses, and what you do not want in it. With the first version you will get something generic and spend an hour fixing it. With the second you will get something close to right on the first try. The AI is exactly that assistant. It is capable, it is fast, and it knows nothing about your specific situation until you tell it.

A good brief answers six things a competent assistant would ask before they started. You do not need a form. You just need to cover them.

**Context:** What is the situation? What has already been decided? "We are a 30-person nonprofit that runs an after-school reading program, and we just got a $50,000 grant we want to announce to our donor list" gives the AI a world to work in. Without it, the AI is writing into a void.

**Goal:** What is this supposed to accomplish? "I want donors to feel proud they supported us, and I want to set up a future ask" is a goal. When the AI knows what success looks like, it makes better choices about what to emphasize.

**Audience:** Who reads this, and what do they already know? Writing for longtime donors who know your program is completely different from writing for strangers. "These are donors who have given for at least two years and already know our staff by name" changes every line.

**Constraints:** What are the hard rules? Length, deadline, tone, and what must not appear. "Under 200 words, warm but not gushing, do not mention the exact salary figures the grant covers."

**Format:** What shape should it take? An email with a subject line, three social posts, a one-page letter. Say it, or the AI will guess.

**Examples:** If you have a past piece you liked, paste it. "Match the voice of this newsletter we sent in March: [paste]" is the single fastest way to get your own tone back out of the AI.

Let me show you the gap with a real example. A school office administrator needs to tell parents that the school is switching to a new pickup system. The prompt version is "write an email about the new pickup procedure." The AI returns a stiff, generic notice that misses every detail that matters, because it has none of them. It pads the whole thing with phrases like "we are committed to student safety" that say nothing. The model did not fail. It did exactly what you asked: write about a topic with no facts attached.

The brief version reads like this: "I am the front-office administrator at an elementary school with about 400 students. Write an email to all parents announcing that, starting October 6th, afternoon pickup moves from the front circle to the back lot off Maple Street, and that every car needs the new numbered tag we mailed home last week. The goal is to prevent confusion and traffic backups on day one. Parents are busy and skim, so put the date, the new location, and the tag requirement near the top. Keep it under 180 words, friendly but clear, and do not bury the key change in a long intro. Format it as an email with a subject line, and end with a line telling parents to reply if they did not receive a tag." That brief produces a sendable email in one shot. The prompt produces a draft that needs three rounds of you typing "no, also mention the tags" and "make it shorter."

Count what the brief did. It gave the role, the situation, the exact change, the goal, the audience behavior, the constraints, the format, and a closing action. It took ninety seconds to write. The prompt took five seconds and cost twenty minutes of back-and-forth. Briefing is slower to start and faster to finish.

Here is a second example. A freelance bookkeeper follows up with a client sixty days late on an invoice. The prompt "write a payment reminder" gives back a cold form letter that damages the relationship. The brief reads: "I am a freelance bookkeeper. Write a follow-up email to a long-term client, a bakery owner named Dana, whose invoice for $1,200 is now sixty days past due. We have worked together three years and I want to keep things warm, so the tone should be friendly and assume good faith. The goal is to get it paid within a week without making Dana feel cornered. Mention I can split it into two payments if cash flow is tight. Keep it under 120 words, sign it from Maria, and do not use the words 'overdue' or 'failure to pay.'" That brief produces an email Dana would respond to. The extra lines each remove a guess: the history sets the warmth, the payment split gives an easy yes, and the banned words steer the AI off the backfiring tone.

The mental move that makes this easy: before you type, picture handing the task to a smart new hire on their first day. Everything you would explain to them belongs in your brief. If they would have to ask "who is this for?" or "how long should it be?" then your brief is missing a piece. The AI will never ask a clarifying question on its own. It fills the gap with the most average answer, so answer the questions in advance.

## multiple_choice

```json
{
  "stem": "An HR manager writes: \"Draft a message to the team about the new remote-work policy.\" What is the core reason this is a prompt and not a brief?",
  "options": [
    {
      "id": "a",
      "label": "It is too short; briefs must always be at least a paragraph long",
      "is_correct": false,
      "explanation": "Length is not the rule. A brief can be short. The issue is that it leaves out the information the AI actually needs, like what the policy says and who reads it."
    },
    {
      "id": "b",
      "label": "It names a topic but gives no context, goal, audience, constraints, or format",
      "is_correct": true,
      "explanation": "Correct. It tells the AI the subject and nothing else. The AI does not know what the policy actually is, who it is for, what tone fits, or what shape the message should take, so it has to guess all of it."
    },
    {
      "id": "c",
      "label": "It uses the word \"draft\" instead of \"write\"",
      "is_correct": false,
      "explanation": "The verb is not the problem. The problem is the missing context, goal, audience, constraints, and format that a brief would supply."
    }
  ]
}
```

## reading

When people first try to write briefs instead of prompts, a handful of mistakes keep them stuck. Here is what goes wrong and how to fix each one.

**Mistake 1: Most people add detail but forget the goal.** They will describe the situation in depth and still never say what the message is supposed to accomplish. A brief that explains the whole grant but never says "I want donors to feel proud and set up a future ask" leaves the AI guessing about what to emphasize. Always answer the question "what do I want the reader to think, feel, or do after this?" That one sentence steers everything else.

**Mistake 2: People describe the audience as themselves.** They write for the version of the reader who already knows everything they know. A teacher writes a parent email full of school jargon because the jargon is obvious to her. State who the reader actually is and what they do not know. "Parents who have never used our online portal" is worth more than three sentences of instructions.

**Mistake 3: People list what they want but never what they do not want.** Rejection criteria are half of a good brief and the half everyone skips. "Do not start with 'We are excited to announce.' Do not use corporate jargon. Do not exceed 150 words." These negative rules are often more powerful than the positive ones, because they cut off the AI's most common bad habits before they appear.

**Mistake 4: People treat the brief as one-and-done and never reuse it.** They write a careful brief for the monthly newsletter, get a great result, and then start from scratch the next month. Save your good briefs. The context, audience, and constraints rarely change. Next time you only swap in the new content and the AI gives you the same quality with a tenth of the effort. Keep a simple notes file with your three or four best briefs in it. A volunteer coordinator who saves the brief for "monthly update to our 200 volunteers" will reuse the same role, audience description, and tone rules every single month, and only paste in the new events. The first brief takes two minutes. Every reuse after that takes ten seconds.

**Mistake 5: People stack so many constraints that they contradict each other.** A brief that says "make it warm and personal, keep it strictly professional, be funny, and stay formal" gives the AI four steering wheels pulling in different directions, and it will pick one at random. If you ask for "under 80 words" but also "explain the full refund policy in detail," you have set a trap the AI cannot escape. When a result feels muddled, check whether your own instructions fight each other. Pick the constraint that matters most and let the smaller ones go.

The thread connecting all four is that a brief is not about writing more words. It is about answering the questions a real assistant would ask. Goal, audience, and what to avoid are the three that people most often leave out, and they are the three that matter most. When an AI answer disappoints you, do not blame the model. Reread your brief and find which question you never answered.

## fill_blank

```json
{
  "template": "The three parts of a brief that people most often skip are the {{1}} (what the message should accomplish), the real {{2}} (who reads it and what they do not know), and the {{3}} that tell the AI what to avoid.",
  "blanks": [
    { "id": "1", "accept": ["goal", "objective", "purpose"], "ideal": "goal" },
    { "id": "2", "accept": ["audience", "reader", "readers"], "ideal": "audience" },
    { "id": "3", "accept": ["rejection criteria", "constraints", "negative rules", "rules"], "ideal": "rejection criteria" }
  ],
  "explanation": "A brief answers the questions a capable assistant would ask. Goal, audience, and what to avoid are the ones most people leave out, and they are the ones that change the output most."
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Take this thin prompt and rewrite it as a full brief. Cover context, goal, audience, constraints, and format. The prompt is: \"Write a reminder email about the team meeting.\" Imagine you are an office manager whose Thursday 2pm planning meeting keeps getting low attendance.",
  "system_prompt": "You are a writing coach who helps people turn one-line prompts into complete briefs. When given a thin prompt, do not write the final email. Instead, rewrite the request as a proper brief that covers context, goal, audience, constraints, and format, and briefly point out what each added part contributes.",
  "ideal_output": "I am the office manager at a 25-person agency. Write a reminder email about our weekly planning meeting this Thursday at 2pm in the main conference room. Context: attendance has been low the last three weeks and people say they forget. Goal: get everyone to actually show up, without sounding like a scolding. Audience: busy account and design staff who skim email. Constraints: under 100 words, friendly and light, mention that we will cover the new client onboarding and that coffee will be there, and do not guilt-trip anyone. Format: an email with a clear subject line.",
  "input_placeholder": "I am a [role]. Write [task]. Context... Goal... Audience... Constraints... Format..."
}
```

## multiple_choice

```json
{
  "stem": "You wrote a detailed brief with full context, audience, and format, but the AI still returned something that opened with \"We are thrilled to announce\" and ran 280 words when you wanted 120. What did your brief most likely leave out?",
  "options": [
    {
      "id": "a",
      "label": "Rejection criteria and length constraints",
      "is_correct": true,
      "explanation": "Right. A brief that never says \"under 120 words\" and \"do not open with an announcement cliche\" leaves those exact gaps. Telling the AI what to avoid is as important as telling it what to do."
    },
    {
      "id": "b",
      "label": "More context about the company",
      "is_correct": false,
      "explanation": "The question says context was already full. Adding more background would not have capped the length or stopped the cliche opener. That takes explicit constraints."
    },
    {
      "id": "c",
      "label": "A clearer role for the AI to play",
      "is_correct": false,
      "explanation": "The role was not the gap. The length and the cliche opener are controlled by constraints and rejection criteria, which were the missing pieces."
    }
  ]
}
```

## mini_project

Find the next real piece of writing on your to-do list: an email, an announcement, a summary, a notice, anything you actually have to send this week. Instead of typing a one-line prompt, write a full brief for it.

- Write your context and goal: the situation, what has already been decided, and what you want the reader to think, feel, or do afterward.
- Write your audience and constraints: who reads this and what they do not already know, plus the hard rules on length, tone, deadline, and anything that must not appear.
- Write your format and one rejection criterion: the shape you want (email with subject line, bullets, short message) and at least one clear "do not do this."
- Run the brief, then save it in a notes file. Next time you write something similar, reuse the brief and only swap the new content.
