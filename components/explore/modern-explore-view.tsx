"use client";

import { Badge } from "@/components/ui/badge";
import { Telescope, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { BookReviewCard } from "@/components/book-review/book-review-card";
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
            {[...Array(120)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-foreground/30 rounded-full"
                    style={{
                        width: Math.random() * 2 + 0.5 + "px",
                        height: Math.random() * 2 + 0.5 + "px",
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                    }}
                    animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.5, 1] }}
                    transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                />
            ))}
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
                <div className="mb-5 sm:mb-8 text-center relative z-10 select-none">
                    <motion.h1
                        style={{ y: headerTitleY }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4 uppercase leading-tight drop-shadow-sm font-heading py-2"
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70">
                            Fikirlerini
                        </span>
                        <span className="relative inline-flex items-center gap-2 sm:gap-4">
                            <span className="relative z-10">Özgür Bırak</span>
                            <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-4 bg-red-600/20 -z-0 -rotate-1 rounded-sm"></span>

                            {/* UFO Icon - Positioned Relative to Text */}
                            <motion.div
                                className="opacity-90 text-foreground"
                                animate={{
                                    y: [0, -6, 0],
                                    rotate: [0, 3, -3, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg width="50" height="30" viewBox="0 0 60 40" fill="currentColor" className="sm:w-[60px] sm:h-[36px]">
                                    {/* Dome */}
                                    <path d="M22 18 C22 8, 38 8, 38 18" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path d="M25 18 C25 12, 35 12, 35 18" fill="currentColor" className="text-red-500/20" />

                                    {/* Body */}
                                    <ellipse cx="30" cy="20" rx="28" ry="8" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M10 20 Q 30 25 50 20" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />

                                    {/* Lights */}
                                    <circle cx="12" cy="20" r="1.5" fill="currentColor" className="text-red-500 animate-pulse" />
                                    <circle cx="30" cy="24" r="1.5" fill="currentColor" className="text-red-500 animate-pulse delay-75" />
                                    <circle cx="48" cy="20" r="1.5" fill="currentColor" className="text-red-500 animate-pulse delay-150" />

                                    {/* Landing Gear / Details */}
                                    <line x1="20" y1="26" x2="16" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="40" y1="26" x2="44" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </motion.div>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground font-medium text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed border-l-4 border-red-600 pl-4 py-1 text-left sm:text-center sm:border-none sm:pl-0 sm:py-0"
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
                                        "h-8 px-4 sm:h-9 sm:px-5 rounded-full text-[10px] sm:text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider",
                                        !currentCategory
                                            ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20"
                                            : "bg-transparent text-muted-foreground border-border hover:border-red-600 hover:text-red-600 hover:shadow-sm"
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
                                            "h-8 px-4 sm:h-9 sm:px-5 rounded-full text-[10px] sm:text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider",
                                            currentCategory === cat
                                                ? "bg-foreground text-background border-foreground shadow-md"
                                                : "bg-transparent text-muted-foreground border-border hover:border-red-600 hover:text-red-600 hover:bg-red-600/5"
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
                        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-red-600/30 bg-red-600/5">
                            <Telescope className="w-12 h-12 text-red-600/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-bold text-sm">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-xs sm:text-sm text-red-600 hover:underline mt-2 inline-block font-black uppercase tracking-wide">
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
                                {article.category === "Kitap İncelemesi" ? (
                                    <BookReviewCard article={article as any} index={idx} />
                                ) : (
                                    <SocialArticleCard
                                        article={article as any}
                                        index={idx}
                                        variant="community"
                                        initialLikes={0}
                                        initialComments={0}
                                    />
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
