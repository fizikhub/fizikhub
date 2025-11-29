import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
import { MagazineHero } from "@/components/articles/magazine-hero";
import { EditorialCard } from "@/components/articles/editorial-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Mail, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bilim Arşivi | Fizikhub",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const supabase = await createClient();
    const articles = await getArticles(supabase, { status: 'published', authorRole: 'all' });

    // Featured articles for Hero (First 3)
    const featuredArticles = articles.slice(0, 3);

    // Remaining articles for the list
    const listArticles = articles.slice(3);

    // Mock Popular Articles (In real app, fetch by views)
    const popularArticles = articles.slice().sort(() => 0.5 - Math.random()).slice(0, 4);

    // Extract categories
    const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Bilim Arşivi</h1>
                        <p className="text-muted-foreground">Evrenin derinliklerine yolculuk.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Makale ara..." className="pl-9 bg-muted/50 border-0" />
                    </div>
                </div>

                {/* Magazine Hero Grid */}
                <MagazineHero articles={featuredArticles} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full" />
                                Son Eklenenler
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                            {listArticles.map((article) => (
                                <EditorialCard key={article.id} article={article} />
                            ))}
                        </div>

                        {listArticles.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                Henüz başka makale yok.
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Popular Articles Widget */}
                        <div className="bg-card/50 rounded-2xl p-6 border shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Popüler İçerikler
                            </h3>
                            <div className="space-y-6">
                                {popularArticles.map((article, i) => (
                                    <div key={article.id} className="flex gap-4 group cursor-pointer">
                                        <div className="text-2xl font-black text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                {article.author?.full_name || "Fizikhub"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-primary" />
                                Kategoriler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Button key={cat} variant="outline" size="sm" className="rounded-full hover:border-primary hover:text-primary">
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Bilim Bülteni</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                En yeni bilimsel gelişmelerden haberdar olmak için abone olun.
                            </p>
                            <div className="space-y-2">
                                <Input placeholder="E-posta adresiniz" className="bg-background" />
                                <Button className="w-full">Abone Ol</Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
