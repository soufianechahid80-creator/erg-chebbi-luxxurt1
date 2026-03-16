create extension if not exists pgcrypto;

alter table if exists public.contact_messages add column if not exists page_source text default 'contact';
alter table if exists public.contact_messages add column if not exists preferred_language text default 'en';
alter table if exists public.contact_messages add column if not exists status text default 'new';

alter table if exists public.booking_requests add column if not exists category text;
alter table if exists public.booking_requests add column if not exists start_date date;
alter table if exists public.booking_requests add column if not exists end_date date;
alter table if exists public.booking_requests add column if not exists add_ons jsonb not null default '[]'::jsonb;
alter table if exists public.booking_requests add column if not exists payment_status text not null default 'unpaid';
alter table if exists public.booking_requests add column if not exists payment_reference text;
alter table if exists public.booking_requests add column if not exists source text not null default 'website';
alter table if exists public.booking_requests add column if not exists status text not null default 'new';
alter table if exists public.booking_requests add column if not exists notes text;
alter table if exists public.booking_requests add column if not exists updated_at timestamptz not null default now();

update public.booking_requests
set start_date = coalesce(start_date, check_in_date),
    end_date = coalesce(end_date, check_out_date)
where true;

alter table if exists public.page_events add column if not exists path text;
alter table if exists public.page_events add column if not exists event_type text not null default 'page_view';
alter table if exists public.page_events add column if not exists referrer text;
alter table if exists public.page_events add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table if exists public.visitor_sessions add column if not exists current_path text;
alter table if exists public.visitor_sessions add column if not exists last_seen_at timestamptz not null default now();
alter table if exists public.visitor_sessions add column if not exists views integer not null default 1;
alter table if exists public.visitor_sessions add column if not exists converted boolean not null default false;

alter table if exists public.payment_links add column if not exists payment_url text;
alter table if exists public.payment_links add column if not exists updated_at timestamptz not null default now();

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.booking_requests(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by text default 'system',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_recent_activity (
  id uuid primary key default gen_random_uuid(),
  activity_type text not null,
  entity_type text not null,
  entity_id text,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.payment_links (provider, label, payment_url, is_active)
values
  ('pay_later', 'Pay Later / Confirm Reservation First', null, true),
  ('stripe', 'Credit Card / Stripe', null, false),
  ('paypal', 'PayPal', null, false),
  ('bank_transfer', 'Bank Transfer', null, false),
  ('cmi', 'CMI / Local Morocco Payment', null, false)
on conflict (provider) do nothing;
