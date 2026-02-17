import { getScienceNews } from "@/lib/rss";
// ... imports ...

export default async function MakalePage({ searchParams }: PageProps) {
    // ... existing logic ...

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
