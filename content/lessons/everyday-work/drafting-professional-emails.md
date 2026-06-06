---
slug: drafting-professional-emails
module: everyday-work
title: "Drafting Professional Emails with AI"
level: beginner
minutes: 15
order: 7
hook: Stop staring at the blank reply box. Brief the AI on the situation, the tone, and the limits, then own the final send.
key_takeaway: A strong email draft comes from briefing the AI on the situation, the key points, the tone, and the constraints. The AI drafts, but you read it, fix what does not sound like you, and own the send.
tags: [general, email, writing]
---

## reading

The hardest part of most work emails is not the writing. It is starting. You know roughly what you need to say, but turning a tense or awkward situation into something professional takes more energy than it should. You write a sentence, delete it, rewrite it, and twenty minutes later you still have nothing in the box. This is one of the things AI does genuinely well, and it can give you back that twenty minutes every single day.

The catch is that the quality of what comes back depends entirely on what you put in. Type "write a professional email" and you get a hollow template full of phrases like "I hope this message finds you well" and "please do not hesitate to reach out." It reads like a form letter because that is exactly what you asked for: an email about nothing in particular. The good stuff comes from feeding the AI your specifics.

There are four things worth handing the AI every time. First, the situation: who this is going to and what is actually happening. Second, the points to make: the two or three things that must land. Third, the tone: how you want to come across. Fourth, the constraints: length, format, anything to avoid. Once you brief all four, the draft that comes back is usually ninety percent of the way there.

## multiple_choice

```json
{
  "stem": "You need to email a vendor about a billing error. Which approach produces the most usable draft?",
  "options": [
    {
      "id": "a",
      "label": "Brief the AI on the situation, the specific points to make, the tone you want, and a length limit, then read and adjust the draft before sending.",
      "is_correct": true,
      "explanation": "Right. The four inputs (situation, points, tone, constraints) turn a generic template into a draft that is ninety percent there, and reading before sending keeps you the author."
    },
    {
      "id": "b",
      "label": "Type 'write a professional email about a billing error' and send whatever comes back, since the AI knows professional language.",
      "is_correct": false,
      "explanation": "A vague request produces a hollow template full of filler. Without your specifics and a final read, you are sending something generic with your name on it."
    },
    {
      "id": "c",
      "label": "Write a long, very formal prompt packed with corporate phrases so the email sounds important.",
      "is_correct": false,
      "explanation": "Formality and length are not what makes an email work. Concrete specifics and a named tone are, and corporate filler usually makes the email worse, not better."
    }
  ]
}
```

## reading

Here is what that looks like in practice. Say you manage an office and a vendor has invoiced you twice for the same delivery. You could stew over how to flag it without sounding accusatory, or you could write: "Draft an email to a vendor I have a good relationship with. They invoiced us twice for the September cleaning supplies order, invoice numbers 4471 and 4488, same items. I want them to void the duplicate and confirm. Tone: friendly and matter of fact, assume it was an honest mistake. Under 100 words." What comes back names the invoices, makes the ask cleanly, and keeps the relationship intact. You read it once and send.

Take a second case. A paralegal needs to decline a request from a partner to take on extra document review because they are already buried, but saying no to a partner feels dangerous. The brief: "Write an email declining a partner's request to handle the Reyes document review. I am already at capacity on the Tanaka and Brooks matters with deadlines this week. I want to say no clearly but show I take their request seriously and offer an alternative. Tone: respectful, confident, not apologetic or groveling. Under 120 words." The draft acknowledges the request, states the conflict in terms of existing deadlines rather than personal preference, and suggests checking back next week. That framing protects you. It says no without sounding like you are dodging work.

## fill_blank

```json
{
  "template": "In the paralegal example, the decline is framed around existing {{1}} on the Tanaka and Brooks matters rather than personal {{2}}, which is what makes the no land as professional.",
  "blanks": [
    { "id": "1", "accept": ["deadlines", "capacity", "workload", "commitments"], "ideal": "deadlines" },
    { "id": "2", "accept": ["preference", "preferences", "choice", "feelings"], "ideal": "preference" }
  ],
  "explanation": "The draft states the conflict in terms of existing deadlines rather than personal preference, so it reads as a real scheduling constraint, not as dodging work."
}
```

## reading

