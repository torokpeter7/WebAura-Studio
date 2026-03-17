create extension if not exists pgcrypto;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  website_type text,
  message text not null,
  status text not null default 'uj' check (status in ('uj', 'folyamatban', 'lezart'))
);

alter table public.contact_requests enable row level security;

-- Bárki beküldhet új ajánlatkérést a publikus űrlapról
create policy "Anyone can insert contact requests"
on public.contact_requests
for insert
to anon, authenticated
with check (true);

-- Csak belépett felhasználó olvashatja az ajánlatkéréseket
create policy "Authenticated users can read contact requests"
on public.contact_requests
for select
to authenticated
using (true);

-- Csak belépett felhasználó módosíthat státuszt
create policy "Authenticated users can update contact requests"
on public.contact_requests
for update
to authenticated
using (true)
with check (true);
