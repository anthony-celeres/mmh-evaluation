-- Create occupant_evaluations table
create table if not exists public.occupant_evaluations (
  id uuid primary key default gen_random_uuid(),
  occupant_id uuid not null references public.users(auth_user_id) on delete cascade,
  evaluators text[] not null default '{}',
  records text not null,
  first_sem text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add updated_at trigger
create trigger set_occupant_evaluations_updated_at
before update on public.occupant_evaluations
for each row
execute function public.set_updated_at();

-- Enable RLS
alter table public.occupant_evaluations enable row level security;

-- Policies
create policy "Occupants can view their own evaluation records"
  on public.occupant_evaluations
  for select
  using (auth.uid() = occupant_id);

create policy "Admins can manage all evaluation records"
  on public.occupant_evaluations
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Indexing for performance
create index if not exists occupant_evaluations_occupant_id_idx on public.occupant_evaluations (occupant_id);
