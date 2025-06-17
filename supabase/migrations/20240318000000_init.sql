-- Create profiles table that extends auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  role text check (role in ('admin', 'super_admin')) not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text,
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.events enable row level security;

-- Create policies
create policy "Profiles are viewable by admin users only"
  on profiles for select
  using (auth.uid() in (
    select id from profiles where role in ('admin', 'super_admin')
  ));

create policy "Events are viewable by admin users only"
  on events for select
  using (auth.uid() in (
    select id from profiles where role in ('admin', 'super_admin')
  ));

create policy "Events are insertable by admin users only"
  on events for insert
  with check (auth.uid() in (
    select id from profiles where role in ('admin', 'super_admin')
  ));

create policy "Events are updatable by admin users only"
  on events for update
  using (auth.uid() in (
    select id from profiles where role in ('admin', 'super_admin')
  ));

create policy "Events are deletable by admin users only"
  on events for delete
  using (auth.uid() in (
    select id from profiles where role in ('admin', 'super_admin')
  ));

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, username)
  values (new.id, new.email, 'admin', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 