"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock } from "lucide-react";
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
    if (!articles || articles.length === 0) return null;

    return (
        <section className="w-full pt-2 pb-1 sm:pb-2 mb-0 mt-2">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-yellow-400 rounded-sm border border-yellow-500" />
                    Son Yazılar
                </h2>
                <Link href="/blog" className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group text-muted-foreground hover:text-yellow-500 transition-colors">
                    Tümünü Gör
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll */}
            <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
                {articles.slice(0, 6).map((article, index) => {
                    const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;

                    return (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="flex-shrink-0 w-[215px] sm:w-[275px] snap-start"
                        >
                            <Link href={`/blog/${article.slug}`}>
                                <div className="group relative bg-zinc-950 border-2 border-zinc-800 hover:border-yellow-400/60 shadow-[3px_3px_0px_0px_rgba(39,39,42,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.4)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300 rounded-2xl overflow-hidden aspect-[16/10] flex flex-col">
                                    {/* Image Container */}
                                    <div className="absolute inset-0 z-0">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 215px, 275px"
                                                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                                                loading={index < 3 ? "eager" : "lazy"}
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
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 bg-yellow-400 text-zinc-900 text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded-md border border-yellow-500/50 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
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
                                        <h3 className="text-[13px] sm:text-sm font-bold text-white leading-snug mb-1.5 group-hover:text-yellow-300 transition-colors line-clamp-2">
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
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
