---
slug: set-up-ai-once-so-it-remembers-how-you-work
module: first-steps
title: Set up AI once so it remembers how you work
level: beginner
minutes: 15
order: 7
hook: You have been re-introducing yourself to the AI in every single chat. There is a settings box that ends that forever.
key_takeaway: Spend fifteen minutes filling in custom instructions or saved memory with your role, your audience, and how you want answers written. After that, every chat starts already knowing you.
tags: [general, custom-instructions]
---

## reading

Open a fresh chat with ChatGPT or Claude and it has no idea who you are. It does not know you are a school nurse, that your notes go into a student health record, that your district makes you write at a sixth-grade reading level, or that you hate the word "utilize." So the first thing you do, every time, is explain all of that again. Then you ask your actual question. You have been writing the same paragraph of background for months without realizing it.

There is a place to put that background once. In ChatGPT it lives in Settings under "Personalization," in a feature called Custom Instructions, plus a Memory toggle that lets the model save facts about you over time. In Claude it lives in Settings under "Profile," where you can describe yourself and set your default response preferences. Different names, same idea: a permanent note the AI reads silently before it reads anything you type. You write it once and it follows you into every new conversation.

Think of it like the standing instructions you would give a new assistant on day one. You would not re-explain your job to your assistant every morning. You would tell them once: here is my role, here is who we serve, here is how I like things written, here is what to never do. Custom instructions are that day-one briefing, except the assistant never forgets and never gets tired of it.

Here is exactly what to put in there. Three pieces.

## multiple_choice

```json
{
  "stem": "Where does ChatGPT keep this permanent background note about you?",
  "options": [
    { "id": "a", "label": "In a new chat window you have to reopen each morning", "is_correct": false, "explanation": "No. The whole point is that you do not reopen it each time. It lives in Settings and is read silently before every conversation." },
    { "id": "b", "label": "In Settings under 'Personalization,' in a feature called Custom Instructions", "is_correct": true, "explanation": "Right. In ChatGPT it lives in Settings under 'Personalization' as Custom Instructions, with a Memory toggle that can save facts over time." },
    { "id": "c", "label": "Nowhere; you have to retype your background at the start of every chat", "is_correct": false, "explanation": "That is exactly the habit this lesson ends. There is a settings box that holds the background once so you stop retyping it." }
  ]
}
```

## reading

First, who you are and who you serve. Be specific about the job, not vague about the industry. A paralegal at a small family-law firm should write: "I am a paralegal at a three-attorney family law firm in Ohio. I draft client intake summaries, discovery requests, and correspondence. My readers are attorneys who want facts fast, and sometimes clients who are stressed and not legally trained." That one paragraph means the AI stops giving you generic "legal" answers and starts matching your actual workload.

Second, how you want answers written. This is where you stop fighting the AI's default habits. An office manager who is sick of bloated, flowery replies should write: "Be direct and skip the preamble. Do not open with 'Certainly!' or 'Great question.' Use short paragraphs and bullet points for any list. Keep it to plain English at about an eighth-grade level. If you are not sure about a fact, say so instead of guessing." Every one of those lines is a habit you would otherwise have to correct by hand in every single chat.

Third, your recurring context, meaning the stuff you find yourself typing again and again. A high school history teacher might add: "I teach 11th grade U.S. History to about 140 students across five sections. My state standards are Texas TEKS. I differentiate for students reading below grade level. When I ask for worksheets or quizzes, default to that audience unless I say otherwise." Now "make me a quiz on the New Deal" produces something usable on the first try, because the AI already knows the grade, the subject, and the standards.

## fill_blank

```json
{
  "template": "The first piece to include is who you are and who you serve, and it should be specific about the {{1}}, not vague about the {{2}}.",
  "blanks": [
    { "id": 1, "accept": ["job", "role", "your job", "your role"], "ideal": "job" },
    { "id": 2, "accept": ["industry", "field", "sector"], "ideal": "industry" }
  ],
  "explanation": "The reading says to be specific about the job, not vague about the industry. 'Healthcare' or 'legal' is too broad; naming the exact role is what makes the AI match your real workload."
}
```

## reading

Here is a full example for an HR manager, start to finish, the kind you could paste in today:

