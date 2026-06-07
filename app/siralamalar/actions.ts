"use server";

import { unstable_cache } from "next/cache";
import { createStaticClient, hasSupabasePublicConfig } from "@/lib/supabase-server";

type LeaderboardRow = {
    id?: string | null;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    reputation?: number | null;
    badges?: Array<{ count?: number | null }> | null;
};

export type LeaderboardEntry = {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    reputation: number;
    rank: number;
    badgeCount: number;
};

// Use direct supabase-js (not SSR client) — unstable_cache cannot use cookies()
const fetchLeaderboard = unstable_cache(
    async () => {
        if (!hasSupabasePublicConfig()) return [];

        const supabase = createStaticClient();

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

        return ((data || []) as LeaderboardRow[])
            .filter((user): user is LeaderboardRow & { id: string; username: string } =>
                Boolean(user.id && user.username)
            )
            .map((user, index: number): LeaderboardEntry => ({
                id: user.id,
                username: user.username,
                full_name: user.full_name || user.username,
                avatar_url: user.avatar_url || "",
                reputation: user.reputation || 0,
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
