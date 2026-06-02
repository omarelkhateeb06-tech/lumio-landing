---
slug: ai-for-lesson-planning-build-a-week-in-minutes
module: industry-deep-dives
title: "AI for Lesson Planning: Build a Week in Minutes"
level: growing
minutes: 9
order: 20
hook: The Sunday-night planning marathon can become a twenty-minute draft-and-refine session, with you still making every real teaching decision.
key_takeaway: Give AI your grade, your standard, and your constraints, and it drafts a coherent week you can shape, so your evening goes to refining instruction instead of building scaffolding from scratch.
tags: [education, planning, writing]
---

## reading

Lesson planning is the work that quietly eats teachers' evenings and weekends. Not because the thinking is hard, but because so much of it is structural: laying out a week, sequencing objectives, drafting warm-ups, writing the check for understanding, listing materials. That scaffolding is exactly the part AI can draft for you, so your real time goes to the instructional decisions only you can make.

The mistake is asking for too little. "Give me a lesson on fractions" returns something generic and gradeless. A good request gives the AI what a substitute teacher would need to know.

Tell it five things: the grade level, the subject and specific topic, the standard you are teaching to, how long each class runs, and anything true about your students. "I teach 4th grade math. This week is introducing equivalent fractions, aligned to my state standard on fraction equivalence. Classes are 50 minutes. Several students are still shaky on multiplication facts. Draft a five-day arc, one day per lesson, each with an objective, a warm-up, a main activity, a quick check for understanding, and the materials I will need."

What comes back is a coherent week you can react to, which is a far easier task than facing a blank planner. You move objectives around, swap an activity for one your class responds to, and cut what does not fit your pacing.

Two cautions specific to planning. First, verify any standard the AI names or quotes. It can misattribute a code or paraphrase a standard inaccurately, and your alignment has to be right. Pull the exact wording from your official standards document, not the model's memory. Second, check any factual content it builds a lesson around, especially in science and history, where a confident wrong detail can travel straight into your slides.

Used this way, AI does not plan your week. It builds the frame, and you do the teaching design that frame is there to serve.

## try_it_live [personalizable]

```json
{
  "instructions": "Draft a week of lessons you can refine. Give the AI your grade, subject and topic, the standard, your class length, and anything about your students. Or use the sample: 4th grade math, introducing equivalent fractions, 50-minute classes, with several students still shaky on multiplication facts.",
  "system_prompt": "You are an experienced K-12 curriculum coach helping a classroom teacher. Given a grade, subject, topic, standard, class length, and notes about the students, draft a five-day lesson arc, one day per lesson. For each day give a clear objective, a short warm-up, a main activity, a quick check for understanding, and a materials list. Keep activities concrete and age-appropriate. Remind the teacher to confirm the exact standard wording against their official document, since you may paraphrase it. No jargon, no em dashes.",
  "ideal_output": "Here is a five-day arc for introducing equivalent fractions in 4th grade math, 50-minute periods. Please confirm the exact wording of your fraction-equivalence standard against your official document, since I am working from a paraphrase.\n\nDay 1, objective: students recognize that two fractions can name the same amount. Warm-up: quick review of multiplication facts as skip-counting, to support the students who are shaky. Main activity: fold paper strips to show that 1/2 and 2/4 cover the same length. Check: students draw one pair of equivalent fractions. Materials: paper strips, markers.\n\nDay 2, objective: students build equivalent fractions by multiplying numerator and denominator. Warm-up: name a fraction shown on a number line. Main activity: guided practice multiplying top and bottom by the same number, tied back to the paper strips. Check: three exit problems. Materials: number-line handout.\n\nDays 3 to 5 continue with a fraction wall, a partner sorting game, and a short formative quiz. Want me to expand any single day into a full lesson with timings?",
  "input_placeholder": "Grade, subject and topic, the standard, class length, and notes about your students..."
}
```

## multiple_choice

```json
{
  "stem": "Your AI-drafted week cites a specific state standard code next to each day's objective. Before you put it in your plan book, what does this lesson tell you to do?",
  "options": [
    {
      "id": "a",
      "label": "Verify each standard against your official standards document, because the model can misattribute a code or paraphrase a standard inaccurately.",
      "is_correct": true,
      "explanation": "Correct. Standard alignment has to be exact, and the AI works from memory that can be wrong. Confirm the code and the wording from the authoritative source, not the draft."
    },
    {
      "id": "b",
      "label": "Trust the codes, since the AI aligned the whole week consistently and consistency means accuracy.",
      "is_correct": false,
      "explanation": "Consistency is not accuracy. The model can apply the same wrong code all week. A confidently formatted standard still needs checking against the official document."
    },
    {
      "id": "c",
      "label": "Remove the standards entirely, since AI cannot be trusted with alignment at all.",
      "is_correct": false,
      "explanation": "That overcorrects. The draft is a useful starting point; you just confirm the codes and wording yourself rather than accepting them on faith."
    }
  ]
}
```

## mini_project

Pick a real topic you are teaching next week. In one AI chat, give it your grade, subject, the specific topic, the standard, your class length, and one true detail about your students, then ask for a five-day arc with an objective, warm-up, main activity, check for understanding, and materials per day. Now do the teacher edit pass: open your official standards document and confirm every standard the AI named, swap at least one activity for something your class actually responds to, and adjust the pacing to fit your real periods. Notice how much of your evening went to instructional judgment instead of building structure.
