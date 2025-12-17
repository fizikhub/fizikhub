import { createClient } from "@/lib/supabase-server";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { Search, TrendingUp, Tag, Telescope, Flame, Clock, Sparkles } from "lucide-react";
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

    // All articles for the feed
    const feedArticles = writerArticles;

    // Popular Articles (In real app, fetch by views)
    const popularArticles = writerArticles.slice().sort(() => 0.5 - Math.random()).slice(0, 5);

    // Extract categories
    const categories = Array.from(new Set(writerArticles.map(a => a.category).filter(Boolean))) as string[];

    // Unique authors
    const uniqueAuthors = new Set(writerArticles.map(a => a.author?.id).filter(Boolean)).size;

    return (
        <div className="min-h-screen pb-20 bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">

                {/* Header - Clean & Minimal */}
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
                            <p className="text-base sm:text-lg text-white/50 font-normal max-w-md leading-relaxed">
                                Bilim insanlarının paylaşım platformu
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Makale, konu veya yazar ara..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/[0.07] focus:outline-none transition-all duration-300"
                            />
                        </div>
                    </div>
                </header>

                {/* Magazine Hero Grid - Featured Posts */}
                <MagazineHero articles={featuredArticles} />

                {/* Feed Tabs */}
                <div className="flex items-center gap-1 mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
                    <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-amber-400 border-b-2 border-amber-400 whitespace-nowrap">
                        <Sparkles className="w-4 h-4" />
                        Tümü
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/50 hover:text-white/80 border-b-2 border-transparent hover:border-white/20 transition-all whitespace-nowrap">
                        <Flame className="w-4 h-4" />
                        Popüler
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/50 hover:text-white/80 border-b-2 border-transparent hover:border-white/20 transition-all whitespace-nowrap">
                        <Clock className="w-4 h-4" />
                        En Yeni
                    </button>
                    {categories.slice(0, 4).map(cat => (
                        <button
                            key={cat}
                            className="px-5 py-3 text-sm font-medium text-white/50 hover:text-white/80 border-b-2 border-transparent hover:border-white/20 transition-all whitespace-nowrap"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Main Content - Social Feed */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            {feedArticles.map((article, index) => (
                                <SocialArticleCard key={article.id} article={article} index={index} />
                            ))}
                        </div>

                        {feedArticles.length === 0 && (
                            <div className="text-center py-24 text-white/40 bg-white/[0.02] border border-white/10 rounded-xl">
                                <Telescope className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p className="text-xl font-medium">Henüz paylaşım yok.</p>
                                <p className="text-sm mt-2 text-white/30">Ama evren genişlemeye devam ediyor...</p>
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
                                {popularArticles.map((article, i) => (
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
                                        <div className="text-xs text-white/30 mt-1">
                                            {Math.floor(Math.random() * 100) + 50} paylaşım
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/10">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
                                <Tag className="w-5 h-5 text-amber-400" />
                                Konular
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className="px-3 py-1.5 text-sm font-medium bg-white/5 rounded-full text-white/60 hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-300"
                                    >
                                        #{cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-5 border border-amber-500/20">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-2xl font-black text-amber-400">{writerArticles.length}</div>
                                    <div className="text-xs text-white/40">Makale</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">{uniqueAuthors}</div>
                                    <div className="text-xs text-white/40">Yazar</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">{categories.length}</div>
                                    <div className="text-xs text-white/40">Konu</div>
                                </div>
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
