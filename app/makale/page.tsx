import { createClient } from "@/lib/supabase-server";
import { CompactHeader } from "@/components/articles/compact-header";
import { MagazineCard } from "@/components/articles/magazine-card";
import { Sparkles, ArrowRight, ArrowUpRight, PenTool } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Makaleler | FizikHub",
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

    // Layout distribution
    const heroArticle = allArticles[0];
    const gridArticles = allArticles.slice(1);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Compact Header */}
                <CompactHeader
                    articleCount={allArticles.length}
                    categories={categories}
                    activeCategory={categoryParam}
                    sortParam={sortParam}
                />

                {allArticles.length > 0 ? (
                    <div className="space-y-16 pb-20">
                        {/* Hero + Grid */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {heroArticle && (
                                    <div className="md:col-span-2 lg:col-span-2">
                                        <MagazineCard article={heroArticle} variant="hero" index={0} />
                                    </div>
                                )}
                                {gridArticles.slice(0, 1).map((article, i) => (
                                    <MagazineCard key={article.id} article={article} variant="standard" index={i + 1} />
                                ))}
                            </div>
                        </section>

                        {/* Rest of Grid */}
                        {gridArticles.length > 1 && (
                            <section>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gridArticles.slice(1).map((article, i) => (
                                        <MagazineCard key={article.id} article={article} variant="standard" index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Writer CTA */}
                        <section className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-8 sm:p-12">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                                        <PenTool className="w-4 h-4" />
                                        Yazarlık Programı
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                                        Sen de yazar ol
                                    </h3>
                                    <p className="text-neutral-500 text-sm mt-1">
                                        Bilimsel makalelerini binlerce okuyucu ile paylaş.
                                    </p>
                                </div>
                                <Link
                                    href="/yazar"
                                    className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Başvur <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">İçerik Bulunamadı</h3>
                        <p className="text-neutral-500 mb-6">Bu kategoride henüz makale yok.</p>
                        <Link
                            href="/makale"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg"
                        >
                            Tüm Makaleler <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
