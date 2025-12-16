import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// ISR: Regenerate every 60 seconds for fresh content with optimal performance
export const revalidate = 60;

export const metadata = {
    title: "Keşfet | Fizikhub",
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
            profiles!articles_author_id_fkey (
                username,
                full_name,
                avatar_url,
                is_writer
            )
        `)
        .eq("status", "published")
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
