-- Update occupant_evaluations table to use numeric points
alter table public.occupant_evaluations 
add column if not exists evaluator_points numeric default 0 check (evaluator_points <= 35),
add column if not exists record_points numeric default 0 check (record_points <= 65),
add column if not exists record_details text; -- Store the actual text comments here

-- Optional: rename 'records' if you want to be cleaner, but keeping it simple for now.
