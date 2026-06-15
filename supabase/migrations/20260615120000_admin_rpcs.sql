-- Admin RPCs: SECURITY DEFINER functions gated to the admin email.
-- These bypass normal RLS so the admin can read and update any learner's
-- cert state. The email guard runs first in every function; any other caller
-- gets a plain "Forbidden" exception, not a data leak.

-- Returns all capstone submissions with status 'submitted' or 'under_review',
-- joined with the learner's email and cert name, ordered oldest-first.
create or replace function public.get_admin_capstones()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;
  return (
    select coalesce(
      jsonb_agg(row_to_json(r) order by r.submitted_at asc nulls last),
      '[]'::jsonb
    )
    from (
      select
        cs.id,
        cs.user_cert_id,
        cs.attempt_number,
        cs.submission_content,
        cs.status,
        cs.submitted_at,
        cs.reviewer_notes,
        u.email  as user_email,
        c.name   as cert_name,
        c.slug   as cert_slug
      from public.capstone_submissions cs
      join public.user_certs uc on uc.id = cs.user_cert_id
      join auth.users       u  on u.id  = uc.user_id
      join public.certs     c  on c.id  = uc.cert_id
      where cs.status in ('submitted', 'under_review')
    ) r
  );
end;
$function$;

-- Updates a submission's status and reviewer notes.
-- When p_award_cert is true, also stamps user_certs.completed_at = now().
create or replace function public.admin_review_submission(
  p_submission_id uuid,
  p_status        text,
  p_notes         text,
  p_award_cert    boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uc_id uuid;
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  update public.capstone_submissions
    set status = p_status, reviewer_notes = p_notes
    where id = p_submission_id
    returning user_cert_id into v_uc_id;

  if p_award_cert and v_uc_id is not null then
    update public.user_certs
      set completed_at = now()
      where id = v_uc_id and completed_at is null;
  end if;

  return jsonb_build_object('ok', true);
end;
$function$;

-- Stamps paid_at for a learner identified by email + cert slug.
-- Returns ok:false with an error key if the user, cert, or unpaid enrollment
-- cannot be found, so the caller can show an actionable error message.
create or replace function public.admin_stamp_paid(
  p_user_email text,
  p_cert_slug  text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_cert_id uuid;
  v_user_id uuid;
  v_rows    integer;
begin
  if (select email from auth.users where id = auth.uid()) != 'omarelkhateeb06@gmail.com' then
    raise exception 'Forbidden';
  end if;

  select id into v_cert_id from public.certs where slug  = p_cert_slug;
  select id into v_user_id from auth.users    where email = p_user_email;

  if v_cert_id is null then
    return jsonb_build_object('ok', false, 'error', 'cert not found: ' || p_cert_slug);
  end if;
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'user not found: ' || p_user_email);
  end if;

  update public.user_certs
    set paid_at = now()
    where cert_id = v_cert_id and user_id = v_user_id and paid_at is null;
  get diagnostics v_rows = row_count;

  if v_rows = 0 then
    return jsonb_build_object('ok', false, 'error', 'no unpaid enrollment found for this user and cert');
  end if;

  return jsonb_build_object('ok', true);
end;
$function$;

grant execute on function public.get_admin_capstones()                            to authenticated;
grant execute on function public.admin_review_submission(uuid, text, text, boolean) to authenticated;
grant execute on function public.admin_stamp_paid(text, text)                     to authenticated;
