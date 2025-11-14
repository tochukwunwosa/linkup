-- Create event_submissions table
create table if not exists public.event_submissions (
  id uuid default gen_random_uuid() primary key,
  tracking_id text unique not null,

  -- Event details (same as events table)
  title text not null,
  start_date date not null,
  end_date date,
  location text not null,
  time text not null,
  type text not null check (type in ('Online', 'In-person', 'In-person & Online')),
  category text[] not null,
  price text,
  currency text default 'NGN',
  price_amount text,
  description text not null,
  link text,
  city text,
  country text,
  lat numeric,
  lng numeric,

  -- Organizer information
  organizer_name text not null,
  organizer_email text not null,
  organizer_phone text,
  organizer_organization text,

  -- Submission status
  submission_status text not null default 'pending' check (submission_status in ('pending', 'approved', 'rejected')),
  admin_feedback text,
  reviewed_by uuid references public.admins(id) on delete set null,
  reviewed_at timestamptz,

  -- Published event reference (when approved)
  published_event_id integer references public.events(id) on delete set null,

  -- Timestamps
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.event_submissions enable row level security;

-- RLS Policies for event_submissions

-- Public can insert (submit events)
create policy "Anyone can submit events"
  on public.event_submissions for insert
  with check (true);

-- Public can read their own submissions by tracking_id (via server action)
create policy "Public can read own submissions"
  on public.event_submissions for select
  using (true); -- We'll filter by tracking_id in the server action

-- Admins can read all submissions
create policy "Admins can read all submissions"
  on public.event_submissions for select
  using (
    exists (
      select 1 from public.admins a
      where a.id = auth.uid()
    )
  );

-- Admins can update submissions (for approval/rejection)
create policy "Admins can update submissions"
  on public.event_submissions for update
  using (
    exists (
      select 1 from public.admins a
      where a.id = auth.uid()
    )
  );

-- Admins can delete submissions
create policy "Admins can delete submissions"
  on public.event_submissions for delete
  using (
    exists (
      select 1 from public.admins a
      where a.id = auth.uid()
    )
  );

-- Create index for faster queries
create index idx_event_submissions_status on public.event_submissions(submission_status);
create index idx_event_submissions_tracking_id on public.event_submissions(tracking_id);
create index idx_event_submissions_organizer_email on public.event_submissions(organizer_email);
create index idx_event_submissions_submitted_at on public.event_submissions(submitted_at desc);

-- Create function to generate tracking ID
create or replace function generate_tracking_id()
returns text as $$
declare
  new_id text;
  done bool;
begin
  done := false;
  while not done loop
    -- Generate 8-character tracking ID (e.g., EVT-A1B2C3D4)
    new_id := 'EVT-' || upper(substr(md5(random()::text), 1, 8));
    -- Check if it exists
    done := not exists(select 1 from public.event_submissions where tracking_id = new_id);
  end loop;
  return new_id;
end;
$$ language plpgsql;

-- Create trigger to auto-generate tracking_id
create or replace function set_tracking_id()
returns trigger as $$
begin
  if new.tracking_id is null or new.tracking_id = '' then
    new.tracking_id := generate_tracking_id();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_tracking_id_trigger
  before insert on public.event_submissions
  for each row execute function set_tracking_id();

-- Create trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_event_submissions_updated_at
  before update on public.event_submissions
  for each row execute function update_updated_at_column();

-- Add last_login column to admins table if not exists
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_name='admins' and column_name='last_login') then
    alter table public.admins add column last_login timestamptz;
  end if;
end $$;
