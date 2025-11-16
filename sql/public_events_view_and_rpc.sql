-- Create public_events view
-- This view filters events to only show published, upcoming events
-- Used for public-facing queries so users only see approved/published events
-- Only shows events that haven't ended yet (based on end_date or start_date)

create or replace view public_events as
select *
from events
where publish_status = 'Published'
  and is_deleted = false
  and (
    -- If end_date exists, check if it's >= today
    (end_date is not null and end_date >= current_date)
    or
    -- If end_date is null (single day event), check if start_date >= today
    (end_date is null and start_date >= current_date)
  )
order by start_date asc;

-- Allow public access to the view
grant select on public_events to anon, authenticated;

-- Create RPC function for category search
-- This function performs a full-text search on events by categories
-- It checks if ANY of the provided keywords match ANY of the event's categories (case-insensitive)

create or replace function search_events_by_categories(keywords text[])
returns setof public_events
language sql
stable
as $$
  select *
  from public_events
  where exists (
    select 1
    from unnest(category) as event_cat
    where exists (
      select 1
      from unnest(keywords) as keyword
      where lower(event_cat) = lower(keyword)
    )
  )
  order by start_date asc;
$$;

-- Allow public access to the RPC function
grant execute on function search_events_by_categories(text[]) to anon, authenticated;

-- Add helpful comments
comment on view public_events is 'Public view of published, upcoming events only. Filters out drafts, deleted events, and past events.';
comment on function search_events_by_categories(text[]) is 'Search published, upcoming events by category keywords. Returns events matching any of the provided categories. Automatically excludes past events.';
