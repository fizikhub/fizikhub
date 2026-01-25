import { createClient } from "@/lib/supabase-server";
import { V33BlogLayout } from "@/components/blog/v33-blog-layout";

// ISR Removed for accurate auth state
// export const revalidate = 0;
// Use forced dynamic to ensure user is fetched correctly every time
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Blog | Fizikhub",
    description: "Fizik dünyasındaki en son makaleleri, popüler konuları ve bilimsel tartışmaları keşfedin.",
};

const VALID_CATEGORIES = ["Tümü", "Blog", "Kitap İncelemesi", "Deney", "Terim"];

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    const category = typeof params.category === 'string' && VALID_CATEGORIES.includes(params.category)
        ? params.category
        : "Tümü"; // Default to Tümü if invalid or missing

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
    // "Tümü" or undefined shows EVERYTHING.
    // "Blog" specifically shows only standard articles (excludes special types).

    if (category === "Blog") {
        dbQuery = dbQuery
            .neq("category", "Kitap İncelemesi")
            .neq("category", "Deney")
            .neq("category", "Terim");
    } else if (category && category !== "Tümü") {
        // Specific category match (e.g. "Kitap İncelemesi")
        dbQuery = dbQuery.eq("category", category);
    }
    // No 'else if (!query)' block anymore - default allows everything.

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
        <V33BlogLayout
            articles={(articles || []) as any}
            categories={VALID_CATEGORIES}
            currentCategory={category}
        />
    );
}
