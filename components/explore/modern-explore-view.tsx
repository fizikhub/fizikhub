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
import { useTransition, useState, useEffect } from "react";

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
// Simple internal component for background animations
function SpaceBackground() {
    const [stars, setStars] = useState<Array<{ width: string, height: string, top: string, left: string, duration: number, delay: number }>>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 120 }, () => ({
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 5
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-foreground/30 rounded-full"
                    style={{
                        width: star.width,
                        height: star.height,
                        top: star.top,
                        left: star.left,
                    }}
                    animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.5, 1] }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay
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
    totalPages,
    currentPage,
    searchQuery
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

    // Helper to get empty state message
    const getEmptyStateContent = () => {
        switch (currentCategory) {
            case "Kitap İncelemesi":
                return {
                    icon: BookReviewCard,
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
            {/* Removed SpaceBackground & UFO for flat Neo-Brutalist look */}

            <div className="w-full max-w-5xl mx-auto px-4 pt-4 pb-8">
                {/* Intro Section - Hard Box */}
                {/* Share Card - Moves to Top */}
                <div className="relative mb-8 mt-0 z-[50]">
                    <ShareInputCard user={user} />
                </div>

                {/* Search Input */}
                <div className="mb-6 px-1 max-w-lg mx-auto">
                    <SearchInput />
                </div>

                {/* Categories - Neo-Brutalist Tabs */}
                <div className="flex justify-center mb-10 overflow-x-auto pb-4 no-scrollbar">
                    <div className="inline-flex gap-4 p-2">
                        {categories.map((cat) => {
                            const isActuallyActive = currentCategory === cat || (!currentCategory && cat === "Tümü");

                            return (
                                <div
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={cn(
                                        "px-6 py-3 text-sm font-black uppercase tracking-wider cursor-pointer border-2 border-black transition-all whitespace-nowrap",
                                        isActuallyActive
                                            ? "bg-[#FFC800] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1 transform rotate-1"
                                            : "bg-white text-black hover:bg-zinc-100 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1"
                                    )}
                                >
                                    {cat}
                                    {isPending && isActuallyActive && (
                                        <span className="ml-2 inline-block w-2 h-2 bg-black rounded-full animate-bounce" />
                                    )}
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