Tone is the lever most people forget to pull, and it changes everything. The exact same facts can be delivered as warm, firm, apologetic, or coolly professional, and the AI will follow your lead if you name it. A teacher emailing a parent about a missed assignment can ask for "supportive and non-judgmental, assume the parent wants to help." An HR manager confirming a policy change can ask for "neutral and clear, no warmth needed, just the facts." If you do not name a tone, the AI defaults to a generic middle that often reads as either stiff or weirdly chummy. Naming it costs you four words and saves you a rewrite.

A few smaller moves sharpen the result further. Tell the AI to skip jargon and filler if you hate corporate-speak: "no buzzwords, no 'circle back,' plain language." Give it a length so it does not ramble: a chasing email should be three sentences, not three paragraphs. And if you have written similar emails before, paste one in and say "match this voice." The AI is good at mirroring a style once it has a sample.

Now the part that matters most, and the part no prompt can do for you. Always read the draft before you send, and read it as the person receiving it. The AI does not know your history with this person. It does not know that this vendor already apologized last month, or that this colleague is going through something hard, or that one sentence in the draft will land wrong because of a conversation you had last week. You know all of that. So the workflow is not "AI writes my email." It is "AI drafts, I decide." You are still the author. The AI just gets you past the blank box and into editing, which is the easy part. When you hit send, that email is yours, with your name on it, and you are accountable for every word. Treat the draft as a strong first pass from a helpful assistant, never as a finished product you can fire off unread.

## multiple_choice

```json
{
  "stem": "According to this segment, if you do not name a tone in your brief, what tends to happen?",
  "options": [
    {
      "id": "a",
      "label": "The AI refuses to write the email until you supply one.",
      "is_correct": false,
      "explanation": "The AI does not refuse. It simply picks a default, which is the whole problem with leaving the tone unnamed."
    },
    {
      "id": "b",
      "label": "The AI defaults to a generic middle that often reads as either stiff or weirdly chummy.",
      "is_correct": true,
      "explanation": "Right. Naming the tone costs four words and steers the email, while leaving it out lands you in that stiff or chummy default."
    },
    {
      "id": "c",
      "label": "The AI automatically matches the tone of the last email you sent.",
      "is_correct": false,
      "explanation": "It only mirrors a style when you paste a sample and ask it to match that voice. Without a named tone or a sample, it falls back to a generic default."
    }
  ]
}
```

## reading

The most common mistake is treating the AI's first draft as finished. People brief it well, get back something that reads smoothly, and hit send without reading it as the recipient would. Then they find out the draft thanked a client for "your continued partnership" when this was a brand-new client, or it apologized profusely when the situation called for a firm correction, not an apology. A smooth draft is not a correct draft. The AI writes confident-sounding sentences about things it cannot possibly know: your history with this person, the politics in the room, the one detail that changes the whole message. Reading every draft before sending is not optional. It is the job.

The second mistake is skipping the tone instruction and accepting whatever default comes out. Left to its own devices, the AI tends toward a chummy, over-friendly register, lots of exclamation points and "I'd love to" and "so excited." For a nurse emailing a doctor about a scheduling conflict, that tone is wrong and undermines you. Name the tone explicitly every time. "Professional and brief," "warm but firm," "neutral, just the facts." Four words steer the entire email.

## fill_blank

```json
{
  "template": "Before sending an AI-drafted email, always {{1}} it as the recipient would, because the AI cannot know your {{2}} with that person.",
  "blanks": [
    { "id": "1", "accept": ["read", "review", "reread", "check"], "ideal": "read" },
    { "id": "2", "accept": ["history", "relationship", "context", "past"], "ideal": "history" }
  ],
  "explanation": "A smooth draft is not a correct draft. The AI writes confident sentences about things it cannot know, so reading every draft as the recipient and catching anything that clashes with your real history is the step that keeps you the author."
}
```

## reading

The third mistake is the opposite problem: over-briefing into a stiff, robotic result. Some people, worried about sounding unprofessional, ask for "highly formal corporate language" and end up with an email so starchy it reads like a legal notice. A frustrated colleague who gets a reply dripping with "per my previous correspondence" feels handled, not heard. Aim for how a thoughtful human actually writes. "Clear and human, no corporate jargon" almost always beats "formal."

