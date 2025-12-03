
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
    const email = 'kozmobilim123@gmail.com';
    const password = 'Kosmobilim123321.';
    const username = 'kozmobilim';
    const fullName = 'Kozmobilim';
    // Using a default avatar or a space-themed one if possible, but standard is fine.
    const avatarUrl = 'https://cdn-icons-png.flaticon.com/512/3212/3212567.png'; // Planet/Space icon

    console.log(`Creating user: ${email}`);

    // Check if service role key is used to allow admin creation (auto-confirm)
    const isServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    let authData, authError;

    if (isServiceRole) {
        console.log('Using Service Role Key for Admin creation...');
        const result = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });
        authData = result.data;
        authError = result.error;
    } else {
        console.log('Using Anon Key for public SignUp...');
        const result = await supabase.auth.signUp({
            email,
            password,
        });
        authData = result.data;
        authError = result.error;
    }

    if (authError) {
        console.error('Error creating user:', authError.message);
        return;
    }

    if (!authData.user) {
        console.error('User creation failed (no user returned)');
        return;
    }

    console.log('User created:', authData.user.id);

    // 2. Update Profile
    // Wait a bit for the trigger to create the profile
    console.log('Waiting for profile trigger...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError.message);
    } else {
        console.log('Profile updated successfully!');
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
    }
}

createUser();
