import { cache } from "react";
import { createClient } from "./supabase-server";

/**
 * Shared cached helper to check author/admin status.
 * Prevents multiple profile fetch requests in a single server request cycle.
 */
export const getAuthorizedProfile = cache(async (userId: string) => {
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, role, is_writer")
        .eq("id", userId)
        .single();
    
    if (!profile) return null;

    const isAuthorized = 
        profile.username === "baranbozkurt" || 
        profile.role === "admin" || 
        profile.role === "editor" || 
        profile.is_writer === true;

    return { 
        ...profile, 
        isAuthorized 
    };
});
