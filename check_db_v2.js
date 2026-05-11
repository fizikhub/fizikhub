import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  } else {
    const columns = Object.keys(data[0] || {});
    console.log("Database columns:", columns);
    if (columns.includes('wants_email_notifications')) {
      console.log("Column EXISTS! Everything is ready.");
    } else {
      console.log("Column MISSING! You still need to run the SQL.");
    }
  }
}
check();
