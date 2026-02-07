import { createClient } from "@/lib/supabase-server";
import { MagazineMasthead } from "@/components/articles/magazine-masthead";
import { MagazineCard } from "@/components/articles/magazine-card";
import { Sparkles, ArrowRight, ArrowUpRight, PenTool, Zap } from "lucide-react";
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

    const supabase = await createClient();

    let query = supabase
        .from('articles')
        .select(`*, author:profiles!articles_author_id_fkey!inner(*)`)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    if (categoryParam) {
        query = query.eq('category', categoryParam);
    }

    if (sortParam === 'popular') {
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    const { data: allCategoriesData } = await supabase.from('articles').select('category').eq('status', 'published');
    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    // Smart layout distribution
    const heroArticle = allArticles[0];
    const featureArticles = allArticles.slice(1, 3);
    const gridArticles = allArticles.slice(3);

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Ultra Premium Masthead */}
            <MagazineMasthead
                articleCount={allArticles.length}
                categories={categories}
                activeCategory={categoryParam}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                {allArticles.length > 0 ? (
                    <div className="space-y-32">
                        {/* HERO + FEATURE GRID */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Hero Article */}
                                {heroArticle && (
                                    <MagazineCard article={heroArticle} variant="hero" index={0} />
                                )}

                                {/* Feature Articles */}
                                {featureArticles.map((article, i) => (
                                    <MagazineCard key={article.id} article={article} variant="feature" index={i + 1} />
                                ))}
                            </div>
                        </section>

                        {/* DIVIDER */}
                        <div className="flex items-center gap-6">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">DAHA FAZLA</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
                        </div>

                        {/* STANDARD GRID */}
                        {gridArticles.length > 0 && (
                            <section>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gridArticles.map((article, i) => (
                                        <MagazineCard
                                            key={article.id}
                                            article={article}
                                            variant={i % 4 === 0 ? "feature" : "standard"}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* WRITER CTA */}
                        <section className="relative">
                            <div className="absolute -inset-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-[2.5rem] blur-sm opacity-50" />
                            <div className="relative bg-neutral-950 rounded-[2.5rem] p-10 sm:p-16 overflow-hidden">
                                {/* Background Effects */}
                                <div className="absolute inset-0 opacity-30">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/30 rounded-full blur-[100px]" />
                                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-500/20 rounded-full blur-[80px]" />
                                </div>

                                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
                                    <div className="max-w-2xl text-center lg:text-left">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8">
                                            <Zap className="w-3 h-3" />
                                            YAZARLIK PROGRAMI
                                        </div>
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tight mb-6">
                                            BİLİMİN SESİ
                                            <span className="block text-amber-500">SEN OL.</span>
                                        </h2>
                                        <p className="text-lg text-neutral-400 leading-relaxed">
                                            FizikHub Yazarlık Akademisi'ne katıl. Araştırmalarını, teorilerini ve bilimsel meraklarını binlerce okuyucuyla paylaş.
                                        </p>
                                    </div>

                                    <Link
                                        href="/yazar"
                                        className="group flex items-center gap-4 px-10 py-6 bg-white text-black font-black text-lg rounded-2xl hover:bg-amber-500 transition-all duration-300 shadow-2xl shadow-white/10 active:scale-95"
                                    >
                                        BAŞVUR
                                        <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-3xl font-black text-black dark:text-white mb-4">İçerik Bulunamadı</h3>
                        <p className="text-neutral-500 mb-8 max-w-md mx-auto">Bu kategoride henüz yayınlanmış bir makale bulunmuyor.</p>
                        <Link
                            href="/makale"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity"
                        >
                            Tüm Makaleler <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
