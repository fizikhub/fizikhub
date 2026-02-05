import { createClient } from "@/lib/supabase-server";
import { JournalTechnicalEntry } from "@/components/articles/journal-technical-entry";
import { JournalMasthead } from "@/components/articles/journal-masthead";
import { Telescope, ListFilter, Cpu, Boxes } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Teknik Arşiv | Fizikhub",
    description: "Akademik derinlik ve teknik disiplin ile harmanlanmış bilimsel dökümantasyon arşivi.",
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

    if (categoryParam && categoryParam !== 'Tümü') {
        query = query.eq('category', categoryParam);
    }

    if (searchParam) {
        query = query.ilike('title', `%${searchParam}%`);
    }

    if (sortParam === 'popular') {
        query = query.order('views', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: articles } = await query;
    const allArticles = articles || [];

    const { data: allCategoriesData } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'published');

    const categories = Array.from(new Set((allCategoriesData || []).map(a => a.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 selection:bg-[#FFC800]">
            {/* 1. MASTHEAD */}
            <JournalMasthead />

            <main className="container mx-auto max-w-7xl pt-2 pb-24 border-x-[3px] border-black bg-white dark:bg-zinc-950/50 min-h-screen relative shadow-[40px_0_100px_rgba(0,0,0,0.05),-40px_0_100px_rgba(0,0,0,0.05)]">

                {/* 2. TECHNICAL FILTERS BAR */}
                <div className="sticky top-16 md:top-20 z-40 bg-[#FAF9F6] dark:bg-zinc-900 border-y-[3px] border-black px-4 flex flex-col md:flex-row items-stretch md:items-center">
                    <div className="flex items-center gap-3 py-4 md:py-0 md:pr-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black">
                        <div className="w-8 h-8 bg-black flex items-center justify-center">
                            <ListFilter className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Directory_Filter</span>
                    </div>

                    <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                        <Link
                            href="/makale"
                            className={cn(
                                "h-14 px-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] border-r-[3px] border-black transition-colors whitespace-nowrap",
                                !categoryParam ? "bg-black text-white" : "hover:bg-[#FFC800]"
                            )}
                        >
                            ALL_REPORTS
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/makale?category=${encodeURIComponent(cat)}`}
                                className={cn(
                                    "h-14 px-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] border-r-[3px] border-black transition-colors whitespace-nowrap",
                                    categoryParam === cat ? "bg-[#FFC800] text-black" : "hover:bg-[#FFC800]"
                                )}
                            >
                                {cat.toUpperCase()}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4 pl-6 text-[9px] font-mono font-bold text-black/30">
                        <Cpu className="w-3 h-3 animate-pulse" /> SCAN_COMPLETE: {allArticles.length} ENTRIES
                    </div>
                </div>

                {/* 3. TECHNICAL ENTRIES LIST */}
                <div className="flex flex-col">
                    {allArticles.map((article, index) => (
                        <JournalTechnicalEntry
                            key={article.id}
                            article={article as any}
                            index={index}
                        />
                    ))}
                </div>

                {/* EMPTY STATE */}
                {allArticles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10">
                        <Boxes className="w-16 h-16 text-black mb-6" />
                        <h3 className="text-4xl font-black uppercase italic">No_Matches_Found</h3>
                        <p className="font-mono text-xs uppercase tracking-widest mt-2">Adjust your query_parameters and try again.</p>
                        <Link href="/makale" className="mt-8 bg-black text-white px-8 py-3 font-black text-xs uppercase tracking-widest border-2 border-transparent hover:border-black hover:bg-white hover:text-black transition-all">
                            REFRESH_DIRECTORY
                        </Link>
                    </div>
                )}

                {/* 4. FOOTER INFO */}
                <div className="mt-12 p-8 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-8 bg-black text-white">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">İlmi İştirak Çağrısı</h4>
                        <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/40 max-w-sm">
                            Technical contributions are currently being accepted for VOL: 2024.2. Submit your research papers for peer-review.
                        </p>
                    </div>
                    <Link href="/yazar" className="group relative bg-[#FFC800] text-black px-10 py-4 font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        SUBMIT_MANUSCRIPT
                    </Link>
                </div>
            </main>
        </div>
    );
}
