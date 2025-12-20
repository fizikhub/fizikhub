
const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
const path = require('path');

// Manually verify .env.local content first
// But for this script, we will try to load it or fail hard if not found.
config({ path: path.resolve(__dirname, '../.env.local') });

async function checkSignupMetadata() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // We need service role key to delete users and sometimes to bypass RLS if inspecting others' data
    // If it's not in .env.local, we can't run this full test properly, but we can try with ANON key 
    // and see if we can at least sign up.

    // NOTE: In the previous step, it complained about missing SERVICE_ROLE_KEY.
    // I will check if .env_local actually HAS it.

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing Supabase env vars. URL:', supabaseUrl, 'Key present:', !!serviceRoleKey);
        // If we only have anon key, we can create user but not inspect 'profiles' if RLS blocks it for others.
        // However, after signup we get a session, so we can inspect OUR OWN profile.
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    const testUsername = `testuser_${Date.now()}`;

    console.log(`Creating user: ${testEmail} with username: ${testUsername}`);

    const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
            data: {
                username: testUsername,
                full_name: 'Test Simulator',
                onboarding_completed: true
            }
        }
    });

    if (error) {
        console.error('SignUp Error:', error.message);
        return;
    }

    const userId = data.user?.id;
    console.log(`User created. ID: ${userId}`);

    // Wait for trigger
    await new Promise(r => setTimeout(r, 2000));

    console.log('Fetching profile...');

    // If we used service role, we can query anything.
    // If we used anon key, we might need to be logged in as that user?
    // signUp returns session usually if email confirmation is not required? 
    // Wait, if email confirmation IS required, session is null.
    // So we CANNOT query the profile with the returned session if it's null.
    // We MUST use Service Role Key to verify the DB state if email is not confirmed.

    if (!serviceRoleKey) {
        console.error("Cannot verify profile state without Service Role Key because session is null pending email confirmation.");
        return;
    }

    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (pError) {
        console.error('Profile fetch error:', pError.message);
    } else {
        console.log('Profile found:', profile);
        console.log(`Correctly onboarded? ${profile.onboarding_completed === true ? 'YES' : 'NO'}`);
    }

    // Cleanup
    await supabase.auth.admin.deleteUser(userId);
    console.log('Test user deleted.');
}

checkSignupMetadata().catch(console.error);
