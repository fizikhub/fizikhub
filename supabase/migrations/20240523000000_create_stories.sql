-- Create stories table if it doesn't exist
create table if not exists public.stories (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  media_url text not null,
  thumbnail_url text, -- Optional, or can use media_url if image
  type text not null default 'image', -- 'image' or 'video'
  caption text,
  author_id uuid references auth.users not null,
  expires_at timestamp with time zone default (now() + interval '24 hours'),
  
  constraint stories_pkey primary key (id)
);

-- Enable RLS
alter table public.stories enable row level security;

-- Policies (drop first to handle existing policies efficiently)
drop policy if exists "Public stories are viewable by everyone" on public.stories;
create policy "Public stories are viewable by everyone"
  on public.stories for select
  using ( true );

drop policy if exists "Admins can insert stories" on public.stories;
create policy "Admins can insert stories"
  on public.stories for insert
  with check ( auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );

drop policy if exists "Admins can delete stories" on public.stories;
create policy "Admins can delete stories"
  on public.stories for delete
  using ( auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );

-- Storage bucket for stories (insert if not exists)
insert into storage.buckets (id, name, public)
values ('stories', 'stories', true)
on conflict (id) do nothing;

drop policy if exists "Stories images are publicly accessible" on storage.objects;
create policy "Stories images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'stories' );

drop policy if exists "Admins can upload stories" on storage.objects;
create policy "Admins can upload stories"
  on storage.objects for insert
  with check ( bucket_id = 'stories' and auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );
