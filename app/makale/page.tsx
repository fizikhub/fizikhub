import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { getScienceNews } from "@/lib/rss";
import { unstable_cache } from "next/cache";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Fizik Makaleleri, Bilimsel Yazılar ve Araştırmalar | Fizikhub",
    description: "Kuantum fiziği, astrofizik, görelilik ve modern fizik üzerine Türkçe bilimsel makaleler. Akademik düzeyde yazılar ve popüler bilim içerikleri.",
    keywords: ["fizik makaleleri", "bilimsel makaleler", "kuantum fiziği", "astrofizik", "popüler bilim", "türkçe bilim", "fizik yazıları"],
    openGraph: {
        title: "Fizik Makaleleri — Fizikhub",
        description: "Kuantum, astrofizik, görelilik ve modern fizik üzerine Türkçe bilimsel makaleler ve araştırmalar.",
        type: "website",
        url: "https://www.fizikhub.com/makale",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub Makaleler" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fizik Makaleleri — Fizikhub",
        description: "Kuantum, astrofizik ve modern fizik üzerine Türkçe bilimsel makaleler.",
        images: ["/og-image.jpg"],
    },
    alternates: { canonical: "https://www.fizikhub.com/makale" },
};

export const revalidate = 60;

// Reusable Supabase client for cached data fetching (no cookies/auth)
const getPublicClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = "https://www.fizikhub.com";

interface MakaleListItem {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    summary?: string | null;
    created_at: string;
    category?: string | null;
    image_url?: string | null;
    cover_url?: string | null;
    author_id?: string | null;
    status: string;
    author?: {
        id: string;
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
        is_verified?: boolean | null;
        is_writer?: boolean | null;
    } | {
        id: string;
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
        is_verified?: boolean | null;
        is_writer?: boolean | null;
    }[] | null;
}

function estimateListingReadingTime(excerpt?: string | null) {
    const words = excerpt?.trim().split(/\s+/).filter(Boolean).length || 0;
    if (words === 0) return 5;
    return Math.max(3, Math.ceil(words / 45));
}

// Cache articles for better performance
const getCachedArticles = (category?: string, sort?: string) => unstable_cache(
    async () => {
        const supabase = getPublicClient();
        let query = supabase
            .from('articles')
            .select('id, title, slug, excerpt, created_at, category, image_url, cover_url, author_id, status, author:profiles!articles_author_id_fkey(id, full_name, username, avatar_url, is_verified, is_writer)')
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
        return (data as unknown as MakaleListItem[] | null)?.map((article) => ({
            ...article,
            author: Array.isArray(article.author) ? article.author[0] : article.author,
            summary: article.excerpt || article.summary,
            reading_time: estimateListingReadingTime(article.excerpt)
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

const getCachedScienceNews = unstable_cache(
    async () => getScienceNews(),
    ['science-news'],
    { revalidate: 1800, tags: ['science-news'] }
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

    const newsItems = await getCachedScienceNews();
    const collectionUrl = `${BASE_URL}/makale${category ? `?category=${encodeURIComponent(category)}` : ''}${sort !== 'latest' ? `${category ? '&' : '?'}sort=${encodeURIComponent(sort)}` : ''}`;
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category ? `${category} makaleleri` : "Fizik makaleleri",
        description: "Fizik, uzay, teknoloji, biyoloji ve modern bilim üzerine Türkçe makaleler.",
        url: collectionUrl,
        isPartOf: {
            "@type": "WebSite",
            name: "Fizikhub",
            url: BASE_URL
        },
        mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 12).map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${BASE_URL}/makale/${article.slug}`,
                name: article.title
            }))
        }
    };

    return (
        <>
            <Script
                id="makale-list-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <ArticleFeed
                articles={articles || []}
                categories={cats}
                activeCategory={category}
                sortParam={sort}
                newsItems={newsItems}
            />
        </>
    );
}
