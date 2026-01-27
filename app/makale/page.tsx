import { createClient } from "@/lib/supabase-server";
import { NeoMagazineHero } from "@/components/articles/neo-magazine-hero";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { SearchInput } from "@/components/blog/search-input";
import { ForumTeaserCard } from "@/components/blog/forum-teaser-card";
import { Search, TrendingUp, Tag, Telescope, Flame, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Makaleler | Fizikhub",
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
    // 1. In blog/page.tsx
    // Replace the query definition
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
        <div className="min-h-screen pb-20 bg-[#f0f0f0] dark:bg-[#0a0a0a]"> {/* Lighter bg for contrast */}
            <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12 md:py-16">

                {/* Header - Neo Brutalist */}
                <header className="mb-8 sm:mb-12 border-b-[4px] border-black pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-3 transform -rotate-1 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                                <Telescope className="w-4 h-4 text-[#FFC800]" />
                                Fizikhub Arşiv
                            </div>
                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-[0.8] mb-0 uppercase stroke-text">
                                BİLİM<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC800] to-[#FF8800]" style={{ WebkitTextStroke: '2px black' }}>ARŞİVİ</span>
                            </h1>
                        </div>

                        {/* Search */}
                        <div className="w-full max-w-md">
                            <SearchInput />
                        </div>
                    </div>
                </header>

                {/* Neo Hero Section */}
                {!searchParam && !categoryParam && sortParam === 'latest' && (
                    <NeoMagazineHero articles={featuredArticles} />
                )}

                {/* Category Tabs - Neo Brutalist Style */}
                <div className="sticky top-14 z-30 bg-[#f0f0f0] dark:bg-[#0a0a0a] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b-[4px] border-black">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
                        <Link
                            href="/makale"
                            className={`px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all ${!categoryParam && sortParam === 'latest'
                                ? 'bg-[#FFC800] text-black'
                                : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                        >
                            Tümü
                        </Link>
                        <Link
                            href="/makale?sort=popular"
                            className={`px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 ${sortParam === 'popular'
                                ? 'bg-[#FF5500] text-white'
                                : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                        >
                            <Flame className="w-3 h-3 filled" />
                            Popüler
                        </Link>

                        {categories.map((cat, index) => (
                            <Link
                                key={cat}
                                href={`/makale?category=${encodeURIComponent(cat)}`}
                                className={`px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all ${categoryParam === cat
                                    ? 'bg-cyan-400 text-black'
                                    : 'bg-white text-black hover:bg-neutral-100'
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
                        {/* Feed Layout: Changed to Grid for Neo Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feedArticles.map((article, index) => (
                                <div key={article.id} className={index % 3 === 0 ? "md:col-span-2" : ""}>
                                    <NeoArticleCard
                                        article={article}
                                        initialLikes={article.likes_count}
                                        initialComments={article.comments_count}
                                        initialIsLiked={article.is_liked}
                                        initialIsBookmarked={article.is_bookmarked}
                                        className="h-full"
                                    />
                                    {index === 4 && (
                                        <div className="my-8 md:col-span-2">
                                            <ForumTeaserCard />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {feedArticles.length === 0 && (
                            <div className="text-center py-24 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-xl">
                                <Telescope className="w-16 h-16 mx-auto mb-4 text-black" />
                                <p className="text-2xl font-black uppercase text-black mb-2">HİÇBİR ŞEY YOK MU?</p>
                                <p className="text-sm font-bold text-neutral-500 mb-6">Bu kategoride henüz bir makale paylaşılmamış.</p>
                                <Link href="/makale" className="inline-block px-6 py-3 bg-[#FFC800] border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
                                    Tüm Makalelere Dön
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-32 h-fit">
                        {/* Trending Section - Neo Style */}
                        <div className="bg-white dark:bg-zinc-900 border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-0 overflow-hidden">
                            <div className="bg-black p-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#FFC800]" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                    Gündemdekiler
                                </h3>
                            </div>
                            <div className="divide-y-2 divide-black">
                                {allArticles.slice(0, 5).map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="block group p-4 hover:bg-[#FFC800]/10 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-3xl font-black text-black/10 group-hover:text-[#FFC800] transition-colors leading-none">
                                                {i + 1}
                                            </span>
                                            <div>
                                                <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                                                    {article.category}
                                                </div>
                                                <h4 className="font-bold text-base text-black dark:text-white group-hover:underline decoration-2 decoration-black leading-snug">
                                                    {article.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Writer CTA - Neo Style */}
                        <div className="bg-[#FF8800] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-6 text-center transform rotate-1 hover:rotate-0 transition-transform">
                            <h3 className="text-2xl font-black text-white uppercase drop-shadow-[2px_2px_0px_black] mb-2 leading-none">YAZAR OLMAK İSTER MİSİN?</h3>
                            <p className="text-xs font-bold text-white/90 mb-5 max-w-[200px] mx-auto border-b-2 border-black/10 pb-2">
                                Kendi bilimsel makalelerini yayınla, topluluğa katkı sağla.
                            </p>
                            <Link
                                href="/yazar"
                                className="inline-flex w-full items-center justify-center py-3 bg-white border-2 border-black text-black font-black text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
                            >
                                Başvuru Yap
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
