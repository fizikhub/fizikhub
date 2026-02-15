"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
import { OptimizedImage, OptimizedAvatar } from "@/components/ui/optimized-image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

interface NeoArticleCardProps {
    article: Article;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    className?: string;
}

export function NeoArticleCard({
    article,
    initialLikes = 0,
    initialComments = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    className
}: NeoArticleCardProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
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
                if (result.error === "Giriş yapmalısınız.") toast.error("Giriş yapmalısınız!");
            } else if (!previousBookmarked) {
                toast.success("Kaydedildi!");
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

    const getPreviewText = (htmlContent: string | null | undefined, summary: string | null | undefined) => {
        if (htmlContent) {
            const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (plainText.length > 20) return plainText;
        }
        return summary || "Bu makale için içerik önizlemesi bulunmuyor.";
    };

    const previewText = getPreviewText(article.content, article.summary);

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";

    return (
        <ViewTransitionLink href={`/blog/${article.slug}`} className="block group">
            <article
                className={cn(
                    "flex flex-col relative overflow-hidden",
                    // COLOR PALETTE: Dark Mode = #27272a (Zinc 800) - Lighter than background
                    "bg-white dark:bg-[#27272a]",
                    // BORDER: Thinner for cleaner look
                    "border border-border/50 rounded-xl",
                    // SHADOW: Subtle or None for "clean" feed
                    "shadow-sm hover:shadow-md hover:border-border/80",
                    // HOVER
                    "transition-all duration-200",
                    className
                )}
            >
                {/* NOISE TEXTURE - Keep but subtle */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b border-border/50 bg-muted z-10">
                    <OptimizedImage
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className="inline-block bg-background/90 backdrop-blur-md border border-border/50 text-foreground px-2 py-1 font-bold text-[10px] sm:text-xs uppercase rounded-md shadow-sm">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3 z-10 relative">

                    {/* Title */}
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground leading-tight tracking-tight mb-1">
                        <span className="bg-gradient-to-r from-transparent to-transparent group-hover:from-primary/10 group-hover:to-primary/10 transition-all duration-300 rounded-sm">
                            {article.title}
                        </span>
                    </h3>

                    {/* Preview Text */}
                    <p className="font-sans text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* SEPARATOR */}
                    <div className="w-full h-px border-t border-border/50 my-2" />

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between pt-2">

                        {/* Author */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="relative w-8 h-8 flex-shrink-0 rounded-full border border-border overflow-hidden bg-muted">
                                <OptimizedAvatar
                                    src={authorAvatar}
                                    alt={authorName}
                                    size={32}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-1 min-w-0">
                                <span className="text-xs font-bold text-foreground truncate max-w-[100px]">
                                    {authorName}
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Actions Code */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-muted",
                                    isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isLiked ? "fill-current" : "")} />
                                {likeCount > 0 && <span className="text-xs ml-1 font-medium">{likeCount}</span>}
                            </button>

                            {/* Comment */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const url = `/blog/${article.slug}#comments`;
                                    if (document.startViewTransition) {
                                        document.startViewTransition(() => {
                                            window.location.href = url;
                                        });
                                    } else {
                                        window.location.href = url;
                                    }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-blue-500 transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-green-500 transition-all"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-muted",
                                    isBookmarked ? "text-primary fill-primary" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-current" : "")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
