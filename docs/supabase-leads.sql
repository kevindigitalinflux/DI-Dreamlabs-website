-- DI Dreamlabs website — leads table.
-- Run in the Supabase SQL editor when wiring up the lead pipeline.
-- Writes happen ONLY from the Cloudflare Pages Function using the
-- service-role key; anonymous/authenticated clients have no access at all.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  company text,
  industry text,
  source text not null check (source in ('calculator', 'contact', 'newsletter')),
  payload jsonb,
  created_at timestamptz not null default now()
);

-- RLS on, no policies for anon/authenticated → only service role can touch it.
alter table public.leads enable row level security;

comment on table public.leads is
  'Marketing-site leads (free-audit requests, calculator unlocks, newsletter signups). Service-role writes only.';
