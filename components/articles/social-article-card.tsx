"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BookOpen, ChevronUp, ChevronDown, Share, BadgeCheck, Zap } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                    toast.error("Bir hata oluştu hocam.");
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
                    toast.error("Bir hata oluştu hocam.");
                }
            } else {
                if (!previousBookmarked) toast.success("Makale kaydedildi.");
                else toast.info("Kaydetme geri alındı.");
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

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
                "group relative bg-card text-card-foreground kinetic-card rounded-none border-l-4 border-l-primary hover:border-l-destructive",
                className
            )}
        >
            {/* Tech Deco Elements */}
            <div className="absolute top-0 right-0 p-1">
                <div className="w-2 h-2 bg-muted-foreground/20 rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-4 sm:p-5">

                {/* Image Section - Data Window */}
                <Link href={`/blog/${article.slug}`} className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 bg-black overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors" prefetch={false}>
                    {article.image_url ? (
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            onError={() => setImgSrc("/images/placeholder-article.webp")}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <Zap className="w-10 h-10 text-muted-foreground" />
                        </div>
                    )}

                    {/* Overlay Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
                </Link>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between pt-4 sm:pt-0">
                    <Link href={`/blog/${article.slug}`} prefetch={false} className="block">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                                {article.category || "GENEL"} // {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                            </span>
                            {isWriter && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                        </div>

                        <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 font-mono opacity-80">
                            {article.summary || (article.content ? article.content.replace(/<[^>]*>?/gm, '').slice(0, 100) + "..." : "Sinyal yok...")}
                        </p>
                    </Link>

                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                        <div className="flex items-center gap-4">
                            <button onClick={handleLike} className="flex items-center gap-1.5 group/btn">
                                <Heart className={cn("w-4 h-4 transition-all group-hover/btn:scale-110", isLiked ? "fill-destructive stroke-destructive" : "stroke-muted-foreground")} />
                                <span className="text-xs font-mono">{likeCount}</span>
                            </button>
                            <Link href={`/blog/${article.slug}#comments`} className="flex items-center gap-1.5 group/btn">
                                <MessageCircle className="w-4 h-4 stroke-muted-foreground group-hover/btn:stroke-primary transition-colors" />
                                <span className="text-xs font-mono">{initialComments}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
                                {getReadingTime(article.content)} DK OKUMA
                            </div>
                            <button onClick={handleShare}>
                                <Share2 className="w-4 h-4 stroke-muted-foreground hover:stroke-foreground transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