"I am an HR manager at a 200-person manufacturing company. I handle hiring, onboarding, policy questions, and difficult employee conversations. My readers are usually managers who are not HR experts, or employees who may be upset, so tone matters a lot. Write in a warm but professional voice. Be clear and brief. Never give me legal advice as if it were settled law; flag anything that an employment lawyer should review. Use bullet points for steps. Avoid corporate jargon like 'synergy' or 'circle back.'"

Notice what that does. The next time this person types "help me write a message to a manager whose employee is always late," the AI already knows the audience is a non-expert manager, the tone should be warm, the format should be steps, and anything legally risky needs a flag. The HR manager just saved the four sentences of setup they used to write every time.

One important boundary: custom instructions are for who you are, not for one specific task. Do not put "write me a quiz about the Civil War" in there, because that would warp every future answer. Put the permanent facts: your role, your audience, your style, your standards. Save the one-off requests for the actual chat. And if your tool has a Memory feature that learns over time, glance at it occasionally to make sure it has not saved something stale, like a project that ended six months ago.

Fifteen minutes of setup. Then every conversation for the next year starts with the AI already knowing your job. That is the highest-return fifteen minutes you will spend on this tool.

## multiple_choice

```json
{
  "stem": "What belongs in your custom instructions (or saved memory), as opposed to a normal chat message?",
  "options": [
    { "id": "a", "label": "The permanent facts about you: your role, who you serve, how you want answers written, and your recurring standards", "is_correct": true, "explanation": "Right. Custom instructions are a day-one briefing that should be true in every conversation, so they hold your identity, audience, and style preferences." },
    { "id": "b", "label": "The specific task you need done right now, like 'write a quiz on the New Deal'", "is_correct": false, "explanation": "A one-off task does not belong there. If you put a single task in custom instructions, it warps every future answer. Keep tasks in the actual chat." },
    { "id": "c", "label": "Nothing important; it is just a name and a greeting preference", "is_correct": false, "explanation": "It is much more than a greeting. Used well, it carries your job, your audience, your tone, and your standards into every chat automatically." }
  ]
}
```

## reading

Most people who try custom instructions make one of three predictable mistakes, and each one quietly cancels the benefit.

The first mistake is being vague. People write things like "I work in healthcare" or "make answers good." That is so general the AI cannot do anything useful with it. "Healthcare" could mean a surgeon, a billing clerk, or a hospice chaplain, and "good" means nothing at all. The fix is to write as if you were describing your job to a temp who starts tomorrow. Not "I work in healthcare" but "I am a charge nurse on a medical-surgical floor; I write shift handoff notes and patient education sheets." Specificity is the entire point. If your instructions would fit fifty different jobs, they are too thin.

The second mistake is stuffing a single task in there. Someone gets excited, writes "always respond as a poem" or "I am working on the Henderson account," and forgets about it. A week later every answer is weirdly poetic, or every answer assumes a project that wrapped up. Remember the rule: custom instructions are for who you are, not what you need today. If you catch the AI behaving strangely across unrelated chats, the first place to check is your instructions for a leftover task.

## multiple_choice

```json
{
  "stem": "According to the reading, what is the fix for vague instructions like 'I work in healthcare'?",
  "options": [
    { "id": "a", "label": "Leave them broad on purpose so the AI can help with any topic", "is_correct": false, "explanation": "Broad is the trap. If your instructions would fit fifty different jobs, they are too thin and the AI cannot do anything useful with them." },
    { "id": "b", "label": "Add the single task you need done today instead", "is_correct": false, "explanation": "That is a different mistake. Stuffing one task in there warps future answers. The fix for vagueness is specificity about your role, not a task." },
    { "id": "c", "label": "Write as if describing your job to a temp who starts tomorrow, naming your exact role and the documents you produce", "is_correct": true, "explanation": "Exactly. The reading says to be specific, like 'I am a charge nurse on a medical-surgical floor who writes shift handoff notes.' Specificity is the entire point." }
  ]
}
```

## reading

The third mistake is the opposite problem: people fill it in once and never look again, even after their job changes. The teacher who switched from 9th grade to 11th grade still has "I teach 9th grade" sitting in there, so every quiz comes out at the wrong level. Treat your instructions like a job description that needs an occasional update. When your role, audience, or standards change, spend two minutes editing the box.

