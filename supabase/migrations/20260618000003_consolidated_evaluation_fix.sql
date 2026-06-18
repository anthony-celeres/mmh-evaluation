-- Consolidated migration to ensure the occupant_evaluations table is correctly structured
-- This script safely adds all necessary columns if they are missing.

-- 1. Ensure the table exists
create table if not exists public.occupant_evaluations (
  id uuid primary key default gen_random_uuid(),
  occupant_id uuid not null references public.users(auth_user_id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Ensure all specific columns exist with correct types and constraints
alter table public.occupant_evaluations 
add column if not exists evaluator_points numeric default 0 check (evaluator_points <= 35),
add column if not exists record_points numeric default 0 check (record_points <= 65),
add column if not exists first_sem text,
add column if not exists second_sem text,
add column if not exists record_details text,
add column if not exists records text default '',
add column if not exists evaluators text[] not null default '{}';

-- 3. Ensure RLS is enabled and policies are set
alter table public.occupant_evaluations enable row level security;

do $$
begin
    if not exists (select 1 from pg_policies where policyname = 'Occupants can view their own evaluation records') then
        create policy "Occupants can view their own evaluation records"
          on public.occupant_evaluations
          for select
          using (auth.uid() = occupant_id);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admins can manage all evaluation records') then
        create policy "Admins can manage all evaluation records"
          on public.occupant_evaluations
          for all
          using (public.is_admin())
          with check (public.is_admin());
    end if;
end $$;

-- 4. Ensure triggers and indexes
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_occupant_evaluations_updated_at on public.occupant_evaluations;
create trigger set_occupant_evaluations_updated_at
before update on public.occupant_evaluations
for each row
execute function public.set_updated_at();

create index if not exists occupant_evaluations_occupant_id_idx on public.occupant_evaluations (occupant_id);
