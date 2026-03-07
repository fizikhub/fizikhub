"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap, LayoutList, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleFeedProps {
    articles: {
        id: string;
        title: string;
        excerpt?: string;
        summary?: string;
        image_url?: string;
        cover_url?: string;
        category?: string;
        created_at: string;
        slug: string;
        content?: string;
        author?: { full_name?: string };
        profiles?: { full_name?: string };
        [key: string]: unknown;
    }[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TABS = [
    { id: 'TÜMÜ', icon: LayoutList, color: 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black' },
    { id: 'Uzay', icon: Telescope, color: 'bg-[#FF0080] text-white' },
    { id: 'Teknoloji', icon: Cpu, color: 'bg-[#23A9FA] text-white' },
    { id: 'Biyoloji', icon: Dna, color: 'bg-[#00F050] text-black' },
    { id: 'Fizik', icon: Zap, color: 'bg-[#FFC800] text-black' },
    { id: 'Kimya', icon: FlaskConical, color: 'bg-[#FF90E8] text-black' },
    { id: 'Genel', icon: Globe, color: 'bg-[#a1a1aa] text-black' },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    const ARTICLES = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.summary || a.excerpt,
        image: a.cover_url || a.image_url || "/images/placeholder-article.webp",
        category: a.category || "Genel",
        date: a.created_at,
        author: a.author?.full_name || a.profiles?.full_name || "FizikHub Editör",
        slug: a.slug,
        readingTime: Math.max(1, Math.ceil((a.content?.split(/\s+/).length || 500) / 200))
    }));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* ── HEADER ── */}
                <header className="mb-10 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-white/10 pb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        >
                            Bilim <span className="text-zinc-400 dark:text-zinc-600">&</span> Makale
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-3 text-sm sm:text-base font-medium tracking-tight text-zinc-500 max-w-xl"
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
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all border",
                                    sortParam === s
                                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md"
                                        : "bg-transparent text-zinc-500 border-zinc-200 dark:border-white/10 hover:text-foreground hover:border-zinc-300 dark:hover:border-white/30"
                                )}
                            >
                                {s === 'latest' ? <Clock className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                                {s === 'latest' ? 'En Yeni' : 'Popüler'}
                            </Link>
                        ))}
                    </div>
                </header>

                {/* ── SLEEK FILTER TABS ── */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                                    "relative flex items-center gap-2 px-5 py-2.5 rounded-full outline-none font-bold text-xs transition-all whitespace-nowrap flex-shrink-0 group uppercase tracking-wider",
                                    isActive
                                        ? `text-white dark:text-black`
                                        : "bg-zinc-100 dark:bg-zinc-900 border border-transparent text-zinc-500 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabMakale"
                                        className={cn("absolute inset-0 rounded-full z-0", tab.color.split(' ').filter(c => c.startsWith('bg')).join(' '))}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={cn("relative z-10 flex items-center gap-2",
                                    isActive ? (tab.color.includes('text-black') ? "text-black" : "text-white") : ""
                                )}>
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{tab.id}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* ── PREMIUM CARDS GRID ── */}
                {ARTICLES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ARTICLES.map((article, index) => {
                            const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;
                            // Only feature the first card if we are not filtering by category specifically (or just always feature it for flair)
                            const isFeatured = index === 0 && !activeCategory;

                            return (
                                <Link
                                    href={`/blog/${article.slug}`}
                                    key={article.id}
                                    className={cn(
                                        "group flex",
                                        isFeatured ? "md:col-span-2 lg:col-span-2 xl:col-span-2 md:row-span-2" : "col-span-1"
                                    )}
                                >
                                    <motion.article
                                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: (index % 10) * 0.05, duration: 0.4 }}
                                        className={cn(
                                            "relative w-full rounded-3xl overflow-hidden flex flex-col border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950/50 hover:dark:bg-zinc-900 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] transition-all duration-500",
                                            isFeatured ? "flex-col" : "flex-col"
                                        )}
                                    >
                                        {/* Image Container */}
                                        <div className={cn(
                                            "relative z-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900",
                                            isFeatured ? "aspect-[16/10] md:aspect-[21/9] w-full" : "aspect-[16/10] w-full"
                                        )}>
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />
                                            {/* Subtle Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                                            {/* Category & New Badges */}
                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                                <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                                                    {article.category}
                                                </span>
                                                {isNew && (
                                                    <span className="flex items-center gap-1.5 bg-[#00F050]/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#00F050]/30 text-[#00F050]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#00F050] animate-pulse shadow-[0_0_8px_rgba(0,240,80,0.8)]" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">YENİ</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Oku Button Overlay (Hover) centered on image */}
                                            <div className={cn(
                                                "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20",
                                                isFeatured ? "hidden md:flex" : ""
                                            )}>
                                                <div className="flex items-center gap-2 bg-white/95 dark:bg-black/90 text-black dark:text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl border border-black/10 dark:border-white/10">
                                                    Hemen Oku <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>

                                            {/* Featured Desktop Content Overlay (instead of standard layout) */}
                                            {isFeatured && (
                                                <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-8 flex-col justify-end z-20">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-3 drop-shadow-md">
                                                        <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-400" />
                                                        <span className="truncate max-w-[150px]">{article.author}</span>
                                                    </div>
                                                    <h3 className="font-extrabold text-white text-3xl lg:text-4xl leading-tight mb-4 group-hover:text-zinc-200 transition-colors drop-shadow-lg max-w-3xl">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-zinc-300 text-sm sm:text-base line-clamp-2 max-w-2xl drop-shadow-md font-medium">
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area - Hidden on Desktop for Featured */}
                                        <div className={cn(
                                            "flex flex-col flex-grow relative z-10 p-5 sm:p-6",
                                            isFeatured ? "md:hidden" : "" // Hide on desktop since it's overlayed
                                        )}>
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                                <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                <span className="truncate max-w-[120px]">{article.author}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className={cn(
                                                "font-extrabold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors",
                                                "text-lg sm:text-xl leading-snug line-clamp-2"
                                            )}>
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className={cn(
                                                "text-zinc-500 dark:text-zinc-400 leading-relaxed mt-auto font-medium",
                                                "text-xs sm:text-sm line-clamp-2"
                                            )}>
                                                {article.excerpt}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-100 dark:border-white/5">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{article.readingTime} dk okuma</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                                    <Flame className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border border-zinc-200 dark:border-white/10 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-5 border border-zinc-200 dark:border-white/10 shadow-sm">
                            <Zap className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-zinc-900 dark:text-zinc-100 font-extrabold text-xl mb-2 uppercase tracking-tight">İçerik Bulunamadı</p>
                        <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed font-medium">Bu kategori için henüz veri işlenmemiş.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
