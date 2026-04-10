import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { getScienceNews } from "@/lib/rss";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
    title: "Fizik Makaleleri, Bilimsel Yazılar ve Araştırmalar | Fizikhub",
    description: "Kuantum fiziği, astrofizik, görelilik ve modern fizik üzerine Türkçe bilimsel makaleler. Akademik düzeyde yazılar ve popüler bilim içerikleri.",
    keywords: ["fizik makaleleri", "bilimsel makaleler", "kuantum fiziği", "astrofizik", "popüler bilim", "türkçe bilim", "fizik yazıları"],
    openGraph: {
        title: "Fizik Makaleleri — Fizikhub",
        description: "Kuantum, astrofizik, görelilik ve modern fizik üzerine Türkçe bilimsel makaleler ve araştırmalar.",
        type: "website",
        url: "https://fizikhub.com/makale",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub Makaleler" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fizik Makaleleri — Fizikhub",
        description: "Kuantum, astrofizik ve modern fizik üzerine Türkçe bilimsel makaleler.",
        images: ["/og-image.jpg"],
    },
    alternates: { canonical: "https://fizikhub.com/makale" },
};

export const revalidate = 60;

// Reusable Supabase client for cached data fetching (no cookies/auth)
const getPublicClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache articles for better performance
const getCachedArticles = (category?: string, sort?: string) => unstable_cache(
    async () => {
        const supabase = getPublicClient();
        let query = supabase
            .from('articles')
            .select('id, title, slug, excerpt, content, created_at, category, image_url, cover_url, author_id, status, author:profiles!articles_author_id_fkey(id, full_name, username, avatar_url, is_verified, is_writer)')
            .eq('status', 'published');

        if (category) {
            query = query.eq('category', category);
        }

        // Sorting
        if (sort === 'popular') {
            query = query.order('created_at', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) {
            console.error("Supabase Error fetching articles in Makale feed:", error, "Query details:", { category, sort });
            return [];
        }
        return data?.map((article: any) => ({
            ...article,
            summary: article.excerpt || article.summary
        })) || [];
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
