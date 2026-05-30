"use client";

import { ViewTransitionLink } from "@/components/ui/view-transition-link";
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
import { motion } from "framer-motion";

interface NeoArticleCardProps {
    article: Article;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    className?: string;
    priority?: boolean;
}

export function NeoArticleCard({
    article,
    initialLikes = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    className,
    priority = false
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
            // Dynamite import for heavy interaction library (canvas-confetti)
            import("@/lib/confetti").then(mod => {
                mod.triggerSmallConfetti(e.clientX, e.clientY);
            });
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
        } catch {
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
        } catch {
            setIsBookmarked(previousBookmarked);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/makale/${article.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link kopyalandı!");
    };

    const getPreviewText = (htmlContent: string | null | undefined, summary: string | null | undefined) => {
        const text = htmlContent 
            ? htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() 
            : (summary || "Bu makale için içerik önizlemesi bulunmuyor.");
            
        return text.replace(/^[#\s]+/, '');
    };

    const previewText = getPreviewText(article.content, article.summary);

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";

    return (
        <ViewTransitionLink href={`/makale/${article.slug}`} className="block group">
            <motion.article
                whileHover={{ y: -4, x: -4, boxShadow: "8px 8px 0px 0px #000" }}
                whileTap={{ y: 0, x: 0, boxShadow: "0px 0px 0px 0px #000", scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                    "flex flex-col relative overflow-hidden",
                    "bg-white dark:bg-[#27272a]",
                    "border-[3px] border-black rounded-none sm:rounded-none noise-bg", // Brutalist hard corners & texture
                    "shadow-[4px_4px_0px_0px_#000]",
                    className
                )}
            >
                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-[3px] border-black bg-[#EAB308] z-10">
                    <OptimizedImage
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 350px"
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 z-20 perspective-500">
                        <span className="inline-block bg-[#FFC700] border-[2px] border-black text-black px-3 py-1 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform origin-center hover:scale-110">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-3.5 sm:p-5 gap-2 sm:gap-3.5 z-10 relative bg-white dark:bg-[#18181b]">

                    {/* Title - Draw Highlight Underline Effect on Hover */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-[16px] sm:text-2xl font-black text-black dark:text-zinc-50 leading-[1.15] uppercase tracking-tighter mb-0.5 sm:mb-1">
                        <span className="relative inline-block">
                            <span className="relative z-10">{article.title}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[28%] bg-[#EAB308]/40 dark:bg-[#EAB308]/30 z-0 transition-all duration-300 ease-[var(--spring-easing)] group-hover:w-full rounded-none" />
                        </span>
                    </h3>

                    {/* Preview Text - Lighter Grey for Contrast */}
                    <p
                        data-nosnippet
                        className="font-[family-name:var(--font-inter)] text-[12.5px] sm:text-sm font-medium text-neutral-600 dark:text-zinc-400 line-clamp-3 leading-relaxed tracking-normal"
                    >
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* SEPARATOR - Black Line */}
                    <div className="w-full h-px border-t-[3px] border-solid border-black/10 dark:border-white/10 my-1 sm:my-2" />

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between pt-1 sm:pt-2">

                        {/* Author */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="relative aspect-square w-10 flex-shrink-0 rounded-none border-[3px] border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_#000]">
                                <OptimizedAvatar
                                    src={authorAvatar}
                                    alt={authorName}
                                    size={40}
                                    fillContainer
                                    className="w-full h-full grayscale-[20%]"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-0.5 min-w-0">
                                <span className="text-[10px] sm:text-xs font-black uppercase text-black dark:text-zinc-100 truncate tracking-wide max-w-[70px] sm:max-w-none">
                                    {authorName}
                                </span>
                                <span className="text-[8px] sm:text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wide">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Actions Code - Framer Motion Physics & 44px A11y Targets */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Like */}
                            <motion.button
                                onClick={handleLike}
                                whileHover={{ scale: 1.08, y: -2, boxShadow: "3px 3px 0px 0px #000" }}
                                whileTap={{ scale: 0.9, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                aria-label={isLiked ? "Beğenmekten Vazgeç" : "Beğen"}
                                className={cn(
                                    "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none border-[3px] border-black relative shadow-[2px_2px_0px_0px_#000]",
                                    isLiked ? "bg-[#FF90E8] text-black" : "bg-white dark:bg-[#27272a] text-black dark:text-white"
                                )}
                            >
                                <Heart className={cn("w-5 h-5 stroke-[3px]", isLiked ? "fill-black stroke-black" : "stroke-current")} />
                            </motion.button>

                            {/* Comment */}
                            <motion.button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const url = `/makale/${article.slug}#comments`;
                                    if (document.startViewTransition) {
                                        document.startViewTransition(() => {
                                            window.location.href = url;
                                        });
                                    } else {
                                        window.location.href = url;
                                    }
                                }}
                                whileHover={{ scale: 1.08, y: -2, boxShadow: "3px 3px 0px 0px #000" }}
                                whileTap={{ scale: 0.9, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                aria-label="Yorum Yap"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none border-[3px] border-black bg-white dark:bg-[#27272a] text-black dark:text-white hover:bg-[#23A9FA] shadow-[2px_2px_0px_0px_#000]"
                            >
                                <MessageCircle className="w-5 h-5 stroke-[3px] stroke-current" />
                            </motion.button>

                            {/* Share */}
                            <motion.button
                                onClick={handleShare}
                                whileHover={{ scale: 1.08, y: -2, boxShadow: "3px 3px 0px 0px #000" }}
                                whileTap={{ scale: 0.9, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                aria-label="Paylaş"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none border-[3px] border-black bg-white dark:bg-[#27272a] text-black dark:text-white hover:bg-[#B8FF01] hover:text-black shadow-[2px_2px_0px_0px_#000]"
                            >
                                <Share2 className="w-5 h-5 stroke-[3px] stroke-current" />
                            </motion.button>

                            {/* Bookmark */}
                            <motion.button
                                onClick={handleBookmark}
                                whileHover={{ scale: 1.08, y: -2, boxShadow: "3px 3px 0px 0px #000" }}
                                whileTap={{ scale: 0.9, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                aria-label={isBookmarked ? "Kaydedilenlerden Çıkar" : "Kaydet"}
                                className={cn(
                                    "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none border-[3px] border-black relative shadow-[2px_2px_0px_0px_#000]",
                                    isBookmarked ? "bg-black text-white" : "bg-white dark:bg-[#27272a] text-black dark:text-white hover:bg-[#FFC700]"
                                )}
                            >
                                <Bookmark className={cn("w-5 h-5 stroke-[3px]", isBookmarked ? "fill-current" : "stroke-current")} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.article>
        </ViewTransitionLink>
    );
}
