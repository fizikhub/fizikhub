"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BookOpen, ChevronUp, ChevronDown, Share } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Calculate reading time
function getReadingTime(content: string | null): number {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function SocialArticleCard({
    article,
    index = 0,
    initialLikes = 0,
    initialComments = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    variant = "writer",
    className,
    badgeLabel,
    badgeClassName
}: SocialArticleCardProps) {
    // Color theming based on variant
    const isWriter = variant === "writer";

    // Default values if not provided
    const defaultBadgeText = isWriter ? "Yazar" : "Topluluk";
    const finalBadgeText = badgeLabel || defaultBadgeText;

    const defaultBadgeClass = isWriter ? "text-amber-500 bg-amber-500/10" : "text-emerald-500 bg-emerald-500/10";
    const finalBadgeClass = badgeClassName || defaultBadgeClass;

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

        // Feedback
        if (!isLiked) {
            triggerHaptic();
            triggerSmallConfetti(e.clientX, e.clientY);
        }

        // Optimistic Update
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLikeLoading(true);

        try {
            const result = await toggleArticleLike(article.id);
            if (!result.success) {
                // Revert
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Beğenmek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            toast.error("Bağlantı hatası.");
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic
        const previousBookmarked = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            const result = await toggleArticleBookmark(article.id);
            if (!result.success) {
                setIsBookmarked(previousBookmarked);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Kaydetmek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            } else {
                if (!previousBookmarked) toast.success("Makale kaydedildi.");
                else toast.info("Makale kaydedilenlerden çıkarıldı.");
            }
        } catch (error) {
            setIsBookmarked(previousBookmarked);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/blog/${article.slug}`;
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.summary || article.title,
                url: url
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link kopyalandı!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-200",
                "bg-card",
                "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)]",
                "hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                // Theme specific hover effects
                isWriter
                    ? "hover:ring-1 hover:ring-amber-500/40"
                    : "hover:ring-1 hover:ring-emerald-500/40",
                variant === "compact" ? "p-4" : "p-0",
                "active:scale-[0.99]",
                className
            )}
        >
            {/* Cosmic background effect */}
            <div className={cn("absolute inset-0 bg-gradient-radial via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", isWriter ? "from-amber-500/5" : "from-emerald-500/5")} />

            {/* Main Navigation Link - covers entire card */}
            <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-[1]" prefetch={false}>
                <span className="sr-only">{article.title}</span>
            </Link>

            <div className="px-3 py-3 sm:px-5 sm:py-3 relative z-10 pointer-events-none">
                {/* Author Row - Enable pointer events for interactive elements */}
                <div className="flex items-center gap-2.5 mb-2 pointer-events-auto w-fit">
                    <Link href={`/kullanici/${article.author?.username}`} className="flex-shrink-0 relative group/avatar z-20">
                        <Avatar className={cn("w-9 h-9 ring-2 ring-transparent transition-all duration-300", isWriter ? "group-hover/avatar:ring-amber-500/20" : "group-hover/avatar:ring-emerald-500/20")}>
                            <AvatarImage src={article.author?.avatar_url || ""} />
                            <AvatarFallback className={cn("font-bold text-xs", isWriter ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                                {article.author?.username?.[0]?.toUpperCase() || "F"}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <Link href={`/kullanici/${article.author?.username}`} className={cn("font-semibold text-foreground hover:underline text-sm transition-colors", isWriter ? "hover:text-amber-500" : "hover:text-emerald-500")}>
                                {article.author?.full_name || article.author?.username || "Fizikhub"}
                            </Link>
                            <span className={cn("text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm", finalBadgeClass)}>{finalBadgeText}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{article.category}</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                        </div>
                    </div>
                </div>

                <div className="block group/content">
                    {/* Title */}
                    <h3 className={cn("font-heading font-bold text-[17px] sm:text-[18px] leading-[1.3] mb-2 text-foreground/95 transition-colors", isWriter ? "group-hover/content:text-amber-500" : "group-hover/content:text-emerald-500")}>
                        {article.title}
                    </h3>

                    {/* Summary */}
                    <div className="text-[13px] sm:text-[14px] text-foreground/80 leading-[1.5] font-sans mb-2 line-clamp-2">
                        {article.summary || (article.content ? article.content.replace(/<[^>]*>?/gm, '').slice(0, 120) + "..." : "Özet bulunmuyor.")}
                    </div>

                    {/* Image */}
                    {article.image_url && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-300/30 dark:border-gray-700/30 mb-3 group-hover/content:border-amber-500/20 transition-colors">
                            <Image
                                src={imgSrc}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/content:scale-[1.02]"
                                onError={() => setImgSrc("/images/placeholder-article.webp")}
                            />
                        </div>
                    )}
                </div>

                {/* Action Bar - Brutalist Space Style */}
                <div className="flex items-center gap-2 pt-3 border-t border-dashed border-gray-300/30 dark:border-gray-700/30 pointer-events-auto">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        disabled={isLikeLoading}
                        className={cn(
                            "flex h-9 items-center gap-2 px-3 rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent",
                            isLiked ? "text-rose-500 border-rose-500/30 bg-rose-500/10" : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <Heart className={cn(
                            "w-4 h-4 stroke-[1.8px]",
                            isLiked ? "fill-current" : ""
                        )} />
                        <span className="text-sm font-semibold min-w-[16px] text-center">
                            {likeCount}
                        </span>
                    </button>

                    {/* Comments */}
                    <Link
                        href={`/blog/${article.slug}#comments`}
                        className="flex h-9 items-center gap-2 px-3 rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent text-foreground"
                    >
                        <MessageCircle className="w-4 h-4 stroke-[1.8px]" />
                        <span className="text-sm font-semibold">{initialComments}</span>
                    </Link>

                    {/* Read Time */}
                    <div className="flex h-9 items-center gap-1.5 px-3 rounded-xl border border-gray-300/60 dark:border-gray-700/60 text-muted-foreground text-xs font-medium">
                        <BookOpen className="w-3.5 h-3.5" />
                        {getReadingTime(article.content)} dk
                    </div>

                    {/* Share & Bookmark Group */}
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={handleBookmark}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent",
                                isBookmarked && "text-amber-500 border-amber-500/30 bg-amber-500/10"
                            )}
                        >
                            <Bookmark className={cn("w-4 h-4 stroke-[1.8px]", isBookmarked && "fill-current")} />
                        </button>

                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent"
                            onClick={handleShare}
                        >
                            <Share className="w-4 h-4 stroke-[1.8px]" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
