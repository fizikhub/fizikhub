import { createClient } from "@/lib/supabase-server";
import { JournalHero } from "@/components/articles/journal-hero";
import { ArticlePrism } from "@/components/articles/article-prism";
import { Sparkles, ArrowRight, PenTool } from "lucide-react";
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

    // Category tracking
    const { data: allCategoriesData } = await supabase.from('articles').select('category').eq('status', 'published');
    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    // Layout distribution
    const heroArticle = allArticles[0];
    const gridArticles = allArticles.slice(1);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-amber-500 selection:text-black">
            {/* Ultra Premium Header */}
            <JournalHero />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6">

                {/* Navigation & Filters */}
                <nav className="sticky top-20 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl py-6 mb-20 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
                        <NavPill href="/makale" active={!categoryParam && sortParam === 'latest'}>
                            TÜMÜ
                        </NavPill>
                        <NavPill href="/makale?sort=popular" active={sortParam === 'popular'}>
                            POPÜLER
                        </NavPill>
                        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-4" />
                        {categories.map(cat => (
                            <NavPill key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={categoryParam === cat}>
                                {cat.toUpperCase()}
                            </NavPill>
                        ))}
                    </div>
                </nav>

                {allArticles.length > 0 ? (
                    <div className="space-y-40">

                        {/* ASYMMETRIC BENTO GRID */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                                {/* Featured Hero Article */}
                                {heroArticle && (
                                    <ArticlePrism
                                        article={heroArticle}
                                        variant="large"
                                        index={0}
                                    />
                                )}

                                {/* Rest of the articles in a dynamic grid */}
                                {gridArticles.map((article, i) => {
                                    // Randomize pattern for visual interest
                                    const variant = (i % 5 === 0) ? "medium" : (i % 3 === 0) ? "small" : "medium";
                                    return (
                                        <ArticlePrism
                                            key={article.id}
                                            article={article}
                                            variant={variant}
                                            index={i + 1}
                                        />
                                    );
                                })}
                            </div>
                        </section>

                        {/* HIGH-END WRITER CTA */}
                        <section className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-neutral-950 rounded-[3rem] p-8 sm:p-20 overflow-hidden border border-white/10">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative flex flex-col md:flex-row items-center justify-between gap-16">
                                    <div className="max-w-2xl text-center md:text-left">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                            <PenTool className="w-3 h-3" />
                                            EDITORIAL BOARD
                                        </span>
                                        <h2 className="text-4xl sm:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                                            BİLİMİN SESİ <span className="text-amber-500">SEN OL.</span>
                                        </h2>
                                        <p className="text-lg sm:text-xl text-neutral-400 font-medium leading-relaxed">
                                            FizikHub Yazarlık Akademisi'ne katıl, araştırmalarını küresel bir toplulukla paylaş ve bilim dünyasında iz bırak.
                                        </p>
                                    </div>
                                    <Link
                                        href="/yazar"
                                        className="group flex items-center gap-4 px-12 py-6 bg-white text-black font-black rounded-2xl hover:bg-amber-500 transition-all duration-500 shadow-2xl active:scale-95"
                                    >
                                        BAŞVUR <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-3xl font-black text-black dark:text-white mb-4 tracking-tight uppercase">İçerik Bulunamadı</h3>
                        <p className="text-neutral-500 max-w-sm mx-auto mb-12">Bu kategoride henüz yayınlanmış bir makale bulunmuyor. Daha sonra tekrar kontrol et.</p>
                        <Link href="/makale" className="inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl hover:opacity-80 transition-opacity uppercase tracking-widest text-xs">
                            Tüm Makaleler <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                <div className="h-40" />
            </div>
        </div>
    );
}

function NavPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`px-6 py-2 text-[10px] font-black tracking-[0.2em] rounded-full transition-all duration-500 ${active
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-black/20'
                : 'text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
        >
            {children}
        </Link>
    );
}
