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

    return (
        <Link href={`/blog/${article.slug}`} className="block group h-full">
            <article
                className={cn(
                    "flex flex-col h-full bg-white dark:bg-[#111] relative overflow-hidden",
                    // THE NEO-BRUTALIST CONTAINER
                    "border-[3px] border-black dark:border-white rounded-xl",
                    "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_#fff]",
                    "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                    className
                )}
            >
                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black dark:border-white bg-[#FFC800]">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label - Styled like a sticker */}
                    <div className="absolute top-4 left-0">
                        <span className="bg-white border-y-[3px] border-r-[3px] border-black text-black px-3 py-1 font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000]">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-4">

                    {/* Title - Bold & Highlighted */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black text-black dark:text-white leading-[1.1] uppercase">
                        <span className="bg-gradient-to-r from-[#FFC800]/50 to-[#FFC800]/50 bg-[length:100%_40%] bg-no-repeat bg-bottom group-hover:bg-[length:100%_100%] transition-all duration-300">
                            {article.title}
                        </span>
                    </h3>

                    {/* Summary - Blockquote Style */}
                    <div className="border-l-[4px] border-[#FFC800] pl-3 py-1">
                        <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-4 leading-relaxed">
                            {article.summary}
                        </p>
                    </div>

                    {/* Spacer to push footer down */}
                    <div className="mt-auto"></div>

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between pt-4 border-t-[3px] border-black/10 dark:border-white/10 border-dashed">

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full border-2 border-black dark:border-white overflow-hidden bg-neutral-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                                <Image
                                    src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                    alt={article.profiles?.full_name || "Yazar"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-xs font-black uppercase text-black dark:text-white">
                                    {article.profiles?.full_name || "Anonim"}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-500 uppercase">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black dark:border-white transition-all transform active:scale-90",
                                    isLiked ? "bg-[#FFC800] shadow-[2px_2px_0px_0px_#000]" : "bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 stroke-[2.5px]", isLiked ? "fill-black stroke-black" : "stroke-black dark:stroke-white")} />
                            </button>

                            {/* Comment */}
                            <Link href={`/blog/${article.slug}#comments`}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black dark:border-white bg-transparent hover:bg-[#23A9FA] transition-all transform active:scale-90"
                            >
                                <MessageCircle className="w-4 h-4 stroke-[2.5px] stroke-black dark:stroke-white" />
                            </Link>

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black dark:border-white bg-transparent hover:bg-[#00F050] transition-all transform active:scale-90"
                            >
                                <Share2 className="w-4 h-4 stroke-[2.5px] stroke-black dark:stroke-white" />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black dark:border-white transition-all transform active:scale-90",
                                    isBookmarked ? "bg-black dark:bg-white text-white dark:text-black" : "bg-transparent hover:bg-[#FF90E8]"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4 stroke-[2.5px]", isBookmarked ? "fill-current" : "stroke-black dark:stroke-white")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
