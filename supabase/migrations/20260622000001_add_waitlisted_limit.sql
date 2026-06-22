-- Insert default waitlisted_limit of 10
insert into public.system_settings (key, value)
values ('waitlisted_limit', '10')
on conflict (key) do nothing;
