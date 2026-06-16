-- Seed four new industry certificates: Education, Finance, HR, Customer Service.
--
--   Each is an industry track that builds on the Beginner cert (base_cert_id ->
--   Beginner), then applies the foundations to six live Industry Deep Dives
--   lessons for that field.
--
-- Standalone and idempotent: each cert upserts on its unique slug, and only that
-- cert's cert_lessons are rebuilt (other certs are left untouched, so this is
-- safe to run alongside the existing cert seeds). A count guard per cert fails
-- loudly if any of its six slugs does not resolve to a published lesson.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- Education AI Practitioner
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'education-ai-practitioner',
    'Education AI Practitioner',
    'beginner',
    'education',
    'By the end of this track, you''ll be able to use AI to build lesson plans, materials, and rubrics, differentiate for a range of learners, and turn slow prep into minutes, with a clear line on academic honesty. An industry certificate for K-12 teachers, administrators, and curriculum designers. Build on the AI foundations, then apply them to lesson planning, feedback, differentiated materials, family communication, and assessment, while setting honest classroom expectations. Submit an education capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Draft a coherent week of lessons in minutes, then refine the instructional decisions yourself",
      "Turn shorthand judgments into specific, kind, actionable student feedback",
      "Produce leveled and differentiated materials without the extra hours",
      "Write clear, warm messages to parents and families while protecting student privacy",
      "Build fair, specific rubrics and assessment frameworks fast",
      "Set honest, followable expectations for AI use in your classroom"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real teaching task, such as a week of lessons, a set of student feedback, differentiated materials, a parent message, or a rubric, and complete it with AI. Show your prompt, the output, the edits you made as the teacher, and any standards or facts you verified. Remove every student-identifying detail before submitting.",
      "min_words": 200
    } $json$::jsonb,
    ''
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

update public.certs c
set base_cert_id = b.id, updated_at = now()
from public.certs b
where c.slug = 'education-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

with cert as (
  select id from public.certs where slug = 'education-ai-practitioner'
)
delete from public.cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from public.certs where slug = 'education-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'ai-for-lesson-planning-build-a-week-in-minutes'),
    (1, 'giving-better-feedback-faster'),
    (2, 'differentiated-materials-without-the-extra-hours'),
    (3, 'writing-to-parents-and-families'),
    (4, 'building-rubrics-and-assessment-frameworks'),
    (5, 'ai-in-your-classroom-setting-honest-expectations')
)
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join public.lessons l on l.slug = a.slug and l.status = 'published'
cross join cert;

do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from public.cert_lessons cl
  join public.certs c on c.id = cl.cert_id
  where c.slug = 'education-ai-practitioner';
  if pinned <> 6 then
    raise exception 'Expected 6 pinned education cert lessons, got %', pinned;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Finance AI Practitioner
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'finance-ai-practitioner',
    'Finance AI Practitioner',
    'beginner',
    'finance',
    'By the end of this track, you''ll be able to use AI to draft analyses, explain numbers in plain language, and speed up recurring reporting, while verifying every figure so nothing unchecked goes out the door. An industry certificate for accountants, CFOs, financial analysts, and finance staff. Build on the AI foundations, then apply them to verifying figures, drafting financial narratives, staying compliant, first-pass research, and spotting AI-enabled fraud. Submit a finance capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Treat every AI-produced number as unverified until traced to a real source",
      "Turn verified figures and your own read into clear board-ready narratives",
      "Know what data AI must never touch and keep regulated information safe",
      "Use AI to accelerate first-pass market and competitive research, then verify every claim",
      "Spot and defend against AI-enabled financial fraud with channel-based verification",
      "Run a quick, sound first-pass P&L analysis with AI support"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real but de-identified finance task, such as a financial narrative, a research first pass, a compliance review, or a fraud-control redesign, and complete it with AI. Show your prompt, the output, the verification you ran against authoritative sources, and the data-handling checks you applied. Remove every confidential or material non-public detail before submitting.",
      "min_words": 200
    } $json$::jsonb,
    ''
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

update public.certs c
set base_cert_id = b.id, updated_at = now()
from public.certs b
where c.slug = 'finance-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

with cert as (
  select id from public.certs where slug = 'finance-ai-practitioner'
)
delete from public.cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from public.certs where slug = 'finance-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'the-verification-rule-every-number-needs-a-source'),
    (1, 'compliance-first-what-ai-cant-touch'),
    (2, 'drafting-financial-narratives-and-board-reports'),
    (3, 'first-pass-market-and-competitive-research'),
    (4, 'spotting-ai-enabled-fraud-in-your-processes'),
    (5, 'ai-in-finance-quick-p-l-analysis')
)
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join public.lessons l on l.slug = a.slug and l.status = 'published'
cross join cert;

