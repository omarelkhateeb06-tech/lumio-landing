---
slug: ai-for-lesson-planning-build-a-week-in-minutes
module: industry-deep-dives
title: "AI for Lesson Planning: Build a Week in Minutes"
level: growing
minutes: 15
order: 20
hook: The Sunday-night planning marathon can become a fifteen-minute draft-and-refine session, with you still making every real teaching decision.
key_takeaway: Give AI your grade, your standard, and your constraints, and it drafts a coherent week you can shape, so your evening goes to refining instruction instead of building scaffolding from scratch.
tags: [education, planning, writing]
---

## reading

Lesson planning is the work that quietly eats teachers' evenings and weekends. The thinking is not the hard part. The volume of structure is. Every week you lay out a five-day arc, sequence objectives, draft warm-ups, write a check for understanding, and list the materials each day needs. That scaffolding is real labor, and it is exactly the part AI can draft for you, so your time goes to the instructional decisions only you can make. The goal is not to hand your week to a machine. The goal is to skip the blank page and start from a frame you react to.

The most common mistake is asking for too little. "Give me a lesson on fractions" returns something generic and gradeless, useless to a real classroom. A good request gives the AI what a substitute teacher would need before walking into your room. Tell it five things: the grade level, the subject and specific topic, the standard you are teaching to, how long each class runs, and anything true about your students that shapes how you teach. Those five inputs turn a vague request into a draft you can actually use.

## multiple_choice

```json
{
  "stem": "You want AI to draft a usable week, not something generic. Which request gives it what it needs?",
  "options": [
    {
      "id": "a",
      "label": "\"Make me a fun lesson about the water cycle.\"",
      "is_correct": false,
      "explanation": "This has no grade, no standard, no class length, and no student notes. The AI will guess at all of it and hand you something gradeless and generic."
    },
    {
      "id": "b",
      "label": "\"I teach 5th grade science, introducing the water cycle toward my state's standard on Earth's water systems, 45-minute periods, students who read below grade level. Draft a five-day arc with an objective, warm-up, activity, check for understanding, and materials per day.\"",
      "is_correct": true,
      "explanation": "Correct. It names grade, topic, standard, class length, and a real student note, then asks for the exact structure you need. That is what turns a vague request into a draft you can actually shape."
    },
    {
      "id": "c",
      "label": "\"Plan my whole week and make all the teaching decisions for me.\"",
      "is_correct": false,
      "explanation": "The AI does not know your students or your pacing, so it cannot make your teaching decisions. Its job is to build the frame; the decisions stay with you."
    },
    {
      "id": "d",
      "label": "\"Give me a lesson on the water cycle.\"",
      "is_correct": false,
      "explanation": "Too thin. With no grade, standard, length, or student context, you get a generic result that needs as much work as starting from scratch."
    }
  ]
}
```

## reading

Here is what that looks like in a real classroom. Picture a 4th grade math teacher introducing equivalent fractions, working toward the state fraction-equivalence standard, with 50-minute periods, and a handful of students still shaky on their multiplication facts. The request might be: "I teach 4th grade math. This week I am introducing equivalent fractions, aligned to my state's fraction-equivalence standard. Classes are 50 minutes. Several students are still shaky on multiplication facts. Draft a five-day arc, one day per lesson, each with an objective, a warm-up, a main activity, a quick check for understanding, and the materials I will need." What comes back is a week with a logical build: day one uses folded paper strips to show that one half and two fourths cover the same length, day two introduces multiplying numerator and denominator by the same number, later days add a fraction wall and a sorting game. You did not write any of that from scratch. You react to it. You move objectives, swap the sorting game for something your class responds to, and cut whatever does not fit your pacing.

Now picture a 7th grade life-science teacher opening a unit on cell structure, working toward the state standard on cells as the basic unit of life, with 45-minute periods and a class that did well on the last lab but struggles with vocabulary. The same five inputs produce a different shaped week: a warm-up that surfaces what students already think a cell is, a main activity building a labeled model, a check that asks students to name the job of one organelle in their own words. Because you told the AI the class struggles with vocabulary, you can push it further and ask for a word bank and a sentence frame for the exit ticket. The frame is generic until your inputs make it specific, and the student note is what makes it specific.

