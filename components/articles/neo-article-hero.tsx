"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

interface NeoArticleHeroProps {
    article: Article;
    readingTime: string;
}

export function NeoArticleHero({ article, readingTime }: NeoArticleHeroProps) {
    const authorName = article.author?.full_name || article.author?.username || "FizikHub Editörü";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    return (
        <div className="w-full mb-0 relative overflow-hidden">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="container max-w-4xl mx-auto px-4 pt-4 sm:pt-10">

                {/* 1. TOP BAR: Back Button Only */}
                <div className="flex items-center justify-between mb-4 sm:mb-8">
                    <Link prefetch={false} href="/makale" className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-black uppercase tracking-normal text-foreground hover:-translate-y-1 transition-transform active:translate-y-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-[2.5px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] group-hover:shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#FFC800] group-hover:text-black flex items-center justify-center transition-all">
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                        </div>
                        <span className="hidden sm:inline group-hover:text-[#FFC800] transition-colors">Geri Dön</span>
                    </Link>
                </div>

                {/* 2. HERO IMAGE — Neo Brutalist Frame */}
                {(article.cover_url || (article as { image_url?: string }).image_url) && (
                    <div className="relative w-[calc(100vw-2rem)] sm:w-full max-w-full aspect-[16/9] rounded-lg sm:rounded-2xl border-[3px] sm:border-4 border-black dark:border-zinc-700 overflow-hidden shadow-[3px_3px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] sm:dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] bg-zinc-100 group mb-5 sm:mb-8">
                        <Image
                            src={article.cover_url || (article as { image_url?: string }).image_url || ''}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 1200px"
                        />
                    </div>
                )}

                {/* 3. CATEGORY + TITLE + META — Clean Premium Layout */}
                <div className="mb-5 sm:mb-8 relative z-10">

                    {/* Category Badge — Neo Brutalist */}
                    {article.category && (
                        <div className="mb-3 sm:mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 bg-[#FFC800] text-black text-[10px] sm:text-xs font-black uppercase tracking-normal border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-default select-none">
                                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3px]" />
                                {article.category}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="w-[calc(100vw-2rem)] max-w-full sm:w-auto sm:max-w-3xl text-[2rem] sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.08] tracking-normal break-words mb-4 sm:mb-6 selection:bg-[#FFC800] selection:text-black">
                        {article.title}
                    </h1>

                    {/* 4. META BAR — Compact Inline Layout */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-4">
                        {/* Author */}
                        <Link
                            prefetch={false}
                            href={`/kullanici/${article.author?.username || 'anonim'}`}
                            className="flex items-center gap-2.5 group/author"
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[2.5px] border-black dark:border-zinc-600 overflow-hidden shadow-[2px_2px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.1)] bg-zinc-100 flex-shrink-0 group-hover/author:shadow-[3px_3px_0px_0px_#FFC800] transition-shadow">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <span className="text-sm sm:text-base font-black text-foreground group-hover/author:text-[#FFC800] transition-colors">{authorName}</span>
                        </Link>

                        {/* Dot */}
                        <span className="hidden text-zinc-400 dark:text-zinc-600 text-lg font-black select-none sm:inline">·</span>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5px]" />
                            <span className="font-bold">{format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}</span>
                        </div>

                        {/* Dot */}
                        <span className="text-zinc-400 dark:text-zinc-600 text-lg font-black select-none">·</span>

                        {/* Read Time */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5px]" />
                            <span className="font-bold">{readingTime}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom separator line */}
                <div className="w-full h-0 border-t-[3px] border-dashed border-black/10 dark:border-white/5" />
            </div>
        </div>
    );
}
