-- ─────────────────────────────────────────────────────────────────────────────
-- check_mastery_answer: per-question feedback without exposing the answer key.
--
-- The served mastery-check payload (get_mastery_check) is deliberately
-- answer-key-stripped, so the client cannot tell whether a single answer is
-- correct on its own. This read-only RPC grades ONE question server-side and
-- returns just {correct, explanation}. It records nothing and awards nothing —
-- final scoring and all value-bearing writes still live in submit_mastery_check,
-- which is left untouched.
--
-- Grading mirrors submit_mastery_check exactly:
--   multiple_choice — the selected option's is_correct flag.
--   fill_blank      — every blank's text must contain (case-insensitive) at
--                     least one of its accept terms.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.check_mastery_answer(
  p_question_id uuid,
  p_response jsonb
)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
declare
  v_uid     uuid := auth.uid();
  v_q       record;
  v_sel     text;
  v_correct boolean := false;
  v_expl    text;
  v_blank   jsonb;
  v_user_txt text;
  v_acc     jsonb;
  v_blank_ok boolean;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select q.id, q.type, q.content
    into v_q
  from public.mastery_check_questions q
  join public.mastery_checks c on c.id = q.check_id
  where q.id = p_question_id and c.status = 'published';
  if not found then
    raise exception 'question not found or not published';
  end if;

  if v_q.type = 'multiple_choice' then
    v_sel := p_response #>> '{}';   -- unwrap the JSON string into text
    v_correct := v_sel is not null and exists (
      select 1 from jsonb_array_elements(v_q.content->'options') o
      where (o->>'id') = v_sel and coalesce((o->>'is_correct')::boolean, false)
    );
    -- Prefer the chosen option's own explanation; fall back to the correct
    -- option's explanation so there is always something to show.
    select o->>'explanation' into v_expl
    from jsonb_array_elements(v_q.content->'options') o
    where (o->>'id') = v_sel and (o->>'explanation') is not null
    limit 1;
    if v_expl is null then
      select o->>'explanation' into v_expl
      from jsonb_array_elements(v_q.content->'options') o
      where coalesce((o->>'is_correct')::boolean, false) and (o->>'explanation') is not null
      limit 1;
    end if;

  elsif v_q.type = 'fill_blank' then
    v_correct := true;
    for v_blank in select * from jsonb_array_elements(v_q.content->'blanks')
    loop
      v_user_txt := coalesce(p_response ->> (v_blank->>'id'), '');
      v_blank_ok := false;
      for v_acc in select * from jsonb_array_elements(v_blank->'accept')
      loop
        if length(trim(both '"' from v_acc::text)) > 0
           and position(lower(v_acc #>> '{}') in lower(v_user_txt)) > 0 then
          v_blank_ok := true;
          exit;
        end if;
      end loop;
      if not v_blank_ok then
        v_correct := false;
        exit;
      end if;
    end loop;
    v_expl := v_q.content->>'explanation';
  end if;

  return jsonb_build_object('correct', v_correct, 'explanation', v_expl);
end;
$function$;

grant execute on function public.check_mastery_answer(uuid, jsonb) to authenticated;
