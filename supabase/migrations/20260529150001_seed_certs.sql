-- ─────────────────────────────────────────────────────────────────────────────
-- Seed the v1 certificates.
--
--   Beginner AI Practitioner   — general track: Foundations (5) + Everyday Work (5)
--   Healthcare AI Practitioner — industry track: Foundations (5) + 4 beginner
--                                clinical lessons; base_cert_id -> Beginner.
--
-- Idempotent: certs upsert on their unique slug; cert_lessons are rebuilt from
-- module / lesson slugs (no hardcoded UUIDs) so a re-run stays correct.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'beginner-ai-practitioner',
    'Beginner AI Practitioner',
    'beginner',
    null,
    'By the end of this track, you''ll be able to fold AI into your everyday work, drafting, summarizing, planning, and checking its output, with the judgment to know when to trust it and when not to. The core certificate for using AI well in everyday knowledge work. Work through the Foundations and Everyday Work lessons, submit a hands-on capstone, and earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Decide when to use AI versus a search engine for any task",
      "Spot when an AI answer is likely made up, and verify it",
      "Write clear prompts using role, task, and constraints",
      "Turn messy notes and emails into polished, ready to send work",
      "Set up custom instructions so AI fits how you actually work"
    ]$json$::jsonb,
    $json$ {
      "description": "Pick a real task from your own work and redo it with AI from start to finish. Show the prompt or brief you wrote, the result you got, and a short reflection on what you would change next time. Plan on a couple of hours.",
      "min_words": 200
    } $json$::jsonb,
    'https://buy.stripe.com/test_placeholder_beginner'
  ),
  (
    'healthcare-ai-practitioner',
    'Healthcare AI Practitioner',
    'beginner',
    'healthcare',
    'By the end of this track, you''ll be able to use AI to cut documentation and admin time, draft clear patient-facing communication, and brief it safely, without putting protected health information at risk. An industry certificate for clinicians and healthcare staff. Build on the AI foundations, then apply them to handoffs, documentation, and patient communication. Submit a clinical capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Apply the core AI foundations to real clinical work",
      "Draft SBAR patient handoffs faster without losing accuracy",
      "Turn rough encounter notes into clean documentation",
      "Explain diagnoses and instructions to patients in plain language",
      "Protect accuracy and patient privacy when using AI tools"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real but de-identified clinical documentation or communication task and complete it with AI. Show your prompt, the output, the accuracy and privacy checks you ran, and what you would do differently. Remove every patient identifier before submitting.",
      "min_words": 200
    } $json$::jsonb,
    'https://buy.stripe.com/test_placeholder_healthcare'
  )
on conflict (slug) do update set
  name                = excluded.name,
  level               = excluded.level,
  industry            = excluded.industry,
  description         = excluded.description,
  price_cents         = excluded.price_cents,
  is_published        = excluded.is_published,
  outcomes            = excluded.outcomes,
  capstone_spec       = excluded.capstone_spec,
  stripe_payment_link = excluded.stripe_payment_link,
  updated_at          = now();

-- Healthcare builds on the Beginner cert.
update public.certs h
set base_cert_id = b.id, updated_at = now()
from public.certs b
where h.slug = 'healthcare-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

-- ── Rebuild cert_lessons ────────────────────────────────────────────────────--
delete from public.cert_lessons
where cert_id in (select id from public.certs where slug in ('beginner-ai-practitioner','healthcare-ai-practitioner'));

-- Beginner: Foundations + Everyday Work, in module then lesson order.
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select
  c.id,
  l.id,
  (row_number() over (order by m.order_index, l.order_index) - 1)::int,
  true
from public.certs c
join public.lessons l on l.status = 'published'
join public.modules m on m.id = l.module_id
where c.slug = 'beginner-ai-practitioner'
  and m.slug in ('foundations', 'everyday-work');

-- Healthcare: Foundations first, then the four beginner clinical lessons.
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select
  c.id,
  l.id,
  (row_number() over (
    order by case when m.slug = 'foundations' then 0 else 1 end, l.order_index
  ) - 1)::int,
  true
from public.certs c
join public.lessons l on l.status = 'published'
join public.modules m on m.id = l.module_id
where c.slug = 'healthcare-ai-practitioner'
  and (
    m.slug = 'foundations'
    or l.slug in (
      'ai-assisted-patient-handoffs-the-sbar-method',
      'turn-rough-encounter-notes-into-clean-documentation',
      'explain-it-in-plain-language-patient-communication',
      'the-accuracy-and-privacy-guardrail-for-clinical-ai'
    )
  );
