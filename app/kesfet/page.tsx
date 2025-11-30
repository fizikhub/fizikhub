import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// Revalidate every 5 minutes for better performance
export const revalidate = 300;

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
