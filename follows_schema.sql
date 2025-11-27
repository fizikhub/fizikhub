-- Create follows table
create table if not exists follows (
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- Enable RLS
alter table follows enable row level security;

-- RLS Policies
create policy "Anyone can read follows"
  on follows for select
  using (true);

create policy "Authenticated users can follow others"
  on follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on follows for delete
  using (auth.uid() = follower_id);

-- Notification Trigger for New Follower
create or replace function handle_new_follow()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into notifications (user_id, type, content, link)
  values (
    new.following_id,
    'follow',
    'Seni takip etmeye başladı.',
    '/kullanici/' || (select username from profiles where id = new.follower_id)
  );
  return new;
end;
$$;

create trigger on_follow_created
  after insert on follows
  for each row
  execute procedure handle_new_follow();
