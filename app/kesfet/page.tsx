import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// Force dynamic rendering to ensure fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: "Keşfet | Fizikhub",
    description: "Fizik dünyasındaki en son makaleleri, popüler konuları ve bilimsel tartışmaları keşfedin.",
};

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string };
}) {
    const supabase = await createClient();
    const query = searchParams.q;
    const category = searchParams.category;

    let dbQuery = supabase
        .from("articles")
        .select(`
            *,
            profiles (
                username,
                full_name,
                avatar_url
            )
        `)
        .eq("status", "published")
        // Sort by reviewed_at (publication time) if available, otherwise created_at
        // Using created_at as primary descending sort is usually fine, but let's try strict consistency.
        // Actually, let's keep it simple: Sort by created_at DESC for now, 
        // as changing sort logic might confuse "old" articles appearing on top if they were just approved.
        // Wait, "Recently Approved" SHOULD appear on top? 
        // If sorting by created_at, an old draft approved today will appear at the bottom.
        // Let's sort by reviewed_at if possible. But old articles have reviewed_at NULL.
        // So fallback to created_at is needed. 
        // Easy fix: sort by reviewed_at DESC NULLS LAST, created_at DESC.
        .order("reviewed_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (category) {
        dbQuery = dbQuery.eq("category", category);
    }

    const { data: articles } = await dbQuery;

    const categories = [
        "Kuantum Fiziği",
        "Astrofizik",
        "Modern Fizik",
        "Klasik Fizik",
        "Parçacık Fiziği",
        "Termodinamik",
        "Bilim Tarihi",
        "Popüler Bilim"
    ];

    return (
        <ModernExploreView
            initialArticles={articles || []}
            categories={categories}
            currentQuery={query}
            currentCategory={category}
        />
    );
}