## multiple_choice

```json
{
  "stem": "In the worked examples, the 7th grade class struggles with vocabulary. How does that single student note change what you can ask the AI for?",
  "options": [
    {
      "id": "a",
      "label": "It tells the AI to skip the main activity, since vocabulary-heavy classes cannot build a model.",
      "is_correct": false,
      "explanation": "The note does not remove the model-building activity. It lets you add support around the lesson, not strip the activity out."
    },
    {
      "id": "b",
      "label": "It means you should switch to the 4th grade fractions plan instead.",
      "is_correct": false,
      "explanation": "The grade and topic do not change because of a student note. The note shapes the support inside the same plan, not the subject of the lesson."
    },
    {
      "id": "c",
      "label": "You can push the AI further and ask for a word bank and a sentence frame for the exit ticket.",
      "is_correct": true,
      "explanation": "Correct. The student note is what makes a generic frame specific. Telling the AI the class struggles with vocabulary lets you request a word bank and a sentence frame tied to that need."
    },
    {
      "id": "d",
      "label": "It guarantees the AI will produce a perfect, ready-to-teach lesson with no editing.",
      "is_correct": false,
      "explanation": "A good note sharpens the draft, but you still react to it and shape it. The note makes the frame specific; it does not remove your teacher pass."
    }
  ]
}
```

## reading

One more. A high-school history teacher planning a single lesson on the causes of World War One, aimed at the state standard on analyzing causes of major conflicts, with an 80-minute block and students who can recall facts but struggle to connect them into an argument. Here the teacher does not want five days of recall. They want one day of analysis. So the request names that: "Draft one 80-minute lesson where students move from listing causes to building a short claim about which cause mattered most, with evidence." The AI returns a structure, a sorting activity, a claim-and-evidence organizer, a closing write. The teacher keeps the bones and brings the judgment about which sources to use and how hard to push.

Across all three, the pattern is the same. You give the AI the grade, the topic, the standard, the class length, and the student notes. It builds the frame. You make the teaching decisions the frame exists to serve. That division of labor is the whole point. The AI does not know your students, your room, or your pacing, and it is not supposed to. It clears the structural work off your plate so the part that needs a teacher gets a teacher.

What you should expect from a good draft is coherence, not perfection. The days should connect. The objectives should build on each other. The checks for understanding should actually match the day's objective. When something is off, that is information: it tells you where your own thinking needs to go. Reacting to a flawed draft is faster than facing an empty planner, and the editing you do is the real instructional design. By the end you have a week that is yours, built in minutes, shaped by judgment.

## multiple_choice

```json
{
  "stem": "The lesson says you should expect coherence, not perfection, from a good draft. What does it say to do when part of the draft is off?",
  "options": [
    {
      "id": "a",
      "label": "Treat the off part as information that tells you where your own thinking needs to go.",
      "is_correct": true,
      "explanation": "Correct. A flaw is a signal. It points to where your judgment is needed, and reacting to a flawed draft is faster than facing an empty planner."
    },
    {
      "id": "b",
      "label": "Start the whole week over from a blank planner, since a flawed draft is worthless.",
      "is_correct": false,
      "explanation": "The lesson says the opposite. Reacting to a flawed draft is faster than facing an empty planner, and the editing you do is the real instructional design."
    },
    {
      "id": "c",
      "label": "Keep it as written, since coherence means the draft is finished.",
      "is_correct": false,
      "explanation": "Coherence is not perfection. The draft is a starting point you shape, not a finished plan you leave untouched."
    },
    {
      "id": "d",
      "label": "Hand the off part back to the AI and let it make the final teaching call.",
      "is_correct": false,
      "explanation": "The teaching decisions inside the frame are yours. The AI does not know your students, your room, or your pacing, so the call stays with you."
    }
  ]
}
```

## reading

The fastest way to get burned by an AI-drafted week is to treat the draft as an authority instead of a starting point. Three errors show up again and again, and all three are avoidable once you know to look for them.

