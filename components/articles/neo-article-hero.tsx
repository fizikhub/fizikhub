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
        <div className="w-full mb-8 sm:mb-16 relative overflow-hidden">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="container max-w-4xl mx-auto px-4 pt-6 sm:pt-12">

                {/* 1. TOP BAR: Back & Category */}
                <div className="flex items-center justify-between mb-6 sm:mb-10">
                    <Link prefetch={false} href="/makale" className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-black uppercase tracking-widest text-foreground hover:-translate-y-1 transition-transform active:translate-y-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-[2.5px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] group-hover:shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#FFC800] group-hover:text-black flex items-center justify-center transition-all">
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                        </div>
                        <span className="hidden sm:inline group-hover:text-[#FFC800] transition-colors">Arşive Dön</span>
                    </Link>

                    {article.category && (
                        <div className="px-3 py-1 sm:px-4 sm:py-1.5 bg-[#23A9FA] border-[2.5px] border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                            <span className="text-[10px] sm:text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
                                <Tag className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
                                {article.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. HERO IMAGE — Neo Brutalist Frame */}
                {(article.cover_url || (article as { image_url?: string }).image_url) && (
                    <div className="relative w-full aspect-[16/9] rounded-lg sm:rounded-2xl border-[3px] sm:border-4 border-black dark:border-zinc-700 overflow-hidden shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] sm:dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] bg-zinc-100 group mb-6 sm:mb-10">
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

                {/* 3. TITLE — Massive Neo Brutalist */}
                <div className="mb-6 sm:mb-10 relative z-10">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase mb-5 sm:mb-8 max-w-3xl selection:bg-[#FFC800] selection:text-black">
                        {article.title}
                    </h1>

                    {/* 4. META BAR — Neo Card */}
                    <div className="flex flex-col sm:flex-row sm:inline-flex sm:flex-wrap sm:items-center gap-3 sm:gap-5 bg-white dark:bg-[#27272a] border-[3px] border-black dark:border-zinc-700 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        {/* Author */}
                        <div className="flex items-center gap-3 pb-3 sm:pb-0 sm:pr-5 border-b-[2px] sm:border-b-0 sm:border-r-2 border-dashed border-black/15 dark:border-white/10">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border-[2.5px] border-black dark:border-zinc-600 overflow-hidden shadow-[2px_2px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.1)] bg-zinc-100 flex-shrink-0">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={44}
                                    height={44}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Yazar</span>
                                <span className="text-sm font-black text-foreground leading-none mt-0.5">{authorName}</span>
                            </div>
                        </div>

                        {/* Date & Time row on mobile */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#FFC800] border-[2px] border-black flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px] text-black" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tarih</span>
                                    <span className="text-xs sm:text-sm font-bold text-foreground">{format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-8 bg-black/10 dark:bg-white/10 sm:hidden" />
                            <div className="hidden sm:block w-px h-10 border-r-2 border-dashed border-black/15 dark:border-white/10" />

                            {/* Read Time */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-neo-pink border-[2px] border-black flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px] text-white" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Süre</span>
                                    <span className="text-xs sm:text-sm font-bold text-foreground">{readingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom separator line */}
                <div className="w-full h-0 border-t-[3px] border-dashed border-black/10 dark:border-white/5" />
            </div>
        </div>
    );
}
