"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Telescope, Sparkles, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

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

    // Parallax effect for header
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 200], [0, -30]);
    const headerOpacity = useTransform(scrollY, [0, 150], [1, 0.8]);

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 overflow-x-hidden">
            <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12">

                {/* Animated Header with Parallax */}
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="mb-12 text-center relative"
                >
                    {/* Floating Decorations */}
                    <motion.div
                        className="absolute -top-4 left-1/4 text-yellow-500/30"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <motion.div
                        className="absolute -top-2 right-1/4 text-emerald-500/30"
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, -15, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        <Rocket className="w-5 h-5" />
                    </motion.div>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                        className="inline-block mb-4"
                    >
                        <Badge variant="outline" className="border-2 border-emerald-500/30 px-4 py-1.5 text-[10px] tracking-[0.25em] font-black uppercase bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ●
                            </motion.span>
                            <span className="ml-2">Topluluk Blogu</span>
                        </Badge>
                    </motion.div>

                    {/* Title with Word Animation */}
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-4 overflow-hidden">
                        {["Fikirlerini", "Özgür", "Bırak"].map((word, idx) => (
                            <motion.span
                                key={word}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    delay: 0.2 + idx * 0.15,
                                    duration: 0.5,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="inline-block mr-3"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-muted-foreground font-medium text-sm md:text-base max-w-md mx-auto"
                    >
                        Bilim, teknoloji ve mizah üzerine düşüncelerini paylaş.
                    </motion.p>
                </motion.div>

                {/* Share Card */}
                <ShareInputCard user={user} />

                {/* Categories with Scale Animation */}
                <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/30 py-4 mb-8 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-10 md:mx-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 md:flex-wrap md:justify-center px-1"
                    >
                        <Link href="/blog" className="shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Badge
                                    variant={!currentCategory ? "default" : "outline"}
                                    className={cn(
                                        "h-9 px-5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer",
                                        !currentCategory
                                            ? "bg-foreground text-background border-foreground shadow-lg"
                                            : "bg-transparent text-muted-foreground border-border/50 hover:border-foreground/30 hover:text-foreground"
                                    )}
                                >
                                    TÜMÜ
                                </Badge>
                            </motion.div>
                        </Link>
                        {categories.map((cat, idx) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 + idx * 0.05 }}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    <Badge
                                        variant={currentCategory === cat ? "default" : "outline"}
                                        className={cn(
                                            "h-9 px-5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer",
                                            currentCategory === cat
                                                ? "bg-foreground text-background border-foreground shadow-lg"
                                                : "bg-transparent text-muted-foreground border-border/50 hover:border-foreground/30 hover:text-foreground"
                                        )}
                                    >
                                        {cat.toUpperCase()}
                                    </Badge>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>

                {/* Feed with Staggered Reveal */}
                <div className="space-y-8">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring" }}
                            className="py-16 text-center rounded-2xl border-2 border-dashed border-border bg-card/30"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Telescope className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
                            </motion.div>
                            <p className="text-muted-foreground font-bold text-lg">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="mt-3 inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-black uppercase tracking-wide text-sm group">
                                <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                                İlk makaleyi sen yaz!
                            </Link>
                        </motion.div>
                    ) : (
                        transformedArticles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    delay: idx * 0.08,
                                    duration: 0.5,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
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
