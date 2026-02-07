import { createClient } from "@/lib/supabase-server";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { TrendingUp, Flame, Clock, Sparkles, Telescope } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NeoArticleHeader } from "@/components/articles/neo-article-header";

export const metadata: Metadata = {
    title: "Bilim Arşivi | FizikHub",
    description: "FizikHub yazarlarından bilimsel makaleler. Evrenin sırlarını çözen içerikler.",
};

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

    let query = supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey!inner(*)
        `)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    if (categoryParam && categoryParam !== 'Tümü') {
        query = query.eq('category', categoryParam);
    }

    if (searchParam) {
        query = query.ilike('title', `%${searchParam}%`);
    }

    if (sortParam === 'popular') {
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    const articleIds = allArticles.map(a => a.id);

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

    const feedArticles = allArticles.map(article => ({
        ...article,
        likes_count: likeCounts[article.id] || 0,
        comments_count: commentCounts[article.id] || 0,
        is_liked: userLikes.has(article.id),
        is_bookmarked: userBookmarks.has(article.id)
    }));

    const { data: allCategoriesData } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'published');

    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen pb-20 bg-background">
            <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-10">

                <NeoArticleHeader />

                {/* Filters - Pill Style */}
                <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm py-3 -mx-3 px-3 sm:mx-0 sm:px-0 mb-6">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        <Link
                            href="/makale"
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap rounded-full border-2 transition-all ${!categoryParam && sortParam === 'latest'
                                    ? 'bg-[#FFC800] border-black text-black shadow-[2px_2px_0px_0px_#000]'
                                    : 'bg-white dark:bg-zinc-800 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700'
                                }`}
                        >
                            <Sparkles className="w-3 h-3" />
                            Tümü
                        </Link>

                        <Link
                            href="/makale?sort=popular"
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap rounded-full border-2 transition-all ${sortParam === 'popular'
                                    ? 'bg-[#FF5500] border-black text-white shadow-[2px_2px_0px_0px_#000]'
                                    : 'bg-white dark:bg-zinc-800 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700'
                                }`}
                        >
                            <Flame className="w-3 h-3" />
                            Popüler
                        </Link>

                        <Link
                            href="/makale?sort=latest"
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap rounded-full border-2 transition-all ${sortParam === 'latest' && !categoryParam
                                    ? 'bg-[#23A9FA] border-black text-black shadow-[2px_2px_0px_0px_#000]'
                                    : 'bg-white dark:bg-zinc-800 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700'
                                }`}
                        >
                            <Clock className="w-3 h-3" />
                            En Yeni
                        </Link>

                        <div className="w-px h-6 bg-black/20 dark:bg-white/20 mx-1" />

                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href={`/makale?category=${encodeURIComponent(cat)}`}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap rounded-full border-2 transition-all ${categoryParam === cat
                                        ? 'bg-purple-500 border-black text-white shadow-[2px_2px_0px_0px_#000]'
                                        : 'bg-white dark:bg-zinc-800 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            {feedArticles.map((article, index) => (
                                <div key={article.id} className={index === 0 ? "sm:col-span-2" : ""}>
                                    <NeoArticleCard
                                        article={article}
                                        initialLikes={article.likes_count}
                                        initialComments={article.comments_count}
                                        initialIsLiked={article.is_liked}
                                        initialIsBookmarked={article.is_bookmarked}
                                        className="h-full"
                                    />
                                </div>
                            ))}
                        </div>

                        {feedArticles.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] rounded-xl">
                                <Telescope className="w-12 h-12 mx-auto mb-3 text-[#FFC800]" />
                                <p className="text-xl font-black uppercase text-black dark:text-white mb-2">Henüz Makale Yok</p>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">Bu kategoride henüz bir makale yok.</p>
                                <Link href="/makale" className="inline-block px-5 py-2.5 bg-[#FFC800] border-2 border-black font-bold uppercase text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all text-black rounded-lg">
                                    Tüm Makalelere Dön
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-6">
                        {/* Trending */}
                        <div className="bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] rounded-xl overflow-hidden">
                            <div className="bg-black dark:bg-white px-4 py-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#FFC800] dark:text-black" />
                                <h3 className="text-sm font-black text-white dark:text-black uppercase tracking-wide">
                                    Gündemdekiler
                                </h3>
                            </div>
                            <div className="divide-y divide-black/10 dark:divide-white/10">
                                {allArticles.slice(0, 5).map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="block p-4 hover:bg-[#FFC800]/10 transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl font-black text-black/10 dark:text-white/10 group-hover:text-[#FFC800] transition-colors leading-none">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                                                    {article.category}
                                                </div>
                                                <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-[#FFC800] transition-colors leading-snug line-clamp-2">
                                                    {article.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Writer CTA */}
                        <div className="bg-gradient-to-br from-[#FF8800] to-[#FF5500] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 rounded-xl">
                            <h3 className="text-xl font-black text-white uppercase mb-2 leading-tight">
                                Yazar Olmak İster misin?
                            </h3>
                            <p className="text-xs font-medium text-white/80 mb-4">
                                Kendi bilimsel makalelerini yayınla, topluluğa katkı sağla.
                            </p>
                            <Link
                                href="/yazar"
                                className="block w-full text-center py-2.5 bg-white border-2 border-black text-black font-bold text-sm uppercase shadow-[3px_3px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all rounded-lg"
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
