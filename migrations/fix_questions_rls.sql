-- Drop failing policies (if any)
drop policy if exists "Users can update their own questions" on questions;
drop policy if exists "Authors can edit their questions" on questions;

-- Create correct policy for UPDATE
create policy "Authors can edit their questions"
on questions for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);
