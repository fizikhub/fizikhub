import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { isLikelyIndexableTitle } from "@/lib/seo-utils";

export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const page = typeof params.page === 'string' ? params.page : undefined;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const hasLowValueParams = Boolean(query || page || (sort && sort !== 'latest'));
    const canonicalUrl = category
        ? `https://www.fizikhub.com/makale?category=${encodeURIComponent(category)}`
        : "https://www.fizikhub.com/makale";
    const title = category
        ? `${category} Makaleleri ve Bilimsel Yazılar`
        : "Fizik Makaleleri, Bilimsel Yazılar ve Araştırmalar";
    const description = category
        ? `${category} üzerine Türkçe bilimsel makaleler, popüler bilim yazıları ve FizikHub içerikleri.`
        : "Kuantum fiziği, astrofizik, görelilik ve modern fizik üzerine Türkçe bilimsel makaleler. Akademik düzeyde yazılar ve popüler bilim içerikleri.";

    return {
        title,
        description,
        keywords: ["fizik makaleleri", "bilimsel makaleler", "kuantum fiziği", "astrofizik", "popüler bilim", "türkçe bilim", category || "fizik yazıları"],
        robots: hasLowValueParams
            ? { index: false, follow: true }
            : { index: true, follow: true },
        openGraph: {
            title: category ? `${category} Makaleleri — Fizikhub` : "Fizik Makaleleri — Fizikhub",
            description,
            type: "website",
            url: canonicalUrl,
            images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub Makaleler" }],
        },
        twitter: {
            card: "summary_large_image",
            title: category ? `${category} Makaleleri — Fizikhub` : "Fizik Makaleleri — Fizikhub",
            description,
            images: ["/og-image.jpg"],
        },
        alternates: { canonical: canonicalUrl },
    };
}

// Reusable Supabase client for cached data fetching (no cookies/auth)
const getPublicClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FeedArticleRow = {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    summary?: string | null;
    content?: string | null;
    created_at: string;
    category?: string | null;
    image_url?: string | null;
    cover_url?: string | null;
    author_id?: string | null;
    status?: string | null;
    author?: {
        id?: string;
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
        is_verified?: boolean | null;
        is_writer?: boolean | null;
    } | null;
};

type CategoryStat = {
    name: string;
    count: number;
};

const NON_ARTICLE_CATEGORIES = ["Kitap İncelemesi", "Deney", "Terim"];

// Cache articles for better performance
const getCachedArticles = (category?: string, sort?: string, searchQuery?: string) => unstable_cache(
    async () => {
        const supabase = getPublicClient();
        let query = supabase
            .from('articles')
            .select('id, title, slug, excerpt, created_at, category, image_url, cover_url, author_id, status, author:profiles!articles_author_id_fkey(id, full_name, username, avatar_url, is_verified, is_writer)')
            .eq('status', 'published');

        query = query.not('category', 'in', `(${NON_ARTICLE_CATEGORIES.map((cat) => `"${cat}"`).join(',')})`);

        if (category) {
            query = query.eq('category', category);
        }

        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
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
        return (data as FeedArticleRow[] | null)?.filter((article) => isLikelyIndexableTitle(article.title)).map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? undefined,
            summary: article.excerpt ?? article.summary ?? undefined,
            content: undefined,
            created_at: article.created_at,
            category: article.category ?? undefined,
            image_url: article.image_url ?? undefined,
            cover_url: article.cover_url ?? undefined,
            author: article.author
                ? {
                    full_name: article.author.full_name ?? undefined,
                }
                : undefined,
        })) || [];
    },
    ['makale-feed', category || 'all', sort || 'latest', searchQuery || 'none'],
    { revalidate: 3600, tags: ['articles'] }
)();

// Cache categories to avoid repeated computation
const getCachedCategories = unstable_cache(
    async () => {
        const supabase = getPublicClient();
        const { data: catData, error } = await supabase
            .from('articles')
            .select('category')
            .eq('status', 'published')
            .not('category', 'in', `(${NON_ARTICLE_CATEGORIES.map((cat) => `"${cat}"`).join(',')})`);

        if (error) {
            console.error("Error in getCachedCategories:", error);
            return [];
        }

        const counts = (catData || []).reduce<Record<string, number>>((acc, row) => {
            if (!row.category) return acc;
            acc[row.category] = (acc[row.category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "tr")) as CategoryStat[];
    },
    ['makale-categories'],
    { revalidate: 3600, tags: ['articles'] }
);

export default async function MakalePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'latest';
    const searchQuery = typeof params.q === 'string' ? params.q : undefined;

    const [articles, cats] = await Promise.all([
        getCachedArticles(category, sort, searchQuery),
        getCachedCategories()
    ]);

    const canonicalUrl = category
        ? `https://www.fizikhub.com/makale?category=${encodeURIComponent(category)}`
        : "https://www.fizikhub.com/makale";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: category ? `${category} Makaleleri` : "Fizikhub Makaleleri",
        description: category
            ? `${category} üzerine Türkçe bilimsel makaleler ve popüler bilim yazıları.`
            : "Fizik, uzay, kuantum, astrofizik ve popüler bilim üzerine Türkçe makale arşivi.",
        inLanguage: "tr-TR",
        isPartOf: { "@id": "https://www.fizikhub.com/#website" },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: (articles || []).slice(0, 24).map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.fizikhub.com/makale/${article.slug}`,
                name: article.title,
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleFeed
                articles={articles || []}
                categories={cats}
                activeCategory={category}
                sortParam={sort}
                searchQuery={searchQuery}
            />
        </>
    );
}
