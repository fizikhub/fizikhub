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

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function completeOnboarding(formData: { username: string; fullName: string; avatarUrl?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Kullanıcı bulunamadı." };
    }

    // Check username uniqueness
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', formData.username)
        .neq('id', user.id)
        .single();

    if (existingUser) {
        return { success: false, error: "Bu kullanıcı adı zaten alınmış." };
    }

    // Update profile
    const { error } = await supabase
        .from('profiles')
        .update({
            username: formData.username,
            full_name: formData.fullName,
            avatar_url: formData.avatarUrl,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
