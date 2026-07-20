-- Support for the automated event-scraping pipeline: scraped rows land in
-- the same event_submissions review queue used for public submissions.
alter table public.event_submissions
  add column if not exists source_type text not null default 'user' check (source_type in ('user', 'scraped')),
  add column if not exists source_url text,
  add column if not exists source_connector text,
  add column if not exists extraction_method text check (extraction_method in ('json-ld', 'og-meta')),
  add column if not exists confidence_score numeric,
  add column if not exists confidence_breakdown jsonb,
  add column if not exists dedupe_hash text;

-- Scraped events frequently have no discoverable named organizer contact.
alter table public.event_submissions alter column organizer_name drop not null;
alter table public.event_submissions alter column organizer_email drop not null;

create index if not exists idx_event_submissions_dedupe_hash on public.event_submissions(dedupe_hash);
create index if not exists idx_event_submissions_source_type on public.event_submissions(source_type);

-- Mirrors event_submissions.dedupe_hash so published events can also be
-- matched against during the scraper's dedup pass.
alter table public.events add column if not exists dedupe_hash text;
create index if not exists idx_events_dedupe_hash on public.events(dedupe_hash);

-- Tracks which connector the daily cron should run next, so a full
-- multi-source catalog gets covered over several days instead of one
-- Vercel Hobby invocation (~60s execution limit) trying to run all of them.
create table if not exists public.scrape_cursor (
  id boolean primary key default true, -- single-row table, enforced below
  last_connector_index integer not null default -1,
  last_run_at timestamptz,
  constraint scrape_cursor_singleton check (id)
);

insert into public.scrape_cursor (id, last_connector_index)
values (true, -1)
on conflict (id) do nothing;

-- Internal bookkeeping only — no anon/authenticated policies, so only the
-- service-role client (used by the scrape cron action) can read/write it.
alter table public.scrape_cursor enable row level security;
