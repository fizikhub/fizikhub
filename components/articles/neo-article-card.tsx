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
                    "flex flex-col h-full bg-white dark:bg-[#111] relative overflow-hidden",
                    // BORDER & SHAPE
                    "border-2 border-black dark:border-white rounded-xl",
                    // PRIMARY SHADOW
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#fff]",
                    // HOVER INTERACTION
                    "transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    "group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                    "group-hover:shadow-none",
                    className
                )}
            >
                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-2 border-black dark:border-white bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className={cn(
                            "inline-flex items-center px-3 py-1",
                            "text-xs font-black uppercase tracking-wider text-black",
                            "bg-[#FFC800] border-2 border-black rounded-md",
                            "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                            "group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all"
                        )}>
                            {article.category || "Genel"}
                        </span>
                    </div>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-xl font-extrabold text-black dark:text-white leading-tight line-clamp-2 uppercase group-hover:text-[#23A9FA] transition-colors">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-600 dark:text-neutral-400 line-clamp-3">
                        {article.summary}
                    </p>

                    {/* Footer: User & Date */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-neutral-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full border-2 border-black dark:border-white overflow-hidden bg-neutral-200">
                                <Image
                                    src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                    alt={article.profiles?.full_name || "Yazar"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-0.5">
                                <span className="text-[11px] font-black uppercase text-black dark:text-white">
                                    {article.profiles?.full_name || "Anonim"}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                    {article.created_at
                                        ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })
                                        : "Tarih yok"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-md border-2 border-black dark:border-white transition-all",
                                    isLiked ? "bg-[#FFC800] dark:bg-[#FFC800] text-black" : "bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isLiked && "fill-black stroke-black")} />
                            </button>

                            {/* Bookmark Button */}
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
            </article>
        </Link>
    );
}
