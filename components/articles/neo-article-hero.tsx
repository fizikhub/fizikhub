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
        <div className="w-full mb-8 sm:mb-16 relative">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 -z-10 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] mask-gradient-to-b" />

            <div className="container max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
                {/* 1. TOP BAR: Back & Category */}
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <Link href="/makale" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full border-2 border-black/20 group-hover:border-black flex items-center justify-center transition-all bg-white dark:bg-black">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span className="hidden sm:inline">Makale Arşivi</span>
                    </Link>

                    <div className="px-4 py-1.5 bg-[#FFC800] border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-1 hover:rotate-0 transition-transform">
                        <span className="text-xs font-black uppercase text-black tracking-widest flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 stroke-[3px]" />
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. TITLE & META HUD */}
                <div className="mb-12 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black dark:text-white leading-[0.9] tracking-tighter uppercase drop-shadow-[6px_6px_0px_rgba(0,0,0,0.1)] mb-8 max-w-4xl mx-auto">
                        {article.title}
                    </h1>

                    {/* NEW: CYBER-META DATA STRIP */}
                    <div className="inline-flex flex-col sm:flex-row items-center bg-white dark:bg-neutral-900 border-[2px] border-black shadow-[4px_4px_0px_0px_#000] divide-y sm:divide-y-0 sm:divide-x-2 divide-black">

                        {/* Author */}
                        <div className="flex items-center gap-3 px-6 py-3">
                            <div className="w-10 h-10 rounded-full border-[2px] border-black overflow-hidden shadow-sm bg-neutral-200">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">YAZAR</span>
                                <span className="text-sm font-bold text-black dark:text-white">{authorName}</span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3 px-6 py-3">
                            <Calendar className="w-5 h-5 text-neutral-400 stroke-[2.5px]" />
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">TARİH</span>
                                <span className="text-sm font-bold text-black dark:text-white uppercase">
                                    {format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-center gap-3 px-6 py-3">
                            <Clock className="w-5 h-5 text-neutral-400 stroke-[2.5px]" />
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">SÜRE</span>
                                <span className="text-sm font-bold text-black dark:text-white uppercase">{readingTime}</span>
                            </div>
                        </div>

                        {/* Views (Optional Placeholder for "Data" feel) */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-black/50">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-neutral-500">CANLI</span>
                        </div>
                    </div>
                </div>

                {/* 3. HERO IMAGE BOX with SCANLINE */}
                {(article.cover_url || (article as any).image_url) && (
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl border-[3px] border-black overflow-hidden shadow-[8px_8px_0px_0px_#000] bg-zinc-900 group select-none">
                        {/* Vignette & Scanlines */}
                        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[11] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                        <Image
                            src={article.cover_url || (article as any).image_url}
                            alt={article.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />

                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-12 h-12 border-t-[3px] border-l-[3px] border-white/30 z-20 rounded-tl-lg" />
                        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-[3px] border-r-[3px] border-white/30 z-20 rounded-br-lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
