"use client";

import { Badge } from "@/components/ui/badge";
import { Telescope, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { motion, useScroll, useTransform } from "framer-motion";

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

// Simple internal component for background animations
function SpaceBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Stars - Increased Count for finer texture */}
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-foreground/30 rounded-full"
                    style={{
                        width: Math.random() * 2 + 0.5 + "px",
                        height: Math.random() * 2 + 0.5 + "px",
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                    }}
                    animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
                    transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                />
            ))}

            {/* Simplified Iconic UFO - Positioned Closer to Header */}
            <motion.div
                className="absolute top-[12%] left-[15%] sm:left-[25%] opacity-15 dark:opacity-25"
                animate={{
                    y: [0, -8, 0],
                    x: [0, 4, 0],
                    rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="50" height="30" viewBox="0 0 60 40" fill="currentColor">
                    {/* Simple Dome */}
                    <path d="M20 20 C20 10, 40 10, 40 20" fill="none" stroke="currentColor" strokeWidth="2" />
                    {/* Simple Disc Body */}
                    <ellipse cx="30" cy="20" rx="25" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
                    {/* Lights */}
                    <circle cx="15" cy="20" r="1.5" />
                    <circle cx="30" cy="23" r="1.5" />
                    <circle cx="45" cy="20" r="1.5" />
                </svg>
            </motion.div>
        </div>
    );
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

    const { scrollY } = useScroll();
    const headerTitleY = useTransform(scrollY, [0, 200], [0, -20]);

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 overflow-x-hidden relative">
            <SpaceBackground />

            {/* Further Reduced Top Padding - Moved Up */}
            <div className="container max-w-2xl mx-auto px-4 py-2 sm:py-6">

                {/* Header Section */}
                <div className="mb-5 sm:mb-8 text-center relative z-10">
                    {/* "Topluluk" Badge Removed as requested */}

                    <motion.h1
                        style={{ y: headerTitleY }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4 uppercase leading-tight drop-shadow-sm font-heading py-2"
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70">
                            Fikirlerini
                        </span>
                        <span className="relative inline-block">
                            <span className="relative z-10">Özgür Bırak</span>
                            <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-4 bg-emerald-500/20 -z-0 -rotate-1 rounded-sm"></span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground font-medium text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed border-l-2 border-emerald-500/30 pl-4 py-1 text-left sm:text-center sm:border-none sm:pl-0 sm:py-0"
                    >
                        Burada blog yazabilir, bilimsel sorular sorabilir veya okuduğun kitapları inceleyebilirsin.
                    </motion.p>
                </div>

                {/* Share Card - Reduced bottom margin */}
                <ShareInputCard user={user} />

                {/* Categories */}
                <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b-2 border-border/10 py-3 mb-6 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 md:flex-wrap md:justify-center px-1">
                        <Link href="/blog" className="shrink-0">
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Badge
                                    variant={!currentCategory ? "default" : "outline"}
                                    className={cn(
                                        "h-8 px-4 sm:h-9 sm:px-5 rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all cursor-pointer whitespace-nowrap",
                                        !currentCategory
                                            ? "bg-foreground text-background border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground"
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
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Badge
                                        variant={currentCategory === cat ? "default" : "outline"}
                                        className={cn(
                                            "h-8 px-4 sm:h-9 sm:px-5 rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all cursor-pointer whitespace-nowrap",
                                            currentCategory === cat
                                                ? "bg-foreground text-background border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
                                                : "bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground"
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
                <div className="space-y-6 sm:space-y-8">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
                            <Telescope className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-bold text-sm">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-xs sm:text-sm text-emerald-500 hover:underline mt-2 inline-block font-black uppercase tracking-wide">
                                <Sparkles className="w-3 h-3 inline mr-1" />
                                İlk başlatıcı sen ol!
                            </Link>
                        </div>
                    ) : (
                        transformedArticles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    delay: idx * 0.05,
                                    duration: 0.4,
                                    ease: "easeOut"
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
