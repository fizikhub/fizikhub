"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
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
        <ViewTransitionLink href={`/blog/${article.slug}`} className="block group h-full">
            <article
                className={cn(
                    "flex flex-col h-full relative overflow-hidden",
                    // COLOR PALETTE: Dark Mode = #18181b (Zinc 900) - Darker
                    "bg-white dark:bg-[#18181b]",
                    // BORDER: Thicker Pure Black
                    "border-[3px] border-black rounded-xl",
                    // SHADOW: Bolder, deeper shadow
                    "shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1",
                    // HOVER
                    "transition-all duration-300 ease-out",
                    className
                )}
            >
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black bg-neutral-900 z-10 overflow-hidden">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Category Label - Absolute Cyber Badge */}
                    <div className="absolute top-0 left-0 z-20">
                        <div className="bg-[#FFC800] border-r-[3px] border-b-[3px] border-black text-black px-4 py-1.5 font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                            {article.category || "GENEL"}
                        </div>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-4 z-10 relative">

                    {/* Date/Author Meta Strip */}
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        <span>{formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}</span>
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <span className="text-black dark:text-neutral-300">{authorName}</span>
                    </div>

                    {/* Title - Massive & Bold */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black text-black dark:text-white leading-[1.0] uppercase tracking-tighter mb-1">
                        <span className="bg-gradient-to-r from-transparent to-transparent group-hover:from-[#FFC800] group-hover:to-[#FFC800] transition-all duration-300 box-decoration-clone px-0 group-hover:px-1 -ml-0 group-hover:-ml-1 text-inherit">
                            {article.title}
                        </span>
                    </h3>

                    {/* Preview Text */}
                    <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* SEPARATOR - Dashed Line */}
                    <div className="w-full h-px border-t-[2px] border-dashed border-black/20 dark:border-white/20 my-2" />

                    {/* 3. ACTIONS FOOTER - Cyber Buttons */}
                    <div className="flex items-center justify-between pt-1">
                        {/* Stats (Read Only) */}
                        <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
                            <span className="flex items-center gap-1 group/like">
                                <Heart className={cn("w-4 h-4 transition-colors", isLiked ? "fill-red-500 text-red-500" : "group-hover/like:text-red-500")} />
                                {likeCount}
                            </span>
                            <span className="flex items-center gap-1 group/comment">
                                <MessageCircle className="w-4 h-4 group-hover/comment:text-blue-500 transition-colors" />
                                {initialComments}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded border-2 border-black transition-all",
                                    "shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                                    isLiked ? "bg-red-500 text-white" : "bg-white hover:bg-neutral-100 text-black"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 stroke-[3px]", isLiked ? "fill-current stroke-current" : "stroke-current")} />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded border-2 border-black transition-all",
                                    "shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                                    isBookmarked ? "bg-black text-white" : "bg-white hover:bg-neutral-100 text-black"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4 stroke-[3px]", isBookmarked ? "fill-current" : "stroke-current")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
