import { createClient } from "@/lib/supabase-server";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { SearchInput } from "@/components/blog/search-input";
import { Sparkles, Flame, Clock, ArrowRight, PenTool } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Makaleler | FizikHub",
    description: "FizikHub yazarlarından bilimsel makaleler.",
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

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-2xl mx-auto px-2 sm:px-4 py-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-foreground">
                        Makaleler
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {allArticles.length} makale yayında
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchInput />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
                    <FilterPill href="/makale" active={!categoryParam && sortParam !== 'popular'}>
                        <Sparkles className="w-3 h-3" /> Tümü
                    </FilterPill>
                    <FilterPill href="/makale?sort=popular" active={sortParam === 'popular'}>
                        <Flame className="w-3 h-3" /> Popüler
                    </FilterPill>
                    <FilterPill href="/makale?sort=latest" active={sortParam === 'latest' && !categoryParam}>
                        <Clock className="w-3 h-3" /> Yeni
                    </FilterPill>

                    {categories.length > 0 && <div className="w-px h-5 bg-border mx-1" />}

                    {categories.map(cat => (
                        <FilterPill key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={categoryParam === cat}>
                            {cat}
                        </FilterPill>
                    ))}
                </div>

                {/* Article Feed */}
                {allArticles.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {allArticles.map((article) => (
                            <NeoArticleCard
                                key={article.id}
                                article={article}
                                initialLikes={0}
                                initialComments={0}
                            />
                        ))}

                        {/* Writer CTA */}
                        <div className="mt-8 p-6 bg-[#FFC800] border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#000]">
                            <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest mb-2">
                                <PenTool className="w-4 h-4" />
                                Yazarlık Programı
                            </div>
                            <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2">
                                Sen de yazar ol
                            </h3>
                            <p className="text-sm text-black/70 mb-4">
                                Bilimsel makalelerini binlerce okuyucu ile paylaş.
                            </p>
                            <Link
                                href="/yazar"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                                Başvur <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 border-[3px] border-black rounded-lg bg-card">
                        <Sparkles className="w-10 h-10 text-[#FFC800] mx-auto mb-4" />
                        <h3 className="text-lg font-black uppercase text-foreground mb-2">İçerik Bulunamadı</h3>
                        <p className="text-sm text-muted-foreground mb-4">Bu kategoride henüz makale yok.</p>
                        <Link
                            href="/makale"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-sm rounded-lg"
                        >
                            Tüm Makaleler <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md border-2 border-black whitespace-nowrap transition-all ${active
                    ? "bg-black text-white shadow-none"
                    : "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000]"
                }`}
        >
            {children}
        </Link>
    );
}