First, verify any standard the AI names or quotes. This is the most common failure in planning specifically. The model works from memory, and it will confidently produce a standard code that looks official, format it neatly next to each objective, and still have it wrong. It misattributes codes, and it paraphrases the wording of standards in ways that drift from the official text. Your alignment has to be exact, because that is what your plan book, your evaluations, and your reporting depend on. So before any standard goes in your plan, pull the exact code and wording from your official standards document, not from the draft. Consistency is a trap here: the AI can apply the same wrong code across all five days, and a uniformly formatted mistake is still a mistake.

Second, check any factual content the AI builds a lesson around, especially in science and history. This is where a confident wrong detail does real damage, because it travels straight from the draft into your slides and out of your mouth in front of thirty students. The AI might give a 7th grade life-science class an organelle the wrong job, or hand a high-school history class a date or a cause that is subtly off. The draft will not flag any of this. It states wrong facts with the same calm tone it uses for right ones. So treat every factual claim in a science or history lesson as unverified until you have confirmed it against a source you trust. The structure can be a gift while the content still needs your eyes.

## fill_blank

```json
{
  "template": "Before you put an AI-drafted week in your plan book, verify every standard the AI names against your {{1}}, because the model misattributes codes and paraphrases wording. And for any science or history lesson, check the {{2}} the AI states, since a confident wrong detail travels straight into your slides.",
  "blanks": [
    {
      "id": "1",
      "accept": ["official standards document", "official document", "standards document", "official standards", "state standards document"],
      "ideal": "official standards document"
    },
    {
      "id": "2",
      "accept": ["facts", "factual content", "factual claims", "facts it states", "content", "details"],
      "ideal": "facts"
    }
  ],
  "explanation": "Standards must come from the authoritative source, not the model's memory, because it misattributes codes and paraphrases wording. And factual content in science and history needs checking, because the AI states wrong details as confidently as right ones."
}
```

## reading

Third, and underneath both of the above, do not mistake the AI draft for teaching judgment. The draft does not know your students. It does not know that third period moves faster than first, that you have two students who need the warm-up scaffolded, or that your real periods run short on assembly days. It does not know your pacing, your room, or your read on which activity will land. When the draft says "ten minutes of partner discussion," it is guessing. You know whether your class can sustain that. The error is letting the draft's confident specificity override what you actually know. The fix is a habit: treat every piece of the draft as a proposal you approve, edit, or reject, never as an instruction you follow. The AI built the frame. The teaching decisions inside that frame are yours, and the whole value of the tool depends on you keeping them.

## multiple_choice

