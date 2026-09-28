-- Leads from the gated business portals (/barber, /collabs, /credit, /trading, /cutlist).
-- The public site may INSERT only; nobody can read, change or delete leads through the site.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business text not null check (business in ('barber','collabs','credit','trading','the-cut-list')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 32),
  email text not null check (char_length(email) between 5 and 200 and email like '%_@_%._%'),
  source_path text check (source_path is null or char_length(source_path) <= 200),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Public can submit leads" on public.leads;
create policy "Public can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);
-- No select / update / delete policies: leads are readable only by the project owner (dashboard / service role).
