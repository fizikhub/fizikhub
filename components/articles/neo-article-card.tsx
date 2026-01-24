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
                    "flex flex-col h-full relative",
                    "bg-white dark:bg-[#111]",
                    "border-4 border-black dark:border-white rounded-none sm:rounded-2xl", // Sharp or slightly rounded
                    "shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff]", // HUGE SHADOW
                    "transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] dark:hover:shadow-[12px_12px_0px_0px_#fff]",
                    className
                )}
            >
                {/* 1. HEADER BAR - Unique 'Folder Tab' look */}
                <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black dark:border-white bg-[#FFC800] text-black">
                    <div className="flex items-center gap-3">
                        {/* Author Avatar - Explicitly Visible */}
                        <div className="relative w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-white">
                            <Image
                                src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                alt={article.profiles?.full_name || "Yazar"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xs uppercase tracking-wider">
                                {article.profiles?.full_name || "ANONİM"}
                            </span>
                            <span className="font-bold text-[10px] opacity-80">
                                {article.created_at
                                    ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })
                                    : "Tarih yok"}
                            </span>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="px-2 py-1 bg-black text-white text-[10px] font-black uppercase rounded-sm">
                        {article.category || "GENEL"}
                    </div>
                </div>

                {/* 2. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-4 border-black dark:border-white overflow-hidden bg-neutral-200">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* Halftone Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                {/* 3. CONTENT BODY */}
                <div className="flex flex-col flex-1 p-5 gap-4 bg-white dark:bg-[#111]">
                    <h3 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-black text-black dark:text-white leading-[0.95] uppercase">
                        {article.title}
                    </h3>

                    <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-600 dark:text-neutral-400 line-clamp-3">
                        {article.summary}
                    </p>
                </div>

                {/* 4. ACTION FOOTER - The 'Control Panel' */}
                <div className="mt-auto px-5 py-4 border-t-4 border-black dark:border-white bg-neutral-100 dark:bg-zinc-900 flex items-center justify-between">

                    {/* Left Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className="group/btn flex items-center gap-2 hover:bg-[#FFC800] px-3 py-2 rounded-lg border-2 border-transparent hover:border-black transition-all"
                        >
                            <Heart className={cn("w-6 h-6 stroke-[3px]", isLiked ? "fill-red-500 stroke-red-500" : "stroke-black dark:stroke-white")} />
                            <span className="font-black text-sm">{likeCount}</span>
                        </button>

                        <Link href={`/blog/${article.slug}#comments`} className="group/btn flex items-center gap-2 hover:bg-[#23A9FA] px-3 py-2 rounded-lg border-2 border-transparent hover:border-black transition-all">
                            <MessageCircle className="w-6 h-6 stroke-[3px] stroke-black dark:stroke-white" />
                            <span className="font-black text-sm">{initialComments}</span>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 hover:bg-[#00F050] rounded-lg border-2 border-transparent hover:border-black transition-all"
                        >
                            <Share2 className="w-6 h-6 stroke-[3px] stroke-black dark:stroke-white" />
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={cn(
                                "p-2 rounded-lg border-2 transition-all",
                                isBookmarked
                                    ? "bg-black text-white border-black"
                                    : "hover:bg-[#FF90E8] border-transparent hover:border-black text-black dark:text-white"
                            )}
                        >
                            <Bookmark className={cn("w-6 h-6 stroke-[3px]", isBookmarked && "fill-white stroke-white")} />
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
}
