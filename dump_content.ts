import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function dump() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  const { data: articles, error: artError } = await supabase.from('articles').select('title, content, category');
  const { data: forum, error: forError } = await supabase.from('questions').select('title, category');

  if (artError || forError) {
    console.error('Error:', artError || forError);
    return;
  }

  console.log('--- ARTICLES ---');
  articles?.forEach(a => console.log(`TITLE: ${a.title}\nCATEGORY: ${a.category}\nCONTENT: ${a.content.substring(0, 500)}...\n---`));
  
  console.log('--- FORUM ---');
  forum?.forEach(q => console.log(`QUESTION: ${q.title}\n---`));
}

dump();