```json
{
  "stem": "The draft says \"ten minutes of partner discussion\" for a day. According to the lesson, what is the right way to read that instruction?",
  "options": [
    {
      "id": "a",
      "label": "As a fixed requirement, since the draft was specific about the timing.",
      "is_correct": false,
      "explanation": "Confident specificity is not knowledge. The draft is guessing at the timing; letting that override what you know about your class is exactly the error to avoid."
    },
    {
      "id": "b",
      "label": "As proof the AI understands your pacing and your room.",
      "is_correct": false,
      "explanation": "The draft does not know your pacing, your room, or which activity will land. A specific number does not mean the AI knows your students."
    },
    {
      "id": "c",
      "label": "As a reason to ask the AI whether your class can sustain ten minutes.",
      "is_correct": false,
      "explanation": "The AI cannot answer that. You are the one who knows whether your class can sustain it; the judgment is yours, not the model's."
    },
    {
      "id": "d",
      "label": "As a proposal you approve, edit, or reject, because you know whether your class can sustain it.",
      "is_correct": true,
      "explanation": "Correct. The fix is a habit: treat every piece of the draft as a proposal, never as an instruction you follow. The teaching decisions inside the frame are yours."
    }
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Draft a week of lessons you can refine. Give the AI your grade, subject and topic, the standard, your class length, and anything about your students. Or use the sample: 4th grade math, introducing equivalent fractions, 50-minute classes, with several students still shaky on multiplication facts.",
  "system_prompt": "You are an experienced K-12 curriculum coach helping a classroom teacher. Given a grade, subject, topic, standard, class length, and notes about the students, draft a five-day lesson arc, one day per lesson. For each day give a clear objective, a short warm-up, a main activity, a quick check for understanding, and a materials list. Keep activities concrete and age-appropriate. Remind the teacher to confirm the exact standard wording against their official document, since you may paraphrase it. No jargon. No em dashes.",
  "ideal_output": "Here is a five-day arc for introducing equivalent fractions in 4th grade math, 50-minute periods. Please confirm the exact wording of your fraction-equivalence standard against your official document, since I am working from a paraphrase.\n\nDay 1. Objective: students recognize that two fractions can name the same amount. Warm-up: a quick review of multiplication facts as skip-counting, to support the students who are shaky. Main activity: fold paper strips to show that one half and two fourths cover the same length. Check: students draw one pair of equivalent fractions. Materials: paper strips, markers.\n\nDay 2. Objective: students build equivalent fractions by multiplying numerator and denominator by the same number. Warm-up: name a fraction shown on a number line. Main activity: guided practice multiplying top and bottom by the same number, tied back to the paper strips. Check: three exit problems. Materials: number-line handout.\n\nDay 3. Objective: students compare two fractions using a fraction wall. Warm-up: skip-count by threes and fours. Main activity: build a fraction wall and find equivalent rows. Check: name two equivalent fractions from the wall. Materials: fraction wall printout.\n\nDay 4. Objective: students sort fractions into equivalent groups. Warm-up: quick true-or-false on equivalence. Main activity: partner sorting game with fraction cards. Check: explain in one sentence why two cards belong together. Materials: fraction card sets.\n\nDay 5. Objective: students show what they have learned. Warm-up: a single confidence-builder problem. Main activity: short formative quiz, then a fix-it review. Check: the quiz itself. Materials: quiz copies.\n\nWant me to expand any single day into a full lesson with timings?",
  "input_placeholder": "Grade, subject and topic, the standard, class length, and notes about your students..."
}
```

## multiple_choice

```json
{
  "stem": "Your AI-drafted week looks great, and day three's main activity rests on a science fact you are not sure about. What is the right move before you teach it?",
  "options": [
    {
      "id": "a",
      "label": "Teach it as written, since the draft was coherent and the rest of the week checked out.",
      "is_correct": false,
      "explanation": "Coherence is not accuracy. The AI states wrong facts in the same confident tone as right ones, and a science error travels straight into your lesson if you do not catch it."
    },
    {
      "id": "b",
      "label": "Confirm the fact against a source you trust before it goes in your slides, because the AI states wrong details as confidently as right ones.",
      "is_correct": true,
      "explanation": "Correct. Factual content in science and history needs verification. The draft will not flag its own errors, so a confident wrong detail is yours to catch before it reaches students."
    },
    {
      "id": "c",
      "label": "Delete day three entirely, since you cannot trust anything the AI produced.",
      "is_correct": false,
      "explanation": "That overcorrects. The structure is still useful. You verify the one fact you are unsure about rather than throwing out a whole day of usable planning."
    },
    {
      "id": "d",
      "label": "Ask the AI to confirm whether its own fact is correct.",
      "is_correct": false,
      "explanation": "The model can restate a wrong fact just as confidently the second time. Verification has to come from a source you trust, not from the same memory that produced the error."
    }
  ]
}
```

## mini_project

Pick a real topic you are teaching next week and build its frame in one AI chat, then do the teacher pass that makes it yours. Give the AI your grade, subject, the specific topic, the standard, your class length, and one true detail about your students, then ask for a five-day arc with an objective, warm-up, main activity, check for understanding, and materials for each day. The draft is your starting point, not your plan. The value is in the edit pass you do next.

- Open your official standards document and confirm every standard the AI named, fixing any code or wording that drifted, since the model paraphrases and misattributes.
- Check every factual claim in any science or history day against a source you trust, because a confident wrong detail goes straight into your slides.
- Apply your judgment: swap at least one activity for something your class actually responds to, adjust the pacing to fit your real periods, and cut whatever does not serve your students.
