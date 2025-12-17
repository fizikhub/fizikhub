import { createClient } from "@/lib/supabase-server";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { EditorialCard } from "@/components/articles/editorial-card";
import { Search, TrendingUp, Tag, BookOpen, Users, Telescope } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Bilim Arşivi | Fizikhub",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri.",
};

// ISR: Regenerate every 60 seconds for fresh content
export const revalidate = 60;

export default async function BlogPage() {
    const supabase = await createClient();

    // Fetch ONLY published articles from WRITERS (is_writer = true)
    const { data: articles } = await supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey(*)
        `)
        .eq('status', 'published')
        .eq('author.is_writer', true)
        .order('created_at', { ascending: false });

    const writerArticles = articles || [];

    // Featured articles for Hero (First 3)
    const featuredArticles = writerArticles.slice(0, 3);

    // Remaining articles for the list
    const listArticles = writerArticles.slice(3);

    // Popular Articles (In real app, fetch by views)
    const popularArticles = writerArticles.slice().sort(() => 0.5 - Math.random()).slice(0, 4);

    // Extract categories
    const categories = Array.from(new Set(writerArticles.map(a => a.category).filter(Boolean))) as string[];

    // Unique authors
    const uniqueAuthors = new Set(writerArticles.map(a => a.author?.id).filter(Boolean)).size;

    return (
        <div className="min-h-screen pb-20 bg-background relative">
            {/* Subtle background texture */}
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">

                {/* Header - Enhanced Brutalist Style */}
                <header className="mb-12 sm:mb-16 md:mb-24">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <Telescope className="w-4 h-4" />
                                Fizikhub Yayınları
                            </div>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                                BİLİM
                                <br />
                                <span className="text-amber-400 relative">
                                    ARŞİVİ
                                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-amber-500/50" />
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-white/50 font-normal max-w-lg leading-relaxed">
                                Evrenin derinliklerine yolculuk. Bilimi keşfet, öğren, paylaş.
                            </p>
                        </div>

                        {/* Search - Desktop */}
                        <div className="hidden md:block relative w-72 lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Makale, konu veya yazar ara..."
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/[0.07] focus:outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Decorative line with more detail */}
                    <div className="mt-10 flex items-center gap-4">
                        <div className="h-1.5 w-20 bg-amber-500" />
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                </header>

                {/* Magazine Hero Grid */}
                <MagazineHero articles={featuredArticles} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-10 sm:mb-12">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-1.5 bg-amber-500" />
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Son Eklenenler
                                </h2>
                            </div>
                            <span className="text-sm text-white/30 hidden sm:block">
                                {listArticles.length} makale
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
                            {listArticles.map((article, index) => (
                                <EditorialCard key={article.id} article={article} index={index} />
                            ))}
                        </div>

                        {listArticles.length === 0 && (
                            <div className="text-center py-24 text-white/40 bg-white/[0.02] border-2 border-dashed border-white/10">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p className="text-xl font-medium">Henüz başka makale yok.</p>
                                <p className="text-sm mt-2 text-white/30">Ama evren genişlemeye devam ediyor...</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column - Enhanced */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-10">
                        {/* Popular Articles Widget */}
                        <div className="bg-white/[0.03] p-6 border-2 border-white/10 relative overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-500/10 rotate-45" />
                            </div>

                            <h3 className="text-base font-bold mb-6 flex items-center gap-3 text-white uppercase tracking-wider">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                Popüler İçerikler
                            </h3>
                            <div className="space-y-4">
                                {popularArticles.map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="flex gap-4 group cursor-pointer items-start hover:bg-white/5 -mx-3 px-3 py-3 transition-all duration-300 border-l-2 border-transparent hover:border-amber-500"
                                    >
                                        <div className="text-2xl font-black text-white/10 group-hover:text-amber-400/60 transition-colors leading-none w-6 flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm leading-snug mb-1 text-white/80 group-hover:text-amber-400 transition-colors line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <span className="text-xs text-white/30">
                                                {article.author?.full_name || "Fizikhub"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div>
                            <h3 className="text-base font-bold mb-5 flex items-center gap-3 text-white uppercase tracking-wider">
                                <Tag className="w-5 h-5 text-amber-400" />
                                Kategoriler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className="px-4 py-2 text-sm font-medium bg-white/5 border-2 border-white/10 text-white/60 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-300"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats Widget - Enhanced */}
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 border-2 border-amber-500/20 relative">
                            <div className="absolute top-4 right-4 text-amber-500/20">
                                <Telescope className="w-16 h-16" />
                            </div>
                            <h3 className="text-base font-bold mb-5 text-white uppercase tracking-wider">Arşiv İstatistikleri</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-3xl font-black text-amber-400">{writerArticles.length}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Makale</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-amber-400">{categories.length}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Kategori</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-amber-400">{uniqueAuthors}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Yazar</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Widget */}
                        <div className="p-6 border-2 border-white/10 bg-white/[0.02] text-center">
                            <Users className="w-10 h-10 mx-auto mb-4 text-amber-400/60" />
                            <h3 className="text-lg font-bold text-white mb-2">Yazar Ol</h3>
                            <p className="text-sm text-white/40 mb-4">
                                Sen de bilim dünyasına katkıda bulun, makalelerini paylaş.
                            </p>
                            <Link
                                href="/yazar"
                                className="inline-flex items-center justify-center w-full py-3 bg-amber-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors"
                            >
                                Başvur
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
