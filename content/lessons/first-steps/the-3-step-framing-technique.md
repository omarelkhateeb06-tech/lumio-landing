---
slug: the-3-step-framing-technique
module: first-steps
title: The 3-step framing technique
level: beginner
minutes: 15
order: 3
hook: One extra sentence before your request doubles the quality of every answer you get back.
key_takeaway: Role, then task, then format. Ten seconds of framing turns a generic answer into something you can actually use at work.
tags: [general, framing, prompting]
---

## reading

Most people talk to AI the way they talk to a search engine. They type a few words, hit enter, and hope. Then the answer comes back generic and bland, and they decide AI just is not that smart. The problem is almost never the AI. The problem is that you handed it a topic when it needed a frame.

Framing means setting up the request before you ask for the thing. It takes about ten seconds and it works every single time. There are exactly three steps, and once you learn them you will use them for the rest of your career.

**Step 1: Give it a role and your context.** Tell the AI who is asking and what world they live in. This is not about telling it to "act as an expert." It is about telling it about you. Compare these two openers. "Write a reminder about flu shots" gives the AI nothing. "I am a charge nurse on a medical-surgical unit at a 200-bed hospital. I am writing to the nurses on my shift" gives it your vocabulary, your audience, and your stakes. The AI now knows to use clinical shorthand instead of patient-friendly language, and to write peer-to-peer instead of top-down. The role tells the AI which version of itself to be.

## multiple_choice

```json
{
  "stem": "According to Step 1, what does giving the AI a role and your context actually mean?",
  "options": [
    {
      "id": "a",
      "label": "Telling the AI to \"act as an expert\" so it sounds more confident",
      "is_correct": false,
      "explanation": "The reading says the role step is not about telling it to act as an expert. That is the opposite of the point being made."
    },
    {
      "id": "b",
      "label": "Asking the AI to guess who you are from the topic",
      "is_correct": false,
      "explanation": "Guessing is exactly what framing avoids. You are supposed to tell the AI who is asking, not leave it to fill in the blank."
    },
    {
      "id": "c",
      "label": "Describing who is asking and what world they live in, like your job and your audience",
      "is_correct": true,
      "explanation": "Right. The charge nurse example shows the role step is about telling the AI about you: your vocabulary, your audience, and your stakes, so it knows which version of itself to be."
    }
  ]
}
```

## reading

**Step 2: State the exact task and the constraints.** A topic is "the flu shot reminder." A task is "write a 4-sentence message reminding day-shift nurses that flu shot documentation is due by Friday, and that anyone who has not logged theirs needs to see me before they clock out." See the difference? The task names the output, the length, the deadline, and the action you want people to take. Constraints are the part almost everyone skips, and they are exactly what separates a vague paragraph from a message you can paste and send. Constraints include length, what to leave out, the deadline, and the one thing the reader must do.

**Step 3: Specify the format.** Tell the AI the shape you want the answer to take. Do you want bullet points or full sentences? A table or a paragraph? An email with a subject line, or a quick Slack message? If you do not say, the AI guesses, and it usually guesses "medium-length paragraph," which is rarely what you actually need. "Give it to me as three bullets" or "format it as a short email with a subject line" removes all the guessing.

Put together, the frame is one breath: **"I am a [role] doing [context]. I need [exact task with constraints]. Give it to me as [format]."**

## multiple_choice

```json
{
  "stem": "A paralegal types: \"I am a paralegal at a small estate-planning firm. I need a plain-English summary of this 12-page trust document for a client with no legal background, as five short bullet points.\" Which of the three framing steps is MISSING?",
  "options": [
    {
      "id": "a",
      "label": "Role and context",
      "is_correct": false,
      "explanation": "The role is clearly stated: a paralegal at an estate-planning firm writing for a non-legal client. That step is covered."
    },
    {
      "id": "b",
      "label": "Nothing is missing; all three steps are present",
      "is_correct": true,
      "explanation": "Correct. Role and context (paralegal, non-legal client), task and constraint (summarize 12 pages in plain English), and format (five short bullets) are all there. This is a complete frame."
    },
    {
      "id": "c",
      "label": "Format",
      "is_correct": false,
      "explanation": "The format is specified: five short bullet points. That is exactly what the format step asks for."
    }
  ]
}
```

