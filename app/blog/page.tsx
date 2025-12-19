import { createClient } from "@/lib/supabase-server";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { SearchInput } from "@/components/blog/search-input";
import { ForumTeaserCard } from "@/components/blog/forum-teaser-card";
import { Search, TrendingUp, Tag, Telescope, Flame, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Bilim Arşivi | Fizikhub",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri.",
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

    // Base Query
    let query = supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey(*)
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
        // Approximate popularity by views or likes if available (falling back to views or random for now as DB might limit complex sorts)
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    // Collect IDs for batch fetching interactions
    const articleIds = allArticles.map(a => a.id);

    // Fetch Interaction Counts (Likes & Comments)
    // Note: In a real large-scale app, we'd use a view or materialized view. 
    // Here we do efficient parallel fetches or just rely on client-side counts if server-side is too heavy.
    // For "Real-time" feel, we fetch them here.

    // Fetch Likes Count
    const { data: likesData } = await supabase
        .from('article_likes')
        .select('article_id')
        .in('article_id', articleIds);

    const likeCounts = (likesData || []).reduce((acc, curr) => {
        acc[curr.article_id] = (acc[curr.article_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Fetch Comments Count
    const { data: commentsData } = await supabase
        .from('article_comments')
        .select('article_id')
        .in('article_id', articleIds);

    const commentCounts = (commentsData || []).reduce((acc, curr) => {
        acc[curr.article_id] = (acc[curr.article_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Fetch User's Likes & Bookmarks
    let userLikes = new Set<number>();
    let userBookmarks = new Set<number>();

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

    // Featured articles for Hero (First 3 from "Latest" generally)
    // We re-fetch or just slice from "latest" to ensure Hero always looks fresh regardless of filter?
    // User probably wants filter to apply to the list below. Let's keep hero static or relevant?
    // Let's keep Hero showing "Featured" or "Latest" mostly.
    const featuredArticles = allArticles.slice(0, 3); // For now showing top of current filter

    // Extract categories for sidebar/tabs
    // We need ALL categories, not just from filtered result. So we might need a separate lightweight query or hardcoded list if performance is key. 
    // For now, let's derive from a separate optimized query or standard list.
    const { data: allCategoriesData } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'published');

    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    // Sidebar Stats
    const uniqueAuthors = new Set((allCategoriesData || []).map((a: any) => a.author_id)).size; // simplified approximation

    return (
        <div className="min-h-screen pb-20 bg-background">
            <div className="container mx-auto max-w-7xl px-2 sm:px-6 py-8 sm:py-12 md:py-16">

                {/* Header */}
                <header className="mb-10 sm:mb-14">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                                <Telescope className="w-4 h-4" />
                                Fizikhub Bilim Sosyal
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] mb-3">
                                Bilim <span className="text-amber-400">Arşivi</span>
                            </h1>
                        </div>

                        {/* Search */}
                        <SearchInput />
                    </div>
                </header>

                {/* Hero only shows on initial 'All' view to avoid clustering? Or always? Always is nice. */}
                <MagazineHero articles={featuredArticles} />

                {/* Category Tabs - Brutalist Style */}
                <div className="sticky top-0 z-30 bg-background py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-y-4 border-black dark:border-white">
                    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                        <Link
                            href="/blog"
                            className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors border-r-2 border-black dark:border-white ${!categoryParam && sortParam === 'latest'
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-transparent hover:bg-accent'
                                }`}
                        >
                            Tümü
                        </Link>
                        <Link
                            href="/blog?sort=popular"
                            className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors border-r-2 border-black dark:border-white ${sortParam === 'popular'
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-transparent hover:bg-accent'
                                }`}
                        >
                            Popüler
                        </Link>

                        {categories.map((cat, index) => (
                            <Link
                                key={cat}
                                href={`/blog?category=${encodeURIComponent(cat)}`}
                                className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${index < categories.length - 1 ? 'border-r-2 border-black dark:border-white' : ''} ${categoryParam === cat
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'bg-transparent hover:bg-accent'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Main Content - Social Feed */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            {feedArticles.map((article, index) => (
                                <div key={article.id}>
                                    <SocialArticleCard
                                        article={article}
                                        index={index}
                                        initialLikes={article.likes_count}
                                        initialComments={article.comments_count}
                                        initialIsLiked={article.is_liked}
                                        initialIsBookmarked={article.is_bookmarked}
                                    />
                                    {index === 2 && <ForumTeaserCard />}
                                </div>
                            ))}
                        </div>

                        {feedArticles.length === 0 && (
                            <div className="text-center py-24 text-white/40 bg-white/[0.02] border border-white/10 rounded-xl">
                                <Telescope className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p className="text-xl font-medium">Bu kategoride henüz paylaşım yok.</p>
                                <Link href="/blog" className="text-amber-400 text-sm mt-2 hover:underline">Tümünü Göster</Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-6">
                        {/* Trending Section */}
                        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/10">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                Gündemde
                            </h3>
                            <div className="space-y-3">
                                {allArticles.slice(0, 5).map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="block group p-3 -mx-2 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="text-xs text-white/40 mb-1">
                                            {article.category} · Gündem #{i + 1}
                                        </div>
                                        <h4 className="font-semibold text-sm text-white/90 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/10 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Sen de Yaz!</h3>
                            <p className="text-sm text-white/40 mb-4">
                                Bilim topluluğuna katıl, makalelerini paylaş.
                            </p>
                            <Link
                                href="/yazar"
                                className="inline-flex items-center justify-center w-full py-3 bg-amber-500 rounded-full text-black font-bold text-sm hover:bg-amber-400 transition-colors"
                            >
                                Yazar Ol
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