There is also a quieter misconception worth naming. Some people assume custom instructions are private and permanent in a way they are not. They are tied to your account and read by the model, which is fine for "I am a paralegal who prefers bullet points." It is not the place for secrets. Do not paste a client's real name, a patient identifier, a password, or anything confidential into the settings box, the same way you would not write those things on a sticky note on your monitor. Keep it to professional context, not sensitive data.

The instinct to skip all of this entirely is the biggest mistake of all. People think it is an advanced feature for power users. It is the opposite: it is the lowest-effort upgrade available, because you do the work once and benefit on every chat afterward. The five minutes you spend re-explaining your job each day adds up to hours a month. Filling in the box ends that tax permanently. Vague is the trap, stale is the slow leak, and skipping it is leaving the easiest win on the table.

## multiple_choice

```json
{
  "stem": "Your quizzes keep coming out at the wrong grade level even though you set up custom instructions months ago. What is the most likely problem?",
  "options": [
    { "id": "a", "label": "Your instructions are stale; they still describe the grade you used to teach, so update them", "is_correct": true, "explanation": "Correct. Custom instructions are not self-updating. When your role or audience changes, you have to edit the box, or it keeps steering answers toward your old situation." },
    { "id": "b", "label": "Custom instructions do not actually affect answers, so it is just coincidence", "is_correct": false, "explanation": "They do affect answers; that is the whole point. Stale instructions affect them in the wrong direction, which is exactly what is happening here." },
    { "id": "c", "label": "You need to re-explain your grade level in every single chat anyway", "is_correct": false, "explanation": "That defeats the purpose. The fix is a two-minute edit to the instructions, after which every future chat is correct without re-explaining." }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "An office manager wants to set up custom instructions. Here is what they almost wrote versus what actually works.",
  "before_prompt": "I work in an office. Please give me good, helpful answers and be professional.",
  "after_prompt": "I am the office manager for a 40-person architecture firm. I handle scheduling, vendor emails, internal announcements, and policy reminders. My readers are busy architects and our front-desk staff. Write in a friendly, clear, professional tone. Skip filler openers like 'Certainly.' Use short paragraphs and bullet points for any steps or lists. Keep language plain, no corporate jargon. When you draft an email for me, give me a subject line too. If something might need owner or HR sign-off, flag it.",
  "changes": ["Names the exact role and company so answers stop being generic 'office' advice and start matching real tasks like vendor emails and announcements", "Describes the actual readers (architects and front-desk staff) so tone and reading level fit them", "Sets concrete style rules (no filler openers, bullet points, subject lines) that would otherwise have to be corrected by hand in every chat", "Adds a standing safety flag for anything needing sign-off, so the AI prompts caution without being asked each time"]
}
```

## multiple_choice

```json
{
  "stem": "Why is the office manager's second version so much more useful as a permanent instruction?",
  "options": [
    { "id": "a", "label": "It names the specific role, the real readers, and concrete style rules, so every future chat starts already tuned to that job", "is_correct": true, "explanation": "Exactly. Specificity about role, audience, and style is what turns a generic note into a true day-one briefing that improves every answer." },
    { "id": "b", "label": "It is longer, and longer instructions are always better", "is_correct": false, "explanation": "Length is not the point. A long but vague note would not help. The second version works because it is specific and actionable, not merely longer." },
    { "id": "c", "label": "It includes the firm's confidential client list, giving the AI more context", "is_correct": false, "explanation": "It does not, and it should not. Confidential data does not belong in the settings box. The strength comes from role and style detail, not secrets." }
  ]
}
```

## mini_project

Write and save your own custom instructions today, using your real job. Open the settings: in ChatGPT go to Settings, then Personalization, then Custom Instructions; in Claude go to Settings, then Profile. Fill in three things in your own words.

- Who you are and who you serve: your exact role, the kinds of documents you produce, and who reads them. Be specific enough that the description would not fit a different job.
- How you want answers written: tone, reading level, format preferences, filler words to avoid, and one thing you always want flagged for caution.
- Your recurring context: the facts you find yourself re-typing in chats, like your grade level, your standards, your audience, or your company size.

Save it, then open a brand-new chat and give it a normal request from your week without any setup paragraph. Notice how much closer the first answer lands. Keep the box open and tweak any line that did not quite work.
