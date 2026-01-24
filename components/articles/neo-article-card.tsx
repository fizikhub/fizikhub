"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, MessageCircle, ExternalLink } from "lucide-react";
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
                    "flex flex-col h-full bg-white dark:bg-[#111]",
                    "border-4 border-black dark:border-white", // Thick outer border
                    "shadow-[8px_8px_0px_0px_#FFC800] dark:shadow-[8px_8px_0px_0px_#222]", // Colored Shadow
                    "transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFC800]",
                    className
                )}
            >
                {/* GRID ROW 1: HEADER INFO */}
                <div className="flex border-b-4 border-black dark:border-white h-10 divide-x-4 divide-black dark:divide-white">
                    <div className="flex-1 flex items-center px-3 bg-black text-white dark:bg-white dark:text-black">
                        <span className="font-mono text-xs font-bold uppercase truncate">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                    <div className="px-3 flex items-center justify-center bg-[#FF90E8] text-black w-24">
                        <span className="font-mono text-[10px] font-black">
                            {article.created_at ? formatDistanceToNow(new Date(article.created_at), { locale: tr }).toUpperCase() : "..."}
                        </span>
                    </div>
                </div>

                {/* GRID ROW 2: IMAGE */}
                <div className="relative aspect-[16/9] w-full border-b-4 border-black dark:border-white overflow-hidden bg-neutral-100">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                    />
                    {/* SVG Noise Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Floating Avatar Badge */}
                    <div className="absolute bottom-0 left-0 p-2">
                        <div className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 shadow-[4px_4px_0px_0px_#000]">
                            <div className="relative w-5 h-5 rounded-sm overflow-hidden border border-black">
                                <Image
                                    src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                    alt="Author"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase text-black">
                                {article.profiles?.full_name || "YAZAR"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* GRID ROW 3: CONTENT */}
                <div className="flex-1 p-4 bg-white dark:bg-[#111]">
                    <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black leading-[0.9] uppercase text-black dark:text-white mb-2 group-hover:underline decoration-4 decoration-[#FF90E8]">
                        {article.title}
                    </h3>
                    <p className="font-mono text-xs font-medium text-neutral-500 line-clamp-3">
                        {article.summary}
                    </p>
                </div>

                {/* GRID ROW 4: ACTION TOOLBAR */}
                <div className="grid grid-cols-4 h-12 border-t-4 border-black dark:border-white divide-x-4 divide-black dark:divide-white bg-neutral-100 dark:bg-zinc-900">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center justify-center hover:bg-[#FFC800] transition-colors group/btn",
                            isLiked && "bg-[#FFC800]"
                        )}
                    >
                        <Heart className={cn("w-5 h-5 transition-transform group-active/btn:scale-90", isLiked ? "fill-black stroke-black" : "stroke-black dark:stroke-white")} />
                    </button>

                    <Link href={`/blog/${article.slug}#comments`} className="flex items-center justify-center hover:bg-[#23A9FA] transition-colors group/btn">
                        <MessageCircle className="w-5 h-5 stroke-black dark:stroke-white transition-transform group-active/btn:scale-90" />
                    </Link>

                    <button
                        onClick={handleBookmark}
                        className="flex items-center justify-center hover:bg-[#FF90E8] transition-colors group/btn"
                    >
                        <Bookmark className={cn("w-5 h-5 transition-transform group-active/btn:scale-90", isBookmarked ? "fill-black stroke-black" : "stroke-black dark:stroke-white")} />
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center hover:bg-[#00F050] transition-colors group/btn"
                    >
                        <Share2 className="w-5 h-5 stroke-black dark:stroke-white transition-transform group-active/btn:scale-90" />
                    </button>
                </div>
            </article>
        </Link>
    );
}
