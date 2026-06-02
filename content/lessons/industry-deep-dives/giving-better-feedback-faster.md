---
slug: giving-better-feedback-faster
module: industry-deep-dives
title: "Giving Better Feedback, Faster"
level: growing
minutes: 8
order: 21
hook: A stack of thirty essays does not have to cost you your weekend, and your students do not have to wait two weeks to hear from you.
key_takeaway: AI turns your shorthand judgment into specific, kind, actionable feedback in the student's own context, so you grade the thinking and let the model do the wording.
tags: [education, writing, editing]
---

## reading

The hardest part of feedback is not deciding what is wrong. You can see in ten seconds that a paragraph has no evidence or that an argument never answers the question. The hard part is writing that out thirty times, kindly and specifically, without turning into a tired person who just writes "needs more detail" in the margin.

That gap, between what you notice and what you have time to write, is exactly where AI helps. You supply the judgment. The model supplies the wording.

The move is to give the AI three things: the assignment or standard you are grading against, the student's actual work, and your shorthand reaction. Your reaction can be rough. "Thesis is fine, body paragraph two has no evidence, conclusion just repeats the intro" is enough. The model expands that into feedback the student can act on, phrased in a tone you choose.

Two habits keep this honest. First, write the judgment yourself. If you let the AI decide whether the essay is good, you have outsourced the one thing only you can do. Feed it your assessment, not a blank essay with "grade this." Second, read every comment before it goes back. The model can invent a strength that is not there or soften a problem you wanted named plainly. You are still the teacher signing the feedback.

Done this way, the student gets a longer, more specific, more encouraging note than a rushed margin scrawl, and you get your evening back. The feedback is still yours. You just stopped doing the typing.

## before_after [personalizable]

```json
{
  "question": "You jotted a quick reaction to a student's persuasive essay. Which prompt turns your shorthand into feedback the student can actually use?",
  "before_prompt": "Give feedback on this student essay about why the school day should start later.",
  "after_prompt": "You are helping me write feedback for a 7th grade persuasive essay on starting the school day later, graded against our rubric: clear claim, two pieces of evidence, and a counterargument. Here is my shorthand assessment: claim is strong and clear, only one piece of evidence and it is an opinion not a fact, no counterargument at all, writing is lively. Turn this into warm, specific feedback addressed to the student. Open with a genuine strength, name the two gaps concretely with a fix for each, and end with one encouraging next step. Keep it to about 120 words.",
  "changes": [
    "Supplies the rubric, so feedback is tied to what was actually assessed rather than generic essay advice.",
    "Feeds the teacher's own judgment instead of asking the AI to grade the essay itself.",
    "Names the tone and structure wanted: a real strength first, concrete gaps with fixes, an encouraging close.",
    "Sets a length, so the note is long enough to help but short enough to read."
  ]
}
```

## multiple_choice

```json
{
  "stem": "A colleague pastes student essays into the AI with just 'grade this and write feedback,' then copies the result onto the papers. What is the core problem with that workflow?",
  "options": [
    {
      "id": "a",
      "label": "It hands the AI the judgment that only the teacher should make, and skips the read-back that catches invented strengths or softened problems.",
      "is_correct": true,
      "explanation": "Correct. The teacher's job is the assessment. Letting the model decide quality, then passing its words on unread, outsources the one part that has to be yours and risks sending feedback that misreads the work."
    },
    {
      "id": "b",
      "label": "Nothing, as long as the essays are good the AI will grade them accurately every time.",
      "is_correct": false,
      "explanation": "The model can misjudge an essay, praise something that is not there, or soften a real gap. Accuracy is not guaranteed, which is why you supply the judgment and read every comment."
    },
    {
      "id": "c",
      "label": "The only issue is speed, since pasting essays one at a time is slower than grading by hand.",
      "is_correct": false,
      "explanation": "Speed is not the concern here. The problem is whose judgment is driving the feedback and whether anyone checked the output before it reached the student."
    }
  ]
}
```

## mini_project

Take a real set of student work you need to grade, even just five pieces. For each one, write your honest shorthand reaction in a sentence or two, the way you would think it but not the way you would say it to a student. Then give the AI your rubric or the assignment, one student's work, and your shorthand, and ask it to expand your reaction into warm, specific feedback with one strength, the concrete gaps, and a next step. Read each note before it goes out and fix anything the model got wrong. Compare how long this took to your usual pace, and notice whether the students got more specific feedback than they normally would.
