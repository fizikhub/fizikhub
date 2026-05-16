"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { ensureUserProfile } from "@/lib/auth-profile";
import { validatePasswordStrength } from "@/lib/security";
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
        console.error("Turnstile secret key is not configured");
        return { success: false, error: "Turnstile yapılandırması eksik." };
    }

    if (!token) {
        return { success: false, error: "Robot doğrulaması tamamlanmadı. Lütfen tekrar deneyin." };
    }

    try {
        const formData = new FormData();
        formData.append("secret", secret);
        formData.append("response", token);

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: formData,
        });

        const result = await response.json() as { success?: boolean; "error-codes"?: string[] };

        if (!result.success) {
            const codes = result["error-codes"]?.join(", ") || "bilinmeyen";
            console.error("Turnstile verification failed:", codes);
            return { success: false, error: `Robot doğrulaması başarısız (${codes}). Sayfayı yenileyip tekrar deneyin.` };
        }

        return { success: true };
    } catch (err) {
        console.error("Turnstile verification network error:", err);
        return { success: false, error: "Robot doğrulaması yapılamadı (ağ hatası). Lütfen tekrar deneyin." };
    }
}

export async function signupWithEmailOtp(input: SignupWithEmailOtpInput) {
    try {
        const email = input.email.trim().toLowerCase();
        const username = input.username.trim();
        const fullName = input.fullName.trim();

        // ── 1. Basic validation ──
        if (!email || !input.password || !username || !fullName) {
            return { success: false, error: "Lütfen tüm alanları doldurun. [ERR_SIGNUP_001]" };
        }

        if (username.length < 3) {
            return { success: false, error: "Kullanıcı adı en az 3 karakter olmalı. [ERR_SIGNUP_002]" };
        }

        const passwordError = validatePasswordStrength(input.password);
        if (passwordError) {
            return { success: false, error: `${passwordError} [ERR_SIGNUP_003]` };
        }

        // ── 2. Turnstile verification ──
        const turnstile = await verifyTurnstileToken(input.captchaToken);
        if (!turnstile.success) {
            return { success: false, error: `${turnstile.error} [ERR_SIGNUP_004]` };
        }

        // ── 3. Environment check ──
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!serviceRoleKey || !resendApiKey) {
            console.error("Missing env vars:", { hasServiceRole: !!serviceRoleKey, hasResend: !!resendApiKey });
            return { success: false, error: "Sunucu yapılandırma hatası. Lütfen yöneticiyle iletişime geçin. [ERR_SIGNUP_005]" };
        }

        let supabaseAdmin;
        try {
            supabaseAdmin = createAdminClient();
        } catch (adminErr: any) {
            console.error("Admin client creation failed:", adminErr);
            return { success: false, error: "Sunucu bağlantı hatası. [ERR_SIGNUP_006]" };
        }

        // ── 4. Username uniqueness check ──
        const { data: existingProfile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("username", username)
            .maybeSingle();

        if (profileError) {
            console.error("Username check DB error:", profileError);
            return { success: false, error: `Kullanıcı adı kontrolünde hata: ${profileError.message} [ERR_SIGNUP_007]` };
        }

        if (existingProfile) {
            return { success: false, error: "Bu kullanıcı adı zaten alınmış. [ERR_SIGNUP_008]" };
        }

        // ── 5. Generate signup link ──
        // generateLink will return an error if email is already registered
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

        if (error) {
            console.error("generateLink error:", error.message, error);
            const message = error.message || "Bilinmeyen hata";

            if (message.toLowerCase().includes("already") || message.toLowerCase().includes("registered")) {
                return { success: false, error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin. [ERR_SIGNUP_EMAIL_EXISTS]" };
            }
            if (message.toLowerCase().includes("rate") || message.toLowerCase().includes("limit")) {
                return { success: false, error: "Çok fazla kayıt denemesi. Lütfen biraz bekleyin. [ERR_SIGNUP_RATE]" };
            }
            if (message.toLowerCase().includes("password")) {
                return { success: false, error: `Şifre hatası: ${message} [ERR_SIGNUP_PASSWORD]` };
            }

            return { success: false, error: `Kayıt oluşturulamadı: ${message} [ERR_SIGNUP_009]` };
        }

        if (!data?.properties?.email_otp || !data.user) {
            console.error("generateLink returned no OTP or user:", { hasOtp: !!data?.properties?.email_otp, hasUser: !!data?.user });
            return { success: false, error: "Doğrulama kodu oluşturulamadı. Lütfen tekrar deneyin. [ERR_SIGNUP_010]" };
        }

        // If user already has confirmed email, they're already registered
        if (data.user.email_confirmed_at) {
            return { success: false, error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin. [ERR_SIGNUP_EMAIL_EXISTS]" };
        }

        // ── 7. Send verification email ──
        let resend;
        try {
            resend = new Resend(resendApiKey);
        } catch (resendInitErr: any) {
            console.error("Resend init failed:", resendInitErr);
            return { success: false, error: "E-posta servisi başlatılamadı. [ERR_SIGNUP_011]" };
        }

        const result = await resend.emails.send({
            from: "FizikHub <bildirim@fizikhub.com>",
            to: email,
            subject: "FizikHub doğrulama kodun",
            html: buildConfirmationTemplate(data.properties.email_otp),
        });

        if (result.error) {
            console.error("Resend email error:", result.error);
            // Clean up: delete the user since email couldn't be sent
            try {
                await supabaseAdmin.auth.admin.deleteUser(data.user.id);
            } catch (deleteErr) {
                console.error("Failed to cleanup user after email error:", deleteErr);
            }
            return { success: false, error: `Doğrulama e-postası gönderilemedi: ${result.error.message} [ERR_SIGNUP_012]` };
        }

        return { success: true, email };

    } catch (unexpectedError: any) {
        // This is the CRITICAL safety net - catches ANY uncaught exception
        // so Next.js never hides the real error from the client
        console.error("CRITICAL: Unexpected signup error:", unexpectedError);
        const msg = unexpectedError?.message || unexpectedError?.toString() || "Bilinmeyen hata";
        return { success: false, error: `Beklenmeyen sunucu hatası: ${msg} [ERR_SIGNUP_CRITICAL]` };
    }
}

export async function verifyOtp(token: string, type: 'signup' | 'recovery' | 'magiclink' = 'signup', email: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    const verifiedUser = data.user;
    if (!verifiedUser) {
        return { success: false, error: "Oturum doğrulandı ama kullanıcı bilgisi alınamadı." };
    }

    const profileResult = await ensureUserProfile(verifiedUser);
    if (!profileResult.success) {
        console.error("OTP profile ensure error:", profileResult.error);
        return { success: false, error: "Profil hazırlanırken hata oluştu. Lütfen tekrar deneyin." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function resendOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!normalizedEmail) {
        return { success: false, error: "E-posta adresi bulunamadı." };
    }

    if (!resendApiKey) {
        return { success: false, error: "E-posta doğrulama sistemi yapılandırması eksik." };
    }

    const supabaseAdmin = createAdminClient();
    const resendSignupParams = {
        type: "signup",
        email: normalizedEmail,
    } as Parameters<typeof supabaseAdmin.auth.admin.generateLink>[0];
    const { data, error } = await supabaseAdmin.auth.admin.generateLink(resendSignupParams);

    if (error || !data?.properties?.email_otp) {
        return { success: false, error: error?.message || "Yeni doğrulama kodu oluşturulamadı." };
    }

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
        from: "FizikHub <bildirim@fizikhub.com>",
        to: normalizedEmail,
        subject: "FizikHub doğrulama kodun",
        html: buildConfirmationTemplate(data.properties.email_otp),
    });

    if (result.error) {
        return { success: false, error: result.error.message };
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
            .select('onboarding_completed, has_seen_onboarding')
            .eq('id', user.id)
            .maybeSingle();

        return {
            shouldShowOnboarding: Boolean(profile?.onboarding_completed && !profile.has_seen_onboarding)
        };
    } catch (error) {
        console.error("Onboarding status check failed:", error);
        return { shouldShowOnboarding: false };
    }
}
