"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import Image from "next/image";
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
import { GlitchText } from "@/components/magicui/glitch-text";

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
                    // BORDER: Pure Black (rgb(0,0,0)) ALWAYS
                    "border-[3px] border-black rounded-[8px]",
                    // SHADOW: Standardized Neo Token
                    "shadow-neo border-black",
                    // HOVER
                    "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]",
                    className
                )}
            >
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black bg-[#FFC800] z-10">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 z-20 perspective-500">
                        <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-2 py-0.5 sm:px-3 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform origin-center hover:scale-110">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-3 sm:p-5 gap-3 z-10 relative">

                    {/* Title - High Contrast White in Dark Mode */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-lg sm:text-2xl font-black text-black dark:text-zinc-50 leading-[1.05] uppercase tracking-tighter mb-0.5 sm:mb-1">
                        <GlitchText text={article.title} />
                    </h3>

                    {/* Preview Text - Lighter Grey for Contrast */}
                    <p className="font-[family-name:var(--font-inter)] text-xs sm:text-sm font-semibold text-neutral-600 dark:text-zinc-300 line-clamp-3 sm:line-clamp-4 leading-relaxed tracking-normal">
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* SEPARATOR - Black Line */}
                    <div className="w-full h-px border-t-[2px] border-dashed border-black/10 dark:border-black/20 my-1 sm:my-2" />

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between pt-1 sm:pt-2">

                        {/* Author */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full border-2 border-black overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000]">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-0.5 min-w-0">
                                <span className="text-[11px] sm:text-xs font-black uppercase text-black dark:text-zinc-100 truncate tracking-wide max-w-[80px] sm:max-w-none">
                                    {authorName}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wide">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Actions Code - Pure Black Borders */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-2 border-black transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
                                    isLiked ? "bg-[#FFC800] text-black" : "bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Heart className={cn("w-5 h-5 stroke-[2.5px]", isLiked ? "fill-black stroke-black" : "stroke-current")} />
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
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-2 border-black bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#23A9FA] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <MessageCircle className="w-5 h-5 stroke-[2.5px] stroke-current" />
                            </button>

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-2 border-black bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#00F050] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <Share2 className="w-5 h-5 stroke-[2.5px] stroke-current" />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-2 border-black transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
                                    isBookmarked ? "bg-black text-white" : "bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#FF90E8]"
                                )}
                            >
                                <Bookmark className={cn("w-5 h-5 stroke-[2.5px]", isBookmarked ? "fill-current" : "stroke-current")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
