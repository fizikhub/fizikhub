"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function updatePassword(newPassword: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