## reading

Here is the full thing for a real person. A high school history teacher needs a parent email about a field trip. The lazy version is "write a field trip email." The framed version is this: "I am a 10th-grade history teacher at a public high school. I need a short email to parents about a field trip to the state capitol on May 14th. It must mention that the permission slip is due May 7th, that lunch is provided, and that students need to wear closed-toe shoes. Keep it warm but professional, under 150 words, and format it as an email with a subject line." The first prompt gets a generic template the teacher has to rewrite. The second gets a sendable email with the subject line, the deadline, and the three logistics already baked in.

One more, for an office manager handling a touchy situation. The unframed version: "write something about the kitchen being messy." That gets a passive-aggressive notice nobody respects. The framed version: "I am the office manager at a 40-person marketing agency. I need a friendly all-staff message asking people to clean up after themselves in the shared kitchen. It should not name anyone, should not sound like a scolding, and should end with a light, positive note. Keep it under 100 words and format it as a Slack message." Now the AI knows the tone is light, the rule is no naming, and the channel is Slack, so it will not write a formal memo.

Notice what every framed example has in common. None of them are longer because the person typed more words for the sake of it. They are longer because each sentence does a job: one sets the role, one sets the task and limits, one sets the shape. That is the whole technique. You are not writing a better prompt. You are briefing a capable assistant who needs to know who you are, what you actually want, and what it should look like when it is done.

The reason this works is simple. The AI does not know anything about your job, your reader, or your standards until you tell it. Every detail you leave out, it fills in with the most average guess possible. Framing is just the act of replacing those average guesses with your real situation, before they happen.

## multiple_choice

```json
{
  "stem": "Based on the worked examples, why are the framed prompts longer than the lazy ones?",
  "options": [
    {
      "id": "a",
      "label": "Because each extra sentence does a job: one sets the role, one sets the task and limits, one sets the shape",
      "is_correct": true,
      "explanation": "Right. The reading says none of them are longer for the sake of more words. They are longer because every sentence does one of the three jobs."
    },
    {
      "id": "b",
      "label": "Because longer prompts always produce better answers from the AI",
      "is_correct": false,
      "explanation": "The reading is explicit that the framed prompts are not longer just to type more words. Length itself is never the point here."
    },
    {
      "id": "c",
      "label": "Because the AI needs polite filler words to take the request seriously",
      "is_correct": false,
      "explanation": "Nothing in the examples adds polite filler. The added length is role, task with limits, and format, each doing a specific job."
    }
  ]
}
```

## reading

Once people learn the three steps, the same predictable mistakes show up. Knowing them ahead of time saves you the frustration of wondering why your framed request still came back wrong.

**Mistake 1: Most people confuse a topic with a task.** They write "I am an HR manager. Help me with the new hire onboarding." They feel like they framed it because they added the role. But "help me with onboarding" is still a topic, not a task. The AI does not know if you want a checklist, an email, a schedule, or a policy. Fix it by naming the deliverable out loud: "draft a day-one welcome email for a new hire starting Monday." The test is simple. If you cannot picture the finished thing in your head, the AI cannot either.

**Mistake 2: People give a role but skip their real context.** "Act as a marketing expert" is the most common opener, and it is nearly useless. It tells the AI to sound confident but gives it nothing about your actual world. The role step is not about flattering the AI into expert mode. It is about describing you: your job, your company size, your audience. "I run marketing for a 12-person dental practice" beats "act as a marketing expert" every time, because it is true and specific.

## fill_blank

```json
{
  "template": "A complete frame names your {{1}}, states the exact {{2}} along with constraints like length, and specifies the {{3}} you want the answer to take.",
  "blanks": [
    { "id": "1", "accept": ["role", "context", "role and context"], "ideal": "role" },
    { "id": "2", "accept": ["task", "output", "deliverable"], "ideal": "task" },
    { "id": "3", "accept": ["format", "shape", "structure"], "ideal": "format" }
  ],
  "explanation": "Role, task with constraints, and format. When an answer comes back generic, check which of these three you left out."
}
```

## reading

