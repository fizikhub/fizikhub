"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { getSiteUrl } from "@/lib/site-url";
import { Resend } from "resend";
import { buildRecoveryTemplate } from "../../scripts/auth-email-templates.mjs";

export async function sendPasswordResetEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!normalizedEmail) {
        return { success: false, error: "E-posta adresi bulunamadı." };
    }

    if (!resendApiKey) {
        return { success: false, error: "Şifre sıfırlama e-posta sistemi yapılandırması eksik." };
    }

    const redirectTo = `${getSiteUrl()}/auth/callback?next=/reset-password`;
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: normalizedEmail,
        options: { redirectTo },
    });

    if (error || !data?.properties?.action_link) {
        return { success: false, error: error?.message || "Şifre sıfırlama bağlantısı oluşturulamadı." };
    }

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
        from: "FizikHub <bildirim@fizikhub.com>",
        to: normalizedEmail,
        subject: "FizikHub şifre sıfırlama",
        html: buildRecoveryTemplate(data.properties.action_link),
    });

    if (result.error) {
        return { success: false, error: result.error.message };
    }

    return { success: true };
}
