import { createClient } from "@/lib/supabase-server";
import { ArticleFeed } from "@/components/articles/article-feed";
import type { Metadata } from "next";
import { getScienceNews } from "@/lib/rss";

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

    const supabase = await createClient();

    let query = supabase
        .from('articles')
        .select(`*, author:profiles!articles_author_id_fkey!inner(*)`)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    if (category) query = query.eq('category', category);

    query = sort === 'popular'
        ? query.order('views', { ascending: false })
        : query.order('created_at', { ascending: false });

    const { data: articles } = await query;

    const { data: catData } = await supabase.from('articles').select('category').eq('status', 'published');
    const cats = [...new Set((catData || []).map(a => a.category).filter(Boolean))] as string[];

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
