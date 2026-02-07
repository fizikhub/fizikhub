import { createClient } from "@/lib/supabase-server";
import { MagazineArchiveHeader } from "@/components/articles/magazine-archive-header";
import { ArchiveFilters } from "@/components/articles/archive-filters";
import { ArchiveBentoGrid } from "@/components/articles/archive-bento-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bilim Arşivi | Fizikhub",
    description: "FizikHub yazarlarından bilimsel makaleler. Evrenin sırlarını çözen içerikler.",
};

// ISR: Regenerate every 60 seconds
export const revalidate = 60;

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const resolvedSearchParams = await searchParams;
    const categoryParam = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
    const sortParam = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'latest';
    const searchParam = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Base Query - Only articles from writers (is_writer = true)
    let query = supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey!inner(*)
        `)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    // Apply Category Filter
    if (categoryParam && categoryParam !== 'Tümü' && categoryParam !== 'Popüler' && categoryParam !== 'En Yeni') {
        query = query.eq('category', categoryParam);
    }

    // Apply Search Filter
    if (searchParam) {
        query = query.ilike('title', `%${searchParam}%`);
    }

    // Apply Sorting
    if (sortParam === 'popular') {
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    // Collect IDs for batch fetching interactions
    const articleIds = allArticles.map(a => a.id);

    // Fetch Interaction Counts (Likes & Comments)
    const { data: likesData } = await supabase
        .from('article_likes')
        .select('article_id')
        .in('article_id', articleIds);

    const likeCounts = (likesData || []).reduce((acc, curr) => {
        acc[curr.article_id] = (acc[curr.article_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const { data: commentsData } = await supabase
        .from('article_comments')
        .select('article_id')
        .in('article_id', articleIds);

    const commentCounts = (commentsData || []).reduce((acc, curr) => {
        acc[curr.article_id] = (acc[curr.article_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Fetch User's Likes & Bookmarks
    const userLikes = new Set<number>();
    const userBookmarks = new Set<number>();

    if (user) {
        const { data: myLikes } = await supabase
            .from('article_likes')
            .select('article_id')
            .eq('user_id', user.id)
            .in('article_id', articleIds);

        myLikes?.forEach(l => userLikes.add(l.article_id));

        const { data: myBookmarks } = await supabase
            .from('article_bookmarks')
            .select('article_id')
            .eq('user_id', user.id)
            .in('article_id', articleIds);

        myBookmarks?.forEach(b => userBookmarks.add(b.article_id));
    }

    // Combine Data
    const feedArticles = allArticles.map(article => ({
        ...article,
        likes_count: likeCounts[article.id] || 0,
        comments_count: commentCounts[article.id] || 0,
        is_liked: userLikes.has(article.id),
        is_bookmarked: userBookmarks.has(article.id)
    }));

    // Extract categories for filters
    const { data: allCategoriesData } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'published');

    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen pb-20 bg-background">
            <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-10">

                {/* Magazine Style Header */}
                <MagazineArchiveHeader />

                {/* Category Filters */}
                <ArchiveFilters
                    categories={categories}
                    activeCategory={categoryParam}
                    activeSort={sortParam}
                />

                {/* Bento Grid Articles */}
                <ArchiveBentoGrid articles={feedArticles} />

            </div>
        </div>
    );
}
