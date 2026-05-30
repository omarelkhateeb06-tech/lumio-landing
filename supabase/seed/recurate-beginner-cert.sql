-- Re-curate the Beginner AI Practitioner cert to the approved 10 (launch slice §7.2).
-- Drops the 4 dropped EW lessons + old set, re-pins the canonical spine + paste-safety
-- + the 2 cert-dependency EW lessons. Positions are 0-based to match the live convention.
-- Reclassified lessons (framing/briefs/setup/iteration) keep their slug-stable uuid, so
-- this is a clean delete+insert; no orphan rows.

begin;

with cert as (
  select id from certs where slug = 'beginner-ai-practitioner'
)
delete from cert_lessons
where cert_id in (select id from cert);

with cert as (
  select id from certs where slug = 'beginner-ai-practitioner'
),
approved(position, slug) as (
  values
    (0, 'when-to-use-chatgpt-vs-google'),
    (1, 'spot-when-ai-is-making-things-up'),
    (2, 'what-ai-cannot-do'),
    (3, 'the-3-step-framing-technique'),
    (4, 'stop-writing-prompts-start-writing-briefs'),
    (5, 'set-up-ai-once-so-it-remembers-how-you-work'),
    (6, 'the-iteration-loop'),
    (7, 'is-this-safe-to-paste'),
    (8, 'drafting-professional-emails'),
    (9, 'summarizing-long-documents')
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
  where c.slug = 'beginner-ai-practitioner';
  if pinned <> 10 then
    raise exception 'Expected 10 pinned beginner cert lessons, got %', pinned;
  end if;
end $$;

commit;
