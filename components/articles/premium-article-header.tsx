"use client";

import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";
import { Calendar, Clock, Quote, Share2, CornerRightDown } from "lucide-react";

interface PremiumArticleHeaderProps {
    article: Article;
    readingTime: string;
}

export function PremiumArticleHeader({ article, readingTime }: PremiumArticleHeaderProps) {
    const authorName = article.author?.full_name || article.author?.username || "FizikHub Editörü";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    return (
        <header className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-foreground/10">
            {/* Subtle background academic pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="container max-w-5xl mx-auto px-4">
                {/* DOI / ID Line */}
                <div className="mb-8 flex items-center gap-3 opacity-60">
                    <div className="h-[1px] w-8 bg-foreground/30" />
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase">
                        JOURNAL NO: {String(article.id).slice(0, 8).toUpperCase()} / {article.category || "GENERAL SCIENCE"}
                    </span>
                    <div className="h-[1px] flex-1 bg-foreground/30" />
                </div>

                {/* Title */}
                <div className="space-y-8 mb-16">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium text-foreground leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <div className="flex gap-6 max-w-3xl">
                            <Quote className="w-8 h-8 text-foreground/20 shrink-0 rotate-180" />
                            <p className="text-xl md:text-2xl font-serif italic text-foreground/70 leading-relaxed border-l border-foreground/10 pl-6">
                                {article.excerpt}
                            </p>
                        </div>
                    )}
                </div>

                {/* Author & Meta HUD */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-foreground/5 pt-10">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background ring-4 ring-foreground/5 shadow-xl transition-transform group-hover:scale-105 duration-500">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-foreground/10 shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <CornerRightDown className="w-3 h-3" /> Published by
                            </span>
                            <span className="text-lg font-display font-semibold text-foreground tracking-tight">
                                {authorName}
                            </span>
                            <div className="flex items-center gap-3 mt-1.5 opacity-60">
                                <div className="flex items-center gap-1.5 text-xs font-mono">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-foreground/20" />
                                <div className="flex items-center gap-1.5 text-xs font-mono">
                                    <Clock className="w-3 h-3" />
                                    {readingTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg active:scale-95">
                            <Share2 className="w-3.5 h-3.5" /> Share Article
                        </button>
                    </div>
                </div>
            </div>

            {/* Elegant Hero Image Frame */}
            {(article.cover_url || (article as any).image_url) && (
                <div className="container max-w-7xl mx-auto px-4 mt-20">
                    <div className="relative group overflow-hidden rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-foreground/10">
                        <div className="absolute inset-x-0 top-0 h-px bg-white/20 z-10" />
                        <div className="absolute inset-0 bg-foreground/10 z-[1] group-hover:bg-transparent transition-colors duration-700" />
                        <div className="aspect-[21/9] w-full relative">
                            <Image
                                src={article.cover_url || (article as any).image_url}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
