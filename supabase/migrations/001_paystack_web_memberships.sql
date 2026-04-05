-- 001_paystack_web_memberships.sql

alter table public.subscriptions
  add column if not exists billing_provider text,
  add column if not exists external_reference text,
  add column if not exists billing_interval text,
  add column if not exists currency text,
  add column if not exists amount_minor bigint,
  add column if not exists cancelled_at timestamptz,
  add column if not exists metadata jsonb;

create unique index if not exists subscriptions_external_reference_key
  on public.subscriptions (external_reference)
  where external_reference is not null;

create table if not exists public.paystack_webhook_events (
  id bigserial primary key,
  event_id text not null,
  event_type text not null,
  reference text,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

create unique index if not exists paystack_webhook_events_event_id_key
  on public.paystack_webhook_events (event_id);

create table if not exists public.paystack_checkout_sessions (
  id bigserial primary key,
  user_id uuid not null,
  plan_type text not null,
  billing_interval text not null,
  reference text not null,
  amount_minor bigint not null,
  currency text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create unique index if not exists paystack_checkout_sessions_reference_key
  on public.paystack_checkout_sessions (reference);