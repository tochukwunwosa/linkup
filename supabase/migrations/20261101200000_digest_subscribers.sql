-- Weekly email alerts: subscribers and their state.
--
-- Personal data (email + state). No anon/authenticated access at all: only
-- server code using the service role reads or writes this table (sign-up
-- server action, confirm/unsubscribe routes, weekly send cron).
--
-- Double opt-in: a sign-up stores the requested preferences in pending_*
-- columns and only applies them when the emailed confirm link is used, so
-- nobody can subscribe, or change the settings of, an address they don't own.

create table if not exists public.digest_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),

  -- Active preferences (null until first confirmed)
  state text,
  include_online boolean,

  -- Preferences awaiting confirmation
  pending_state text,
  pending_include_online boolean,
  confirm_token_hash text unique,       -- sha256 of the emailed token
  confirm_expires_at timestamptz,

  status text not null default 'pending' check (status in ('pending', 'confirmed')),
  unsubscribe_token text not null unique, -- random; only allows unsubscribing

  consent_text text not null,           -- wording the person agreed to
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_digest_subscribers_confirmed
  on public.digest_subscribers (status, state);

alter table public.digest_subscribers enable row level security;
-- No policies on purpose: RLS with no policies denies anon and authenticated.
revoke all on table public.digest_subscribers from anon, authenticated;
