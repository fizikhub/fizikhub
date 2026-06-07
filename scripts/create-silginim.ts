
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.SEED_SILGINIM_EMAIL || 'silginim@gmail.com';
const password = process.env.SEED_SILGINIM_PASSWORD;
const username = process.env.SEED_SILGINIM_USERNAME || 'silginim';
const fullName = process.env.SEED_SILGINIM_FULL_NAME || 'Silginim';
const avatarUrl = process.env.SEED_SILGINIM_AVATAR_URL || 'https://cdn-icons-png.flaticon.com/512/2661/2661282.png';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

if (!password) {
    console.error('Missing SEED_SILGINIM_PASSWORD. Refusing to use a hard-coded seed password.');
    process.exit(1);
}

const seedPassword = password;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
    console.log(`Creating user: ${email}`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: seedPassword,
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
