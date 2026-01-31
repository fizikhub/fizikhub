-- Add cover_url to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url text;

-- Create covers bucket if not exists
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own covers
create policy "Users can upload own cover"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to covers
create policy "Covers are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'covers');

-- Allow users to update their own covers
create policy "Users can update own cover"
on storage.objects for update
to authenticated
using (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own covers
create policy "Users can delete own cover"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