A fourth trap is pasting in confidential details without thinking. If you are drafting an email about a patient, a client matter, or an employee's performance, do not paste names, medical details, or sensitive specifics into a tool your workplace has not approved. Describe the situation in general terms ("an employee who missed three deadlines") and add the real names yourself in the final draft. Check your organization's policy on what can go into AI tools before you paste anything sensitive.

The last mistake is asking the AI to handle something it should not. An email firing someone, denying a serious complaint, or delivering legally significant news is not a "draft it and tweak it" task. The stakes are too high and the wording carries real consequences. Use the AI for the everyday volume: the chasers, the scheduling notes, the polite declines, the status updates. For the genuinely sensitive sends, write them yourself or get a human to review, because those are the emails where a wrong word actually costs you.

## multiple_choice

```json
{
  "stem": "Based on this segment, how should you handle confidential details like patient or employee names when drafting with an unapproved AI tool?",
  "options": [
    {
      "id": "a",
      "label": "Paste everything in so the AI has full context, then delete the sensitive parts afterward.",
      "is_correct": false,
      "explanation": "Once you paste sensitive details into an unapproved tool, deleting them later does not undo the exposure. The point is not to paste them in the first place."
    },
    {
      "id": "b",
      "label": "Describe the situation in general terms and add the real names or specifics yourself in the final draft.",
      "is_correct": true,
      "explanation": "Right. General terms like 'an employee who missed three deadlines' keep the brief useful while you add the sensitive specifics yourself, and you check your organization's policy first."
    },
    {
      "id": "c",
      "label": "Avoid drafting any email with AI if it touches a person, no matter how general.",
      "is_correct": false,
      "explanation": "You can still draft these emails. The segment says to describe the situation generally and add real names yourself, not to avoid the tool entirely."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "You need to chase a client who is two weeks late paying an invoice, without damaging the relationship. Same goal, two prompts. See how the second one earns a better email.",
  "before_prompt": "Write an email asking a client to pay an overdue invoice.",
  "after_prompt": "Draft a short email chasing a client about invoice 2210 for $3,400, which was due May 15 and is now two weeks overdue. This is a long-term client I value, and I assume it is an oversight, not a refusal. I want to remind them clearly, make it easy to pay, and keep the relationship warm. Tone: friendly and low-pressure, not accusatory. Under 90 words, plain language, no corporate filler.",
  "changes": [
    "Names the specific invoice, amount, and dates, so the email is concrete and the client knows exactly what is owed.",
    "States the relationship and the assumption (an oversight, not a refusal), so the tone stays warm instead of legalistic.",
    "Sets a clear tone and a length limit, so the result is a short, easy-to-act-on nudge rather than a stiff demand letter."
  ]
}
```

## multiple_choice

```json
{
  "stem": "In the overdue-invoice example, why does adding 'I assume it is an oversight, not a refusal' improve the draft?",
  "options": [
    {
      "id": "a",
      "label": "It steers the AI toward a warm, low-pressure tone that protects a valued client relationship instead of sounding accusatory.",
      "is_correct": true,
      "explanation": "Right. Telling the AI how to read the situation shapes the tone of the whole email, which is exactly the lever you want to pull when the relationship matters."
    },
    {
      "id": "b",
      "label": "It makes the email longer and more formal, which clients respond to better.",
      "is_correct": false,
      "explanation": "The brief actually asks for under 90 words and plain language. Length and formality are not the point; the framing of the relationship is."
    },
    {
      "id": "c",
      "label": "It lets the AI decide on its own whether the client meant to skip the payment.",
      "is_correct": false,
      "explanation": "The AI cannot know the client's intent. You are supplying the assumption on purpose, precisely because the AI has no way to judge it."
    }
  ]
}
```

## mini_project

Pick a real email you have been putting off, the kind that sits in your head as a low-grade dread. A polite decline, an overdue chase, a reply to someone who is frustrated, a correction you need to make without causing offense. Draft it with AI using the four-part brief, then own the send.

- Write your brief covering all four inputs: the situation (who and what is happening), the two or three points that must land, the tone you want in your own words, and the constraints (length, no jargon, anything to avoid).
- Run it, then read the draft out loud as if you were the person receiving it. Mark every spot that does not sound like you or that clashes with something the AI could not know about your history with this person.
- Rewrite those spots in your own words, add any real names or details you kept out for privacy, and tighten the length. Send the version you would be comfortable having your name on, and note how long the whole thing took compared to writing it from scratch.
