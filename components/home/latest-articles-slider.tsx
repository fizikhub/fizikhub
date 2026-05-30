"use client";

import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ChevronRight, Clock, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Article {
    id: string;
    title: string;
    image: string | null;
    slug: string;
    category: string;
    author_name: string;
    created_at: string;
    reading_time?: number;
}

interface LatestArticlesSliderProps {
    articles: Article[];
}

export function LatestArticlesSlider({ articles }: LatestArticlesSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll, { passive: true });
        
        // Timeout to ensure content has rendered and layout settled
        const timer = setTimeout(checkScroll, 100);
        
        window.addEventListener("resize", checkScroll, { passive: true });
        
        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
            clearTimeout(timer);
        };
    }, [articles]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = window.innerWidth < 640 ? 227 : 287; // width + gap
        el.scrollBy({
            left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
            behavior: "smooth"
        });
    };

    if (!articles || articles.length === 0) return null;

    return (
        <section className="w-full pt-2 pb-1 sm:pb-2 mb-0 mt-2 relative group/slider">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-yellow-400 rounded-sm border border-yellow-500" />
                    Popüler Yazılar
                </h2>
                {/* A11y Fix: Increased touch target for link */}
                <Link href="/makale" className="p-2 -m-2 min-h-[44px] min-w-[44px] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1 group text-muted-foreground hover:text-yellow-500 transition-colors" aria-label="Tüm popüler yazıları gör">
                    Tümünü Gör
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Carousel Container Wrapper for Absolute Arrow Placement */}
            <div className="relative w-full">
                {/* Desktop Navigation Chevrons - Neo Brutalist Style */}
                {canScrollLeft && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px 0px #000" }}
                        onClick={() => scroll("left")}
                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[44px] min-h-[44px] items-center justify-center rounded-none bg-[#FF90E8] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] opacity-0 group-hover/slider:opacity-100 cursor-pointer noise-bg"
                        aria-label="Önceki yazılar"
                    >
                        <ChevronLeft className="w-6 h-6 text-black stroke-[3px]" />
                    </motion.button>
                )}

                {canScrollRight && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px 0px #000" }}
                        onClick={() => scroll("right")}
                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[44px] min-h-[44px] items-center justify-center rounded-none bg-[#FF90E8] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] opacity-0 group-hover/slider:opacity-100 cursor-pointer noise-bg"
                        aria-label="Sonraki yazılar"
                    >
                        <ChevronRight className="w-6 h-6 text-black stroke-[3px]" />
                    </motion.button>
                )}

                {/* Horizontal Scroll */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0 scroll-smooth" 
                    role="region" 
                    aria-label="Popüler yazılar karusel"
                >
                    {articles.slice(0, 6).map((article, index) => {
                        const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
                        const isAboveFold = index < 2;

                        return (
                            <motion.article
                                key={article.id}
                                className="flex-shrink-0 w-[215px] sm:w-[275px] snap-start"
                                whileHover="hover"
                                whileTap="tap"
                                variants={{
                                    hover: { y: -4, x: -4 },
                                    tap: { scale: 0.98, y: 0, x: 0 }
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <Link href={`/makale/${article.slug}`} prefetch={false}>
                                    <motion.div 
                                        variants={{
                                            hover: { boxShadow: "8px 8px 0px 0px #EAB308" },
                                            tap: { boxShadow: "0px 0px 0px 0px #000" }
                                        }}
                                        className="group relative bg-zinc-950 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-none overflow-hidden aspect-[16/10] flex flex-col will-change-transform noise-bg"
                                    >
                                        {/* Image Container */}
                                        <div className="absolute inset-0 z-0">
                                            {article.image ? (
                                                <OptimizedImage
                                                    src={article.image}
                                                    alt={article.title}
                                                    fill
                                                    sizes="(max-width: 640px) 215px, 275px"
                                                    className="object-cover group-hover:scale-[1.08] transition-transform duration-500 ease-out will-change-transform"
                                                    priority={isAboveFold}
                                                    loading={isAboveFold ? "eager" : "lazy"}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                    <span className="text-zinc-700 font-black uppercase tracking-tighter text-xs">Görsel Yok</span>
                                                </div>
                                            )}
                                            {/* Premium Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 z-10 p-3.5 sm:p-4 flex flex-col justify-end">
                                            {/* Category Badge + New Indicator */}
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 bg-[#FFC700] text-black text-[9px] font-black uppercase tracking-widest rounded-none border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                                                    {article.category}
                                                </span>
                                                {isNew && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-none bg-[#B8FF01] animate-pulse shadow-[2px_2px_0px_0px_#000]" />
                                                        <span className="text-[9px] font-black text-[#B8FF01] uppercase tracking-wider">Yeni</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-[13px] sm:text-sm font-bold text-white leading-snug mb-1.5 group-hover:text-yellow-300 transition-colors line-clamp-2 drop-shadow-md">
                                                {article.title}
                                            </h3>

                                            {/* Reading Time */}
                                            <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-bold tracking-wide pt-1.5 border-t-2 border-white/20">
                                                <Clock className="w-2.5 h-2.5" />
                                                <span>{article.reading_time || 5} dk okuma</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
