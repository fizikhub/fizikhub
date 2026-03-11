"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

// Use direct supabase-js (not SSR client) — unstable_cache cannot use cookies()
const fetchLeaderboard = unstable_cache(
    async () => {
        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
        );

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

        return data.map((user: any, index: number) => ({
            ...user,
            rank: index + 1,
            badgeCount: user.badges?.[0]?.count || 0
        }));
    },
    ['leaderboard-v1'],
    { revalidate: 60, tags: ['leaderboard'] }
);

export async function getLeaderboard() {
    return fetchLeaderboard();
}
