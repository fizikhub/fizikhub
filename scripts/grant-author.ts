import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function grantAuthorRole(username: string) {
    console.log(`Searching for user: ${username}`);

    // 1. Find the user by username in profiles table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, role')
        .eq('username', username)
        .single();

    if (profileError) {
        console.error('Error finding user:', profileError.message);
        return;
    }

    if (!profile) {
        console.error('User not found!');
        return;
    }

    console.log(`Found user: ${profile.username} (Current role: ${profile.role})`);

    // 2. Update the role
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'author' })
        .eq('id', profile.id);

    if (updateError) {
        console.error('Error updating role:', updateError.message);
    } else {
        console.log(`Successfully updated role for ${username} to 'author' ✅`);
    }
}

const targetUsername = process.argv[2];

if (!targetUsername) {
    console.error('Please provide a username. Usage: npx tsx scripts/grant-author.ts <username>');
    process.exit(1);
}

grantAuthorRole(targetUsername);
