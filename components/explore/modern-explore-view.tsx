"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Telescope, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 overflow-x-hidden">
            <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12">

                {/* Animated Header */}
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="inline-block mb-2"
                    >
                        <Badge variant="outline" className="border-2 border-foreground/20 px-3 py-1 text-[10px] tracking-[0.2em] font-black uppercase bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none">
                            Topluluk
                        </Badge>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-3 relative inline-block">
                        <span className="relative z-10">Fikirlerini Özgür Bırak</span>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-1 left-0 h-3 bg-yellow-400/30 -z-10 -rotate-1"
                        />
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm md:text-base max-w-md mx-auto">
                        Bilim, teknoloji ve mizah üzerine düşüncelerini paylaş.
                    </p>
                </div>

                {/* Share Card */}
                <ShareInputCard user={user} />

                {/* Categories */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b-2 border-border/50 py-3 mb-8 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-10 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 md:flex-wrap md:justify-center px-1">
                        <Link href="/blog" className="shrink-0">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Badge
                                    variant={!currentCategory ? "default" : "outline"}
                                    className={cn(
                                        "h-9 px-5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer",
                                        !currentCategory
                                            ? "bg-emerald-500 text-white border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground hover:bg-muted/30"
                                    )}
                                >
                                    TÜMÜ
                                </Badge>
                            </motion.div>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Badge
                                        variant={currentCategory === cat ? "default" : "outline"}
                                        className={cn(
                                            "h-9 px-5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer",
                                            currentCategory === cat
                                                ? "bg-emerald-500 text-white border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
                                                : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground hover:bg-muted/30"
                                        )}
                                    >
                                        {cat.toUpperCase()}
                                    </Badge>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-8">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-16 text-center rounded-2xl border-2 border-dashed border-border bg-card/50"
                        >
                            <Telescope className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4 animate-bounce" />
                            <p className="text-muted-foreground font-bold">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-sm text-emerald-500 hover:text-emerald-400 mt-2 inline-flex items-center gap-1 font-black uppercase tracking-wide">
                                <Sparkles className="w-3 h-3" />
                                İlk makaleyi sen yaz!
                            </Link>
                        </motion.div>
                    ) : (
                        transformedArticles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                            >
                                <SocialArticleCard
                                    article={article as any}
                                    index={idx}
                                    variant="community"
                                    initialLikes={0}
                                    initialComments={0}
                                />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
