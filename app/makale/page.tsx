import { createClient } from "@/lib/supabase-server";
import { PremiumArchiveCard } from "@/components/articles/premium-archive-card";
import { PremiumArchiveHeader } from "@/components/articles/premium-archive-header";
import { Flame, TrendingUp, Telescope, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Tahkikat Arşivi | Fizikhub",
    description: "Evrenin sırlarını derinlemesine inceleyen bilimsel makaleler ve notlar.",
};

// Enable immediate updates during design overhaul
export const revalidate = 0;

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

    // Base Query
    let query = supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey!inner(*)
        `)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    // Apply Category Filter
    if (categoryParam && categoryParam !== 'Tümü' && categoryParam !== 'Popüler' && categoryParam !== 'En Yeni') {
        query = query.eq('category', categoryParam);
    }

    // Apply Search Filter
    if (searchParam) {
        query = query.ilike('title', `%${searchParam}%`);
    }

    // Apply Sorting
    if (sortParam === 'popular') {
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    // Extract categories for filters
    const { data: allCategoriesData } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'published');

    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen bg-background">
            {/* New Premium Header with Search Integration */}
            <PremiumArchiveHeader />

            <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Elegant Minimalist Filters */}
                        <div className="flex flex-col space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-foreground/10" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 px-4">Tasnif & Filtre</span>
                                <div className="h-px flex-1 bg-foreground/10" />
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-4">
                                <Link
                                    href="/makale"
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                                        !categoryParam && sortParam === 'latest'
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-transparent text-foreground/50 border-foreground/10 hover:border-foreground/40 hover:text-foreground"
                                    )}
                                >
                                    Tüm Koleksiyon
                                </Link>
                                <Link
                                    href="/makale?sort=popular"
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2",
                                        sortParam === 'popular'
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-transparent text-foreground/50 border-foreground/10 hover:border-foreground/40 hover:text-foreground"
                                    )}
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                    Popüler Tahkikatlar
                                </Link>

                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/makale?category=${encodeURIComponent(cat)}`}
                                        className={cn(
                                            "px-6 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                                            categoryParam === cat
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-transparent text-foreground/50 border-foreground/10 hover:border-foreground/40 hover:text-foreground"
                                        )}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Article Grid - Journal Index Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-24">
                            {allArticles.map((article, index) => (
                                <PremiumArchiveCard
                                    key={article.id}
                                    article={article as any}
                                    index={index}
                                />
                            ))}
                        </div>

                        {allArticles.length === 0 && (
                            <div className="text-center py-32 space-y-6">
                                <div className="p-8 bg-foreground/[0.02] rounded-full w-24 h-24 mx-auto flex items-center justify-center border border-foreground/5 mb-6">
                                    <Telescope className="w-10 h-10 text-foreground/20" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Netice Bulunamadı</h3>
                                    <p className="text-sm font-serif italic text-foreground/40 max-w-sm mx-auto">
                                        Seçtiğiniz kriterlere uygun veya aradığınız başlığa sahip bir makale arşivimizde bulunmuyor.
                                    </p>
                                </div>
                                <Link href="/makale" className="inline-block px-10 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Arşivi Sıfırla
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column - Synchronized with Article Page */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-12 h-fit sticky top-32">

                        {/* Trending Section */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <TrendingUp className="w-4 h-4 text-foreground/30" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Gündemdekiler</h3>
                            </div>

                            <div className="space-y-8">
                                {allArticles.slice(0, 5).map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/makale/${article.slug}`}
                                        className="group flex gap-6 items-start"
                                    >
                                        <span className="text-4xl font-display font-light text-foreground/10 group-hover:text-foreground/30 transition-colors leading-[0.8]">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="space-y-1.5">
                                            <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                                                {article.category}
                                            </div>
                                            <h4 className="font-display font-medium text-lg text-foreground group-hover:text-foreground/70 transition-colors leading-snug">
                                                {article.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Writer CTA - Academic Recruitment Style */}
                        <div className="relative p-8 border border-foreground/10 bg-foreground/[0.03] overflow-hidden group">
                            {/* Subtle dot pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}
                            />

                            <div className="relative space-y-6 text-center">
                                <div className="p-3 bg-foreground/[0.05] rounded-full w-12 h-12 mx-auto flex items-center justify-center border border-foreground/5">
                                    <UserPlus className="w-5 h-5 text-foreground/40" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-display font-medium text-foreground tracking-tight">İlmi İştirak</h3>
                                    <p className="text-xs font-serif italic text-foreground/50 leading-relaxed">
                                        Kendi bilimsel çalışmalarınızı FizikHub arşivine dahil etmek ister misiniz? Topluluğumuza yazar olarak katkı sağlayın.
                                    </p>
                                </div>
                                <Link
                                    href="/yazar"
                                    className="block w-full py-3 border border-foreground bg-foreground text-background font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-background hover:text-foreground shadow-sm"
                                >
                                    Müracaat Formu
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
