-- ─────────────────────────────────────────────────────────────────────────────
-- Launch slice §7.5 — re-author the Foundations module-check questions that
-- tested lessons now reclassified into First Steps.
--
-- The dynamic resolver self-heals SCOPE (module → currently-published lessons),
-- but the question CONTENT was written against the pre-slice Foundations set.
-- Questions 0-3 still cover retained Foundations lessons (tool choice, hallucina-
-- tions, fact-checking) and are left as-is. Questions 4-7 tested framing / briefs
-- / custom-instructions — all now First Steps — so they are replaced with the
-- net-new Foundations lessons: "not behind / not cheating", "what AI actually is",
-- "what AI cannot do", and "AI and your privacy".
--
-- Matched by (check slug, order_index), mirroring 20260529140000. No em dashes.
-- ─────────────────────────────────────────────────────────────────────────────

-- Q4 → You're Not Behind (and It's Not Cheating)
update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "A colleague says using AI to draft your work is basically cheating. What is the best way to think about it?",
  "options": [
    { "id": "a", "label": "Using AI to draft and then editing with your own judgment is a tool, much like a calculator, not cheating.", "is_correct": true, "explanation": "The skill that matters now is knowing what to ask, checking the output, and deciding what to keep. That is real work." },
    { "id": "b", "label": "They are right, so you should write everything from scratch to be safe.", "is_correct": false, "explanation": "Avoiding the tool entirely just means doing slower work with no advantage. The judgment is still yours." },
    { "id": "c", "label": "It is only cheating if you are a beginner who has not earned it yet.", "is_correct": false, "explanation": "There is no skill threshold you have to pass first. Everyone is learning this at the same time." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 4;

-- Q5 → What AI Actually Is (and Isn't)
update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "At its core, what is a chatbot like ChatGPT actually doing when it answers you?",
  "options": [
    { "id": "a", "label": "Predicting the next likely words based on patterns in the text it learned from.", "is_correct": true, "explanation": "It is a very good guesser of what sounds right, which is why it drafts well but can state facts that are wrong." },
    { "id": "b", "label": "Looking each fact up in a verified database before it replies.", "is_correct": false, "explanation": "There is no fact-checker inside. It produces plausible text, not confirmed facts." },
    { "id": "c", "label": "Thinking and reasoning the way a human expert does.", "is_correct": false, "explanation": "It is not reasoning from understanding. It is predicting likely text, which is a different thing." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 5;

-- Q6 → What AI Cannot Do
update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "Which task should you NOT hand to AI alone, without a qualified human checking the result?",
  "options": [
    { "id": "a", "label": "Deciding the dosage of a medication or the wording of a binding legal clause.", "is_correct": true, "explanation": "Anything high-stakes, where being wrong is expensive or harmful, needs a qualified human in charge." },
    { "id": "b", "label": "Rewriting a rough paragraph to sound clearer and warmer.", "is_correct": false, "explanation": "Reshaping text you provide is exactly the kind of low-risk task AI is great at." },
    { "id": "c", "label": "Brainstorming a list of possible names for a project.", "is_correct": false, "explanation": "Brainstorming is low-stakes and a strong use of AI. A bad idea costs you nothing." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 6;

-- Q7 → AI and Your Privacy
update public.mastery_check_questions q set type = 'multiple_choice', content = $json$
{
  "stem": "You want AI's help replying to an angry email from a named client. What is the safest effective move?",
  "options": [
    { "id": "a", "label": "Replace the name and any account numbers with placeholders, then paste the rest and ask for the draft.", "is_correct": true, "explanation": "Stripping the identifying details keeps them in your hands while the AI still gets everything it needs to help." },
    { "id": "b", "label": "Paste the whole email exactly as it is so the AI has full context.", "is_correct": false, "explanation": "That hands a real person's identifying details to the tool, which may store or review them. The AI does not need those specifics." },
    { "id": "c", "label": "Type out a guess at what the email said from memory instead.", "is_correct": false, "explanation": "Unnecessary. Anonymizing the real text is both safer and more accurate than working from a fuzzy memory." }
  ]
}
$json$::jsonb, updated_at = now()
from public.mastery_checks c
where q.check_id = c.id and c.slug = 'foundations-module-check' and q.order_index = 7;
