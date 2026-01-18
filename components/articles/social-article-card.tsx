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

    const defaultBadgeClass = isWriter ? "text-amber-500 bg-amber-500/10" : "text-red-500 bg-red-500/10";
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
            }).catch(() => { });
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300",
                "bg-card border border-border",
                "shadow-sm hover:shadow-md hover:border-border/80",
                // Cybernetic theme overrides
                isCybernetic && "cyber-card cyber-lift",
                // Pink / Dark Pink theme overrides
                isCute && "cute-border rounded-[1.5rem]",
                // Blood theme overrides
                isBlood && "bg-[rgba(40,0,0,0.6)] border-red-900/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(200,20,20,0.3)]",
                // No more bg-white override for pink - use bg-card always
                className
            )}
        >
            {/* CUTE DECORATION: Cat Ears (Only visible in Pink) */}
            {isCute && (
                <>
                    <div className="cute-cat-ear-left group-hover:block transition-all" />
                    <div className="cute-cat-ear-right group-hover:block transition-all" />
                </>
            )}

            {/* HUD DECORATION: Random Data Numbers (Only visible in Cybernetic) */}
            {isCybernetic && (
                <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-500/50 pointer-events-none z-20 select-none">
                    NO.{index + 4209}-{Math.floor(Math.random() * 99)}
                </div>
            )}
            {/* 1. TOP BAR: Category & Date */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-xs font-bold tracking-wide",
                        isWriter
                            ? "text-amber-600 dark:text-amber-500"
                            : "text-red-600 dark:text-red-500"
                    )}>
                        {article.category || "GENEL"}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground/60">
                    {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                </span>
            </div>

            {/* Main Link Wrapper */}
            <Link href={`/blog/${article.slug}`} className="block flex-1 group/content" prefetch={false}>

                {/* 2. HERO IMAGE */}
                {article.image_url && (
                    <div className="relative aspect-video w-full overflow-hidden border-b border-border/30 bg-muted">
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover/content:scale-[1.03]"
                            onError={() => setImgSrc("/images/placeholder-article.webp")}
                        />
                        {/* Subtle vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                    </div>
                )}

                {/* 3. CONTENT BODY */}
                <div className="p-5 flex flex-col gap-3">
                    {/* Title */}
                    <h3 className={cn(
                        "font-heading font-extrabold text-xl sm:text-2xl leading-[1.2] text-foreground transition-colors",
                        isWriter ? "group-hover/content:text-amber-600 dark:group-hover/content:text-amber-400" : "group-hover/content:text-red-600 dark:group-hover/content:text-red-400",
                        // Cybernetic theme: gradient text on hover
                        isCybernetic && "group-hover/content:cyber-text"
                    )}>
                        {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-[15px] leading-relaxed text-muted-foreground font-sans line-clamp-2">
                        {article.summary || (article.content ? article.content.replace(/<[^>]*>?/gm, '').slice(0, 120) + "..." : "Özet bulunmuyor.")}
                    </p>

                    {/* Author Mini-Row (Inside Content) */}
                    <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-6 h-6 border border-border">
                            <AvatarImage src={article.author?.avatar_url || ""} />
                            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                                {article.author?.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors">
                            {article.author?.full_name || article.author?.username || "Fizikhub"}
                        </span>
                        {isWriter && (
                            <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
                        )}
                    </div>
                </div>
            </Link>

            {/* 4. BOTTOM ACTION BAR */}
            <div className="mt-auto px-5 py-3 border-t border-border/50 flex items-center justify-between pointer-events-auto bg-muted/5">
                {/* Left Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        disabled={isLikeLoading}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-bold transition-colors",
                            isLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Heart className={cn("w-4 h-4 stroke-[2.5px]", isLiked && "fill-current")} />
                        <span>{likeCount}</span>
                    </button>

                    <Link
                        href={`/blog/${article.slug}#comments`}
                        className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MessageCircle className="w-4 h-4 stroke-[2.5px]" />
                        <span>{initialComments}</span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border border-border/50">
                        <BookOpen className="w-3 h-3" />
                        {getReadingTime(article.content)} dk
                    </div>

                    <button
                        onClick={handleBookmark}
                        className={cn(
                            "transition-colors",
                            isBookmarked ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Bookmark className={cn("w-4.5 h-4.5 stroke-[2.5px]", isBookmarked && "fill-current")} />
                    </button>

                    <button
                        onClick={handleShare}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Share className="w-4.5 h-4.5 stroke-[2.5px]" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
