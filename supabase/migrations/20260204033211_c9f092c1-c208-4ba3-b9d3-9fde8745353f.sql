-- Add unique constraint on name column for upsert support
ALTER TABLE public.charities ADD CONSTRAINT charities_name_key UNIQUE (name);