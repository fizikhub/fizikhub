"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap, LayoutList, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

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
        id: a.id,
        title: a.title,
        excerpt: a.summary || a.excerpt,
        image: a.cover_url || a.image_url || "/images/placeholder-article.webp",
        category: a.category || "Genel",
        date: a.created_at,
        author: a.author?.full_name || a.profiles?.full_name || "FizikHub Editör",
        slug: a.slug,
        readingTime: a.reading_time || Math.max(3, Math.ceil(((a.summary || a.excerpt || '').split(/\s+/).filter(Boolean).length || 120) / 45))
    }));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* ── NEO-BRUTALIST HEADER ── */}
                <header className="mb-10 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-foreground/10 pb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter"
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
                                    "flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-black text-xs uppercase tracking-wider transition-all duration-200",
                                    sortParam === s
                                        ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                                        : "bg-background text-muted-foreground border-foreground/20 hover:text-foreground hover:border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1"
                                )}
                            >
                                {s === 'latest' ? <Clock className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                                {s === 'latest' ? 'En Yeni' : 'Popüler'}
                            </Link>
                        ))}
                    </div>
                </header>

                {/* ── NEO-BRUTALIST TABS ── */}
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
                                    "relative flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 outline-none font-black text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 group uppercase tracking-wider active:translate-y-0 active:translate-x-0 active:shadow-none",
                                    isActive
                                        ? `${tab.color} border-foreground dark:border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] -translate-y-1 -translate-x-1`
                                        : "bg-card border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-card hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ARTICLES.map((article, index) => {
                            const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;
                            const isFeatured = index === 0 && !activeCategory; // Optional: Keep first item featured
                            const accentColors = ['#FFC800', '#23A9FA', '#FF0080', '#00F050'];
                            const accentColor = accentColors[index % accentColors.length];

                            return (
                                <Link
                                    href={`/makale/${article.slug}`}
                                    key={article.id}
                                    className={cn(
                                        "group flex h-full",
                                        isFeatured ? "md:col-span-2 lg:col-span-2 xl:col-span-2 md:row-span-2" : "col-span-1"
                                    )}
                                >
                                    <motion.article
                                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: (index % 10) * 0.05, duration: 0.3 }}
                                        className={cn(
                                            "relative w-full rounded-xl overflow-hidden flex flex-col border-2 border-foreground/10 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:border-foreground hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-300",
                                            isFeatured ? "flex-col" : "flex-col"
                                        )}
                                    >
                                        {/* Top Accent Line */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-[4px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-20"
                                            style={{ backgroundColor: accentColor }}
                                        />

                                        {/* Image Container */}
                                        <div className={cn(
                                            "relative z-0 overflow-hidden bg-muted border-b-2 border-transparent group-hover:border-foreground/10 transition-colors",
                                            isFeatured ? "aspect-[16/10] md:aspect-[21/9] w-full" : "aspect-[16/10] w-full"
                                        )}>
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                                                className="object-cover transition-all duration-500 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-[1.03]"
                                            />
                                            {/* Harsh Neo Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />

                                            {/* Strict Category Badges */}
                                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                                                <span
                                                    className="px-2 py-1 bg-background text-foreground text-[10px] font-black uppercase tracking-wider border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                                >
                                                    {article.category}
                                                </span>
                                                {isNew && (
                                                    <span className="flex items-center gap-1.5 bg-[#00F050] text-black px-2 py-1 border-2 border-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                                                        <span className="h-2 w-2 rounded-none bg-black animate-pulse" />
                                                        YENİ
                                                    </span>
                                                )}
                                            </div>

                                            {/* Featured Desktop Content Overlay (instead of standard layout) */}
                                            {isFeatured && (
                                                <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-8 flex-col justify-end z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider mb-3">
                                                        <span className="bg-black px-2 py-0.5 border-2 border-black">{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                        <span className="bg-black px-2 py-0.5 border-2 border-black truncate max-w-[150px]">{article.author}</span>
                                                    </div>
                                                    <h3 className="font-black text-white text-3xl lg:text-4xl leading-tight mb-4 max-w-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                                        {article.title}
                                                    </h3>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area - Hidden on Desktop for Featured if hover state desired, otherwise always show */}
                                        <div className={cn(
                                            "flex flex-col flex-grow relative z-10 p-5 bg-card group-hover:bg-accent/50 transition-colors",
                                            isFeatured ? "md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300 md:absolute md:inset-0 md:pt-16 md:bg-black/80 md:backdrop-blur-sm md:text-white" : ""
                                        )}>
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                                <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                <span className="w-1 h-1 bg-foreground/30" />
                                                <span className="truncate max-w-[120px]">{article.author}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className={cn(
                                                "font-black text-foreground mb-3 group-hover:text-foreground/80 transition-colors leading-tight",
                                                isFeatured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl line-clamp-2"
                                            )}>
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className={cn(
                                                "text-muted-foreground leading-relaxed mt-auto font-medium",
                                                isFeatured ? "text-sm sm:text-base line-clamp-3 md:line-clamp-4 md:text-white/80" : "text-xs sm:text-sm line-clamp-2"
                                            )}>
                                                {article.excerpt}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 mt-5 border-t-2 border-foreground/10">
                                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{article.readingTime} dk okuma</span>
                                                </div>
                                                <div className="w-8 h-8 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                                    <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-4 border-foreground/10 rounded-xl bg-card">
                        <div className="w-16 h-16 bg-muted rounded-none flex items-center justify-center mb-5 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <Zap className="w-7 h-7 text-muted-foreground stroke-[3px]" />
                        </div>
                        <p className="text-foreground font-black text-2xl mb-2 uppercase tracking-tight">İçerik Bulunamadı</p>
                        <p className="text-muted-foreground text-sm max-w-[280px] leading-relaxed font-bold">Bu kategori için henüz veri işlenmemiş.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
