-- Allow authors to delete their own questions
create policy "Authors can delete their own questions"
  on questions for delete
  using (auth.uid() = author_id);

-- Allow authors to delete their own answers
create policy "Authors can delete their own answers"
  on answers for delete
  using (auth.uid() = author_id);
