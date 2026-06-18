create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  degree_program text not null,
  year smallint not null check (year between 1 and 10),
  room_number text,
  role text not null check (role in ('admin', 'occupant')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_role_idx on public.users (role);

alter table public.users enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create policy "Users can read their own profile"
  on public.users
  for select
  using (auth.uid() = auth_user_id);

create policy "Users can create their own profile"
  on public.users
  for insert
  with check (auth.uid() = auth_user_id);

create policy "Users can update their own profile"
  on public.users
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users as u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  )
$$;

create policy "Admins can read all profiles"
  on public.users
  for select
  using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_degree_program text;
  v_year smallint;
  v_room_number text;
  v_role text;
begin
  v_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', new.email);
  v_degree_program := coalesce(new.raw_user_meta_data ->> 'degree_program', 'Undeclared');
  v_year := coalesce(nullif(new.raw_user_meta_data ->> 'year', '')::smallint, 1);
  v_room_number := nullif(new.raw_user_meta_data ->> 'room_number', '');
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'occupant');

  insert into public.users (
    auth_user_id,
    full_name,
    email,
    degree_program,
    year,
    room_number,
    role
  )
  values (
    new.id,
    v_full_name,
    new.email,
    v_degree_program,
    v_year,
    v_room_number,
    v_role
  )
  on conflict (auth_user_id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        degree_program = excluded.degree_program,
        year = excluded.year,
        room_number = excluded.room_number,
        role = excluded.role,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.add_user_profile(
  p_auth_user_id uuid,
  p_full_name text,
  p_email text,
  p_degree_program text,
  p_year smallint,
  p_room_number text,
  p_role text
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
begin
  insert into public.users (
    auth_user_id,
    full_name,
    email,
    degree_program,
    year,
    room_number,
    role
  )
  values (
    p_auth_user_id,
    p_full_name,
    p_email,
    p_degree_program,
    p_year,
    p_room_number,
    p_role
  )
  on conflict (auth_user_id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        degree_program = excluded.degree_program,
        year = excluded.year,
        room_number = excluded.room_number,
        role = excluded.role,
        updated_at = now()
  returning * into v_user;

  return v_user;
end;
$$;