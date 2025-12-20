"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}

export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient();
    // Remove any non-alphanumeric characters (spaces, dashes, etc.)
    const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');

    console.log(`Attempting verification for ${email} with token length ${cleanToken.length}`);

    // Array of types to try in order
    // 'signup': For new users
    // 'email': For existing users logging in or changing email
    // 'recovery': For password reset (sometimes used interchangeably in flows)
    const types: ('signup' | 'email' | 'recovery')[] = ['signup', 'email', 'recovery'];
    let lastError = "";

    for (const type of types) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: cleanToken,
            type
        });

        if (!error) {
            console.log(`Verification successful with type: ${type}`);
            return { success: true };
        }

        console.log(`Verification failed for type ${type}:`, error.message);
        // Capture the error from the 'signup' attempt as it's the most likely one for new users
        if (type === 'signup') {
            lastError = error.message;
        }
    }

    // If all fail, return the specific error for debugging
    return { success: false, error: lastError || "Doğrulama başarısız." };
}

export async function resendOtp(email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function completeOnboarding(formData: { username: string; fullName: string; avatarUrl?: string; bio?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Kullanıcı bulunamadı." };
    }

    // Normalize username just in case client-side validation was bypassed
    let username = formData.username.toLowerCase();
    const trMap: { [key: string]: string } = { 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' };
    username = username.replace(/[ğüşıöç]/g, char => trMap[char] || char);
    username = username.replace(/[^a-z0-9_.-]/g, '');

    if (username.length < 3) {
        return { success: false, error: "Kullanıcı adı en az 3 karakter olmalıdır." };
    }

    // Check username uniqueness
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id) // Exclude self if updating
        .single();

    if (existingUser) {
        return { success: false, error: "Bu kullanıcı adı zaten alınmış." };
    }

    // UPSERT profile to handle both new and existing (auto-created) profiles
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            username: formData.username,
            full_name: formData.fullName,
            avatar_url: formData.avatarUrl,
            bio: formData.bio,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
        });

    if (error) {
        return { success: false, error: error.message };
    }

    // Redirect to profile page on success
    redirect('/profil');
}
