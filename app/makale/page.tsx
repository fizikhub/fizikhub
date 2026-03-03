import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { getScienceNews } from "@/lib/rss";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
    title: "Makaleler | FizikHub",
    description: "Bilimsel makaleler ve araştırmalar.",
};

export const revalidate = 60;

// Reusable Supabase client for cached data fetching (no cookies/auth)
const getPublicClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
);

// Cache articles for better performance
const getCachedArticles = (category?: string, sort?: string) => unstable_cache(
    async () => {
        const supabase = getPublicClient();
        let query = supabase
            .from('articles')
            .select('title, slug, image_url, content, category, created_at, author:profiles!articles_author_id_fkey!inner(full_name, is_writer)')
            .eq('status', 'published')
            .eq('author.is_writer', true);

        if (category) {
            query = query.eq('category', category);
        }

        // Filtering by author's writer status using the profiles table
        // We use 'author' as the join path defined in the select string.
        query = query.eq('author.is_writer', true);

        // Sorting
        if (sort === 'popular') {
            // Since views column is removed, we fallback to created_at
            query = query.order('created_at', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error in getCachedArticles:", error);
            return [];
        }
        return data;
    },
    ['makale-feed', category || 'all', sort || 'latest'],
    { revalidate: 3600, tags: ['articles'] }
)();

// Cache categories to avoid repeated computation
const getCachedCategories = unstable_cache(
    async () => {
        const supabase = getPublicClient();
        const { data: catData, error } = await supabase
            .from('articles')
            .select('category')
            .eq('status', 'published');

        if (error) {
            console.error("Error in getCachedCategories:", error);
            return [];
        }

        return [...new Set((catData || []).map(a => a.category).filter(Boolean))] as string[];
    },
    ['makale-categories'],
    { revalidate: 3600, tags: ['articles'] }
);

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MakalePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'latest';

    const [articles, cats] = await Promise.all([
        getCachedArticles(category, sort),
        getCachedCategories()
    ]);

    // Fetch RSS News (Server Side)
    const newsItems = await getScienceNews();

    return (
        <ArticleFeed
            articles={articles || []}
            categories={cats}
            activeCategory={category}
            sortParam={sort}
            newsItems={newsItems}
        />
    );
}
