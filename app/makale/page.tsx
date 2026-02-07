import { createClient } from "@/lib/supabase-server";
import { EliteCard } from "@/components/articles/elite-card";
import { EliteJournalHeader } from "@/components/articles/elite-journal-header";
import { Flame, Clock, ArrowRight, PenTool, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Bilim Dergisi | FizikHub",
    description: "FizikHub yazarlarından bilimsel makaleler. Evrenin sırlarını keşfedin.",
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

    if (categoryParam) {
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

    const { data: commentsData } = await supabase.from('article_comments').select('article_id').in('article_id', articleIds);
    const commentCounts = (commentsData || []).reduce((acc, curr) => {
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
        comments_count: commentCounts[article.id] || 0,
        is_liked: userLikes.has(article.id),
        is_bookmarked: userBookmarks.has(article.id)
    }));

    const { data: allCategoriesData } = await supabase.from('articles').select('category').eq('status', 'published');
    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    // Smart layout distribution
    const heroArticle = feedArticles[0];
    const spotlightArticles = feedArticles.slice(1, 3);
    const gridArticles = feedArticles.slice(3, 9);
    const listArticles = feedArticles.slice(9);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">

                {/* Elite Header */}
                <EliteJournalHeader />

                {/* Navigation Bar */}
                <nav className="sticky top-14 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-10 border-b border-neutral-200/50 dark:border-neutral-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            <NavPill href="/makale" active={!categoryParam && sortParam === 'latest'} icon={<Sparkles className="w-3.5 h-3.5" />}>
                                Tümü
                            </NavPill>
                            <NavPill href="/makale?sort=popular" active={sortParam === 'popular'} icon={<Flame className="w-3.5 h-3.5" />}>
                                Popüler
                            </NavPill>
                            <NavPill href="/makale?sort=latest" active={sortParam === 'latest' && !categoryParam} icon={<Clock className="w-3.5 h-3.5" />}>
                                En Yeni
                            </NavPill>
                            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700 mx-1" />
                            {categories.map(cat => (
                                <NavPill key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={categoryParam === cat}>
                                    {cat}
                                </NavPill>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                            <span>{feedArticles.length} makale</span>
                        </div>
                    </div>
                </nav>

                {feedArticles.length > 0 ? (
                    <div className="space-y-32">
                        {/* HERO SECTION */}
                        {heroArticle && (
                            <section className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
                                <EliteCard
                                    article={heroArticle}
                                    variant="hero"
                                    initialLikes={heroArticle.likes_count}
                                    initialComments={heroArticle.comments_count}
                                    initialIsLiked={heroArticle.is_liked}
                                    initialIsBookmarked={heroArticle.is_bookmarked}
                                />
                            </section>
                        )}

                        {/* BENTO GRID SECTION */}
                        <section>
                            <SectionHeader
                                icon={<Sparkles className="w-5 h-5" />}
                                title="Keşfedilmeye Değer"
                                subtitle="Bilimin en taze ve dikkat çeken başlıkları"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {/* Large Spotlight Item */}
                                {spotlightArticles[0] && (
                                    <div className="md:col-span-4 lg:col-span-4">
                                        <EliteCard
                                            article={spotlightArticles[0]}
                                            variant="spotlight"
                                            initialLikes={spotlightArticles[0].likes_count}
                                            initialComments={spotlightArticles[0].comments_count}
                                            initialIsLiked={spotlightArticles[0].is_liked}
                                            initialIsBookmarked={spotlightArticles[0].is_bookmarked}
                                        />
                                    </div>
                                )}

                                {/* Vertical Spotlight Item */}
                                {spotlightArticles[1] && (
                                    <div className="md:col-span-4 lg:col-span-2">
                                        <EliteCard
                                            article={spotlightArticles[1]}
                                            variant="card"
                                            initialLikes={spotlightArticles[1].likes_count}
                                            initialComments={spotlightArticles[1].comments_count}
                                            initialIsLiked={spotlightArticles[1].is_liked}
                                            initialIsBookmarked={spotlightArticles[1].is_bookmarked}
                                        />
                                    </div>
                                )}

                                {/* Rest of Grid */}
                                {gridArticles.map((article, i) => (
                                    <div key={article.id} className="md:col-span-2 lg:col-span-2">
                                        <EliteCard
                                            article={article}
                                            index={i}
                                            variant="card"
                                            initialLikes={article.likes_count}
                                            initialComments={article.comments_count}
                                            initialIsLiked={article.is_liked}
                                            initialIsBookmarked={article.is_bookmarked}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* WRITER CTA */}
                        <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 border border-neutral-800 p-8 sm:p-16">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="max-w-xl text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                                        <PenTool className="w-3 h-3" />
                                        Yazarlık Akademisi
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                        Bilimi Senin Sesinden <span className="text-amber-500 italic">Dinleyelim.</span>
                                    </h3>
                                    <p className="text-lg text-neutral-400">
                                        Araştırmalarını, teorilerini ve bilimsel meraklarını binlerce okuyucuyla paylaşma zamanı geldi.
                                    </p>
                                </div>
                                <Link
                                    href="/yazar"
                                    className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    BAŞVURU YAP
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </section>

                        {/* ARCHIVE SECTION */}
                        {listArticles.length > 0 && (
                            <section className="grid lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4">
                                    <div className="sticky top-32">
                                        <h2 className="text-4xl font-black text-black dark:text-white mb-4 tracking-tighter italic">ARŞİVDEN</h2>
                                        <p className="text-neutral-500 text-sm max-w-xs mb-8">
                                            Geçmişin derinliklerinden bugüne ışık tutan zamansız bilimsel çalışmalar.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.slice(0, 5).map(cat => (
                                                <Link key={cat} href={`/makale?category=${cat}`} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-amber-500 transition-colors">
                                                    #{cat}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-8">
                                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {listArticles.map((article, i) => (
                                            <EliteCard
                                                key={article.id}
                                                article={article}
                                                index={i}
                                                variant="list"
                                                initialLikes={article.likes_count}
                                                initialComments={article.comments_count}
                                                initialIsLiked={article.is_liked}
                                                initialIsBookmarked={article.is_bookmarked}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Henüz Makale Yok</h3>
                        <p className="text-neutral-500 mb-8">Bu kategoride henüz içerik yayınlanmamış.</p>
                        <Link href="/makale" className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-opacity">
                            Tüm Makalelere Dön <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* Footer spacer */}
                <div className="h-20" />
            </div>
        </div>
    );
}

function NavPill({ href, active, icon, children }: { href: string; active: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-200 ${active
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
        >
            {icon}
            {children}
        </Link>
    );
}

function SectionHeader({ icon, title, subtitle }: { icon?: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        {icon}
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">{title}</h2>
                    {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}
