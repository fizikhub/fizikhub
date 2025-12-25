"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ has_seen_onboarding: true })
        .eq("id", user.id);

    if (error) {
        console.error("Error completing onboarding:", error);
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
}
