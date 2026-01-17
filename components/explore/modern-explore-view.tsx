"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Telescope, ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { motion } from "framer-motion";

interface Article {
    id: number;
    title: string;
    excerpt: string | null;
    summary?: string | null;
    content: string;
    slug: string;
    category: string;
    cover_url: string | null;
    image_url?: string | null;
    created_at: string;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_writer?: boolean;
    } | null;
}

interface ModernExploreViewProps {
    initialArticles: Article[];
    categories: string[];
    currentQuery?: string;
    currentCategory?: string;
    user?: any;
}

export function ModernExploreView({
    initialArticles,
    categories,
    currentQuery,
    currentCategory,
    user
}: ModernExploreViewProps) {

    // Transform articles
    const transformedArticles = initialArticles.map(article => ({
        ...article,
        image_url: article.cover_url || article.image_url,
        summary: article.excerpt || article.summary,
        author: article.profiles ? {
            username: article.profiles.username,
            full_name: article.profiles.full_name,
            avatar_url: article.profiles.avatar_url,
            is_writer: article.profiles.is_writer
        } : null
    }));

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 font-sans overflow-hidden">

            {/* Radical Header Section */}
            <div className="relative pt-12 pb-24 md:pt-20 md:pb-32 container max-w-5xl mx-auto px-4">
                {/* Asymetrical Background Elements */}
                <div className="absolute top-10 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="inline-block"
                    >
                        <div className="bg-black dark:bg-white text-white dark:text-black font-mono text-sm font-bold px-3 py-1 mb-4 inline-flex items-center gap-2 transform -rotate-2">
                            <Hash className="w-4 h-4" />
                            FIZIKHUB_COMMUNITY
                        </div>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground mb-6">
                        YAZ.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 inline-block transform hover:skew-x-12 transition-transform cursor-default">
                            PAYLAŞ.
                        </span><br />
                        <span className="relative inline-block">
                            KEŞFET
                            <svg className="absolute -bottom-2 w-full h-3 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="max-w-xl text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400 border-l-4 border-emerald-500 pl-6 py-2">
                        Burası sadece bir blog değil. Burası beyninin halka açık bir oyun alanı.
                    </p>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-2 relative z-20 -mt-16">
                <ShareInputCard user={user} />
            </div>

            {/* Sticky "Ticker" Category Bar */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-y-2 border-black dark:border-white py-0 overflow-hidden">
                <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-3 md:justify-center">
                    <Link href="/blog" className="shrink-0 px-2">
                        <div className={cn(
                            "px-6 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-wider text-sm transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
                            !currentCategory ? "bg-black text-white dark:bg-white dark:text-black" : "bg-transparent text-foreground"
                        )}>
                            TÜMÜ
                        </div>
                    </Link>
                    {categories.map((cat) => (
                        <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0 px-2">
                            <div className={cn(
                                "px-6 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-wider text-sm transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
                                currentCategory === cat ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" : "bg-transparent text-foreground"
                            )}>
                                {cat}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Masonry-ish Look Grid for Articles */}
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col gap-8">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-20 text-center border-4 border-black dark:border-white border-dashed bg-zinc-100 dark:bg-zinc-900">
                            <Telescope className="w-16 h-16 mx-auto mb-4 text-zinc-400 animate-spin-slow" />
                            <p className="text-xl font-black uppercase text-zinc-500">Sinyal Yok...</p>
                            <Link href="/makale/yeni" className="mt-4 inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 font-bold border-2 border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                                İLKİ BAŞLAT <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    ) : (
                        transformedArticles.map((article, idx) => (
                            <div key={article.id} className={cn(
                                "transform transition-all duration-300",
                                idx % 2 === 0 ? "md:translate-x-4" : "md:-translate-x-4"
                            )}>
                                <div className="relative group">
                                    <div className="absolute top-2 left-2 w-full h-full bg-black dark:bg-white rounded-xl -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 lg:group-hover:translate-x-4 lg:group-hover:translate-y-4" />
                                    <SocialArticleCard
                                        article={article as any}
                                        index={idx}
                                        variant="community"
                                        initialLikes={0}
                                        initialComments={0}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
