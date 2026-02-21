"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base sm:text-base font-black uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-yellow-400 border-2 border-black"></span>
                    Son Yazılar
                </h2>
                <Link href="/blog" className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 group hover:text-yellow-600 transition-colors">
                    Tümünü Gör
                    <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
                {articles.slice(0, 6).map((article, index) => {
                    const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;

                    return (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex-shrink-0 w-[220px] sm:w-[260px] snap-start"
                        >
                            <Link href={`/blog/${article.slug}`}>
                                <div className="group relative bg-zinc-950 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300 rounded-[1.5rem] overflow-hidden aspect-[16/10] flex flex-col">
                                    {/* Image Container with Zoom */}
                                    <div className="absolute inset-0 z-0">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 220px, 260px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                loading={index < 3 ? "eager" : "lazy"}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                <span className="text-zinc-700 font-black uppercase tracking-tighter">Görsel Yok</span>
                                            </div>
                                        )}
                                        {/* Premium Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="px-2 py-0.5 bg-yellow-400 border-2 border-black text-[8px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_#000] rounded-md">
                                                {article.category}
                                            </span>
                                            {isNew && (
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse border border-black" title="Yeni İçerik" />
                                            )}
                                        </div>

                                        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tighter leading-[1.15] mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5 text-white/50 text-[8px] font-black uppercase tracking-widest pt-2 border-t border-white/5">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>{article.reading_time || 5} DK OKUMA</span>
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
