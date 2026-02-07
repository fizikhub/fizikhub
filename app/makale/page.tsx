import { createClient } from "@/lib/supabase-server";
import { MagazineCard } from "@/components/articles/magazine-card";
import { MagazineHeader } from "@/components/articles/magazine-header";
import { TrendingUp, Flame, Clock, BookOpen, Telescope, PenTool } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Bilim Dergisi | FizikHub",
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
        .select(`*, author:profiles!articles_author_id_fkey!inner(*)`)
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

    // Fetch interactions
    const { data: likesData } = await supabase.from('article_likes').select('article_id').in('article_id', articleIds);
    const likeCounts = (likesData || []).reduce((acc, curr) => {
        acc[curr.article_id] = (acc[curr.article_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const userLikes = new Set<number>();
    const userBookmarks = new Set<number>();

    if (user) {
        const { data: myLikes } = await supabase.from('article_likes').select('article_id').eq('user_id', user.id).in('article_id', articleIds);
        myLikes?.forEach(l => userLikes.add(l.article_id));
        const { data: myBookmarks } = await supabase.from('article_bookmarks').select('article_id').eq('user_id', user.id).in('article_id', articleIds);
        myBookmarks?.forEach(b => userBookmarks.add(b.article_id));
    }

    const feedArticles = allArticles.map(article => ({
        ...article,
        likes_count: likeCounts[article.id] || 0,
        is_liked: userLikes.has(article.id),
        is_bookmarked: userBookmarks.has(article.id)
    }));

    const { data: allCategoriesData } = await supabase.from('articles').select('category').eq('status', 'published');
    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    const heroArticle = feedArticles[0];
    const featuredArticles = feedArticles.slice(1, 5);
    const restArticles = feedArticles.slice(5);

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-b from-background via-background to-[#FFC800]/5">
            <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-10">

                {/* Magazine Header */}
                <MagazineHeader />

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4 mb-6 -mx-3 px-3">
                    <FilterPill href="/makale" active={!categoryParam && sortParam === 'latest'} icon={<BookOpen className="w-3.5 h-3.5" />}>
                        Tümü
                    </FilterPill>
                    <FilterPill href="/makale?sort=popular" active={sortParam === 'popular'} icon={<Flame className="w-3.5 h-3.5" />} color="bg-orange-500">
                        Popüler
                    </FilterPill>
                    <FilterPill href="/makale?sort=latest" active={sortParam === 'latest' && !categoryParam} icon={<Clock className="w-3.5 h-3.5" />} color="bg-cyan-500">
                        En Yeni
                    </FilterPill>
                    <div className="w-px h-6 bg-black/20 dark:bg-white/20 mx-1 flex-shrink-0" />
                    {categories.map(cat => (
                        <FilterPill key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={categoryParam === cat} color="bg-purple-500">
                            {cat}
                        </FilterPill>
                    ))}
                </div>

                {/* Main Content */}
                {feedArticles.length > 0 ? (
                    <div className="space-y-8">
                        {/* Hero Article */}
                        {heroArticle && (
                            <MagazineCard
                                article={heroArticle}
                                index={0}
                                variant="hero"
                                initialLikes={heroArticle.likes_count}
                                initialIsLiked={heroArticle.is_liked}
                                initialIsBookmarked={heroArticle.is_bookmarked}
                            />
                        )}

                        {/* Featured Grid */}
                        {featuredArticles.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {featuredArticles.map((article, i) => (
                                    <MagazineCard
                                        key={article.id}
                                        article={article}
                                        index={i + 1}
                                        variant="featured"
                                        initialLikes={article.likes_count}
                                        initialIsLiked={article.is_liked}
                                        initialIsBookmarked={article.is_bookmarked}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Writer CTA */}
                        <div className="relative overflow-hidden rounded-2xl border-[3px] border-black bg-gradient-to-r from-[#FF8800] to-[#FF5500] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000]">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/30">
                                        <PenTool className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase">Sen de Yazar Ol!</h3>
                                        <p className="text-sm text-white/80">Bilimsel makalelerini yayınla, topluluğa katkı sağla.</p>
                                    </div>
                                </div>
                                <Link href="/yazar" className="px-6 py-3 bg-white text-black font-black text-sm uppercase tracking-wide rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                    Başvuru Yap
                                </Link>
                            </div>
                        </div>

                        {/* Rest as Compact List */}
                        {restArticles.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                <div className="lg:col-span-2 mb-2">
                                    <h2 className="text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-[#FFC800]" />
                                        Daha Fazla Makale
                                    </h2>
                                </div>
                                {restArticles.map((article, i) => (
                                    <MagazineCard
                                        key={article.id}
                                        article={article}
                                        index={i}
                                        variant="compact"
                                        initialLikes={article.likes_count}
                                        initialIsLiked={article.is_liked}
                                        initialIsBookmarked={article.is_bookmarked}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
                        <Telescope className="w-16 h-16 mx-auto mb-4 text-[#FFC800]" />
                        <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-2">Henüz Makale Yok</h3>
                        <p className="text-sm text-neutral-500 mb-6">Bu kategoride henüz bir makale yayınlanmamış.</p>
                        <Link href="/makale" className="inline-block px-6 py-3 bg-[#FFC800] text-black font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                            Tüm Makalelere Dön
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterPill({ href, active, icon, color, children }: { href: string; active: boolean; icon?: React.ReactNode; color?: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wide whitespace-nowrap rounded-full border-2 transition-all ${active
                    ? `${color || 'bg-[#FFC800]'} border-black text-${color ? 'white' : 'black'} shadow-[3px_3px_0px_0px_#000]`
                    : 'bg-white dark:bg-zinc-800 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700'
                }`}
        >
            {icon}
            {children}
        </Link>
    );
}
