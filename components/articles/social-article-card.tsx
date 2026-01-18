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
                    "relative flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300",
                    "bg-card border-2 border-border", // Thicker border
                    "hover:border-slate-400 dark:hover:border-slate-600", // Neutral border on hover
                    "shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1", // Lift & Deep Shadow
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

                    {/* 1. HEADER: Category & Metadata */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                isWriter
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                            )}>
                                {article.category || "GENEL"}
                            </span>
                            {isWriter && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-500">
                                    <BadgeCheck className="w-3 h-3" />
                                    <span>YAZAR</span>
                                </div>
                            )}
                        </div>
                        <time className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </time>
                    </div>

                    {/* 2. IMAGE SECTION (Clean) */}
                    {article.image_url && (
                        <div className="relative aspect-video w-full overflow-hidden border-b border-border/50 bg-muted">
                            <Image
                                src={imgSrc}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                onError={() => setImgSrc("/images/placeholder-article.webp")}
                            />
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                        </div>
                    )}

                    {/* 3. CONTENT BODY */}
                    <div className="flex-1 p-5 flex flex-col gap-3 bg-gradient-to-b from-card to-muted/10">
                        <h3 className={cn(
                            "text-xl sm:text-2xl font-bold font-heading leading-tight text-foreground transition-colors",
                            "group-hover:text-rose-600 dark:group-hover:text-rose-500"
                        )}>
                            {article.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 font-medium leading-relaxed">
                            {article.summary || (article.content ? article.content.replace(/<[^>]*>?/gm, '').slice(0, 120) + "..." : "Özet bulunmuyor.")}
                        </p>

                        {/* Author Info */}
                        <div className="mt-auto pt-4 flex items-center gap-2">
                            <Avatar className="w-6 h-6 border-2 border-background ring-1 ring-border">
                                <AvatarImage src={article.author?.avatar_url || ""} />
                                <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">
                                    {article.author?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                                {article.author?.full_name || article.author?.username || "Fizikhub"}
                            </span>
                        </div>
                    </div>

                    {/* 4. FOOTER ACTIONS */}
                    <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between bg-muted/5 group/actions">
                        {/* Reading Time */}
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                            <BookOpen className="w-3 h-3" />
                            <span>{getReadingTime(article.content)} dk</span>
                        </div>

                        {/* Action Buttons (Stop Propagation to prevent Link navigation) */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors relative group/btn",
                                    isLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-600"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 stroke-[2.5px]", isLiked && "fill-current")} />
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap bg-background border px-1 rounded shadow-sm">
                                    {likeCount}
                                </span>
                            </button>

                            <Link href={`/blog/${article.slug}#comments`} className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-muted-foreground hover:text-blue-600 transition-colors">
                                <MessageCircle className="w-4 h-4 stroke-[2.5px]" />
                            </Link>

                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "p-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors",
                                    isBookmarked ? "text-amber-500" : "text-muted-foreground hover:text-amber-600"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4 stroke-[2.5px]", isBookmarked && "fill-current")} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Share className="w-4 h-4 stroke-[2.5px]" />
                            </button>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
