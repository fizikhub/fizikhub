import { createClient } from "@/lib/supabase-server";
import { JournalCard } from "@/components/articles/journal-card";
import { JournalHeader } from "@/components/articles/journal-header";
import { Flame, Clock, ArrowRight, PenTool } from "lucide-react";
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

    // Layout split
    const coverArticle = feedArticles[0];
    const featureArticles = feedArticles.slice(1, 3);
    const gridArticles = feedArticles.slice(3, 9);
    const listArticles = feedArticles.slice(9);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">

                {/* Header */}
                <JournalHeader />

                {/* Navigation */}
                <nav className="flex items-center justify-center gap-6 py-4 border-b border-neutral-200 dark:border-neutral-800 mb-10 overflow-x-auto">
                    <NavLink href="/makale" active={!categoryParam && sortParam === 'latest'}>Tümü</NavLink>
                    <NavLink href="/makale?sort=popular" active={sortParam === 'popular'}>
                        <Flame className="w-3.5 h-3.5" /> Popüler
                    </NavLink>
                    <NavLink href="/makale?sort=latest" active={sortParam === 'latest' && !categoryParam}>
                        <Clock className="w-3.5 h-3.5" /> En Yeni
                    </NavLink>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                    {categories.map(cat => (
                        <NavLink key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={categoryParam === cat}>
                            {cat}
                        </NavLink>
                    ))}
                </nav>

                {feedArticles.length > 0 ? (
                    <div className="space-y-16">

                        {/* Cover Story */}
                        {coverArticle && (
                            <section>
                                <JournalCard
                                    article={coverArticle}
                                    variant="cover"
                                    initialLikes={coverArticle.likes_count}
                                    initialIsLiked={coverArticle.is_liked}
                                    initialIsBookmarked={coverArticle.is_bookmarked}
                                />
                            </section>
                        )}

                        {/* Feature Stories */}
                        {featureArticles.length > 0 && (
                            <section>
                                <SectionTitle>Öne Çıkanlar</SectionTitle>
                                <div className="space-y-8">
                                    {featureArticles.map((article) => (
                                        <JournalCard
                                            key={article.id}
                                            article={article}
                                            variant="feature"
                                            initialLikes={article.likes_count}
                                            initialIsLiked={article.is_liked}
                                            initialIsBookmarked={article.is_bookmarked}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Grid */}
                        {gridArticles.length > 0 && (
                            <section>
                                <SectionTitle>Son Makaleler</SectionTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {gridArticles.map((article) => (
                                        <JournalCard
                                            key={article.id}
                                            article={article}
                                            variant="standard"
                                            initialLikes={article.likes_count}
                                            initialIsLiked={article.is_liked}
                                            initialIsBookmarked={article.is_bookmarked}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Writer CTA */}
                        <section className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 sm:p-12">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <PenTool className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-black dark:text-white">Yazar Olmak İster misin?</h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Bilimsel makalelerini yayınla, topluluğa katkı sağla.</p>
                                    </div>
                                </div>
                                <Link
                                    href="/yazar"
                                    className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                                >
                                    Başvuru Yap <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </section>

                        {/* Minimal List */}
                        {listArticles.length > 0 && (
                            <section>
                                <SectionTitle>Arşivden</SectionTitle>
                                <div className="max-w-2xl">
                                    {listArticles.map((article) => (
                                        <JournalCard
                                            key={article.id}
                                            article={article}
                                            variant="minimal"
                                            initialLikes={article.likes_count}
                                            initialIsLiked={article.is_liked}
                                            initialIsBookmarked={article.is_bookmarked}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-neutral-500 mb-6">Bu kategoride henüz makale yok.</p>
                        <Link href="/makale" className="inline-flex items-center gap-2 text-amber-600 font-medium hover:underline">
                            Tüm makalelere dön <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors ${active
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
        >
            {children}
        </Link>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            {children}
        </h2>
    );
}
