---
slug: differentiated-materials-without-the-extra-hours
module: industry-deep-dives
title: "Differentiated Materials Without the Extra Hours"
level: growing
minutes: 9
order: 22
hook: You already know your one lesson needs to reach a struggling reader, a grade-level reader, and a student who finished early and is bored. Making three versions used to mean three times the work.
key_takeaway: Give AI one strong base text and your specific learners, and it produces leveled versions and supports in minutes, so differentiation becomes editing instead of rebuilding.
tags: [education, writing, planning]
---

## reading

Differentiation is one of those words that sounds reasonable in a staff meeting and feels impossible at 9pm. The principle is sound: a single reading or task rarely fits every student in the room. But building a struggling-reader version, a grade-level version, and an extension for the kids who race ahead has always meant doing the work two or three times over. So most of us pick one version and hope.

AI changes the math, because differentiation is mostly transformation, and transformation is what these models are good at. You write or choose one strong base text. Then you ask the model to produce the variations.

Start from quality. The base text has to be accurate and well written, because every version inherits whatever you feed it. Then name your learners concretely. "Rewrite this passage at a 3rd grade reading level for students still building vocabulary, keeping every key fact" gives you a real support. "Create three comprehension questions at increasing difficulty, the last one open-ended" gives you a ladder. "Write a two-sentence challenge prompt for students who finish early" gives you the extension you never had time to make.

Two checks matter. When the AI simplifies a text, confirm it kept the facts and did not flatten meaning into something wrong. And when it adapts for a specific need, like an English-language learner or a student with an IEP goal, you are still the one who knows that child. The model drafts the accommodation. You decide whether it actually serves the student.

The result is not a robot teaching your class. It is you, finally able to hand three students three right-sized versions of the same lesson, because making them took fifteen minutes instead of three hours.

## try_it_live

```json
{
  "instructions": "Hand the AI one base text and ask for leveled versions. Give it a short passage you teach, then ask for a simplified version, a grade-level version, and an extension. Or use the sample: a paragraph on the water cycle for a 5th grade class with a few striving readers and a couple of students who need a challenge.",
  "system_prompt": "You are an instructional designer helping a K-12 teacher differentiate one text for a mixed-readiness class. Given a base passage and a description of the learners, produce: (1) a simplified version at a stated lower reading level that keeps every key fact intact, (2) the grade-level version lightly cleaned up, and (3) a short extension prompt for early finishers that deepens thinking rather than just adding more work. Preserve factual accuracy in every version and never drop a key concept to make text easier. Flag any place where simplifying risks changing the meaning so the teacher can check it. No jargon, no em dashes.",
  "ideal_output": "Here are three versions of your water cycle passage. I kept the same four stages in all of them so no key fact is lost.\n\nSimplified, around 3rd grade level: The sun heats water in oceans and lakes. The water turns into a gas called water vapor and rises into the sky. Up high it cools and forms clouds. When the clouds get heavy, the water falls back down as rain or snow. Then it starts again.\n\nGrade level, 5th grade: The sun's heat causes water in oceans, lakes, and rivers to evaporate into water vapor. As the vapor rises and cools, it condenses into clouds. When enough water collects, it falls as precipitation, rain or snow, and collects again to repeat the cycle.\n\nExtension for early finishers: A puddle disappears on a sunny day but there is no rain. Which stage of the water cycle explains where the water went, and what would have to happen for it to come back as rain?\n\nOne flag: in the simplified version I called water vapor 'a gas,' which is accurate but you may want to confirm your class has met the word 'gas' in this context.",
  "input_placeholder": "Paste your base passage and describe your learners: reading levels, language needs, who needs a challenge..."
}
```

## multiple_choice

```json
{
  "stem": "You ask AI to simplify a science passage to a lower reading level for your striving readers. Before you hand it out, what does this lesson tell you to check first?",
  "options": [
    {
      "id": "a",
      "label": "That the simpler version kept the facts intact and did not flatten the meaning into something inaccurate.",
      "is_correct": true,
      "explanation": "Correct. Every version inherits the content of what you feed in, and simplifying can quietly change or drop a key fact. Confirming accuracy is the check that protects the learning, especially in science and history."
    },
    {
      "id": "b",
      "label": "That the simpler version is shorter than the original, since shorter always means easier.",
      "is_correct": false,
      "explanation": "Length is not the point. A shorter passage can still be too hard, and a simplified one can be wrong. The thing to verify is whether it stayed accurate while becoming more readable."
    },
    {
      "id": "c",
      "label": "Nothing needs checking, because the AI was given a strong base text to start from.",
      "is_correct": false,
      "explanation": "A strong base text helps, but the transformation itself can introduce errors. Simplifying is exactly where meaning can shift, so you still verify the facts survived."
    }
  ]
}
```

## mini_project

Pick one text or task you are teaching this week and one real range of learners in your class. Feed the AI your base text, then ask for three things: a version at a lower reading level that keeps all the facts, a set of comprehension questions that climb in difficulty, and a short extension prompt for students who finish early. Now do the part only you can do: read the simplified version against the original and confirm nothing important got lost or distorted, and check that any accommodation actually fits the specific student you had in mind. Time the whole thing. Notice whether you ended up with materials you would normally have skipped making at all.
