import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase-admin";

type ProfileSnapshot = {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    onboarding_completed: boolean | null;
};

function cleanUsername(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_.-]/g, "")
        .replace(/^[_.-]+|[_.-]+$/g, "");
}

async function getUniqueUsername(baseValue: string, userId: string) {
    const supabaseAdmin = createAdminClient();
    let baseUsername = cleanUsername(baseValue);

    if (baseUsername.length < 3) {
        baseUsername = `user${Math.floor(Math.random() * 10000)}`;
    }

    for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = attempt === 0
            ? baseUsername
            : `${baseUsername.slice(0, 24)}${Math.floor(1000 + Math.random() * 9000)}`;

        const { data: collision } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("username", candidate)
            .neq("id", userId)
            .maybeSingle();

        if (!collision) return candidate;
    }

    return `${baseUsername.slice(0, 20)}${Date.now().toString(36)}`;
}

export async function ensureUserProfile(user: User) {
    const supabaseAdmin = createAdminClient();
    const metadata = user.user_metadata || {};
    const email = user.email || "";

    const { data: existingProfile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("id, username, full_name, avatar_url, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle<ProfileSnapshot>();

    if (fetchError) {
        return { success: false, error: fetchError.message };
    }

    const metaUsername = typeof metadata.username === "string" ? metadata.username : "";
    const metaFullName = typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
            ? metadata.name
            : "";
    const metaAvatar = typeof metadata.avatar_url === "string"
        ? metadata.avatar_url
        : typeof metadata.picture === "string"
            ? metadata.picture
            : "";

    const username = existingProfile?.username
        || await getUniqueUsername(metaUsername || email.split("@")[0] || "user", user.id);
    const fullName = existingProfile?.full_name || metaFullName || username;

    const { error: upsertError } = await supabaseAdmin
        .from("profiles")
        .upsert({
            id: user.id,
            username,
            full_name: fullName,
            avatar_url: existingProfile?.avatar_url || metaAvatar || null,
            onboarding_completed: existingProfile?.onboarding_completed ?? false,
            updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

    if (upsertError) {
        return { success: false, error: upsertError.message };
    }

    return {
        success: true,
        profile: {
            username,
            fullName,
            onboardingCompleted: existingProfile?.onboarding_completed ?? false,
        },
    };
}
