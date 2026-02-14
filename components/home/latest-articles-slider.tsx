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
        <section className="w-full pt-0 pb-6 mb-8 mt-[-10px]">
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-8 bg-yellow-400 border-2 border-black"></span>
                    Son Yazılar
                </h2>
                <Link href="/blog" className="text-xs font-black uppercase tracking-widest flex items-center gap-1 group hover:text-yellow-600 transition-colors">
                    Tümünü Gör
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory px-1">
                {articles.slice(0, 6).map((article, index) => (
                    <div
                        key={article.id}
                        className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start article-slide-item"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <Link href={`/blog/${article.slug}`}>
                            <div className="group relative bg-white dark:bg-zinc-900 border-[3px] border-black shadow-[5px_5px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] hover:scale-[1.02] transition-all duration-300 rounded-3xl overflow-hidden aspect-[4/3]">
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
                                <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end">
                                    <div className="mb-3">
                                        <span className="px-3 py-1 bg-yellow-400 border-[1.5px] border-black text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                                            {article.category}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-tight line-clamp-2 mb-3 drop-shadow-lg">
                                        {article.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-white/70 text-[10px] uppercase font-bold tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span className="truncate max-w-[80px]">{article.author_name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date(article.created_at).toLocaleDateString("tr-TR")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
