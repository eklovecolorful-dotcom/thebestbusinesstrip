-- Adds Stripe deposit-payment tracking to orders.
-- A deposit locks in the tour date; the remainder is settled with the host later.

alter table public.orders
  add column if not exists stripe_checkout_session_id text,
  add column if not exists deposit_amount_cents integer,
  add column if not exists deposit_paid_at timestamptz;

create unique index if not exists orders_stripe_checkout_session_id_idx
  on public.orders (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
