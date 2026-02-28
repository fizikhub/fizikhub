"use server";

import { createClient } from "@/lib/supabase-server";
import { headers } from "next/headers";

// Throttle last_seen updates: 5 dakikada bir güncelle (sunucu taraflı)
const lastSeenCache = new Map<string, number>();
const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000; // 5 dakika

function shouldUpdateLastSeen(userId: string): boolean {
    const now = Date.now();
    const lastUpdate = lastSeenCache.get(userId);
    if (!lastUpdate || now - lastUpdate > LAST_SEEN_THROTTLE_MS) {
        lastSeenCache.set(userId, now);
        // Belleği temizle: 1000+ kullanıcı biriktiyse eski kayıtları sil
        if (lastSeenCache.size > 1000) {
            const cutoff = now - LAST_SEEN_THROTTLE_MS;
            for (const [key, val] of lastSeenCache) {
                if (val < cutoff) lastSeenCache.delete(key);
            }
        }
        return true;
    }
    return false;
}

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

        // Build promises array
        const promises: PromiseLike<any>[] = [
            // 1. Insert Log
            supabase.from("user_activity_logs").insert({
                user_id: user.id,
                action_type: actionType,
                path: path,
                details: details,
                ip_address: ip,
                user_agent: userAgent,
            }),
        ];

        // 2. Throttled Last Seen update (5 dakikada bir)
        if (shouldUpdateLastSeen(user.id)) {
            promises.push(
                supabase.from("profiles").update({
                    last_seen: new Date().toISOString()
                }).eq("id", user.id)
            );
        }

        await Promise.all(promises);

    } catch (error) {
        console.error("Failed to log activity:", error);
        // Fail silently to not disrupt user experience
    }
}