do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from public.cert_lessons cl
  join public.certs c on c.id = cl.cert_id
  where c.slug = 'finance-ai-practitioner';
  if pinned <> 6 then
    raise exception 'Expected 6 pinned finance cert lessons, got %', pinned;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- HR AI Practitioner
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'hr-ai-practitioner',
    'HR AI Practitioner',
    'beginner',
    'hr',
    'By the end of this track, you''ll be able to use AI to write job posts, screening questions, and policy and employee communications, with the fairness and confidentiality guardrails the work demands. An industry certificate for HR managers, recruiters, and HR business partners. Build on the AI foundations, then apply them to job descriptions, fair screening, AI use policies, performance reviews, high-volume hiring, and employee communication. Submit an HR capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Write job descriptions that attract strong candidates instead of filtering them out",
      "Use AI to organize applications without baking historical bias into screening",
      "Draft short, concrete AI use policies your team will actually follow",
      "Turn observations into specific, fair, behavior-based performance review language",
      "Handle AI-inflated application volume by screening on verifiable evidence",
      "Build a reusable library of employee communication templates"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real but de-identified HR task, such as a job description, a screening process, an AI use policy, a performance review, or a communication template, and complete it with AI. Show your prompt, the output, the judgment you applied, and the fairness and bias checks you ran. Remove every employee-identifying detail before submitting.",
      "min_words": 200
    } $json$::jsonb,
    ''
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

update public.certs c
set base_cert_id = b.id, updated_at = now()
from public.certs b
where c.slug = 'hr-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

with cert as (
  select id from public.certs where slug = 'hr-ai-practitioner'
)
delete from public.cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from public.certs where slug = 'hr-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'writing-job-descriptions-that-attract-real-candidates'),
    (1, 'ai-assisted-screening-without-baking-in-bias'),
    (2, 'drafting-ai-use-policies-your-team-will-follow'),
    (3, 'performance-review-language-thats-specific-and-fair'),
    (4, 'managing-the-ai-application-flood'),
    (5, 'employee-communication-templates')
)
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join public.lessons l on l.slug = a.slug and l.status = 'published'
cross join cert;

do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from public.cert_lessons cl
  join public.certs c on c.id = cl.cert_id
  where c.slug = 'hr-ai-practitioner';
  if pinned <> 6 then
    raise exception 'Expected 6 pinned hr cert lessons, got %', pinned;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Customer Service AI Practitioner
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'customer-service-ai-practitioner',
    'Customer Service AI Practitioner',
    'beginner',
    'customer-service',
    'By the end of this track, you''ll be able to use AI to draft fast, on-brand replies, defuse difficult messages, and turn repeat questions into reusable templates, while knowing when a human has to step in. An industry certificate for support agents, CS managers, and support staff. Build on the AI foundations, then apply them to empathetic responses, template libraries, de-escalation, quality monitoring, escalation handoffs, and self-review. Submit a customer service capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Draft empathetic, genuine responses to upset customers in seconds",
      "Build a reusable response template library that keeps quality consistent",
      "Use de-escalation language that lowers the temperature instead of raising it",
      "Work alongside AI quality monitoring, treating scores as signals not verdicts",
      "Write clean escalation handoffs so customers never repeat themselves",
      "Use AI as a private coach to review and improve your own interactions"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real but de-identified customer service task, such as an empathetic reply, a template, a de-escalation rewrite, an escalation handoff, or a self-review, and complete it with AI. Show your prompt, the output, the personalization and judgment you applied, and the accuracy checks you ran. Remove every customer-identifying detail before submitting.",
      "min_words": 200
    } $json$::jsonb,
    ''
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

update public.certs c
set base_cert_id = b.id, updated_at = now()
from public.certs b
where c.slug = 'customer-service-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

with cert as (
  select id from public.certs where slug = 'customer-service-ai-practitioner'
)
delete from public.cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from public.certs where slug = 'customer-service-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'drafting-empathetic-responses-to-upset-customers'),
    (1, 'building-your-response-template-library'),
    (2, 'de-escalation-language-that-actually-works'),
    (3, 'working-alongside-ai-quality-monitoring'),
    (4, 'writing-clean-escalation-handoffs'),
    (5, 'using-ai-to-review-your-own-interactions')
)
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join public.lessons l on l.slug = a.slug and l.status = 'published'
cross join cert;

do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from public.cert_lessons cl
  join public.certs c on c.id = cl.cert_id
  where c.slug = 'customer-service-ai-practitioner';
  if pinned <> 6 then
    raise exception 'Expected 6 pinned customer service cert lessons, got %', pinned;
  end if;
end $$;

commit;