**Mistake 3: People skip constraints because they feel obvious.** You know the email should be short. You know not to mention the budget. But the AI does not know what is in your head. If you do not say "under 100 words" you will get 300. If you do not say "do not mention the price increase" it might lead with it. Constraints are not nitpicking; they are the difference between a draft you can send and a draft you have to rewrite. Say the obvious thing out loud.

**Mistake 4: People believe a longer prompt is automatically a better prompt.** So they pile on detail that does not do any of the three jobs. Adding "please be thorough and professional and high quality" does nothing, because those words do not set a role, a task, or a format. Length is not the goal. Coverage is. A good frame can be three sentences. A bad one can be three paragraphs of filler.

The pattern behind all four mistakes is the same: people do part of the framing and assume the rest is understood. The AI never assumes what you meant. It only works with what you wrote. When an answer comes back off, do not retype the whole thing. Look at your frame and ask which of the three steps you left thin. Nine times out of ten, you skipped the task or the constraints.

## multiple_choice

```json
{
  "stem": "According to Mistake 4, what makes a prompt good, since length is not the goal?",
  "options": [
    {
      "id": "a",
      "label": "Adding phrases like \"please be thorough and professional and high quality\"",
      "is_correct": false,
      "explanation": "The reading singles out that exact phrase as doing nothing, because those words do not set a role, a task, or a format."
    },
    {
      "id": "b",
      "label": "Making the prompt at least three paragraphs long",
      "is_correct": false,
      "explanation": "The reading says a bad frame can be three paragraphs of filler. More paragraphs is not what makes a prompt good."
    },
    {
      "id": "c",
      "label": "Writing in a confident, expert-sounding tone",
      "is_correct": false,
      "explanation": "Tone is not the measure here. Mistake 4 is about coverage of the three jobs, not how confident the wording sounds."
    },
    {
      "id": "d",
      "label": "Coverage: whether the prompt does the role, task, and format jobs, even in three sentences",
      "is_correct": true,
      "explanation": "Right. The reading says length is not the goal, coverage is. A good frame can be three sentences as long as it covers role, task, and format."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "Same goal, two requests. Watch how the second one does all three framing jobs in three sentences.",
  "before_prompt": "Write an email to staff about the parking changes.",
  "after_prompt": "I am the office manager at a 60-person insurance firm. Write a short all-staff email letting people know that, starting March 1st, the north lot will be closed for repaving and everyone should use the street garage on Elm with their existing badge. Keep it under 120 words, do not sound alarmed, and end by thanking people for their patience. Format it as an email with a subject line.",
  "changes": [
    "Adds role and context: an office manager at a 60-person insurance firm, which sets the audience and tone.",
    "Names the exact task and constraints: the date, the lot closing, the alternative garage, the badge detail, the 120-word limit, and the no-alarm rule.",
    "Specifies the format: an email with a subject line, so the AI does not return a vague paragraph."
  ]
}
```

## multiple_choice

```json
{
  "stem": "You framed a request with a clear role and a clear format, but the answer came back twice as long as you wanted and mentioned a detail you wished it had left out. Which framing step did you most likely leave thin?",
  "options": [
    {
      "id": "a",
      "label": "The task and its constraints",
      "is_correct": true,
      "explanation": "Right. Length limits and what to leave out are constraints, which live in the task step. A missing word count gives you a long answer, and a missing exclusion gives you the detail you did not want."
    },
    {
      "id": "b",
      "label": "The role and context",
      "is_correct": false,
      "explanation": "The question says the role was clear. Role shapes tone and vocabulary, not length or which details get included."
    },
    {
      "id": "c",
      "label": "The format",
      "is_correct": false,
      "explanation": "The question says the format was clear. Format controls the shape, like bullets versus paragraphs, not the length or the content choices."
    }
  ]
}
```

## mini_project

Pick a message or document you actually have to produce this week: a parent email, a shift reminder, a client summary, an all-staff note, whatever is sitting on your list. Before you write it yourself, frame it for the AI using all three steps in order.

- Write one sentence of role and context: your job, your company or unit, and who will read this.
- Write one sentence of task and constraints: the exact deliverable, the length, the deadline if there is one, and anything the AI must leave out.
- Write one sentence of format: bullets, table, email with a subject line, or short message.
- Run the framed version, then delete the role sentence and run it again. Compare the two answers side by side and notice exactly what the role was buying you.
