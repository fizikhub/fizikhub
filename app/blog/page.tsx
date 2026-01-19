import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// ISR: Regenerate every 60 seconds for fresh content with optimal performance
export const revalidate = 60;

export const metadata = {
    title: "Blog | Fizikhub",
    description: "Fizik dünyasındaki en son makaleleri, popüler konuları ve bilimsel tartışmaları keşfedin.",
};

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const supabase = await createClient();
    const { q: query, category } = await searchParams;

    let dbQuery = supabase
        .from("articles")
        .select(`
            *,
            profiles!articles_author_id_fkey!inner (
                username,
                full_name,
                avatar_url,
                is_writer
            )
        `)
        .eq("status", "published")
        .eq("profiles.is_writer", false) // Only non-writers
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (category) {
        dbQuery = dbQuery.eq("category", category);
    }

    const { data: articles } = await dbQuery;

    // Fetch current user for the share card
    const { data: { user } } = await supabase.auth.getUser();
    let userProfile = null;

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, full_name, avatar_url")
            .eq("id", user.id)
            .single();
        userProfile = profile;
    }

    const categories = [
        "Kitap İncelemesi",
        "Deney",
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
            user={userProfile}
        />
    );
}
