import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data: stories } = await supabase.from('stories').select('id, title, group_id, media_url, expires_at').limit(5);
console.log('Stories:', stories);
const { data: g } = await supabase.from('story_groups').select('id, title').limit(5);
console.log('Groups:', g);
