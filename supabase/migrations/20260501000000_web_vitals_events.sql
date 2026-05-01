create table if not exists public.web_vitals_events (
    id uuid primary key default gen_random_uuid(),
    metric_id text,
    name text not null check (name in ('CLS', 'FCP', 'INP', 'LCP', 'TTFB')),
    value double precision not null,
    delta double precision,
    rating text check (rating is null or rating in ('good', 'needs-improvement', 'poor')),
    navigation_type text,
    pathname text,
    href text,
    connection jsonb,
    attribution jsonb,
    user_agent text,
    created_at timestamptz not null default now()
);

alter table public.web_vitals_events enable row level security;

create index if not exists web_vitals_events_name_created_at_idx
    on public.web_vitals_events (name, created_at desc);

create index if not exists web_vitals_events_pathname_created_at_idx
    on public.web_vitals_events (pathname, created_at desc);
