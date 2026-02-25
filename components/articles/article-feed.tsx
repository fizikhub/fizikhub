"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    const ARTICLES = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.summary || a.excerpt,
        image: a.cover_url || a.image_url || "/images/placeholder-article.webp",
        category: a.category || "GENEL",
        date: a.created_at,
        author: a.author?.full_name || a.profiles?.full_name || "Anonim",
        slug: a.slug,
    }));

    const COLORS = ['#FFC800', '#FF0080', '#00F050', '#23A9FA'];

    return (
        <div className="min-h-screen bg-transparent text-black dark:text-white pb-20">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">

                <header className="mb-12 border-b-[4px] border-black dark:border-white pb-8">
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                        <div className="max-w-4xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-heading text-6xl sm:text-8xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] drop-shadow-[4px_4px_0px_#000] dark:drop-shadow-[4px_4px_0px_#fff]"
                            >
                                İNDEKS<span className="text-[#00F050]">.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="mt-8 text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-600 dark:text-zinc-400 border-l-[6px] border-[#FFC800] pl-5 max-w-2xl"
                            >
                                Kozmosun ve teknolojinin sınırlarında en güncel <span className="text-black dark:text-white">bilimsel makaleler</span>. Özgün, premium ve tavizsiz tasarım.
                            </motion.p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {['latest', 'popular'].map((s) => (
                                <Link
                                    key={s}
                                    href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                    className={cn(
                                        "px-8 py-3.5 font-black uppercase text-sm border-[3px] border-black dark:border-white transition-all duration-200",
                                        sortParam === s
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-none translate-x-[2px] translate-y-[2px]"
                                            : "bg-white dark:bg-[#18181b] text-black dark:text-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    )}
                                >
                                    {s === 'latest' ? 'En Yeni' : 'Popüler'}
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="flex gap-4 overflow-x-auto no-scrollbar mb-16 pb-4 snap-x">
                    <Link
                        href="/makale"
                        className={cn(
                            "snap-start whitespace-nowrap px-8 py-3 font-black uppercase text-sm border-[3px] border-black dark:border-white transition-all duration-200",
                            !activeCategory
                                ? "bg-[#FF0080] text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                : "bg-white dark:bg-[#18181b] text-black dark:text-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        )}
                    >
                        TÜMÜ
                    </Link>
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat}
                            href={`/makale?category=${cat}`}
                            className={cn(
                                "snap-start whitespace-nowrap px-8 py-3 font-black uppercase text-sm border-[3px] border-black dark:border-white transition-all duration-200",
                                activeCategory === cat
                                    ? "text-black shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-white dark:bg-[#18181b] text-black dark:text-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                            )}
                            style={activeCategory === cat ? { backgroundColor: COLORS[idx % COLORS.length] } : {}}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                {ARTICLES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 auto-rows-[400px]">
                        {ARTICLES.map((article, i) => {
                            const isHero = i === 0;
                            const isWide = i % 5 === 4 && i !== 0;
                            const currentAccent = COLORS[i % COLORS.length];

                            return (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    className={cn(
                                        "group relative flex overflow-hidden border-[3px] border-black dark:border-white bg-white dark:bg-[#09090b] transition-transform duration-300",
                                        "hover:-translate-y-1 hover:translate-x-1",
                                        isHero ? "flex-col md:col-span-2 lg:col-span-2 lg:row-span-2 shadow-[6px_6px_0px_#FFC800] dark:shadow-[6px_6px_0px_#FFC800]" :
                                            isWide ? "flex-col md:flex-row md:col-span-2 lg:col-span-2 lg:row-span-1 shadow-[6px_6px_0px_#00F050] dark:shadow-[6px_6px_0px_#00F050]" :
                                                "flex-col col-span-1 lg:row-span-1 shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]",
                                        "hover:shadow-[8px_8px_0px_#23A9FA] dark:hover:shadow-[8px_8px_0px_#23A9FA]"
                                    )}
                                >
                                    <div className={cn(
                                        "relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-black dark:border-white",
                                        isHero ? "absolute inset-0 w-full h-full" :
                                            isWide ? "w-full md:w-1/2 border-b-[3px] md:border-b-0 md:border-r-[3px]" :
                                                "w-full h-1/2 border-b-[3px]"
                                    )}>
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {isHero && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                                        )}

                                        <div className="absolute top-4 left-4 z-20">
                                            <span
                                                className="text-black border-[3px] border-black px-4 py-1.5 font-black text-xs uppercase shadow-[4px_4px_0px_#000]"
                                                style={{ backgroundColor: currentAccent }}
                                            >
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "relative flex flex-col z-10",
                                        isHero ? "mt-auto p-8 md:p-12 w-full max-w-2xl" :
                                            isWide ? "w-full md:w-1/2 p-6 md:p-8 flex items-start justify-center" :
                                                "w-full h-1/2 p-6"
                                    )}>
                                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest mb-4 opacity-90 drop-shadow-sm">
                                            <span className={isHero ? "text-white" : "text-zinc-500 dark:text-zinc-400"}>
                                                {formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE
                                            </span>
                                            <span className={isHero ? "text-[#FFC800]" : "text-[#FF0080]"}>•</span>
                                            <span className={cn("truncate", isHero ? "text-white" : "text-black dark:text-white")}>
                                                {article.author}
                                            </span>
                                        </div>

                                        <h3 className={cn(
                                            "font-heading font-black uppercase tracking-tighter leading-[0.95]",
                                            isHero ? "text-5xl md:text-6xl lg:text-7xl text-white mb-6" :
                                                isWide ? "text-3xl sm:text-4xl text-black dark:text-white mb-4 line-clamp-3" :
                                                    "text-2xl text-black dark:text-white mb-4 line-clamp-3"
                                        )}>
                                            {article.title}
                                        </h3>

                                        {(!isHero || isWide) && <div className="mt-auto"></div>}

                                        {!isHero && (
                                            <div className="pt-2 flex items-center justify-between">
                                                <span className="text-sm font-black uppercase flex items-center gap-2 text-black dark:text-white group-hover:text-[#23A9FA] transition-colors">
                                                    İncele <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {isHero && (
                                        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-[#00F050] text-black p-5 rounded-full border-[3px] border-black shadow-[4px_4px_0px_#000]">
                                                <ArrowUpRight className="w-8 h-8 stroke-[4px]" />
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border-[4px] border-black dark:border-white bg-[#FFC800] text-black shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff]">
                        <Cpu className="w-24 h-24 mb-6 opacity-80" />
                        <h3 className="font-heading font-black text-6xl uppercase mb-4 tracking-tighter">SİNYAL YOK</h3>
                        <p className="font-bold text-xl max-w-md mx-auto mb-10">
                            Bu sektörde henüz keşfedilmiş bir makale bulunmuyor. Farklı bir filtre seçerek taramaya devam edin.
                        </p>
                        <Link href="/makale" className="bg-black text-white font-black uppercase text-xl px-12 py-5 border-[4px] border-black shadow-[8px_8px_0px_#FFF] hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:translate-x-[8px] active:translate-y-[8px] active:shadow-none">
                            TÜMÜNE DÖN
                        </Link>
                    </div>
                )}
                <div className="mt-20 sm:mt-24 pt-16">
                    <GoldenTicketCTA />
                </div>
            </main>
        </div>
    );
}
