"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom, color: '#FFC800', rotate: '-1deg' },
    { label: 'Uzay', icon: Telescope, color: '#FF0080', rotate: '1deg' },
    { label: 'Teknoloji', icon: Cpu, color: '#23A9FA', rotate: '-2deg' },
    { label: 'Biyoloji', icon: Dna, color: '#F472B6', rotate: '2deg' },
    { label: 'Kimya', icon: FlaskConical, color: '#00F050', rotate: '-1deg' },
    { label: 'Genel', icon: Globe, color: '#a1a1aa', rotate: '0deg' },
];

const SORT_OPTS = [
    { value: 'latest', label: 'En Yeni', icon: Clock },
    { value: 'popular', label: 'Popüler', icon: Flame },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    return (
        <div className="min-h-screen pt-20 sm:pt-28 pb-10 text-black dark:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* ── NEO-BRUTALIST HEADER ── */}
                <header className="mb-8 border-b-[3px] border-black dark:border-white pb-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
                    >
                        <div>
                            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
                                MAKALELER<span className="text-[#FF0080]">.</span>
                            </h1>
                            <div className="mt-4 font-bold text-sm sm:text-base max-w-lg border-l-4 border-[#FFC800] pl-4">
                                Bilim, teknoloji ve evrenin sınırlarında dolaşan elit makaleler. Kuantumdan kozmolojiye gerçek bilim burada.
                            </div>
                        </div>

                        {/* Sort Options - Brutalist Toggle */}
                        <div className="flex flex-col gap-2 md:items-end w-full md:w-auto">
                            <div className="inline-flex items-center p-1 bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                                {SORT_OPTS.map(s => (
                                    <Link
                                        key={s.value}
                                        href={`/makale?sort=${s.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-6 py-2.5 font-black text-xs sm:text-sm uppercase transition-all duration-200 border-[2px] border-transparent active:translate-y-0.5",
                                            sortParam === s.value
                                                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                                                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <s.icon className="w-4 h-4 stroke-[3px]" />
                                        {s.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* ── CATEGORIES - NEO-PILLS ── */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    <Link
                        href="/makale"
                        className={cn(
                            "snap-start flex items-center justify-center min-w-[100px] gap-2 px-5 py-3 rounded-full border-[3px] border-black dark:border-white font-black text-sm uppercase transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none whitespace-nowrap",
                            !activeCategory
                                ? "bg-black text-white dark:bg-white dark:text-black shadow-none translate-x-[2px] translate-y-[2px]"
                                : "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        )}
                    >
                        <Globe className="w-5 h-5 stroke-[2.5px]" />
                        Hepsi
                    </Link>

                    {TOPICS.map((t) => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "snap-start flex items-center justify-center min-w-[120px] gap-2 px-5 py-3 rounded-full border-[3px] font-black text-sm uppercase transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none whitespace-nowrap",
                                activeCategory === t.label
                                    ? "shadow-none translate-x-[2px] translate-y-[2px] border-black dark:border-white text-black"
                                    : "bg-white dark:bg-zinc-900 text-black dark:text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.color } : {}}
                        >
                            <t.icon className="w-5 h-5 stroke-[2.5px]" style={{ color: activeCategory === t.label ? '#000' : t.color }} />
                            <span style={activeCategory === t.label ? { color: '#000' } : {}}>{t.label}</span>
                        </Link>
                    ))}
                </div>

                {/* ── NEWS TICKER ── */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-12 border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] bg-[#FFC800] rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ── ARTICLES GRID ── */}
                <section className="mb-20">
                    <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white pb-3 mb-8">
                        <div className="flex items-center gap-3 border-l-[6px] border-[#00F050] pl-4">
                            <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tighter">İndeks</h2>
                        </div>
                        <span className="bg-black dark:bg-white text-white dark:text-black font-black text-sm sm:text-lg px-4 py-1.5 border-[3px] border-black dark:border-white uppercase shadow-[3px_3px_0px_0px_#23A9FA] rotate-1">
                            {articles.length} SİNYAL
                        </span>
                    </div>

                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {articles.map((article) => (
                                <NeoArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-[3px] border-dashed border-black dark:border-white bg-[#FFC800]/10">
                            <Cpu className="w-16 h-16 mb-4 opacity-30 text-black dark:text-white" />
                            <h3 className="font-heading font-black text-3xl uppercase mb-3">SİNYAL YOK.</h3>
                            <p className="font-bold text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-sm mb-8">
                                Bu filtrede veri yakalanamadı. Lütfen farklı bir kategori seçerek taramaya devam edin.
                            </p>
                            <Link href="/makale" className="bg-[#FF0080] text-white font-black uppercase text-base px-8 py-4 border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#fff] transition-all active:translate-x-[6px] active:translate-y-[6px] active:shadow-none">
                                Geri Dön
                            </Link>
                        </div>
                    )}
                </section>

                <div className="mt-16 sm:mt-24 border-t-[3px] border-black dark:border-white pt-16 relative">
                    {/* Decorative element marking the end of feed */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[18px] bg-white dark:bg-[#18181b] px-6">
                        <Zap className="w-8 h-8 opacity-20" />
                    </div>
                    <GoldenTicketCTA />
                </div>
            </div>
        </div>
    );
}
