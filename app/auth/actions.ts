"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                username: username,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/auth/verify");
}

export async function verifyOtp(token: string, type: 'signup' | 'recovery' | 'magiclink' = 'signup', email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
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

export async function completeOnboarding(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Kullanıcı bulunamadı." };
    }

    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const bio = formData.get("bio") as string;

    const updateData: any = {
        onboarding_completed: true,
        has_seen_onboarding: true
    };

    if (username) updateData.username = username;
    if (fullName) updateData.full_name = fullName;
    if (avatarUrl) updateData.avatar_url = avatarUrl;
    if (bio) updateData.bio = bio;

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/profil", "layout");
    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/login");
}

export async function getOnboardingStatus() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) return { shouldShowOnboarding: false };

        const { data: profile } = await supabase
            .from('profiles')
            .select('has_seen_onboarding')
            .eq('id', user.id)
            .maybeSingle();

        return {
            shouldShowOnboarding: profile && !profile.has_seen_onboarding
        };
    } catch (error) {
        console.error("Onboarding status check failed:", error);
        return { shouldShowOnboarding: false };
    }
}
