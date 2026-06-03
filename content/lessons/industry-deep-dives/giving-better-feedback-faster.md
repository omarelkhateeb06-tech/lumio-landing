---
slug: giving-better-feedback-faster
module: industry-deep-dives
title: "Giving Better Feedback, Faster"
level: growing
minutes: 15
order: 21
hook: A stack of thirty essays does not have to cost you your weekend, and your students do not have to wait two weeks to hear from you.
key_takeaway: AI turns your shorthand judgment into specific, kind, actionable feedback in the student's own context, so you grade the thinking and let the model do the wording.
tags: [education, writing, editing]
---

## reading

The hardest part of feedback is not deciding what is wrong. You can see in ten seconds that a paragraph has no evidence, or that an argument never answers the question, or that a lab report skipped the analysis and jumped straight to the conclusion. The hard part is writing all of that out, kindly and specifically, thirty times in a row, without turning into a tired person who just scrawls "needs more detail" in the margin at 9pm.

That gap, between what you notice and what you have time to write, is exactly where AI helps. You supply the judgment. The model supplies the wording.

The move is simple. You give the AI three things: the assignment or rubric you are grading against, the student's actual work, and your shorthand reaction. Your reaction can be rough and ugly, the way you actually think it. "Thesis is fine, body paragraph two has no evidence, conclusion just repeats the intro" is plenty. The model takes that and expands it into feedback the student can act on, written in a tone you choose. You stay the teacher. You just stop doing the typing.

Let me show you what this looks like with real work.

Take a 7th grade persuasive essay arguing the school day should start later. Your rubric has three things on it: a clear claim, two pieces of evidence, and a counterargument. You read the essay and your honest reaction is, "Claim is strong and clear. Only one piece of evidence and it is really just an opinion dressed up as a fact. No counterargument at all. The writing itself is lively and fun to read." That is your whole assessment, and it took you about forty seconds. Now you hand the AI the rubric, the essay, and that reaction, and you ask it to write warm, specific feedback addressed to the student: open with a real strength, name the two gaps with a concrete fix for each, and close with one encouraging next step. What comes back is a 120 word note that praises the lively voice, explains the difference between an opinion and a cited fact, asks for one source the student could add, points out that a counterargument was missing and shows where it would go, and ends on a "you are close, here is the next move" note. You read it, you tweak one sentence, it goes out. You did the thinking. The AI did the writing.

Now scale it up. You have a stack of thirty biology lab reports on enzyme activity, all graded against the same rubric: hypothesis, procedure, data table, and analysis. As you skim each one, you are mostly writing the same three or four reactions in different combinations. "Data table is clean, but the analysis just restates the numbers instead of explaining what they mean." "Hypothesis is missing entirely, jumped straight into procedure." "Strong analysis, but no control mentioned." You can write these shorthand reactions fast because you are a biology teacher and this is exactly the judgment you are trained to make. Then you batch them. You give the AI your rubric once, and for each report you paste the student's work and your two-line reaction, and it expands each one into a feedback paragraph in a consistent, encouraging voice. Thirty reports that would have taken you a full evening of margin-writing now take you the time to skim and react, plus a few minutes per report to read and approve the expanded note. The student gets a real paragraph instead of a checkmark.

Or take something shorter. A set of short-answer history responses where students had to explain one cause of the Great Depression in three or four sentences. You read thirty of them. Some nail it, some confuse a cause with an effect, some give a real cause but no explanation of the mechanism. Your shorthand for one might be, "Identified bank failures correctly, but never explained why a bank failure hurt ordinary families." That single sentence of judgment is the whole point. The AI turns it into two or three sentences of student-facing feedback that names the strength, explains the missing link, and points the student toward the connection they almost made. You would never have written that out by hand for all thirty. Now you can.

In every one of these cases, notice what you did and what the AI did. You read the work. You decided what was strong and what was weak. You made the call about whether bank failures were explained or just named. The AI never made a single judgment about quality. It took your judgment and made it longer, warmer, and more specific than a rushed margin note ever could be. That division of labor is the entire skill. Keep the judgment. Give away the typing.

## multiple_choice

```json
{
  "stem": "You want AI to help you write feedback on a stack of essays without losing what makes the feedback yours. What do you hand the AI, and what do you keep for yourself?",
  "options": [
    {
      "id": "a",
      "label": "Hand it a blank essay and ask it to grade the work and write the feedback, then copy what it says.",
      "is_correct": false,
      "explanation": "This gives away the one part that has to be yours: deciding whether the work is good. The AI is not a better judge of your student's essay than you are. Keep the judgment, hand off the wording."
    },
    {
      "id": "b",
      "label": "Hand it the rubric, the student's work, and your own shorthand reaction, and keep the judgment about quality for yourself.",
      "is_correct": true,
      "explanation": "Correct. You supply the assessment in rough form. The AI expands it into specific, warm, student-facing language. You stayed the teacher and skipped only the typing."
    },
    {
      "id": "c",
      "label": "Hand it nothing about the assignment, just the essay, so it forms a fresh unbiased opinion of the work.",
      "is_correct": false,
      "explanation": "Without the rubric you get generic essay advice, and without your reaction the AI is guessing at quality. The point is to tie feedback to what you actually assessed, not to outsource the assessment."
    }
  ]
}
```

## reading

The workflow is simple, but there are a few ways it goes wrong on a real Tuesday with a real stack of papers. Knowing them ahead of time saves you from learning them the hard way.

The first is a privacy problem, and it is the one with real consequences. If you paste a student's actual work into a free public AI tool with their name on the page, you may be handing identifiable student data to a company whose terms let them keep and train on it. A 7th grader's essay with their name in the header is a student record. Strip names before pasting, or use a tool your school or district has approved for student data. This is not a judgment call you want to discover you got wrong after the fact, so build the habit of removing names every time, even when you are tired and it feels like a hassle.

