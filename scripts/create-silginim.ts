
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
    const email = 'silginim@gmail.com';
    const password = 'SİLGİNİM123.098.';
    const username = 'silginim';
    const fullName = 'Silginim';
    const avatarUrl = 'https://cdn-icons-png.flaticon.com/512/2661/2661282.png'; // Eraser icon

    console.log(`Creating user: ${email}`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

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
        console.log(`Avatar: ${avatarUrl}`);
    }
}

createUser();
