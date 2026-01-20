import { createClient } from "@/lib/supabase-server";
import { ModernExploreView } from "@/components/explore/modern-explore-view";

// ISR Removed for accurate auth state
// export const revalidate = 0;
// Use forced dynamic to ensure user is fetched correctly every time
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Blog | Fizikhub",
    description: "Fizik dünyasındaki en son makaleleri, popüler konuları ve bilimsel tartışmaları keşfedin.",
};

const VALID_CATEGORIES = ["Blog", "Kitap İncelemesi", "Deney", "Terim"];

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
    if (category === "Blog") {
        // "Blog" means everything EXCEPT Book Reviews and Experiments
        // We REMOVED the '.eq("profiles.is_writer", false)' check because it was hiding the user's own posts.
        // If a writer posts a "Blog", it should show up here.
        dbQuery = dbQuery
            .neq("category", "Kitap İncelemesi")
            .neq("category", "Deney");
    } else if (category) {
        // Specific category match
        dbQuery = dbQuery.eq("category", category);
    }
    // If NO category is selected (e.g. /blog root)
    else if (!query) {
        dbQuery = dbQuery
            .neq("category", "Kitap İncelemesi")
            .neq("category", "Deney");
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
        // Fetch full profile to ensure we have name/avatar
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        userProfile = profile;
    }

    return (
        <div className="container md:px-16 px-0 py-4 md:py-8 max-w-[1600px] mx-auto min-h-screen">
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
