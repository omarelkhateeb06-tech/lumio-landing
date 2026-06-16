-- Seed the Legal AI Practitioner industry certificate.
--
--   Legal AI Practitioner (industry track): builds on the Beginner cert, then
--   applies the foundations to the six live legal lessons in Industry Deep Dives.
--   base_cert_id -> Beginner.
--
-- Standalone and idempotent: the cert upserts on its unique slug, and only the
-- legal cert_lessons are rebuilt (other certs are left untouched, so this is
-- safe to run alongside the existing cert seeds). A count guard fails loudly if
-- any of the six legal slugs does not resolve to a published lesson.

begin;

insert into public.certs (slug, name, level, industry, description, price_cents, is_published, outcomes, capstone_spec, stripe_payment_link)
values
  (
    'legal-ai-practitioner',
    'Legal AI Practitioner',
    'beginner',
    'legal',
    'By the end of this track, you''ll be able to use AI to summarize and compare documents, draft routine correspondence and clauses, and pressure-test wording, while catching the fabricated citations and confident errors before they reach a client. An industry certificate for lawyers, paralegals, and legal staff. Build on the AI foundations, then apply them to contract summaries, research, client communication, and document review, all while protecting confidentiality. Submit a legal capstone to earn a verifiable credential.',
    4900,
    true,
    $json$[
      "Know exactly where AI helps in legal work and the line you must never cross",
      "Turn dense contracts into clear, plain-language summaries you then verify",
      "Use AI for fast first-pass legal research, with every citation confirmed in an authoritative source",
      "Build reusable, plain-language templates for routine client communication",
      "Prepare for document review with AI-built checklists and issue summaries",
      "Protect client confidentiality and privilege whenever you use AI tools"
    ]$json$::jsonb,
    $json$ {
      "description": "Choose a real but anonymized legal task, such as a contract summary, a research first pass, a client update, or a document-review checklist, and complete it with AI. Show your prompt, the output, the verification you ran against authoritative sources, and the confidentiality checks you applied. Remove every privileged or identifying detail before submitting.",
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

-- Legal builds on the Beginner cert.
update public.certs lg
set base_cert_id = b.id, updated_at = now()
from public.certs b
where lg.slug = 'legal-ai-practitioner' and b.slug = 'beginner-ai-practitioner';

-- Rebuild just the legal cert_lessons from the six approved legal slugs.
with cert as (
  select id from public.certs where slug = 'legal-ai-practitioner'
)
delete from public.cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from public.certs where slug = 'legal-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'ai-in-legal-work-limits'),
    (1, 'contract-summaries-with-ai'),
    (2, 'legal-research-first-passes'),
    (3, 'client-communication-legal'),
    (4, 'document-review-prep'),
    (5, 'confidentiality-and-ai-legal')
)
insert into public.cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join public.lessons l on l.slug = a.slug and l.status = 'published'
cross join cert;

-- Guard: fail loudly if any approved slug failed to resolve to a published lesson.
do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from public.cert_lessons cl
  join public.certs c on c.id = cl.cert_id
  where c.slug = 'legal-ai-practitioner';
  if pinned <> 6 then
    raise exception 'Expected 6 pinned legal cert lessons, got %', pinned;
  end if;
end $$;

commit;
