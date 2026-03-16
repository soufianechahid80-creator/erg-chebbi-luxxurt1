create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  country text,
  preferred_language text default 'en',
  experience_slug text not null,
  experience_title text not null,
  category text,
  start_date date,
  end_date date,
  nights integer default 0,
  adults integer not null default 2,
  children integer not null default 0,
  add_ons jsonb not null default '[]'::jsonb,
  payment_method text,
  payment_status text not null default 'unpaid',
  payment_reference text,
  estimated_total numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  special_requests text,
  source text not null default 'website',
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.booking_requests(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by text default 'system',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_language text default 'en',
  subject text,
  message text not null,
  page_source text default 'contact',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.visitor_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  landing_path text,
  current_path text,
  referrer text,
  locale text,
  user_agent text,
  country_guess text,
  views integer not null default 1,
  converted boolean not null default false,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  path text not null,
  event_type text not null default 'page_view',
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
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

create table if not exists public.payment_links (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  label text not null,
  payment_url text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability_calendar (
  id uuid primary key default gen_random_uuid(),
  available_date date not null unique,
  is_available boolean not null default true,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  asset_key text not null unique,
  label text not null,
  url text,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_booking_requests_status on public.booking_requests(status);
create index if not exists idx_booking_requests_created_at on public.booking_requests(created_at desc);
create index if not exists idx_booking_requests_experience_slug on public.booking_requests(experience_slug);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_visitor_sessions_last_seen_at on public.visitor_sessions(last_seen_at desc);
create index if not exists idx_page_events_session_id on public.page_events(session_id);
create index if not exists idx_page_events_created_at on public.page_events(created_at desc);
create index if not exists idx_activity_created_at on public.admin_recent_activity(created_at desc);

drop trigger if exists booking_requests_set_updated_at on public.booking_requests;
create trigger booking_requests_set_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

drop trigger if exists payment_links_set_updated_at on public.payment_links;
create trigger payment_links_set_updated_at
before update on public.payment_links
for each row execute function public.set_updated_at();

drop trigger if exists availability_calendar_set_updated_at on public.availability_calendar;
create trigger availability_calendar_set_updated_at
before update on public.availability_calendar
for each row execute function public.set_updated_at();

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

alter table public.booking_requests enable row level security;
alter table public.booking_status_history enable row level security;
alter table public.contact_messages enable row level security;
alter table public.visitor_sessions enable row level security;
alter table public.page_events enable row level security;
alter table public.admin_recent_activity enable row level security;
alter table public.payment_links enable row level security;
alter table public.availability_calendar enable row level security;
alter table public.media_assets enable row level security;

insert into public.payment_links (provider, label, payment_url, is_active)
values
  ('stripe', 'Credit Card / Stripe', null, false),
  ('paypal', 'PayPal', null, false),
  ('bank_transfer', 'Bank Transfer', null, false),
  ('cmi', 'CMI / Local Morocco Payment', null, false)
on conflict (provider) do nothing;
