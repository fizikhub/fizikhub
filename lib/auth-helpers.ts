import { cache } from "react";
import { createClient } from "./supabase-server";
import { isAdminEmail } from "./admin-shared";

/**
 * Shared cached helper to check author/admin status.
 * Prevents multiple profile fetch requests in a single server request cycle.
 */
export const getAuthorizedProfile = cache(async (userId: string) => {
    const supabase = await createClient();
    const [{ data: profile }, { data: { user } }] = await Promise.all([
        supabase
        .from("profiles")
        .select("id, username, role, is_writer")
        .eq("id", userId)
        .single(),
        supabase.auth.getUser(),
    ]);
    
    if (!profile) return null;

    const isAuthorized = 
        isAdminEmail(user?.email) ||
        profile.role === "admin" || 
        profile.role === "editor" || 
        profile.is_writer === true;

    return { 
        ...profile, 
        isAuthorized 
    };
});
