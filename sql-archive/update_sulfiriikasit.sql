-- Update the follower count function to handle sulfiriikasit
create or replace function get_follower_count(target_user_id uuid)
returns bigint
language plpgsql
security definer
as $$
declare
  real_count bigint;
  target_username text;
  user_email text;
begin
  -- Get the username and email
  select username, email into target_username, user_email 
  from profiles 
  join auth.users on auth.users.id = profiles.id
  where profiles.id = target_user_id;
  
  -- Get real follower count
  select count(*) into real_count from follows where following_id = target_user_id;
  
  -- Logic for specific users
  if lower(target_username) = 'sulfiriikasit' then
    return real_count + 100000;
  end if;

  if user_email = 'barannnbozkurttb.b@gmail.com' then
    return real_count + 28000;
  end if;
  
  return real_count;
end;
$$;

-- Create Verified Badge if it doesn't exist
insert into badges (name, description, icon)
values ('Doğrulanmış Hesap', 'Bu hesap Fizikhub tarafından doğrulanmıştır.', '✅')
on conflict (name) do nothing;

-- Assign Verified Badge to sulfiriikasit
do $$
declare
  v_target_user_id uuid;
  v_badge_id integer;
begin
  -- Find user id
  select id into v_target_user_id from profiles where username = 'sulfiriikasit';
  
  -- Find badge id
  select id into v_badge_id from badges where name = 'Doğrulanmış Hesap';
  
  if v_target_user_id is not null and v_badge_id is not null then
    insert into user_badges (user_id, badge_id)
    values (v_target_user_id, v_badge_id)
    on conflict (user_id, badge_id) do nothing;
  end if;
end $$;