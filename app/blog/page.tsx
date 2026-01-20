import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// ISR: Regenerate every 60 seconds for fresh content with optimal performance
export const revalidate = 60;

export const metadata = {
    title: "Blog | Fizikhub",
    description: "Fizik dünyasındaki en son makaleleri, popüler konuları ve bilimsel tartışmaları keşfedin.",
};

const VALID_CATEGORIES = ["Blog", "Kitap İncelemesi", "Deney"];

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    const category = typeof params.category === 'string' && VALID_CATEGORIES.includes(params.category)
        ? params.category
        : undefined;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    let dbQuery = supabase
        .from('articles')
        .select(`
            *,
            profiles(username, full_name, avatar_url, is_writer, is_verified)
        `, { count: 'exact' })
        .eq("status", "published")
        .order("created_at", { ascending: false });

    // --- NEW FILTERING LOGIC ---
    if (category) {
        if (category === "Blog") {
            // "Blog" means everything EXCEPT Book Reviews and Experiments
            dbQuery = dbQuery
                .neq("category", "Kitap İncelemesi")
                .neq("category", "Deney");
        } else {
            // "Kitap İncelemesi" or "Deney" -> Specific match
            dbQuery = dbQuery.eq("category", category);
        }
    } else if (!query) {
        // Default (All view) - Show everything? Or should default be "Blog"?
        // For now, if no category is selected, we show EVERYTHING.
        // If user wants default to be "Blog" (excluding others), we can change valid logic.
        // Let's assume URL '/blog' shows everything mixed.
    }

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    const { data: articles, count } = await dbQuery
        .range(offset, offset + limit - 1);

    const totalPages = count ? Math.ceil(count / limit) : 0;

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

    return (
        <div className="container md:px-32 px-4 py-8 max-w-[1400px] mx-auto min-h-screen">
            <ModernExploreView
                initialArticles={articles || []}
                currentCategory={category}
                categories={VALID_CATEGORIES}
                searchQuery={query}
                totalPages={totalPages}
                currentPage={page}
            />
        </div>
    );
}
