
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function grantExtraTime() {
    const username = 'silginim';

    console.log(`Checking time usage for user: ${username}...`);

    // 1. Get user by username
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, username, daily_time_used_seconds')
        .eq('username', username)
        .single();

    if (userError || !user) {
        console.error('Error finding user:', userError ? userError.message : 'User not found');
        return;
    }

    console.log(`Found user: ${user.username}. Current usage: ${user.daily_time_used_seconds}s`);

    // 2. Reduce usage by 600 seconds (10 mins), but not below 0
    const newUsage = Math.max(0, (user.daily_time_used_seconds || 0) - 600);

    console.log(`Granting 10 mins... New usage will be: ${newUsage}s`);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ daily_time_used_seconds: newUsage })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating time usage:', updateError.message);
    } else {
        console.log(`Successfully granted 10 minutes! User usage reduced from ${user.daily_time_used_seconds}s to ${newUsage}s.`);
    }
}

grantExtraTime();
