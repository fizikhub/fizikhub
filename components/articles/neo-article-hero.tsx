"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoArticleHeroProps {
    article: Article;
    readingTime: string;
}

export function NeoArticleHero({ article, readingTime }: NeoArticleHeroProps) {
    const authorName = article.author?.full_name || article.author?.username || "FizikHub Editörü";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    return (
        <div className="w-full mb-8 sm:mb-12 relative">

            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 -z-10 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] mask-gradient-to-b" />

            <div className="container max-w-4xl mx-auto px-4 pt-6 sm:pt-10">

                {/* 1. TOP BAR: Back & Category */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <Link href="/makale" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full border-2 border-black/20 group-hover:border-black flex items-center justify-center transition-all bg-white dark:bg-black">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span>Arşive Dön</span>
                    </Link>

                    <div className="px-3 py-1 bg-[#FFC800] border-2 border-black shadow-[2px_2px_0px_0px_#000] transform -rotate-2">
                        <span className="text-xs font-black uppercase text-black tracking-widest flex items-center gap-1">
                            <Tag className="w-3 env:w-3 h-3 env:h-3" />
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. TITLE AREA */}
                <div className="mb-8 sm:mb-10 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-[0.95] tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] mb-6">
                        {article.title}
                    </h1>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 pb-6 border-b-[3px] border-black">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2px] border-black overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] sm:text-xs font-black text-neutral-500 uppercase tracking-widest">YAZAR</span>
                                <span className="text-sm sm:text-base font-bold text-black dark:text-white leading-none">{authorName}</span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-black/20 hidden sm:block" />

                        {/* Date */}
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">TARİH</span>
                                <span className="text-xs sm:text-sm font-bold text-black dark:text-white">
                                    {format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}
                                </span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-black/20 hidden sm:block" />

                        {/* Read Time */}
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">SÜRE</span>
                                <span className="text-xs sm:text-sm font-bold text-black dark:text-white">{readingTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. HERO IMAGE BOX */}
                {(article.cover_url || (article as any).image_url) && (
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl border-[3px] border-black overflow-hidden shadow-[6px_6px_0px_0px_#000] bg-zinc-100 group">
                        <Image
                            src={article.cover_url || (article as any).image_url}
                            alt={article.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
