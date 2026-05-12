"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { buildConfirmationTemplate } from "../../scripts/auth-email-templates.mjs";

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

type SignupWithEmailOtpInput = {
    email: string;
    password: string;
    fullName: string;
    username: string;
    captchaToken: string;
    redirectTo?: string;
};

async function verifyTurnstileToken(token: string) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
        return { success: false, error: "Turnstile yapılandırması eksik." };
    }

    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: formData,
    });

    const result = await response.json() as { success?: boolean; "error-codes"?: string[] };

    if (!result.success) {
        return { success: false, error: "Robot doğrulaması başarısız oldu." };
    }

    return { success: true };
}

export async function signupWithEmailOtp(input: SignupWithEmailOtpInput) {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();
    const fullName = input.fullName.trim();

    if (!email || !input.password || !username || !fullName) {
        return { success: false, error: "Lütfen tüm alanları doldurun." };
    }

    if (username.length < 3) {
        return { success: false, error: "Kullanıcı adı en az 3 karakter olmalı." };
    }

    const turnstile = await verifyTurnstileToken(input.captchaToken);
    if (!turnstile.success) {
        return { success: false, error: turnstile.error };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!serviceRoleKey || !resendApiKey) {
        return { success: false, error: "E-posta doğrulama sistemi yapılandırması eksik." };
    }

    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (existingProfile) {
        return { success: false, error: "Bu kullanıcı adı zaten alınmış." };
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        password: input.password,
        options: {
            redirectTo: input.redirectTo,
            data: {
                username,
                full_name: fullName,
                onboarding_completed: false,
            },
        },
    });

    if (error || !data?.properties?.email_otp || !data.user) {
        const message = error?.message || "Kayıt doğrulama kodu oluşturulamadı.";

        if (message.toLowerCase().includes("already")) {
            return { success: false, error: "Bu e-posta zaten kayıtlı." };
        }

        return { success: false, error: message };
    }

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
        from: "FizikHub <bildirim@fizikhub.com>",
        to: email,
        subject: "FizikHub doğrulama kodun",
        html: buildConfirmationTemplate(data.properties.email_otp),
    });

    if (result.error) {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return { success: false, error: result.error.message };
    }

    return { success: true, email };
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
