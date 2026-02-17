-- Create storage bucket for stories if it doesn't exist
insert into storage.buckets (id, name, public)
values ('stories', 'stories', true)
on conflict (id) do nothing;

-- Set up RLS for storage
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'stories' );

create policy "Authenticated users can upload stories"
  on storage.objects for insert
  with check ( bucket_id = 'stories' and auth.role() = 'authenticated' );

create policy "Users can update their own stories"
  on storage.objects for update
  using ( bucket_id = 'stories' and auth.uid() = owner )
  with check ( bucket_id = 'stories' and auth.uid() = owner );

create policy "Users can delete their own stories"
  on storage.objects for delete
  using ( bucket_id = 'stories' and auth.uid() = owner );
