-- Create stories table
create table public.stories (
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

-- Policies
create policy "Public stories are viewable by everyone"
  on public.stories for select
  using ( true );

create policy "Admins can insert stories"
  on public.stories for insert
  with check ( auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );

create policy "Admins can delete stories"
  on public.stories for delete
  using ( auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );

-- Storage bucket for stories
insert into storage.buckets (id, name, public) values ('stories', 'stories', true);

create policy "Stories images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'stories' );

create policy "Admins can upload stories"
  on storage.objects for insert
  with check ( bucket_id = 'stories' and auth.uid() in (select id from public.profiles where username = 'baranbozkurt') );
