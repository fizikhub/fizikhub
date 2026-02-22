require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function get() {
  const { data } = await supabase.from('stories').select('id, title, group_id, media_url, expires_at').limit(5);
  console.log('Stories:', data);
  const { data: g } = await supabase.from('story_groups').select('id, title').limit(5);
  console.log('Groups:', g);
}
get();
