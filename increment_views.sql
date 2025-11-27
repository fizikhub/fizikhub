create or replace function increment_question_views(question_id bigint)
returns void
language plpgsql
security definer
as $$
begin
  update questions
  set views = views + 1
  where id = question_id;
end;
$$;
