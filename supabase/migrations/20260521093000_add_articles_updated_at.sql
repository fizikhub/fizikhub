alter table public.articles
    add column if not exists updated_at timestamptz;

update public.articles
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

alter table public.articles
    alter column updated_at set default now(),
    alter column updated_at set not null;

create or replace function public.set_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;

create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.set_articles_updated_at();
