-- Create avatars bucket if not exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own avatars
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to avatars
create policy "Avatars are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Allow users to update their own avatars
create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
create policy "Users can delete own avatar"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
