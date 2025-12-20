
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key to bypass RLS if possible, or use anon if enabled for update

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserReputation() {
    const username = 'sulfiriikasit';
    const newReputation = 109;

    console.log(`Updating reputation for user: ${username} to ${newReputation}...`);

    // 1. Get user by username
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, username, reputation')
        .eq('username', username)
        .single();

    if (userError || !user) {
        console.error('Error finding user:', userError ? userError.message : 'User not found');
        return;
    }

    console.log(`Found user: ${user.username} (ID: ${user.id}). Current Reputation: ${user.reputation}`);

    // 2. Update reputation
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ reputation: newReputation })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating reputation:', updateError.message);
    } else {
        console.log('Successfully updated reputation!');
    }
}

updateUserReputation();
