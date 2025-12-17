import { createClient } from "@/lib/supabase-server";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { EditorialCard } from "@/components/articles/editorial-card";
import { Search, TrendingUp, Tag } from "lucide-react";
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

    return (
        <div className="min-h-screen pb-20 bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">

                {/* Header - Brutalist Style */}
                <header className="mb-10 sm:mb-14 md:mb-20">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-none mb-3">
                                BİLİM
                                <br />
                                <span className="text-amber-400">ARŞİVİ</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-white/50 font-normal max-w-md leading-relaxed">
                                Evrenin derinliklerine yolculuk. Bilimi keşfet, öğren, paylaş.
                            </p>
                        </div>

                        {/* Search - Desktop */}
                        <div className="hidden md:block relative w-72 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Makale ara..."
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Decorative line */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-1 w-16 bg-amber-500" />
                        <div className="h-1 flex-1 bg-white/10" />
                    </div>
                </header>

                {/* Magazine Hero Grid */}
                <MagazineHero articles={featuredArticles} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-4 mb-8 sm:mb-10">
                            <div className="h-8 w-1 bg-amber-500" />
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Son Eklenenler
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                            {listArticles.map((article) => (
                                <EditorialCard key={article.id} article={article} />
                            ))}
                        </div>

                        {listArticles.length === 0 && (
                            <div className="text-center py-20 text-white/40 bg-white/5 border-2 border-dashed border-white/10">
                                <p className="text-lg font-medium">Henüz başka makale yok.</p>
                                <p className="text-sm mt-2">Ama evren genişlemeye devam ediyor...</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-10">
                        {/* Popular Articles Widget */}
                        <div className="bg-white/5 p-6 border-2 border-white/10">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-white uppercase tracking-wider">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                Popüler İçerikler
                            </h3>
                            <div className="space-y-5">
                                {popularArticles.map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="flex gap-4 group cursor-pointer items-start hover:bg-white/5 -mx-2 px-2 py-2 transition-colors"
                                    >
                                        <div className="text-3xl font-black text-white/10 group-hover:text-amber-400/50 transition-colors leading-none -mt-1 w-8 flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-snug mb-1 text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <span className="text-xs text-white/40">
                                                {article.author?.full_name || "Fizikhub"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-white uppercase tracking-wider">
                                <Tag className="w-5 h-5 text-amber-400" />
                                Kategoriler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className="px-3 py-1.5 text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats Widget */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 border-2 border-amber-500/20">
                            <h3 className="text-lg font-bold mb-4 text-white">Arşiv İstatistikleri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-3xl font-black text-amber-400">{writerArticles.length}</div>
                                    <div className="text-sm text-white/50">Makale</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-amber-400">{categories.length}</div>
                                    <div className="text-sm text-white/50">Kategori</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

