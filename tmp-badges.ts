import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase.from('badges').select('name').order('name');
    if (error) {
        console.error(error);
    } else {
        console.log("BADGE NAMES:", JSON.stringify(data.map(d => d.name), null, 2));
        console.log("TOTAL BADGES:", data.length);
    }
}

main();
