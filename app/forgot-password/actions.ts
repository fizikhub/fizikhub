"use server";

import { createClient } from "@/lib/supabase-server";

export async function sendPasswordResetEmail(email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
