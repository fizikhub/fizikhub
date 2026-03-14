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
        <div className="w-full mb-8 sm:mb-16 relative">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:opacity-[0.03]" />
            <div className="absolute inset-0 -z-20 bg-grid-black/[0.04] dark:bg-grid-white/[0.02] mask-gradient-to-b" />

            <div className="container max-w-4xl mx-auto px-4 pt-8 sm:pt-12">
                {/* 1. TOP BAR: Back & Category */}
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <Link prefetch={false} href="/makale" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground hover:-translate-y-1 transition-transform active:translate-y-0">
                        <div className="w-10 h-10 rounded-xl border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[4px_4px_0px_0px_#000] group-hover:bg-[#FFC800] group-hover:text-black flex items-center justify-center transition-all">
                            <ArrowLeft className="w-5 h-5 stroke-[3px]" />
                        </div>
                        <span className="group-hover:text-[#FFC800] transition-colors">Arşive Dön</span>
                    </Link>

                    {article.category && (
                        <div className="px-4 py-1.5 bg-[#23A9FA] dark:bg-[#1a8cd2] border-2 border-black dark:border-black shadow-[3px_3px_0px_0px_#000] transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                            <span className="text-xs sm:text-sm font-black uppercase text-white tracking-widest flex items-center gap-1.5">
                                <Tag className="w-4 h-4 stroke-[3px]" />
                                {article.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. TITLE AREA */}
                <div className="mb-10 sm:mb-14 text-left relative z-10">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tighter uppercase mb-6 sm:mb-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] max-w-3xl selection:bg-[#FFC800] selection:text-black">
                        {article.title}
                    </h1>

                    {/* Meta Bar - Neo Card Component */}
                    <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 p-3 sm:p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]">
                        {/* Author */}
                        <div className="flex items-center gap-3 pr-4 sm:pr-6 border-r-2 border-dashed border-black/20 dark:border-white/10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000] bg-zinc-100 flex-shrink-0">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] sm:text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Yazar</span>
                                <span className="text-sm sm:text-base font-black text-foreground leading-none mt-0.5 hover:text-[#FFC800] cursor-pointer transition-colors">{authorName}</span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 pr-4 sm:pr-6 border-r-2 border-dashed border-black/20 dark:border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-[#FFBD2E] border-2 border-black flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 stroke-[3px] text-black" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Tarih</span>
                                <span className="text-xs sm:text-sm font-bold">{format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}</span>
                            </div>
                        </div>

                        {/* Read Time */}
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <div className="w-8 h-8 rounded-lg bg-neo-pink border-2 border-black flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 stroke-[3px] text-white" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Süre</span>
                                <span className="text-xs sm:text-sm font-bold">{readingTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. HERO IMAGE BOX */}
                {(article.cover_url || (article as { image_url?: string }).image_url) && (
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl border-4 border-black dark:border-zinc-800 overflow-hidden shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] bg-zinc-100 group">
                        <Image
                            src={article.cover_url || (article as { image_url?: string }).image_url || ''}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
