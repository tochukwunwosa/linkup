
-- Create Admins Table
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null check (role in ('admin', 'superadmin')),
  invited_by text,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- Create Events Table
create table if not exists events (
  id serial primary key,
  title text not null,
  start_date date not null,
  end_date date,
  location text not null,
  time text not null,
  type text not null check (type in ('Online', 'In-person', 'In-person & Online')),
  category text not null,
  price text,
  price_amount text,
  description text not null,
  publish_status text not null,
  link text,
  created_by uuid references admins(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

-- Admins RLS Policies
create policy "Superadmins can read all admins"
on admins for select
using (
  auth.uid() is not null and (
    exists (
      select 1 from admins a
      where a.email = auth.jwt() ->> 'email'
      and a.role = 'superadmin'
    )
  )
);

create policy "Admins can read their own profile"
on admins for select
using (
  auth.uid() is not null and
  email = auth.jwt() ->> 'email'
);

create policy "Only superadmins can modify admins"
on admins for all
to authenticated
using (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
    and a.role = 'superadmin'
  )
)
with check (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
    and a.role = 'superadmin'
  )
);

-- Events RLS Policies
create policy "Admins and superadmins can read all events"
on events for select
using (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
  )
);

create policy "Admins and superadmins can insert events"
on events for insert
with check (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
  )
);

create policy "Admins and superadmins can update any event"
on events for update
using (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
  )
);

create policy "Admins and superadmins can delete any event"
on events for delete
using (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email'
  )
);
