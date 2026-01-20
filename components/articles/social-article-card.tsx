"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BookOpen, ChevronUp, ChevronDown, Share, BadgeCheck } from "lucide-react";
import { Article } from "@/lib/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CyberArticleCard } from "@/components/themes/cybernetic/cyber-article-card";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

interface SocialArticleCardProps {
    article: Article;
    index?: number;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    variant?: "default" | "compact" | "community" | "writer";
    className?: string;
    badgeLabel?: string;
    badgeClassName?: string;
}

// Calculate reading time
function getReadingTime(content: string | null): number {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function SocialArticleCard({
    article,
    index = 0,
    initialLikes = 0,
    initialComments = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    variant = "writer",
    className,
    badgeLabel,
    badgeClassName
}: SocialArticleCardProps) {
    // Color theming based on variant
    const isWriter = variant === "writer";
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';
    const isPink = mounted && theme === 'pink';
    const isDarkPink = mounted && theme === 'dark-pink';
    const isCute = isPink || isDarkPink; // Both share the "cute" shape and ears
    const isBlood = mounted && theme === 'blood';

    // Default values if not provided
    const defaultBadgeText = isWriter ? "Yazar" : "Topluluk";
    const finalBadgeText = badgeLabel || defaultBadgeText;

    const defaultBadgeClass = isWriter ? "text-amber-500 bg-amber-500/10" : "text-primary bg-primary/10";
    const finalBadgeClass = badgeClassName || defaultBadgeClass;

    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.webp");

    // Optimistic UI States
    const targetArticleTitle = "Sessiz Bir Varsayım: Yerçekimi";
    const effectiveInitialLikes = article.title === targetArticleTitle ? 7 : initialLikes;

    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(effectiveInitialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isLikeLoading, setIsLikeLoading] = useState(false);


    const { triggerHaptic } = useHaptic();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLikeLoading) return;

        // Feedback
        if (!isLiked) {
            triggerHaptic();
            triggerSmallConfetti(e.clientX, e.clientY);
        }

        // Optimistic Update
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLikeLoading(true);

        try {
            const result = await toggleArticleLike(article.id);
            if (!result.success) {
                // Revert
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Beğenmek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            toast.error("Bağlantı hatası.");
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic
        const previousBookmarked = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            const result = await toggleArticleBookmark(article.id);
            if (!result.success) {
                setIsBookmarked(previousBookmarked);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Kaydetmek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            } else {
                if (!previousBookmarked) toast.success("Makale kaydedildi.");
                else toast.info("Makale kaydedilenlerden çıkarıldı.");
            }
        } catch (error) {
            setIsBookmarked(previousBookmarked);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/blog/${article.slug}`;
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.summary || article.title,
                url: url
            }).catch(() => { /* share cancelled or not supported - ignorable */ });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link kopyalandı!");
        }
    };

    // ----------------------------------------------------------------------
    // RENDER: CYBERNETIC THEME
    // ----------------------------------------------------------------------
    if (isCybernetic) {
        return (
            <CyberArticleCard
                article={article}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likeCount={likeCount}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
                badgeLabel={finalBadgeText}
            />
        );
    }

    // ----------------------------------------------------------------------
    // RENDER: STANDARD THEME (+ Pink Variants)
    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // RENDER: STANDARD THEME (Soft Neo-Brutalist Redesign)
    // ----------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("h-full", className)}
        >
            <Link href={`/blog/${article.slug}`} className="block h-full group font-sans">
                <article className={cn(
                    "relative flex flex-col h-full overflow-hidden rounded-[2rem] transition-all duration-300",
                    "bg-card border border-border/40", // Subtle border, no thick white border
                    "focus-within:border-foreground/20",
                    // PERSISTENT NEO-BRUTALIST SHADOW (Darkened for dark mode, not white)
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]",
                    "translate-x-[0px] translate-y-[0px] hover:-translate-y-1 hover:translate-x-1",
                    // Colored border on hover
                    "hover:border-primary/50 dark:hover:border-primary/50",
                    // PASTEL GREEN THEME FOR STANDARD ARTICLES
                    !isWriter && !isCybernetic && !isCute && !isBlood && "bg-[#d1fae5] dark:bg-[#064e3b]/30 border-emerald-500/20 hover:border-emerald-500/50",
                    // Theme Overrides
                    isCute && "rounded-[1.5rem] cute-border",
                    isBlood && "bg-[rgba(40,0,0,0.6)] border-red-900/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(200,20,20,0.3)]"
                )}>
                    {/* CUTE DECORATION: Cat Ears (Only visible in Pink) */}
                    {isCute && (
                        <>
                            <div className="cute-cat-ear-left group-hover:block transition-all" />
                            <div className="cute-cat-ear-right group-hover:block transition-all" />
                        </>
                    )}

                    {/* 1. HEADER: Category & Date (Compact Padding) */}
                    <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:pt-4 sm:pb-2">
                        <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border", // Slightly rectangular (rounded-md)
                            // Clean, non-neon look
                            isWriter
                                ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
                                : "bg-muted text-muted-foreground border-border/50"
                        )}>
                            {article.category || "GENEL"}
                        </span>
                        <time className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </time>
                    </div>

                    {/* 2. IMAGE SECTION - EDGE TO EDGE */}
                    {article.image_url && (
                        <div className="w-full mt-2 border-y-2 border-foreground/5">
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <Image
                                    src={imgSrc}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={() => setImgSrc("/images/placeholder-article.webp")}
                                />
                            </div>
                        </div>
                    )}

                    {/* 3. CONTENT BODY (Compact Padding, Reduced Line Clamp) */}
                    <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-2 sm:gap-3">
                        <h3 className={cn(
                            "text-lg sm:text-2xl font-bold font-heading leading-tight text-foreground/90 transition-colors",
                            "group-hover:text-primary dark:group-hover:text-primary"
                        )}>
                            {article.title}
                        </h3>

                        <p className="text-sm sm:text-base text-muted-foreground/80 line-clamp-3 sm:line-clamp-4 font-medium leading-relaxed">
                            {article.summary || (article.content ? article.content.replace(/<[^>]*>?/gm, '').slice(0, 180) + "..." : "Özet bulunmuyor.")}
                        </p>

                        {/* Author Info (Moved to bottom left) & Reading Time */}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8 border-2 border-background ring-1 ring-border/20 shadow-sm">
                                    <AvatarImage src={article.author?.avatar_url || ""} />
                                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                        {article.author?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground/90 group-hover:text-foreground transition-colors">
                                        {article.author?.full_name || article.author?.username || "Fizikhub"}
                                        <span className="ml-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                            BLOG
                                        </span>
                                    </span>
                                    {isWriter && (
                                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                                            <BadgeCheck className="w-2.5 h-2.5" />
                                            <span>YAZAR</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. FOOTER ACTIONS */}
                    <div className="px-5 py-4 border-t border-border/30 bg-muted/20 flex items-center justify-between group/actions">
                        {/* Text Info */}
                        <div className="flex items-center gap-1.5 text-xs sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{getReadingTime(article.content)} dk</span>
                        </div>

                        {/* Action Buttons (Strict Equal Spacing using fixed width containers + justify-between) */}
                        <div className="flex items-center gap-0 sm:gap-1">
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full transition-colors group/btn hover:bg-muted/50",
                                    isLiked ? "text-rose-500" : "text-muted-foreground/70 hover:text-rose-500"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5px]", isLiked && "fill-current")} />
                                <span className={cn("ml-1 text-[10px] font-bold", isLiked && "text-rose-600 dark:text-rose-400")}>{likeCount}</span>
                            </button>

                            <Link href={`/blog/${article.slug}#comments`} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/70 hover:text-blue-500 hover:bg-muted/50 transition-colors">
                                <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5px]" />
                            </Link>

                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-muted/50",
                                    isBookmarked ? "text-amber-500" : "text-muted-foreground/70 hover:text-amber-500"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5px]", isBookmarked && "fill-current")} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                            >
                                <Share className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5px]" />
                            </button>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
