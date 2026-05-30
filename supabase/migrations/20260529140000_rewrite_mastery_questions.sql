-- ─────────────────────────────────────────────────────────────────────────────
-- Rewrite of the seeded mastery-check questions for plain-language clarity.
--
-- The original questions (seeded in 20260529120001_seed_gamification.sql) were
-- awkwardly worded. These rewrites keep the same eight-question count per check
-- and the same 0.8 pass threshold, but: use plain language a non-technical
-- reader can follow on the first pass; give each question one unambiguous correct
-- answer; keep fill-in-the-blank only where the missing word is obvious (role /
-- {{task}} / constraints, and "verify"); and convert the two blanks that asked
-- for a concept rather than an obvious word into multiple choice. No em dashes.
--
-- Updates are matched by (check slug, order_index) so they land on the exact
-- seeded rows regardless of question id.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── beginner-level-check ─────────────────────────────────────────────────────

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "What is the quickest way to decide between using Google and using ChatGPT?",
  "options": [
    { "id": "a", "label": "Ask whether the answer already exists somewhere and just needs finding, or whether it needs to be written or worked out.", "is_correct": true, "explanation": "If the answer already exists and can be looked up, use Google. If it has to be created or reasoned through, use ChatGPT." },
    { "id": "b", "label": "Always try Google first and switch only if it gives you nothing.", "is_correct": false, "explanation": "Your starting point does not match the tool to the job. Some tasks are a poor fit for Google no matter what." },
    { "id": "c", "label": "Use whichever one you happen to have open.", "is_correct": false, "explanation": "The right tool depends on the task, not on which tab is already open." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 0;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "ChatGPT gives you a confident answer about something that happened last week, with no sign of doubt. What should you assume?",
  "options": [
    { "id": "a", "label": "It may be made up or out of date, because recent events can fall after the model's training cutoff.", "is_correct": true, "explanation": "A model is trained up to a cutoff date. A sure-sounding answer about very recent news is a warning sign, not a guarantee." },
    { "id": "b", "label": "It must be correct, because it sounds so certain.", "is_correct": false, "explanation": "Sounding certain is not the same as being right. The model can be confidently wrong." },
    { "id": "c", "label": "Recent news is exactly what these tools are best at.", "is_correct": false, "explanation": "Recent events are often the weakest area, since they may be past the training cutoff." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 1;

update public.mastery_check_questions q set type = 'fill_blank', content = $json$
{
  "template": "Before you paste an AI answer into a document with your name on it, you should {{1}} any fact you would stake your reputation on.",
  "blanks": [ { "id": "1", "ideal": "verify", "accept": ["verify", "check", "confirm", "double-check", "double check"] } ],
  "explanation": "AI is great for a first draft, but you still check the high-stakes facts yourself before they go out."
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 2;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Which request gives ChatGPT the best chance of a useful answer?",
  "options": [
    { "id": "a", "label": "Help me with my email.", "is_correct": false, "explanation": "This gives the model nothing to work with: no role, no task, and no detail." },
    { "id": "b", "label": "I am a project manager at a fintech startup. Write a five-bullet board update on Q3 that sounds confident but is honest about our missed retention target.", "is_correct": true, "explanation": "It names who you are, the exact task, and clear limits. That is what turns a vague reply into a useful one." },
    { "id": "c", "label": "Write something about Q3.", "is_correct": false, "explanation": "Too vague. The model has to guess what you actually want." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 3;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Which kind of email is usually best to write entirely yourself, rather than handing to AI?",
  "options": [
    { "id": "a", "label": "A routine note telling the team a meeting is still on.", "is_correct": false, "explanation": "Low-stakes, repetitive messages are exactly where AI saves you time." },
    { "id": "b", "label": "A delicate or tense message where the exact wording really matters.", "is_correct": true, "explanation": "When nuance and tone carry real weight, you want full control of every word." },
    { "id": "c", "label": "A standard follow-up after a call.", "is_correct": false, "explanation": "These are routine enough that AI can draft them well." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 4;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "You look back over a full month of your calendar to see where your time actually went. What is the main thing this shows you?",
  "options": [
    { "id": "a", "label": "Whether how you really spend your time matches the priorities you say matter most.", "is_correct": true, "explanation": "Most people find a real gap between what they say matters and where their hours actually go." },
    { "id": "b", "label": "Which coworkers schedule the most meetings.", "is_correct": false, "explanation": "It might hint at that, but spotting it is not the point of the exercise." },
    { "id": "c", "label": "How to color-code your calendar.", "is_correct": false, "explanation": "Formatting is not the goal. The goal is comparing time spent against your stated priorities." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 5;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Why is it fine to paste rough, messy meeting notes into ChatGPT instead of cleaning them up first?",
  "options": [
    { "id": "a", "label": "It can handle shorthand and half-finished sentences, so you can capture notes while they are fresh and let it tidy them up.", "is_correct": true, "explanation": "You get the value down quickly and hand the formatting to the tool." },
    { "id": "b", "label": "You must always rewrite notes into full sentences before pasting them.", "is_correct": false, "explanation": "Cleaning up first wastes the very time the tool is meant to save you." },
    { "id": "c", "label": "Messy notes actually produce better answers than clear ones.", "is_correct": false, "explanation": "Messy notes are fine, but they are not better. Clarity never hurts." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 6;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "What is the benefit of setting up custom instructions one time?",
  "options": [
    { "id": "a", "label": "You stop repeating the same background about yourself at the start of every chat.", "is_correct": true, "explanation": "Set it once and every later conversation starts with that context built in, for free." },
    { "id": "b", "label": "It lets ChatGPT search the live web for you.", "is_correct": false, "explanation": "Custom instructions store context about you. They do not turn on web browsing." },
    { "id": "c", "label": "It means you never have to write a prompt again.", "is_correct": false, "explanation": "You still write prompts. You just stop re-explaining who you are each time." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'beginner-level-check' and q.order_index = 7;

-- ── foundations-module-check ─────────────────────────────────────────────────

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "You need today's exact interest rate to quote a client. Which tool should you use?",
  "options": [
    { "id": "a", "label": "Google, because it is a live fact you can trace to a source.", "is_correct": true, "explanation": "Facts that change in real time belong to a search engine, not a language model." },
    { "id": "b", "label": "ChatGPT, because it is quicker than searching.", "is_correct": false, "explanation": "A model is trained up to a cutoff and cannot see today's rate. You would risk a confident wrong number." },
    { "id": "c", "label": "Either one is equally reliable here.", "is_correct": false, "explanation": "They are not equal for live facts. Only a search engine can pull the current rate from a real source." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 0;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Which job is a better fit for ChatGPT than for Google?",
  "options": [
    { "id": "a", "label": "Finding the exact wording of a specific regulation.", "is_correct": false, "explanation": "That is looking up something that already exists, which is Google's strength." },
    { "id": "b", "label": "Turning a messy paragraph into a clear, well-organized one.", "is_correct": true, "explanation": "Rewriting, reasoning, and shaping text is what a language model is built for." },
    { "id": "c", "label": "Checking yesterday's closing stock price.", "is_correct": false, "explanation": "That is a fact to look up, not something to reason out." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 1;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "An AI answer quotes a study with an exact journal name, year, and percentage. What should you do?",
  "options": [
    { "id": "a", "label": "Trust it, since that much detail proves it is real.", "is_correct": false, "explanation": "Made-up sources often look very precise. Detail is not proof." },
    { "id": "b", "label": "Check that the study and source actually exist before you use it.", "is_correct": true, "explanation": "Oddly specific detail is a classic sign of a made-up answer. Always confirm it." },
    { "id": "c", "label": "Throw out the entire answer as fake.", "is_correct": false, "explanation": "One unverified citation does not make the whole answer wrong. Check it rather than discard everything." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 2;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Why does ChatGPT sometimes state wrong information as if it were fact?",
  "options": [
    { "id": "a", "label": "It is built to produce text that sounds right, so it will fill in a plausible answer even when it does not actually know.", "is_correct": true, "explanation": "This is how the tool works by design, which is why you verify instead of waiting for it to be fixed." },
    { "id": "b", "label": "The servers get overloaded and make random errors.", "is_correct": false, "explanation": "It is not a server glitch. It comes from how the model generates text." },
    { "id": "c", "label": "Only older versions ever do this.", "is_correct": false, "explanation": "Every version can do it, because it comes from the basic design, not the age of the model." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 3;

update public.mastery_check_questions q set type = 'fill_blank', content = $json$
{
  "template": "The three parts of a well-framed prompt are role, {{1}}, and constraints.",
  "blanks": [ { "id": "1", "ideal": "task", "accept": ["task"] } ],
  "explanation": "Giving the model a role to play, a task to do, and constraints to follow turns a vague answer into a useful one."
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 4;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "What is the main difference between a brief and a simple prompt?",
  "options": [
    { "id": "a", "label": "A brief is just a longer version of the same prompt.", "is_correct": false, "explanation": "Length is not the point. A brief adds context and standards, not just more words." },
    { "id": "b", "label": "A brief adds the background, the stakes, examples, and what a bad answer would look like.", "is_correct": true, "explanation": "You would not hand a new colleague one sentence and expect great work. A brief gives them what they need." },
    { "id": "c", "label": "A brief has to be written by the AI itself.", "is_correct": false, "explanation": "You write the brief. That is how you set the direction." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 5;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "What kind of information belongs in your custom instructions?",
  "options": [
    { "id": "a", "label": "A one-time request for the specific task you are doing today.", "is_correct": false, "explanation": "Today-only requests belong in the chat itself, not in settings that apply to every conversation." },
    { "id": "b", "label": "Lasting details about you: your role, your tone, and how you like answers written.", "is_correct": true, "explanation": "Custom instructions act like a standing brief that is added before every conversation." },
    { "id": "c", "label": "Your password, so it can log into your accounts.", "is_correct": false, "explanation": "Never put passwords there. Custom instructions are about context, and the model cannot log into anything." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 6;

update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Besides telling the AI what you want, what else makes a brief much more effective?",
  "options": [
    { "id": "a", "label": "Telling it what a bad answer would look like, so it knows what to avoid.", "is_correct": true, "explanation": "Spelling out what you do not want is what cuts down on rounds of revisions." },
    { "id": "b", "label": "Making the brief as short as possible.", "is_correct": false, "explanation": "A brief works because it is detailed, not because it is short." },
    { "id": "c", "label": "Letting the AI decide the goal for you.", "is_correct": false, "explanation": "You set the goal. The brief is how you make that goal clear." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 7;
