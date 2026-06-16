-- Re-curate the Healthcare AI Practitioner cert to append the 2 net-new
-- cert-track healthcare lessons at positions 9 and 10, keeping the existing
-- spine (positions 0-8) intact. Delete+insert is clean: reclassified/new lessons
-- carry slug-stable uuids, so no orphan rows.

begin;

with cert as (
  select id from certs where slug = 'healthcare-ai-practitioner'
)
delete from cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from certs where slug = 'healthcare-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'when-to-use-chatgpt-vs-google'),
    (1, 'spot-when-ai-is-making-things-up'),
    (2, 'the-3-step-framing-technique'),
    (3, 'stop-writing-prompts-start-writing-briefs'),
    (4, 'set-up-ai-once-so-it-remembers-how-you-work'),
    (5, 'ai-assisted-patient-handoffs-the-sbar-method'),
    (6, 'turn-rough-encounter-notes-into-clean-documentation'),
    (7, 'explain-it-in-plain-language-patient-communication'),
    (8, 'the-accuracy-and-privacy-guardrail-for-clinical-ai'),
    (9, 'keep-human-connection-in-care'),
    (10, 'protect-clinical-judgment')
)
insert into cert_lessons (cert_id, lesson_id, position, is_required)
select cert.id, l.id, a.position, true
from approved a
join lessons l on l.slug = a.slug
cross join cert;

-- Guard: fail loudly if any approved slug failed to resolve to a published lesson.
do $$
declare
  pinned int;
begin
  select count(*) into pinned
  from cert_lessons cl
  join certs c on c.id = cl.cert_id
  where c.slug = 'healthcare-ai-practitioner';
  if pinned <> 11 then
    raise exception 'Expected 11 pinned healthcare cert lessons, got %', pinned;
  end if;
end $$;

commit;
