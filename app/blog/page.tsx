import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { EditorialCard } from "@/components/articles/editorial-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Mail, Tag } from "lucide-react";
import type { Metadata } from "next";
import { SpaceBackground } from "@/components/home/space-background";

export const metadata: Metadata = {
    title: "Bilim Arşivi | Fizikhub",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri.",
};

export const dynamic = "force-dynamic";

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

    // Mock Popular Articles (In real app, fetch by views)
    const popularArticles = writerArticles.slice().sort(() => 0.5 - Math.random()).slice(0, 4);

    // Extract categories
    const categories = Array.from(new Set(writerArticles.map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Space Background */}
            <SpaceBackground />

            <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-8 relative z-10">
                {/* Header - Simplified for Mobile */}
                <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-10">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            BİLİM ARŞİVİ
                        </h1>
                        <p className="text-base sm:text-lg text-blue-200/80 font-medium">
                            Evrenin derinliklerine yolculuk.
                        </p>
                    </div>

                    {/* Search - Hidden on Mobile, can be toggled if needed */}
                    <div className="hidden sm:block relative w-full md:w-72 md:ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                        <Input
                            placeholder="Makale ara..."
                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 rounded-full backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Magazine Hero Grid */}
                <MagazineHero articles={featuredArticles} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
                            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
                                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]" />
                                Son Eklenenler
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-x-8 sm:gap-y-12">
                            {listArticles.map((article) => (
                                <EditorialCard key={article.id} article={article} />
                            ))}
                        </div>

                        {listArticles.length === 0 && (
                            <div className="text-center py-20 text-white/50 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-lg">Henüz başka makale yok.</p>
                                <p className="text-sm mt-2">Ama evren genişlemeye devam ediyor...</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column - Hidden on Mobile */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-10">
                        {/* Popular Articles Widget */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md shadow-xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                Popüler İçerikler
                            </h3>
                            <div className="space-y-6">
                                {popularArticles.map((article, i) => (
                                    <div key={article.id} className="flex gap-4 group cursor-pointer items-start">
                                        <div className="text-3xl font-black text-white/10 group-hover:text-cyan-400/50 transition-colors leading-none -mt-1">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-snug mb-1 text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <span className="text-xs text-blue-200/50">
                                                {article.author?.full_name || "Fizikhub"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                                <Tag className="w-5 h-5 text-purple-400" />
                                Kategoriler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Button
                                        key={cat}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full bg-white/5 border-white/10 text-blue-100 hover:bg-white/10 hover:text-white hover:border-white/20"
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-white/10 text-center backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white relative z-10">Bilim Bülteni</h3>
                            <p className="text-sm text-blue-200/70 mb-4 relative z-10">
                                En yeni bilimsel gelişmelerden haberdar olmak için abone olun.
                            </p>
                            <div className="space-y-2 relative z-10">
                                <Input
                                    placeholder="E-posta adresiniz"
                                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                                />
                                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white border-0">Abone Ol</Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
