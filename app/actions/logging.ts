"use server";

import { createClient } from "@/lib/supabase-server";
import { headers } from "next/headers";

export async function logActivity(
    actionType: string,
    path: string,
    details: any = {}
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return; // Only log for authenticated users

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        // Parallelize updates for performance
        await Promise.all([
            // 1. Insert Log
            supabase.from("user_activity_logs").insert({
                user_id: user.id,
                action_type: actionType,
                path: path,
                details: details,
                ip_address: ip,
                user_agent: userAgent,
            }),

            // 2. Update Last Seen
            supabase.from("profiles").update({
                last_seen: new Date().toISOString()
            }).eq("id", user.id)
        ]);

    } catch (error) {
        console.error("Failed to log activity:", error);
        // Fail silently to not disrupt user experience
    }
}
