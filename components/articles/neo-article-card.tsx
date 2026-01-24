"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowUpRight, Heart, Bookmark, Share2 } from "lucide-react";
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

    return (
        <Link href={`/blog/${article.slug}`} className="block group h-full">
            <article
                className={cn(
                    "flex flex-col h-full relative overflow-hidden",
                    // BORDER & SHAPE
                    "bg-white dark:bg-[#18181b]",
                    "border-[3px] border-black dark:border-white rounded-xl",
                    // PRIMARY SHADOW - Deep and Hard
                    "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#fff]",
                    // HOVER INTERACTION
                    "transition-all duration-200 ease-out",
                    "hover:translate-x-[2px] hover:translate-y-[2px]",
                    "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                    className
                )}
            >
                {/* 1. IMAGE SECTION with Bottom Border */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black dark:border-white bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Category Tag - Absolute & Bold */}
                    <div className="absolute top-0 left-0">
                        <span className={cn(
                            "inline-flex items-center justify-center px-4 py-2",
                            "text-xs font-black uppercase tracking-widest text-black",
                            "bg-[#FFC800] border-b-[3px] border-r-[3px] border-black",
                            "rounded-br-xl"
                        )}>
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                    {/* Header: Date & Author Name */}
                    <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                        <span>{article.profiles?.full_name || "ANONİM"}</span>
                        <span>
                            {article.created_at
                                ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })
                                : "TARİH YOK"}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black text-black dark:text-white leading-[1.1] uppercase line-clamp-3 group-hover:underline decoration-4 underline-offset-4 decoration-[#FFC800]">
                        {article.title}
                    </h3>

                    {/* Excerpt - Hidden on mobile for cleaner look, visible on desktop */}
                    <p className="hidden sm:block font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {article.summary}
                    </p>
                    <button
                        onClick={handleBookmark}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-md border-2 border-black dark:border-white transition-all",
                            isBookmarked ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                    </button>
                </div>
            </div>
        </div>
            </article >
        </Link >
    );
}
