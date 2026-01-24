"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Bookmark, Share, Zap } from "lucide-react";
import { Article } from "@/lib/api";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

interface SocialArticleCardProps {
    article: Article;
    index?: number;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    variant?: "default" | "compact" | "community" | "writer";
    className?: string;
    badgeLabel?: string;
    badgeClassName?: string;
}

export function SocialArticleCard({
    article,
    initialLikes = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    className,
    variant = "default", // Default to standard size
}: SocialArticleCardProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isFeatured = article.is_featured;
    // Compact variant requires smaller text and padding
    const isCompact = variant === "compact";

    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.webp");

    // Optimistic UI States
    const targetArticleTitle = "Sessiz Bir Varsayım: Yerçekimi";
    const effectiveInitialLikes = article.title === targetArticleTitle ? 7 : initialLikes;

    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(effectiveInitialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const { triggerHaptic } = useHaptic();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLikeLoading) return;

        if (!isLiked) {
            triggerHaptic();
            triggerSmallConfetti(e.clientX, e.clientY);
        }

        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLikeLoading(true);

        try {
            const result = await toggleArticleLike(article.id);
            if (!result.success) {
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Giriş yapmalısınız!");
                }
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const previousBookmarked = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            const result = await toggleArticleBookmark(article.id);
            if (!result.success) {
                setIsBookmarked(previousBookmarked);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Giriş yapmalısınız!");
                }
            } else {
                if (!previousBookmarked) toast.success("Kaydedildi!");
            }
        } catch (error) {
            setIsBookmarked(previousBookmarked);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/blog/${article.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link kopyalandı!");
    };

    return (
        // KEY FIX: max-w-full and w-full ensures it never overflows parent container
        // min-w-0 prevents flexbox flex-shrink issues
        <div className={cn("h-full font-sans w-full max-w-full min-w-0", className)}>
            <Link href={`/blog/${article.slug}`} className="block h-full group w-full">
                <article
                    className={cn(
                        "relative h-full flex flex-col overflow-hidden w-full",
                        "bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white rounded-none",
                        "shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]",
                        "transition-transform duration-200 ease-out hover:translate-x-[2px] hover:translate-y-[2px]",
                        "hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                        isCompact ? "text-sm" : "text-base" // Adjust base text size for compact
                    )}
                >
                    {/* Header Bar */}
                    <div className={cn("flex items-center justify-between border-b-[3px] border-black dark:border-white bg-[#F2C32E]", isCompact ? "px-3 py-2" : "px-4 py-3")}>
                        <div className="flex items-center gap-2">
                            <span className={cn("bg-black text-white font-black uppercase tracking-widest", isCompact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]")}>
                                {article.category || "GENEL"}
                            </span>
                            {isFeatured && (
                                <span className={cn("flex items-center gap-1 font-black uppercase text-black", isCompact ? "text-[8px]" : "text-[10px]")}>
                                    <Zap className={cn("fill-black", isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} /> POPÜLER
                                </span>
                            )}
                        </div>
                        <span className={cn("font-bold text-black uppercase tracking-wider", isCompact ? "text-[8px]" : "text-[10px]")}>
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[16/9] w-full border-b-[3px] border-black dark:border-white overflow-hidden group">
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            onError={() => setImgSrc("/images/placeholder-article.webp")}
                        />
                        <div className="absolute inset-0 bg-[#A26FE3]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className={cn("flex-1 flex flex-col gap-3", isCompact ? "p-3" : "p-5")}>
                        <h3 className={cn(
                            "font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.95] text-black dark:text-white group-hover:text-[#A26FE3] transition-colors break-words",
                            isCompact ? "text-lg line-clamp-2" : "text-xl sm:text-2xl"
                        )}>
                            {article.title}
                        </h3>

                        {!isCompact && (
                            <p className="flex-1 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed font-mono break-words">
                                {article.summary}
                            </p>
                        )}

                        {/* Author */}
                        <div className={cn("flex items-center gap-3 mt-auto border-t-[3px] border-black/10 dark:border-white/10 border-dashed", isCompact ? "pt-2" : "pt-4")}>
                            <div className={cn("rounded-none border-2 border-black dark:border-white overflow-hidden bg-gray-100 flex-shrink-0", isCompact ? "w-5 h-5" : "w-6 h-6")}>
                                <Image
                                    src={article.author?.avatar_url || "/images/default-avatar.png"}
                                    alt={article.author?.full_name || "Yazar"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xs font-bold uppercase text-black dark:text-white truncate">
                                {article.author?.full_name || "Anonim"}
                            </span>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className={cn(
                        "flex items-center justify-between border-t-[3px] border-black dark:border-white bg-zinc-100 dark:bg-zinc-800",
                        isCompact ? "px-3 py-2" : "px-4 py-3"
                    )}>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center justify-center border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-[#F2C32E] transition-colors",
                                    isCompact ? "p-1" : "p-1.5",
                                    isLiked && "bg-[#F2C32E] text-black"
                                )}
                            >
                                <Heart className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5", isLiked && "fill-black stroke-black")} />
                            </button>
                            <span className="text-[10px] font-black font-mono">{likeCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className={cn("border-2 border-transparent hover:border-black dark:hover:border-white transition-all", isCompact ? "p-1" : "p-1.5")}>
                                <MessageCircle className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
                            </button>
                            <button onClick={handleBookmark} className={cn("border-2 border-transparent hover:border-black dark:hover:border-white transition-all", isCompact ? "p-1" : "p-1.5")}>
                                <Bookmark className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5", isBookmarked && "fill-black dark:fill-white")} />
                            </button>
                            <button onClick={handleShare} className={cn("border-2 border-transparent hover:border-black dark:hover:border-white transition-all", isCompact ? "p-1" : "p-1.5")}>
                                <Share className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
                            </button>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
}
