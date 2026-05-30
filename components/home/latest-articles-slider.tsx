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
            <div className="flex items-center justify-between mb-3 px-0.5">
                <h2 className="text-[15px] sm:text-base font-black uppercase flex items-center gap-2 text-zinc-50">
                    <span className="w-1.5 h-5 bg-[#EAB308] rounded-[3px] border border-black shadow-[1px_1px_0_0_#000]" />
                    Popüler Yazılar
                </h2>
                <Link href="/makale" className="text-[10px] font-black uppercase flex items-center gap-1.5 group text-zinc-400 hover:text-[#EAB308] transition-colors">
                    Tümünü Gör
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll */}
            <div className="relative -mx-3 sm:mx-0">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-background to-transparent sm:hidden"
                />
                <div className="flex overflow-x-auto gap-3 pb-3 px-3 sm:px-0 scrollbar-hide snap-x snap-mandatory scroll-px-3" role="region" aria-label="Popüler yazılar karusel">
                {articles.slice(0, 6).map((article, index) => {
                    const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
                    const isAboveFold = index < 2;

                    return (
                        <article
                            key={article.id}
                            className="flex-shrink-0 w-[228px] min-[390px]:w-[246px] sm:w-[292px] snap-start"
                        >
                            <Link href={`/makale/${article.slug}`} prefetch={false}>
                                <div className="group relative bg-[#101014] border-2 border-black hover:border-[#EAB308] shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_rgba(234,179,8,0.35)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 rounded-[8px] overflow-hidden aspect-[16/10] flex flex-col">
                                    {/* Image Container */}
                                    <div className="absolute inset-0 z-0">
                                        {article.image ? (
                                            <OptimizedImage
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 246px, 292px"
                                                className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                                                priority={isAboveFold}
                                                loading={isAboveFold ? "eager" : "lazy"}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                <span className="text-zinc-700 font-black uppercase text-xs">Görsel Yok</span>
                                            </div>
                                        )}
                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 opacity-85 group-hover:opacity-95 transition-opacity" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 p-3.5 sm:p-4 flex flex-col justify-end">
                                        {/* Category Badge + New Indicator */}
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 bg-[#EAB308] text-zinc-950 text-[8px] font-black uppercase rounded-[4px] border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.45)]">
                                                {article.category}
                                            </span>
                                            {isNew && (
                                                <span className="flex items-center gap-1">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                                    <span className="text-[8px] font-black text-emerald-300 uppercase">Yeni</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[13px] sm:text-[15px] font-black text-white leading-snug mb-1.5 group-hover:text-[#EAB308] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        {/* Reading Time */}
                                        <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-bold pt-1.5 border-t border-white/10">
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
            </div>
        </section>
    );
}
