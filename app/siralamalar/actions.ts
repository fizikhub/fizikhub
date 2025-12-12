"use server";

import { createClient } from "@/lib/supabase-server";

export async function getLeaderboard() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, reputation, badges:user_badges(count)')
        .neq('username', 'baranbozkurt')
        .order('reputation', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }

    return data.map((user, index) => ({
        ...user,
        rank: index + 1,
        badgeCount: user.badges?.[0]?.count || 0
    }));
}
