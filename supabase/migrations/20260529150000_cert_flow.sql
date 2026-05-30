-- ─────────────────────────────────────────────────────────────────────────────
-- Certification flow: the two columns the cert UI needs that were not already on
-- the table, plus a public certificate-verification RPC.
--
-- Reuses what already exists rather than adding spec-named duplicates:
--   price            -> certs.price_cents (already present)
--   capstone_description -> certs.capstone_spec jsonb (store under .description)
--   awarded_at       -> user_certs.completed_at (already present)
--   user_certs.status-> derived in the client (paid_at / capstone row / completed_at)
--
-- New columns:
--   certs.outcomes            jsonb  — array of "what you will learn" strings
--   certs.stripe_payment_link text   — external Stripe payment link (v1 gate)
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.certs
  add column if not exists outcomes jsonb not null default '[]'::jsonb,
  add column if not exists stripe_payment_link text;

-- ── Public certificate verification ─────────────────────────────────────────--
-- The /verify/:token page is fully public, but RLS on user_certs and profiles is
-- own-row only, so an anonymous visitor cannot read them directly. This
-- SECURITY DEFINER function exposes ONLY the public-safe fields of an AWARDED
-- certificate (completed_at set), keyed by the unguessable verify_token. It
-- returns found=false for unknown tokens or certs that are not yet awarded, so it
-- never leaks the existence of an in-progress enrollment.
create or replace function public.get_certificate(p_token uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
declare
  v_uc      public.user_certs%rowtype;
  v_cert    public.certs%rowtype;
  v_name    text;
begin
  select * into v_uc from public.user_certs where verify_token = p_token;
  if not found or v_uc.completed_at is null then
    return jsonb_build_object('found', false);
  end if;

  select * into v_cert from public.certs where id = v_uc.cert_id;

  if v_uc.is_anonymous then
    v_name := null;
  else
    v_name := coalesce(
      nullif(v_uc.holder_name_snapshot, ''),
      (select nullif(p.full_name, '') from public.profiles p where p.id = v_uc.user_id)
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'anonymous', v_uc.is_anonymous,
    'holder_name', v_name,
    'cert_title', v_cert.name,
    'cert_slug', v_cert.slug,
    'awarded_at', v_uc.completed_at
  );
end;
$function$;

grant execute on function public.get_certificate(uuid) to anon, authenticated;
