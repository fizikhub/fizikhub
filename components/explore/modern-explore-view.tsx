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
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

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

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCategoryChange = (category: string) => {
        startTransition(() => {
            const params = new URLSearchParams(window.location.search);
            if (category === "Tümü") {
                params.delete("category");
            } else {
                params.set("category", category);
            }
            // Reset page to 1 on category change
            params.delete("page");
            router.push(`/blog?${params.toString()}`);
        });
    };

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

    // Helper to get empty state message
    const getEmptyStateContent = () => {
        switch (currentCategory) {
            case "Kitap İncelemesi":
                return {
                    icon: BookReviewCard, // Just valid component ref or icon
                    title: "Henüz inceleme yok...",
                    desc: "Okuduğun son kitabı anlatmaya ne dersin?",
                    action: "İlk İncelemeyi Yaz",
                    link: "/kitap-inceleme/yeni"
                };
            case "Deney":
                return {
                    icon: ExperimentCard,
                    title: "Laboratuvar sessiz...",
                    desc: "Çılgın bir deney yapıp sonuçlarını paylaş!",
                    action: "Deney Paylaş",
                    link: "/makale/yeni?type=experiment"
                };
            case "Terim":
                return {
                    icon: TermCard,
                    title: "Sözlük boş...",
                    desc: "Bilimsel bir terimi açıklayarak bize öğret.",
                    action: "Terim Ekle",
                    link: "/makale/yeni?type=term"
                };
            default:
                return {
                    icon: Sparkles,
                    title: "Henüz makale yok...",
                    desc: "Bu konuda henüz kimse bir şey yazmamış.",
                    action: "İlk Yazıyı Sen Yaz",
                    link: "/makale/yeni"
                };
        }
    };

    const emptyState = getEmptyStateContent();

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 overflow-x-hidden relative">
            <SpaceBackground />

            {/* Further Reduced Top Padding - Moved Up */}
            {/* Relaxed Container Width */}
            <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-6">

                {/* Share Card - Reduced bottom margin */}
                <div className="relative mb-8">
                    <ShareInputCard user={user} />

                    {/* Simple Helper Text - No Flashy Containers */}
                    <p className="text-center text-xs text-muted-foreground/70 italic mt-3 mb-0">
                        Burada blog yazabilir, bilimsel sorular sorabilir veya okuduğun kitapları inceleyebilirsin.
                    </p>

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
                            const isActive = currentCategory === cat || (!currentCategory && cat === "Tümü"); // Assuming 'Tümü' might be added, or handling undefined
                            const isActuallyActive = currentCategory === cat;

                            return (
                                <div
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={cn(
                                        "relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 select-none group",
                                        isActuallyActive
                                            ? "text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                                        isActuallyActive && cat === 'Blog' && "bg-gradient-to-tr from-amber-500 to-orange-500 border-orange-400/50",
                                        isActuallyActive && cat === 'Kitap İncelemesi' && "bg-gradient-to-tr from-red-500 to-rose-500 border-red-400/50",
                                        isActuallyActive && cat === 'Deney' && "bg-gradient-to-tr from-green-500 to-emerald-500 border-green-400/50",
                                        isActuallyActive && cat === 'Terim' && "bg-gradient-to-tr from-blue-500 to-cyan-500 border-blue-400/50",
                                        isPending && !isActuallyActive && "opacity-50 grayscale"
                                    )}
                                >
                                    {/* Loading Indicator for Pending State */}
                                    {isPending && isActuallyActive && (
                                        <div className="absolute right-2 top-2">
                                            <span className="flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Simple dot indicator for active state */}
                                    {isActuallyActive && (
                                        <motion.span
                                            layoutId="active-dot"
                                            className="absolute inset-0 rounded-xl bg-white/10 mix-blend-overlay"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <span className="relative z-10 tracking-tight">{cat}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Reset Filter Button (Optional - Shows only if a category is selected and user might want to go back to 'mixed' view, though user request implied these 3 are the main views. I'll leave a subtle way to clear if needed, or rely on just switching tabs.) */}
                {/* For now, assuming these 3 are the primary navigation modes. */}

                {/* Feed */}
                <div className={cn("space-y-6 sm:space-y-8 min-h-[400px]", isPending && "opacity-50 transition-opacity duration-300")}>
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-muted/20 to-muted/5 flex items-center justify-center border border-white/5 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/10 blur-xl animate-pulse" />
                                <Telescope className="w-10 h-10 text-muted-foreground relative z-10" />
                            </motion.div>

                            <h3 className="text-xl font-black text-foreground mb-2">{emptyState.title}</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mb-8 text-sm">{emptyState.desc}</p>

                            <Link
                                href={emptyState.link}
                                className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold overflow-hidden shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <Sparkles className="w-4 h-4" />
                                <span>{emptyState.action}</span>
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
