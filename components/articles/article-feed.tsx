"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, TrendingUp, Clock, SlidersHorizontal, ArrowDownWideNarrow, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom, accent: '#FFC800' },
    { label: 'Uzay', icon: Telescope, accent: '#FF0080' },
    { label: 'Teknoloji', icon: Cpu, accent: '#23A9FA' },
    { label: 'Biyoloji', icon: Dna, accent: '#F472B6' },
    { label: 'Kimya', icon: FlaskConical, accent: '#00F050' },
    { label: 'Genel', icon: Globe, accent: '#a1a1aa' },
];

const SORT_OPTS = [
    { value: 'latest', label: 'En Yeni', icon: Clock },
    { value: 'popular', label: 'Popüler', icon: Flame },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    // featured = first 3 if no filter
    const showFeatured = !activeCategory && sortParam === "latest" && articles.length >= 3;
    const featured = showFeatured ? articles.slice(0, 3) : [];
    const gridArticles = showFeatured ? articles.slice(3) : articles;

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-10">
            <div className="max-w-[1200px] mx-auto px-3 sm:px-6">

                {/* ═══ HEADER ═══ */}
                <div className="mb-6">
                    <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
                        Makaleler
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1 font-bold">
                        {articles.length} yazı yayında
                    </p>
                </div>

                {/* ═══ FILTERS — same style as DarkNeoFeed tabs ═══ */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b-2 border-dashed border-black/20 dark:border-white/10">
                    {/* Category Filters */}
                    <Link
                        href="/makale"
                        className={cn(
                            "relative flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl font-black text-[11px] transition-all whitespace-nowrap flex-shrink-0 active:scale-95 uppercase tracking-wider",
                            !activeCategory
                                ? "bg-[#FFC800] text-black border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                : "bg-white dark:bg-[#27272a] border-black dark:border-white text-zinc-500 hover:text-black dark:hover:text-white hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                        )}
                    >
                        Tümü
                    </Link>
                    {TOPICS.map(t => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "relative flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl font-black text-[11px] transition-all whitespace-nowrap flex-shrink-0 active:scale-95 uppercase tracking-wider",
                                activeCategory === t.label
                                    ? "text-black border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                    : "bg-white dark:bg-[#27272a] border-black dark:border-white text-zinc-500 hover:text-black dark:hover:text-white hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.accent } : {}}
                        >
                            <t.icon className="w-3 h-3 stroke-[2.5px]" />
                            {t.label}
                        </Link>
                    ))}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Sort */}
                    {SORT_OPTS.map(s => (
                        <Link
                            key={s.value}
                            href={`/makale?sort=${s.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                            className={cn(
                                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl font-black text-[11px] transition-all whitespace-nowrap flex-shrink-0 active:scale-95 uppercase tracking-wider",
                                sortParam === s.value
                                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] translate-x-[-1px] translate-y-[-1px]"
                                    : "bg-white dark:bg-[#27272a] border-black dark:border-white text-zinc-500 hover:text-black dark:hover:text-white"
                            )}
                        >
                            <s.icon className="w-3 h-3 stroke-[2.5px]" />
                            {s.label}
                        </Link>
                    ))}
                </div>

                {/* ═══ FEATURED BENTO — 1 big + 2 small ═══ */}
                {showFeatured && (
                    <section className="mb-8 sm:mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                            {/* MAIN — big card */}
                            <Link href={`/blog/${featured[0].slug}`} className="lg:col-span-7 group block">
                                <article className={cn(
                                    "relative overflow-hidden h-full min-h-[280px] sm:min-h-[400px] flex flex-col justify-end",
                                    "border-3 border-black dark:border-white rounded-xl",
                                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                                    "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                                    "hover:translate-x-[2px] hover:translate-y-[2px]",
                                    "transition-all duration-200"
                                )}>
                                    <Image
                                        src={featured[0].cover_url || featured[0].image_url || "/images/placeholder-article.webp"}
                                        alt={featured[0].title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                    {/* Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="inline-block bg-[#FFC800] border-2 border-black text-black px-2.5 py-0.5 font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform">
                                            {featured[0].category || "MAKALE"}
                                        </span>
                                    </div>

                                    <div className="relative z-10 p-4 sm:p-6">
                                        <h2 className="font-heading text-xl sm:text-3xl md:text-4xl font-black text-white leading-[1.05] tracking-tight uppercase mb-2 group-hover:text-[#FFC800] transition-colors">
                                            {featured[0].title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-white/60 text-[11px] font-bold">
                                            {featured[0].author?.avatar_url && (
                                                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30">
                                                    <Image src={featured[0].author.avatar_url} alt="" width={20} height={20} className="object-cover" />
                                                </div>
                                            )}
                                            <span>{featured[0].author?.full_name}</span>
                                            <span>·</span>
                                            <span>{ago(featured[0].created_at)}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* SIDE — 2 stacked */}
                            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                                {featured.slice(1, 3).map((a, i) => (
                                    <Link key={a.id} href={`/blog/${a.slug}`} className="group block">
                                        <article className={cn(
                                            "relative overflow-hidden h-full min-h-[160px] sm:min-h-[190px] flex flex-col justify-end",
                                            "border-3 border-black dark:border-white rounded-xl",
                                            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                                            "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                                            "hover:translate-x-[2px] hover:translate-y-[2px]",
                                            "transition-all duration-200"
                                        )}>
                                            <Image
                                                src={a.cover_url || a.image_url || "/images/placeholder-article.webp"}
                                                alt={a.title} fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            <div className="absolute top-2.5 left-2.5 z-10">
                                                <span className={cn(
                                                    "inline-block border-2 border-black text-black px-2 py-0.5 font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000]",
                                                    i === 0 ? "bg-[#FF0080]" : "bg-[#23A9FA]"
                                                )}>
                                                    {a.category || "MAKALE"}
                                                </span>
                                            </div>

                                            <div className="relative z-10 p-3 sm:p-4">
                                                <h3 className="font-heading text-sm sm:text-lg font-black text-white leading-tight tracking-tight uppercase mb-1 group-hover:text-[#FFC800] transition-colors line-clamp-2">
                                                    {a.title}
                                                </h3>
                                                <span className="text-white/50 text-[10px] font-bold">
                                                    {a.author?.full_name} · {ago(a.created_at)}
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ NEWS TICKER ═══ */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-8 sm:mb-10 border-3 border-black dark:border-white rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ═══ ARTICLE GRID ═══ */}
                <section>
                    {gridArticles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {gridArticles.map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
                                >
                                    <NeoArticleCard article={article} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/20">
                            <p className="text-zinc-300 font-black text-base mb-1">İçerik Bulunamadı</p>
                            <p className="text-zinc-500 text-xs max-w-[250px] leading-relaxed font-bold mb-4">Bu kategoride henüz yazı yayınlanmamış.</p>
                            <Link href="/makale">
                                <span className="px-4 py-2 bg-[#FFC800] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all">
                                    Tümünü Gör
                                </span>
                            </Link>
                        </div>
                    )}
                </section>

                {/* ═══ CTA ═══ */}
                <div className="mt-10 sm:mt-14">
                    <GoldenTicketCTA />
                </div>
            </div>
        </div>
    );
}
