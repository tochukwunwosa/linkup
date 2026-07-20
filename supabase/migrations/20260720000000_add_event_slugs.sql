-- Add slug columns for SEO-friendly event URLs.
-- events.slug is left nullable here; a backfill script populates existing
-- rows, after which a follow-up migration adds NOT NULL + a unique index.
alter table public.events add column if not exists slug text;

-- event_submissions.slug is generated at intake (submit or scrape time) and
-- carried forward into events on approval. No unique constraint here since
-- duplicate slugs across pending/rejected submissions are harmless.
alter table public.event_submissions add column if not exists slug text;
