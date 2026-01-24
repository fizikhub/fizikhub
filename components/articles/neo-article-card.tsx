"use client";

import Link from "next/link";
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

    // Helper: Strip HTML tags to get raw text for "first 4 lines"
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
        <Link href={`/blog/${article.slug}`} className="block group h-full">
            <article
                className={cn(
                    "flex flex-col h-full bg-white dark:bg-[#111] relative overflow-hidden",
                    // THE NEO-BRUTALIST CONTAINER - Premium Finish
                    "border-[3px] border-black dark:border-white rounded-xl",
                    "shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]",
                    "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                    className
                )}
            >
                {/* NOISE TEXTURE OVERLAY */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black dark:border-white bg-[#FFC800] z-10">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label - 3D STICKER EFFECT */}
                    <div className="absolute top-3 left-3 z-20 perspective-500">
                        <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform origin-center hover:scale-110">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-3 z-10 relative">

                    {/* Title - PREMIUM TYPOGRAPHY */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black text-black dark:text-white leading-[1.0] uppercase tracking-tighter mb-1">
                        <span className="bg-gradient-to-r from-transparent to-transparent group-hover:from-[#FFC800]/30 group-hover:to-[#FFC800]/30 transition-all duration-300 rounded-sm">
                            {article.title}
                        </span>
                    </h3>

                    {/* Preview Text */}
                    <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-600 dark:text-neutral-400 line-clamp-4 leading-relaxed tracking-normal">
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* THE ZIGZAG SEPARATOR */}
                    <div className="h-4 w-[calc(100%+40px)] -mx-5 my-2 overflow-hidden relative opacity-30">
                        <div className="absolute inset-0 bg-repeat-x bg-left-bottom h-[10px] w-full animate-slide-slow"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L10 0 L20 10' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E")`
                            }}
                        />
                    </div>

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between mt-1">

                        {/* Author */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-9 h-9 flex-shrink-0 rounded-full border-2 border-black dark:border-white overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff]">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-0.5 min-w-0">
                                <span className="text-xs font-black uppercase text-black dark:text-white truncate tracking-widest">
                                    {authorName}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Actions Code - Tactile Buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black dark:border-white transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]",
                                    isLiked ? "bg-[#FFC800]" : "bg-white dark:bg-black hover:bg-neutral-50"
                                )}
                            >
                                <Heart className={cn("w-3.5 h-3.5 stroke-[2.5px]", isLiked ? "fill-black stroke-black" : "stroke-black dark:stroke-white")} />
                            </button>

                            {/* Comment */}
                            <Link href={`/blog/${article.slug}#comments`}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-[#23A9FA] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                            >
                                <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px] stroke-black dark:stroke-white" />
                            </Link>

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-[#00F050] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                            >
                                <Share2 className="w-3.5 h-3.5 stroke-[2.5px] stroke-black dark:stroke-white" />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black dark:border-white transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]",
                                    isBookmarked ? "bg-black dark:bg-white text-white dark:text-black" : "bg-white dark:bg-black text-black dark:text-white hover:bg-[#FF90E8]"
                                )}
                            >
                                <Bookmark className={cn("w-3.5 h-3.5 stroke-[2.5px]", isBookmarked ? "fill-current" : "stroke-black dark:stroke-white")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
