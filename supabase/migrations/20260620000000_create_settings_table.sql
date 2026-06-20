-- Create system_settings table to store global admin settings
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Policies
drop policy if exists "Anyone can read system settings" on public.system_settings;
create policy "Anyone can read system settings"
  on public.system_settings
  for select
  using (true);

drop policy if exists "Admins can manage system settings" on public.system_settings;
create policy "Admins can manage system settings"
  on public.system_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Insert default retained_limit of 47
insert into public.system_settings (key, value)
values ('retained_limit', '47')
on conflict (key) do nothing;
