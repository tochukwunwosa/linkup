-- Lock down public access to event_submissions.
--
-- The 20250114 migration granted anon SELECT on every row ("using (true)").
-- Production had already dropped that policy (checked 2026-11-01), but it
-- still allowed anon to INSERT directly. The select drop below is kept so
-- fresh environments built from these migrations are not exposed.
--
-- After: anon has no direct table access. Public submissions go through
-- submit_event_submission(), which only inserts a 'pending', user-sourced
-- row and returns its id and tracking_id. Public lookups already use the
-- get_submission_by_tracking_id / get_submissions_by_email RPCs.

drop policy if exists "Public can read own submissions" on public.event_submissions;
drop policy if exists "Anyone can submit events" on public.event_submissions;

create or replace function public.submit_event_submission(
  p_slug_base text,
  p_title text,
  p_start_date date,
  p_end_date date,
  p_location text,
  p_time text,
  p_type text,
  p_category text[],
  p_price text,
  p_currency text,
  p_price_amount text,
  p_description text,
  p_link text,
  p_city text,
  p_country text,
  p_lat numeric,
  p_lng numeric,
  p_organizer_name text,
  p_organizer_email text,
  p_organizer_phone text,
  p_organizer_organization text
)
returns table (id uuid, tracking_id text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base text := coalesce(nullif(p_slug_base, ''), 'event');
  v_slug text := v_base;
  v_attempt int := 1;
begin
  -- Same scheme as generateUniqueEventSlug in lib/slug.ts: base, base-2, base-3...
  while exists (select 1 from public.events e where e.slug = v_slug)
     or exists (select 1 from public.event_submissions s where s.slug = v_slug) loop
    v_attempt := v_attempt + 1;
    v_slug := v_base || '-' || v_attempt;
  end loop;

  return query
  insert into public.event_submissions (
    title, slug, start_date, end_date, location, time, type, category,
    price, currency, price_amount, description, link, city, country, lat, lng,
    organizer_name, organizer_email, organizer_phone, organizer_organization,
    submission_status, source_type
  ) values (
    p_title, v_slug, p_start_date, p_end_date, p_location, p_time, p_type, p_category,
    p_price, coalesce(p_currency, 'NGN'), p_price_amount, p_description, p_link,
    p_city, p_country, p_lat, p_lng,
    p_organizer_name, p_organizer_email, p_organizer_phone, p_organizer_organization,
    'pending', 'user'
  )
  returning event_submissions.id, event_submissions.tracking_id;
end;
$$;

revoke all on function public.submit_event_submission(
  text, text, date, date, text, text, text, text[], text, text, text, text,
  text, text, text, numeric, numeric, text, text, text, text
) from public;
grant execute on function public.submit_event_submission(
  text, text, date, date, text, text, text, text[], text, text, text, text,
  text, text, text, numeric, numeric, text, text, text, text
) to anon, authenticated;

-- get_admin_emails() was executable by anon and PUBLIC, so anyone with the
-- public anon key could list admin email addresses. Its only caller is the
-- submit action, which now uses the service role. Revoke every overload by
-- name so this does not depend on the exact signature.
do $$
declare
  f regprocedure;
begin
  for f in
    select p.oid::regprocedure
    from pg_proc p
    where p.proname = 'get_admin_emails'
      and p.pronamespace = 'public'::regnamespace
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f);
  end loop;
end;
$$;
