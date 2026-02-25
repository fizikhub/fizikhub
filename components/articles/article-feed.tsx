"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { ProfileArticleCard } from "@/components/profile/profile-article-card";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom, accent: '#FFC800', rotation: '-2deg' },
    { label: 'Uzay', icon: Telescope, accent: '#FF0080', rotation: '1deg' },
    { label: 'Teknoloji', icon: Cpu, accent: '#23A9FA', rotation: '-1deg' },
    { label: 'Biyoloji', icon: Dna, accent: '#F472B6', rotation: '2deg' },
    { label: 'Kimya', icon: FlaskConical, accent: '#00F050', rotation: '-1.5deg' },
    { label: 'Genel', icon: Globe, accent: '#a1a1aa', rotation: '0deg' },
];

const SORT_OPTS = [
    { value: 'latest', label: 'En Yeni', icon: Clock },
    { value: 'popular', label: 'Popüler', icon: Flame },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

// Custom hook for mouse position
function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);
    return mousePosition;
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    const mousePos = useMousePosition();
    const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

    // Smooth spring configuration for the floating image
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mousePos.x, springConfig);
    const cursorY = useSpring(mousePos.y, springConfig);

    useEffect(() => {
        cursorX.set(mousePos.x);
        cursorY.set(mousePos.y);
    }, [mousePos, cursorX, cursorY]);

    return (
        <div className="min-h-screen pt-20 sm:pt-28 pb-10 overflow-hidden text-black dark:text-white">

            {/* FLOATING IMAGE REVEAL (DESKTOP ONLY) */}
            <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
                <AnimatePresence>
                    {hoveredArticle && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 2 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                x: cursorX,
                                y: cursorY,
                                translateX: "-50%",
                                translateY: "-50%",
                            }}
                            className="absolute w-[260px] h-[180px] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-sm overflow-hidden"
                        >
                            <Image
                                src={hoveredArticle}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* MAGAZINE HEADER (APP-LIKE BRUTALISM) */}
                <header className="mb-8 sm:mb-12 border-b-2 border-black dark:border-white pb-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
                    >
                        <div>
                            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black dark:text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                                MAKALELER<span className="text-[#FF0080]">.</span>
                            </h1>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <p className="max-w-xs text-sm font-bold leading-tight md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#23A9FA] pl-3 md:pl-0 md:pr-3">
                                Bilim, teknoloji ve evrenin sınırlarında dolaşan {articles.length} makale.
                            </p>

                            {/* Sort Options App-like Toggle */}
                            <div className="flex items-center p-1 bg-black/5 dark:bg-white/5 border-2 border-black dark:border-white rounded-full w-fit">
                                {SORT_OPTS.map(s => (
                                    <Link
                                        key={s.value}
                                        href={`/makale?sort=${s.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-[11px] uppercase transition-all",
                                            sortParam === s.value
                                                ? "bg-[#00F050] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                                                : "text-zinc-500 hover:text-black dark:hover:text-white"
                                        )}
                                    >
                                        <s.icon className="w-3.5 h-3.5 stroke-[3px]" />
                                        {s.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* CATEGORIES / FILTER CAROUSEL */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    <Link
                        href="/makale"
                        className={cn(
                            "snap-start relative flex flex-col items-center justify-center min-w-[90px] h-[90px] border-2 rounded-xl font-black transition-all active:scale-95 group",
                            !activeCategory
                                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                                : "bg-white dark:bg-zinc-900 text-black dark:text-white border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"
                        )}
                    >
                        <Globe className={cn("w-6 h-6 mb-1.5 stroke-[2px]", !activeCategory ? "animate-spin-slow" : "group-hover:rotate-12 transition-transform")} />
                        <span className="text-[10px] uppercase tracking-widest">Hepsi</span>
                    </Link>

                    {TOPICS.map((t, i) => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "snap-start relative flex flex-col items-center justify-center min-w-[90px] h-[90px] border-2 border-black dark:border-white rounded-xl font-black transition-all active:scale-95 group",
                                activeCategory === t.label
                                    ? "text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] -translate-y-1"
                                    : "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.accent, transform: `rotate(${t.rotation}) translateY(-4px)` } : {}}
                        >
                            <div className={cn("p-1.5 rounded-full mb-1 border-2 border-black", activeCategory === t.label ? "bg-white" : "bg-black dark:bg-white text-white dark:text-black")} style={activeCategory !== t.label ? { backgroundColor: t.accent } : {}}>
                                <t.icon className={cn("w-4 h-4 stroke-[2.5px]", activeCategory === t.label ? "text-black" : "text-black")} />
                            </div>
                            <span className="text-[9px] uppercase tracking-wider">{t.label}</span>
                        </Link>
                    ))}
                </div>

                {/* NEWS TICKER */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-10 border-2 border-black dark:border-white bg-[#FFC800] text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ARTICLES GRID */}
                <section className="mb-16">
                    <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 mb-6">
                        <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tighter">İndeks</h2>
                        <span className="bg-black dark:bg-white text-white dark:text-black font-black text-base px-3 py-1 rounded-full uppercase">
                            {articles.length} Yazı
                        </span>
                    </div>

                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <ProfileArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-black dark:border-white rounded-2xl bg-black/5 dark:bg-white/5">
                            <Cpu className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="font-heading font-black text-2xl uppercase mb-2">BOŞLUK.</h3>
                            <p className="font-bold text-zinc-500 text-sm max-w-sm">Bu filtrede hiçbir sinyal yakalanamadı. Lütfen rotayı değiştirin.</p>
                            <Link href="/makale" className="mt-6 bg-[#FF0080] text-white font-black uppercase text-sm px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                KAPSAMA ALANINA DÖN
                            </Link>
                        </div>
                    )}
                </section>

                <div className="mt-16 sm:mt-24">
                    <GoldenTicketCTA />
                </div>
            </div>
        </div>
    );
}
