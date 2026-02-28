"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { validatePasswordStrength } from "@/lib/security";

export async function updatePassword(newPassword: string) {
    // Validate password strength
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
        return { success: false, error: strengthError };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
