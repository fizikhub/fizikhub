import { createClient } from "@/lib/supabase-server";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { getScienceNews } from "@/lib/rss";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
    title: "Makaleler | FizikHub",
    description: "Bilimsel makaleler ve araştırmalar.",
};

export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MakalePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'latest';

    const getCachedArticles = unstable_cache(
        async () => {
            const supabase = await createClient();
            let query = supabase
                .from('articles')
                .select('*, author:profiles!articles_author_id_fkey!inner(*)')
                .eq('status', 'published')
                .eq('author.is_writer', true);

            if (category) query = query.eq('category', category);

            query = sort === 'popular'
                ? query.order('created_at', { ascending: false })
                : query.order('created_at', { ascending: false });

            const { data } = await query;
            return data;
        },
        ['makale-feed', category || 'all', sort],
        { revalidate: 3600, tags: ['articles'] }
    );

    const getCachedCategories = unstable_cache(
        async () => {
            const supabase = await createClient();
            const { data: catData } = await supabase.from('articles').select('category').eq('status', 'published');
            return [...new Set((catData || []).map(a => a.category).filter(Boolean))] as string[];
        },
        ['makale-categories'],
        { revalidate: 3600, tags: ['articles'] }
    );

    const [articles, cats] = await Promise.all([
        getCachedArticles(),
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
