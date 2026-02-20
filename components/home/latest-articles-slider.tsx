"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
                {articles.slice(0, 6).map((article, index) => (
                    <article
                        key={article.id}
                        className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start article-slide-item"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <Link href={`/blog/${article.slug}`}>
                            <div className="group relative bg-white dark:bg-zinc-900 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden aspect-[4/3] flex flex-col">
                                {/* Image Background */}
                                <div className="absolute inset-0 z-0">
                                    {article.image ? (
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 640px) 280px, 320px"
                                            className="object-cover"
                                            loading={index < 2 ? "eager" : "lazy"}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                            <span className="text-zinc-400 font-black uppercase tracking-tighter">Görsel Yok</span>
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end">
                                    <div className="mb-2">
                                        <span className="px-2 py-0.5 bg-yellow-400 border border-black text-[9px] font-black uppercase tracking-widest shadow-[1.5px_1.5px_0px_0px_#000]">
                                            {article.category}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tighter leading-tight line-clamp-2 mb-2 drop-shadow-lg">
                                        {article.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-white/80 text-[9px] uppercase font-bold tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <User className="w-2.5 h-2.5" />
                                            <span className="truncate max-w-[70px]">{article.author_name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>{new Date(article.created_at).toLocaleDateString("tr-TR")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
