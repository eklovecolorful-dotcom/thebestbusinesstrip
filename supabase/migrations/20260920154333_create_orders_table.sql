-- Orders created from the AI Trip Builder's "Confirm & Book" form.
-- All writes happen server-side (API route) using the service_role key,
-- which bypasses RLS by design — so this table intentionally has RLS
-- enabled with no public policies (no anon/authenticated access at all).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  tour_date date not null,
  party_size text not null,
  itinerary_details jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create index if not exists orders_customer_email_idx on public.orders (customer_email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
