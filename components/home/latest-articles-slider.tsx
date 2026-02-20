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
}

interface LatestArticlesSliderProps {
    articles: Article[];
}

export function LatestArticlesSlider({ articles }: LatestArticlesSliderProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="w-full pt-2 pb-0 mb-0 mt-2">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg sm:text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-6 bg-yellow-400 border-2 border-black"></span>
                    Son Yazılar
                </h2>
                <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group hover:text-yellow-600 transition-colors">
                    Tümünü Gör
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
                {articles.slice(0, 6).map((article, index) => {
                    const isNew = new Date().getTime() - new Date(article.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;

                    return (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-[260px] sm:w-[320px] snap-start"
                        >
                            <Link href={`/blog/${article.slug}`}>
                                <div className="group relative bg-zinc-950 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300 rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[3/4] flex flex-col">
                                    {/* Image Container with Zoom */}
                                    <div className="absolute inset-0 z-0">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 280px, 320px"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                loading={index < 2 ? "eager" : "lazy"}
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
                                    <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-3 py-1 bg-yellow-400 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] rounded-lg">
                                                {article.category}
                                            </span>
                                            {isNew && (
                                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse border border-black shadow-[0_0_8px_rgba(34,197,94,0.5)]" title="Yeni İçerik" />
                                            )}
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-[1.1] mb-4 group-hover:text-yellow-400 transition-colors line-clamp-3">
                                            {article.title}
                                        </h3>

                                        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black flex items-center justify-center text-[10px] text-black font-bold">
                                                        {article.author_name.charAt(0)}
                                                    </div>
                                                    <span className="text-white/70 text-[10px] uppercase font-black tracking-widest truncate max-w-[100px]">
                                                        {article.author_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(article.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            </div>

                                            {/* Expand Button Visual */}
                                            <div className="flex items-center gap-2 text-yellow-400 font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                DEVAMINI OKU <ArrowRight className="w-3 h-3" />
                                            </div>
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
