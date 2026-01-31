create or replace function get_follower_count(target_user_id uuid)
returns bigint
language plpgsql
security definer
as $$
declare
  real_count bigint;
  user_email text;
begin
  -- Get the email of the user
  select email into user_email from auth.users where id = target_user_id;
  
  -- Get real follower count
  select count(*) into real_count from follows where following_id = target_user_id;
  
  -- If admin, add 28000
  if user_email = 'barannnbozkurttb.b@gmail.com' then
    return real_count + 28000;
  end if;
  
  return real_count;
end;
$$;