The second is the temptation to outsource the assessment itself. It is genuinely faster to paste an essay and type "is this a good essay, and write feedback." Do not do this. The AI does not know your students, your standards, or what this particular kid was capable of last month. It will produce a confident judgment that sounds right and may be wrong. The moment you let the model decide whether the work is good, you have given away the only part of grading that required you. Feed it your judgment, not a blank essay.

The third shows up when you send AI feedback without reading it. The model is built to be encouraging, so it will invent a strength that is not in the work. It will tell a student their "vivid use of evidence" was wonderful when the whole problem was that there was no evidence. It will also soften a gap you wanted named plainly, turning "you never answered the question" into "you might consider exploring the prompt further," which the student will not understand as a problem. Read every note before it goes out. You are the one signing the feedback, so it has to say what you mean.

The fourth is subtler and easy to slide into over a long grading session. You start treating the AI as the authority on the student's work instead of as a writing assistant for your conclusions. You catch yourself wondering if the AI is right and you are wrong about a paragraph. It is not the authority. It never read the assignment in class, never saw the student struggle with the same skill last week, never set the standard. You did all of that. The AI's job is to phrase your call well, not to make the call. If you keep that straight, every other mistake on this list gets easier to avoid, because you will never be tempted to send something you did not actually decide.

## multiple_choice

```json
{
  "stem": "You expanded thirty lab reports with AI and you are about to send the feedback. One note praises a student's 'careful control group' that you do not remember seeing. What is the right move, and why?",
  "options": [
    {
      "id": "a",
      "label": "Send it anyway. If the AI saw a control group, it was probably there and you missed it while skimming.",
      "is_correct": false,
      "explanation": "The AI is built to be encouraging and will invent strengths that are not in the work. Treating it as the authority on the student's report is exactly the mistake to avoid."
    },
    {
      "id": "b",
      "label": "Delete the whole note and grade that one entirely by hand, since the AI clearly cannot be trusted at all.",
      "is_correct": false,
      "explanation": "You do not need to throw out the workflow. You need to read and correct the output, which is the step that catches invented strengths. One fix, not a full retreat."
    },
    {
      "id": "c",
      "label": "Check the report yourself, and if there is no control group, cut the false praise before the note goes out.",
      "is_correct": true,
      "explanation": "Correct. Reading every note before it goes out is what catches the AI inventing a strength. You are the one signing the feedback, so it has to match the actual work."
    }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "You jotted a quick reaction to a student's persuasive essay. Which prompt turns your shorthand into feedback the student can actually use?",
  "before_prompt": "Give feedback on this student essay about why the school day should start later.",
  "after_prompt": "You are helping me write feedback for a 7th grade persuasive essay on starting the school day later, graded against our rubric: a clear claim, two pieces of evidence, and a counterargument. The student's name has been removed. Here is my shorthand assessment: claim is strong and clear, only one piece of evidence and it is an opinion not a fact, no counterargument at all, the writing is lively. Turn this into warm, specific feedback addressed to the student. Open with a genuine strength, name the two gaps concretely with a fix for each, and end with one encouraging next step. Keep it to about 120 words. Do not praise anything I did not list, and do not soften the missing counterargument.",
  "changes": [
    "Supplies the rubric and notes the name was removed, so feedback is tied to what was assessed and student data is protected.",
    "Feeds the teacher's own judgment instead of asking the AI to decide whether the essay is good.",
    "Names the tone, structure, and length wanted, and tells the model not to invent strengths or soften the gap you wanted named plainly."
  ]
}
```

## multiple_choice

```json
{
  "stem": "Your shorthand on a history short-answer is 'identified bank failures as a cause but never explained why that hurt families.' Which instruction added to your prompt best protects the feedback from going wrong?",
  "options": [
    {
      "id": "a",
      "label": "Tell the AI to decide if the answer deserves full credit and grade it on a scale of one to ten.",
      "is_correct": false,
      "explanation": "This hands the AI the judgment that has to be yours. The grade is your call. The AI's job is to phrase the feedback for the call you already made."
    },
    {
      "id": "b",
      "label": "Tell the AI to make the feedback as encouraging as possible so the student feels good no matter what.",
      "is_correct": false,
      "explanation": "Pushing for maximum encouragement is how you get invented strengths and softened gaps. You want warm and honest, with the missing explanation named plainly."
    },
    {
      "id": "c",
      "label": "Tell the AI to name only the strength I listed, explain the missing link about families, and not add praise I did not write.",
      "is_correct": true,
      "explanation": "Correct. Constraining the AI to your judgment keeps it from inventing a strength, and asking it to explain the missing mechanism turns your shorthand into something the student can act on."
    }
  ]
}
```

## mini_project

Take a real set of student work you actually need to grade, even just five pieces, and pick one rubric or assignment they all share. For each piece, read it and write your honest shorthand reaction in a sentence or two, the way you think it rather than the way you would say it to a student. Then strip the student names, hand the AI the rubric plus one student's work plus your shorthand, and ask it to expand your reaction into warm, specific feedback with one real strength, the concrete gaps with a fix for each, and an encouraging next step. Read every note before it goes out, cut any praise the model invented, and put back any plainness it softened. Compare how long this took to your usual pace, and notice whether the students got more specific feedback than they normally would.

- Remove student names from every piece before it touches the AI tool, and use a tool your school has approved for student work.
- Write your own one or two sentence judgment for each piece first, so the AI is expanding your assessment and never making it.
- Read and correct each expanded note before it goes to a student, fixing invented strengths and restoring anything the model softened.
