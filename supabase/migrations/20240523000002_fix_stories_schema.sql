-- Ensure all columns exist in stories table
alter table public.stories add column if not exists media_url text;
alter table public.stories add column if not exists thumbnail_url text;
alter table public.stories add column if not exists type text default 'image';
alter table public.stories add column if not exists caption text;
alter table public.stories add column if not exists expires_at timestamp with time zone default (now() + interval '24 hours');

-- Make title nullable if it exists (fix for legacy schema issue)
do $$
begin
  -- Fix 'title'
  if exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'title') then
    alter table public.stories alter column title drop not null;
  end if;

  -- Fix 'image_url' (Legacy column causing errors)
  if exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'image_url') then
    alter table public.stories alter column image_url drop not null;
  end if;

  -- Fix 'content' (Potential legacy column)
  if exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'content') then
    alter table public.stories alter column content drop not null;
  end if;
  
  -- Fix 'description' (Potential legacy column)
  if exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'description') then
    alter table public.stories alter column description drop not null;
  end if;
end $$;

-- Ensure RLS is enabled
alter table public.stories enable row level security;

-- Re-apply policies to be safe (drop first)
drop policy if exists "Public stories are viewable by everyone" on public.stories;
create policy "Public stories are viewable by everyone"
  on public.stories for select
  using ( true );

drop policy if exists "Authenticated users can insert stories" on public.stories; 
create policy "Authenticated users can insert stories"
  on public.stories for insert
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete their own stories" on public.stories;
create policy "Users can delete their own stories"
  on public.stories for delete
  using ( auth.uid() = author_id );
