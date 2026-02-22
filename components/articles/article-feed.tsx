"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { useCallback, useEffect, useRef, useState } from "react";
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
    { label: 'Fizik', icon: Atom, color: '#FACC15' },
    { label: 'Uzay', icon: Telescope, color: '#FF0080' },
    { label: 'Teknoloji', icon: Cpu, color: '#23A9FA' },
    { label: 'Biyoloji', icon: Dna, color: '#F472B6' },
    { label: 'Kimya', icon: FlaskConical, color: '#4ADE80' },
    { label: 'Genel', icon: Globe, color: '#71717a' },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

/* ─────────────────────────────────────────
   FEATURED CAROUSEL — swipe through top articles
   like flipping pages of a physical magazine
───────────────────────────────────────── */
function FeaturedCarousel({ articles }: { articles: any[] }) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const touchStart = useRef(0);
    const max = Math.min(articles.length, 5);

    const go = useCallback((dir: number) => {
        setDirection(dir);
        setCurrent(prev => {
            const next = prev + dir;
            if (next < 0) return max - 1;
            if (next >= max) return 0;
            return next;
        });
    }, [max]);

    // auto-advance
    useEffect(() => {
        const t = setInterval(() => go(1), 6000);
        return () => clearInterval(t);
    }, [go]);

    const a = articles[current];
    if (!a) return null;

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
    };

    return (
        <div
            className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] rounded-2xl sm:rounded-3xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_#000] bg-zinc-900 select-none"
            onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
                const diff = e.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(diff) > 50) go(diff < 0 ? 1 : -1);
            }}
        >
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src={a.cover_url || a.image_url || "/images/placeholder-hero.jpg"}
                        alt={a.title} fill
                        className="object-cover"
                        priority={current === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <Link href={`/blog/${a.slug}`} className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 md:p-10 group">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[.2em] text-yellow-400/90 mb-2">{a.category}</span>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-[1.05] tracking-tight max-w-2xl mb-2 sm:mb-3 group-hover:text-yellow-400 transition-colors">
                            {a.title}
                        </h2>
                        <p className="hidden sm:block text-zinc-300/80 text-sm max-w-lg line-clamp-2 leading-relaxed mb-3">
                            {a.excerpt || a.summary || (a.content?.replace(/<[^>]*>/g, "").slice(0, 140) + "…") || ""}
                        </p>
                        <div className="flex items-center gap-2">
                            {a.author?.avatar_url && (
                                <Image src={a.author.avatar_url} alt="" width={24} height={24}
                                    className="rounded-full border border-zinc-600 w-6 h-6 object-cover" />
                            )}
                            <span className="text-zinc-300 text-[11px] font-medium">{a.author?.full_name}</span>
                            <span className="text-zinc-600 text-[10px]">·</span>
                            <span className="text-zinc-500 text-[10px]">{ago(a.created_at)}</span>
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* nav arrows */}
            <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {Array.from({ length: max }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === current ? "w-6 bg-yellow-400" : "w-1.5 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN FEED
───────────────────────────────────────── */
export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const isHome = !activeCategory && sortParam === "latest";
    const featured = isHome ? articles.slice(0, 5) : [];
    const grid = isHome ? articles.slice(5) : articles;

    return (
        <main className="min-h-screen bg-[#1c1c1f]">

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-14 sm:pb-20">

                {/* ── HEADER + FILTERS ── */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-4">
                        {activeCategory ? activeCategory : "Makaleler"}
                    </h1>

                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        <Link
                            href="/makale"
                            className={cn(
                                "shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border-2 transition-all",
                                !activeCategory
                                    ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Tümü
                        </Link>
                        {TOPICS.map(t => (
                            <Link
                                key={t.label}
                                href={`/makale?category=${t.label}`}
                                className={cn(
                                    "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border-2 transition-all",
                                    activeCategory === t.label
                                        ? "text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                        : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                                )}
                                style={activeCategory === t.label ? { backgroundColor: t.color } : {}}
                            >
                                <t.icon className="w-3 h-3" />
                                {t.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── FEATURED CAROUSEL ── */}
                {isHome && featured.length > 0 && (
                    <div className="mb-8 sm:mb-12">
                        <FeaturedCarousel articles={featured} />
                    </div>
                )}

                {/* ── NEWS TICKER ── */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-8 sm:mb-12 rounded-xl border border-zinc-800 overflow-hidden">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ── GRID ── */}
                {grid.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {grid.map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20px" }}
                                transition={{ delay: Math.min(i * 0.03, 0.2), duration: 0.3 }}
                                className={cn(
                                    i === 0 && !activeCategory ? "sm:col-span-2" : ""
                                )}
                            >
                                <NeoArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/30">
                        <p className="text-zinc-500 font-medium mb-3">Bu kategoride henüz yazı yok.</p>
                        <Link href="/makale" className="text-sm text-yellow-400 hover:underline font-semibold">
                            Tüm yazılara dön →
                        </Link>
                    </div>
                )}

                {/* ── CTA ── */}
                <div className="mt-12 sm:mt-16">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
