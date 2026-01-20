"use client";

import { Telescope, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";
import { BookReviewCard } from "@/components/book-review/book-review-card";
import { ExperimentCard } from "@/components/experiment/experiment-card";
import { SearchInput } from "@/components/blog/search-input";
import { TermCard } from "@/components/term/term-card";
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
    totalPages?: number;
    currentPage?: number;
    searchQuery?: string; // Add this prop
}

// Simple internal component for background animations
function SpaceBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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
    user,
    totalPages, // Add these
    currentPage,
    searchQuery // Add this
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
            {/* Relaxed Container Width */}
            <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-6">

                {/* Share Card - Reduced bottom margin */}
                <div className="relative">
                    <ShareInputCard user={user} />

                    {/* Description Text - Repositioned */}
                    {/* Description Text - Repositioned & Compacted */}
                    <div className="mt-4 mb-4 flex items-center justify-between px-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-muted-foreground font-medium text-xs sm:text-sm max-w-lg leading-relaxed italic"
                        >
                            Burada blog yazabilir, bilimsel sorular sorabilir veya okuduğun kitapları inceleyebilirsin.
                        </motion.p>
                    </div>

                    {/* Improved UFO - Floating on the right side of the share area */}
                    <motion.div
                        className="absolute right-0 top-0 sm:-right-8 sm:-top-12 z-50 pointer-events-none" // Moved mobile top from -top-6 to top-0 to keep it visible
                        initial={{ x: 100, opacity: 0 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            y: [0, -10, 0]
                        }}
                        transition={{
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            default: { duration: 1 }
                        }}
                    >
                        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-10 sm:w-32 sm:h-20 drop-shadow-xl opacity-90 sm:opacity-100">
                            {/* Glow */}
                            <ellipse cx="60" cy="40" rx="35" ry="10" fill="#22c55e" fillOpacity="0.2" className="animate-pulse" />

                            {/* Beam (Optional/Subtle) */}
                            <path d="M60 50 L40 80 H80 L60 50" fill="url(#beam-gradient)" opacity="0.3" />
                            <defs>
                                <linearGradient id="beam-gradient" x1="60" y1="50" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#22c55e" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Dome */}
                            <path d="M45 32 C45 20, 75 20, 75 32" fill="#e0f2fe" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />

                            {/* Alien Head (Tiny detail) */}
                            <circle cx="60" cy="28" r="4" fill="#22c55e" />
                            <circle cx="58.5" cy="27" r="1" fill="black" fillOpacity="0.5" />
                            <circle cx="61.5" cy="27" r="1" fill="black" fillOpacity="0.5" />

                            {/* Body Ring */}
                            <ellipse cx="60" cy="40" rx="45" ry="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                            <ellipse cx="60" cy="37" rx="45" ry="12" fill="#334155" />

                            {/* Lights */}
                            <circle cx="25" cy="40" r="2" fill="#ef4444" className="animate-pulse" />
                            <circle cx="42" cy="46" r="2" fill="#eab308" className="animate-pulse delay-75" />
                            <circle cx="60" cy="48" r="2" fill="#22c55e" className="animate-pulse delay-150" />
                            <circle cx="78" cy="46" r="2" fill="#3b82f6" className="animate-pulse delay-300" />
                            <circle cx="95" cy="40" r="2" fill="#a855f7" className="animate-pulse delay-500" />
                        </svg>
                    </motion.div>
                </div>

                {/* Search Input */}
                <div className="mb-6 px-1 max-w-lg mx-auto">
                    <SearchInput />
                </div>

                {/* Categories - Redesigned Tab System */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1.5 bg-muted/20 border border-primary/5 rounded-2xl backdrop-blur-sm relative items-center gap-1">

                        {/* Categories Loop */}
                        {categories.map((cat) => {
                            const isActive = currentCategory === cat;
                            // Icon Mapping
                            let Icon;
                            if (cat === 'Blog') Icon = Telescope; // Will change to proper icon in actual map logic or strict list

                            return (
                                <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
                                    <div
                                        className={cn(
                                            "relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2",
                                            isActive
                                                ? "text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                                                : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                                            isActive && cat === 'Blog' && "bg-gradient-to-tr from-amber-500 to-orange-500 border-orange-400/50",
                                            isActive && cat === 'Kitap İncelemesi' && "bg-gradient-to-tr from-red-500 to-rose-500 border-red-400/50",
                                            isActive && cat === 'Deney' && "bg-gradient-to-tr from-green-500 to-emerald-500 border-green-400/50",
                                            isActive && cat === 'Terim' && "bg-gradient-to-tr from-blue-500 to-cyan-500 border-blue-400/50"
                                        )}
                                    >
                                        {/* Simple dot indicator for active state */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="active-dot"
                                                className="absolute inset-0 rounded-xl bg-white/10 mix-blend-overlay"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <span className="relative z-10 tracking-tight">{cat}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Reset Filter Button (Optional - Shows only if a category is selected and user might want to go back to 'mixed' view, though user request implied these 3 are the main views. I'll leave a subtle way to clear if needed, or rely on just switching tabs.) */}
                {/* For now, assuming these 3 are the primary navigation modes. */}

                {/* Feed */}
                <div className="space-y-6 sm:space-y-8">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
                            <Telescope className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-bold text-sm">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-xs sm:text-sm text-primary hover:underline mt-2 inline-block font-black uppercase tracking-wide">
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
                                ) : article.category === "Deney" ? (
                                    <ExperimentCard article={article as any} index={idx} />
                                ) : article.category === "Terim" ? (
                                    <TermCard article={article as any} index={idx} />
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
