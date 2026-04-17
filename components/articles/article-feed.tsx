"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import { Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { Article } from "@/lib/api";

interface ArticleFeedProps {
    articles: {
        id: string;
        title: string;
        excerpt?: string | null;
        summary?: string | null;
        image_url?: string | null;
        cover_url?: string | null;
        category?: string | null;
        created_at: string;
        slug: string;
        content?: string;
        reading_time?: number;
        author?: { full_name?: string | null } | null;
        profiles?: { full_name?: string | null } | null;
        [key: string]: unknown;
    }[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TABS = [
    { id: 'TÜMÜ', icon: LayoutList, color: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black' },
    { id: 'Uzay', icon: Telescope, color: 'bg-[#FF0080] text-white' },
    { id: 'Teknoloji', icon: Cpu, color: 'bg-[#23A9FA] text-white' },
    { id: 'Biyoloji', icon: Dna, color: 'bg-[#00F050] text-black' },
    { id: 'Fizik', icon: Zap, color: 'bg-[#FFC800] text-black' },
    { id: 'Kimya', icon: FlaskConical, color: 'bg-[#FF90E8] text-black' },
    { id: 'Genel', icon: Globe, color: 'bg-[#a1a1aa] text-black' },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    const ARTICLES = articles.map(a => ({
        ...a,
        id: a.id as any,
        title: a.title,
        summary: a.summary || a.excerpt,
        image_url: a.cover_url || a.image_url || "/images/placeholder-article.webp",
        category: a.category || "Genel",
        created_at: a.created_at,
        slug: a.slug,
        author: { full_name: a.author?.full_name || a.profiles?.full_name || "FizikHub Editör" } as any
    }));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-10">
                {/* ── NEO-BRUTALIST HEADER ── */}
                <header className="mb-6 sm:mb-10 pt-2 sm:pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b-[2.5px] border-black/10 dark:border-white/10 pb-4 sm:pb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        >
                            Bilim <span className="text-muted-foreground/50">&</span> Makale
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-3 text-sm sm:text-base font-bold tracking-tight text-muted-foreground max-w-xl"
                        >
                            Evrenin sırları ve teknolojik atılımlar hakkında derinlemesine analizler.
                        </motion.p>
                    </div>

                    <div className="flex gap-3">
                        {['latest', 'popular'].map((s) => (
                            <Link
                                key={s}
                                href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                className={cn(
                                    "flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[10px] border-2 sm:border-[2.5px] font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200",
                                    sortParam === s
                                        ? "bg-foreground text-background border-foreground shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] sm:dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.2)] -translate-x-[1px] -translate-y-[1px]"
                                        : "bg-background text-muted-foreground border-foreground/20 hover:text-foreground hover:border-foreground hover:shadow-[2px_2px_0_0_#000] sm:hover:shadow-[3px_3px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-[1px] hover:-translate-x-[1px]"
                                )}
                            >
                                {s === 'latest' ? <Clock className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                                {s === 'latest' ? 'En Yeni' : 'Popüler'}
                            </Link>
                        ))}
                    </div>
                </header>

                {/* ── NEO-BRUTALIST TABS ── */}
                <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-4 sm:pb-6 mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isAll = tab.id === 'TÜMÜ';
                        const isActive = isAll ? !activeCategory : activeCategory === tab.id;

                        if (!isAll && !categories.includes(tab.id) && !isActive) return null;

                        return (
                            <Link
                                key={tab.id}
                                href={isAll ? '/makale' : `/makale?category=${tab.id}${sortParam !== 'latest' ? `&sort=${sortParam}` : ''}`}
                                className={cn(
                                    "relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[10px] border-2 sm:border-[2.5px] outline-none font-black text-[10px] sm:text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 group uppercase tracking-wider active:translate-y-0 active:translate-x-0 active:shadow-none",
                                    isActive
                                        ? `${tab.color} border-foreground dark:border-transparent shadow-[2px_2px_0_0_rgba(0,0,0,1)] sm:shadow-[3px_3px_0_0_rgba(0,0,0,1)] -translate-y-[1px] -translate-x-[1px]`
                                        : "bg-card border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-card hover:shadow-[2px_2px_0_0_#000] sm:hover:shadow-[3px_3px_0_0_#000] hover:-translate-y-[1px] hover:-translate-x-[1px]"
                                )}
                            >
                                <Icon className={cn("w-3.5 h-3.5 stroke-[3px]", isActive ? "stroke-current" : "")} />
                                <span>{tab.id}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* ── NEO-BRUTALIST CARDS GRID ── */}
                {ARTICLES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                        {ARTICLES.map((article, index) => (
                            <NeoArticleCard 
                                key={article.id} 
                                article={article as any} 
                                priority={index < 4} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 sm:border-[2.5px] border-black dark:border-zinc-700 rounded-[14px] bg-white dark:bg-[#1e1e21] shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)]">
                        <div className="bg-[#FFBD2E]/20 border-2 sm:border-[2.5px] border-black dark:border-zinc-600 w-16 h-16 rounded-[10px] flex items-center justify-center mb-5 shadow-[2px_2px_0_0_#000] -rotate-3">
                            <Zap className="w-7 h-7 text-black dark:text-zinc-300 stroke-[2.5px]" />
                        </div>
                        <p className="text-black dark:text-zinc-50 font-[family-name:var(--font-outfit)] font-black text-2xl mb-2 uppercase tracking-tight">İçerik Bulunamadı</p>
                        <p className="text-neutral-500 dark:text-zinc-400 text-sm max-w-[280px] leading-relaxed font-bold">Bu kategori için henüz veri işlenmemiş.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
