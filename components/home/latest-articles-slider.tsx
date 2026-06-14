"use client";

import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ChevronRight, Clock } from "lucide-react";

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
    if (!articles || articles.length === 0) return null;

    return (
        <section className="w-full pt-1 pb-1 sm:pb-2 mb-0">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-5 bg-yellow-400 rounded-sm border border-yellow-500 shrink-0" />
                    Popüler Yazılar
                </h2>
                <Link href="/makale" className="min-h-11 px-2 -mr-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1 group text-muted-foreground hover:text-yellow-500 transition-colors rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]">
                    Tümünü Gör
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll */}
            <div className="flex touch-pan-x overscroll-x-contain overflow-x-auto gap-3 pb-3 scrollbar-hide snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0" role="region" aria-label="Popüler yazılar karusel">
                {articles.slice(0, 6).map((article, index) => {
                    const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
                    const isAboveFold = index < 2;

                    return (
                        <article
                            key={article.id}
                            className="flex-shrink-0 w-[76vw] min-w-[248px] max-w-[300px] sm:w-[300px] snap-start"
                        >
                            <Link href={`/makale/${article.slug}`} prefetch={false} className="block rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                                <div className="group relative bg-zinc-950 border-2 border-zinc-800 hover:border-yellow-400/60 shadow-[3px_3px_0px_0px_rgba(39,39,42,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.4)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 rounded-[8px] overflow-hidden aspect-[16/10] flex flex-col">
                                    {/* Image Container */}
                                    <div className="absolute inset-0 z-0">
                                        {article.image ? (
                                            <OptimizedImage
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 76vw, 300px"
                                                className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                                                priority={isAboveFold}
                                                loading={isAboveFold ? "eager" : "lazy"}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                <span className="text-zinc-700 font-black uppercase tracking-tighter text-xs">Görsel Yok</span>
                                            </div>
                                        )}
                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 p-3.5 sm:p-4 flex flex-col justify-end">
                                        {/* Category Badge + New Indicator */}
                                        <div className="flex items-center gap-2 mb-1.5 min-w-0">
                                            <span className="max-w-[72%] truncate px-2 py-1 bg-yellow-400 text-zinc-900 text-[8px] font-black uppercase tracking-wider rounded-[6px] border border-yellow-500/50 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
                                                {article.category}
                                            </span>
                                            {isNew && (
                                                <span className="flex items-center gap-1">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                                    <span className="text-[7px] font-bold text-emerald-400 uppercase tracking-wider">Yeni</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[15px] sm:text-base font-black text-white leading-snug mb-1.5 group-hover:text-yellow-300 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        {/* Reading Time */}
                                        <div className="flex items-center gap-1.5 text-white/40 text-[8px] font-medium tracking-wide pt-1.5 border-t border-white/10">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>{article.reading_time || 5} dk okuma</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
