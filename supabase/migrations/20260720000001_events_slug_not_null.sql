-- Run this ONLY after `scripts/backfill-event-slugs.ts` has completed with
-- zero failures against this environment — every events row must already
-- have a slug or this migration fails.
alter table public.events alter column slug set not null;
create unique index if not exists events_slug_unique_idx on public.events(slug);
