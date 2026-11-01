-- Published events including ones that have ended.
--
-- public_events only returns upcoming/ongoing events, so event pages 404'd
-- once an event ended, losing their search ranking and shared links. Event
-- pages and the sitemap read from this view instead; listings keep using
-- public_events so ended events don't appear in the feed.
create or replace view public.published_events as
select *
from public.events
where publish_status = 'Published'
  and is_deleted = false;

grant select on public.published_events to anon, authenticated;

comment on view public.published_events is
  'Published, non-deleted events including ended ones. For event pages and the sitemap; use public_events for listings.';
