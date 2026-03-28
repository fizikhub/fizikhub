import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const { data, error } = await supabase.from('articles').select('content').order('created_at', { ascending: false }).limit(5);
    if (error) console.error(error);
    else {
        console.log(JSON.stringify(data, null, 2));
    }
}
main();
