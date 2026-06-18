-- Add second_sem column to occupant_evaluations
alter table public.occupant_evaluations 
add column if not exists second_sem text;

-- Ensure required columns for backward compatibility exist
alter table public.occupant_evaluations
add column if not exists evaluators text[] not null default '{}',
add column if not exists records text default '';
