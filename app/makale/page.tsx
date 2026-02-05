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
        <div className="min-h-screen bg-[#fafaf9] dark:bg-zinc-950"> {/* Premium Cream Paper Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-10 bg-[url('/noise.png')]" />

            {/* New Premium Header with Journal Masthead Style */}
            <PremiumArchiveHeader />

            <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Neo-Brutalist Journal Filters */}
                        <div className="flex flex-col space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="h-0.5 flex-1 bg-black/10" />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white px-2">Katalog ve Tasnif</span>
                                <div className="h-0.5 flex-1 bg-black/10" />
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
                                <Link
                                    href="/makale"
                                    className={cn(
                                        "px-6 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                        !categoryParam && sortParam === 'latest'
                                            ? "bg-[#FFC800] text-black"
                                            : "bg-white text-black hover:bg-neutral-50"
                                    )}
                                >
                                    Tüm Koleksiyon
                                </Link>
                                <Link
                                    href="/makale?sort=popular"
                                    className={cn(
                                        "px-6 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center gap-2",
                                        sortParam === 'popular'
                                            ? "bg-[#FF5500] text-white"
                                            : "bg-white text-black hover:bg-neutral-50"
                                    )}
                                >
                                    <Flame className="w-4 h-4 filled" />
                                    Popüler Tahkikatlar
                                </Link>

                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/makale?category=${encodeURIComponent(cat)}`}
                                        className={cn(
                                            "px-6 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                            categoryParam === cat
                                                ? "bg-cyan-400 text-black"
                                                : "bg-white text-black hover:bg-neutral-50"
                                        )}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Article Grid - Journal Index Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
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

                    {/* Sidebar Column - Synchronized with Editorial Theme */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-12 h-fit sticky top-32">

                        {/* Trending Section */}
                        <div className="space-y-8 bg-white dark:bg-zinc-900 border-[3px] border-black shadow-neo-sm p-6">
                            <div className="flex items-center gap-4 border-b-2 border-black pb-3">
                                <TrendingUp className="w-5 h-5 text-[#FFC800]" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white font-heading">Gündemdekiler</h3>
                            </div>

                            <div className="space-y-8">
                                {allArticles.slice(0, 5).map((article, i) => (
                                    <Link
                                        key={article.id}
                                        href={`/makale/${article.slug}`}
                                        className="group flex gap-6 items-start border-b border-black/5 pb-4 last:border-0"
                                    >
                                        <span className="text-4xl font-display font-light text-black/10 dark:text-white/10 group-hover:text-[#FFC800] transition-colors leading-[0.8] font-heading">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-black text-[#FFC800] uppercase tracking-widest">
                                                {article.category}
                                            </div>
                                            <h4 className="font-display font-medium text-lg text-black dark:text-white group-hover:underline underline-offset-2 transition-colors leading-snug">
                                                {article.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Writer CTA - Recruitment Masthead */}
                        <div className="relative p-8 border-[3px] border-black bg-[#FF8800] shadow-neo group overflow-hidden">
                            {/* Subtle dot pattern */}
                            <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}
                            />

                            <div className="relative space-y-6 text-center">
                                <div className="p-3 bg-white border-2 border-black rounded-full w-12 h-12 mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                    <UserPlus className="w-5 h-5 text-black" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display font-medium text-white tracking-tight drop-shadow-[2px_2px_0px_black]">İlmi İştirak</h3>
                                    <p className="text-xs font-serif italic text-white/90 leading-relaxed font-medium">
                                        Kendi bilimsel çalışmalarınızı FizikHub arşivine dahil etmek ister misiniz? Topluluğumuza yazar olarak katkı sağlayın.
                                    </p>
                                </div>
                                <Link
                                    href="/yazar"
                                    className="block w-full py-3 bg-white border-2 border-black text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-neo-sm"
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
