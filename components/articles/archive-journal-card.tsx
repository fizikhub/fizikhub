"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, MessageCircle, Eye, ArrowUpRight } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

type CardVariant = 'featured' | 'standard' | 'compact';

interface ArchiveJournalCardProps {
    article: Article;
    variant?: CardVariant;
    index?: number;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    className?: string;
}

export function ArchiveJournalCard({
    article,
    variant = 'standard',
    index = 0,
    initialLikes = 0,
    initialComments = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    className
}: ArchiveJournalCardProps) {
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
        triggerHaptic();
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
        triggerHaptic();
        const url = `${window.location.origin}/blog/${article.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link kopyalandı!");
    };

    const getPreviewText = (htmlContent: string | null | undefined, summary: string | null | undefined) => {
        if (htmlContent) {
            const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (plainText.length > 20) return plainText;
        }
        return summary || "Bu makale için içerik önizlemesi bulunmuyor.";
    };

    const previewText = getPreviewText(article.content, article.summary);
    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";

    // Issue number based on index for magazine feel
    const issueNumber = String(index + 1).padStart(2, '0');

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const
            }
        }
    };

    if (variant === 'featured') {
        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={cn("group", className)}
            >
                <Link href={`/blog/${article.slug}`} className="block">
                    <article className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] border-[3px] border-black dark:border-white rounded-xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] transition-all duration-300 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff]">

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Image Section */}
                            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black dark:border-white">
                                <Image
                                    src={article.image_url || "/images/placeholder-article.webp"}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Issue Number Badge */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[#FFC800] border-2 border-black text-black font-black text-lg shadow-[2px_2px_0px_0px_#000] rotate-[-3deg] group-hover:rotate-0 transition-transform">
                                        {issueNumber}
                                    </span>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="inline-block bg-black text-white px-3 py-1.5 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#FFC800]">
                                        {article.category || "GENEL"}
                                    </span>
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col p-6 lg:p-8">
                                {/* Reading Time / Views */}
                                <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {article.views || 0} görüntülenme
                                    </span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}</span>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white leading-[1.1] uppercase tracking-tight mb-4 group-hover:text-[#FFC800] transition-colors">
                                    {article.title}
                                </h2>

                                {/* Preview */}
                                <p className="text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-6 leading-relaxed">
                                    {previewText}
                                </p>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Author & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black/10 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_#000]">
                                            <Image
                                                src={authorAvatar}
                                                alt={authorName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-sm font-black uppercase text-black dark:text-white tracking-wide">
                                            {authorName}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ActionButton onClick={handleLike} active={isLiked} activeColor="bg-[#FFC800]">
                                            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                            {likeCount > 0 && <span className="text-xs font-bold ml-1">{likeCount}</span>}
                                        </ActionButton>
                                        <ActionButton onClick={handleBookmark} active={isBookmarked} activeColor="bg-black dark:bg-white">
                                            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current", isBookmarked && "text-white dark:text-black")} />
                                        </ActionButton>
                                        <ActionButton onClick={handleShare}>
                                            <Share2 className="w-4 h-4" />
                                        </ActionButton>
                                    </div>
                                </div>

                                {/* Read More Indicator */}
                                <div className="mt-4 flex items-center gap-2 text-[#FFC800] font-black text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                    <span>Makaleyi Oku</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>
            </motion.div>
        );
    }

    // Standard & Compact variants
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn("group h-full", className)}
        >
            <Link href={`/blog/${article.slug}`} className="block h-full">
                <article className={cn(
                    "relative flex flex-col h-full overflow-hidden",
                    "bg-white dark:bg-[#1a1a1a]",
                    "border-[3px] border-black dark:border-white rounded-lg",
                    "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]",
                    "transition-all duration-200",
                    "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]"
                )}>
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-black dark:border-white">
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Issue Number */}
                        <div className="absolute top-3 left-3 z-20">
                            <span className="inline-flex items-center justify-center w-9 h-9 bg-[#FFC800] border-2 border-black text-black font-black text-sm shadow-[2px_2px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform">
                                {issueNumber}
                            </span>
                        </div>

                        {/* Category */}
                        <div className="absolute top-3 right-3 z-20">
                            <span className="inline-block bg-black text-white px-2 py-1 font-black text-[10px] uppercase tracking-wider border border-black">
                                {article.category || "GENEL"}
                            </span>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 sm:p-5">
                        {/* Date */}
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                            {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-black text-black dark:text-white leading-[1.15] uppercase tracking-tight mb-2 line-clamp-2 group-hover:text-[#FFC800] transition-colors">
                            {article.title}
                        </h3>

                        {/* Preview */}
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                            {previewText}
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-dashed border-black/10 dark:border-white/10">
                            {/* Author */}
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000] flex-shrink-0">
                                    <Image
                                        src={authorAvatar}
                                        alt={authorName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold uppercase text-black dark:text-white truncate max-w-[80px] sm:max-w-[100px]">
                                    {authorName}
                                </span>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center gap-1.5">
                                <ActionButton onClick={handleLike} active={isLiked} activeColor="bg-[#FFC800]" size="sm">
                                    <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
                                </ActionButton>
                                <ActionButton onClick={handleBookmark} active={isBookmarked} activeColor="bg-black dark:bg-white" size="sm">
                                    <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-current", isBookmarked && "text-white dark:text-black")} />
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}

// Helper Action Button Component
function ActionButton({
    children,
    onClick,
    active = false,
    activeColor = "bg-[#FFC800]",
    size = "default"
}: {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    active?: boolean;
    activeColor?: string;
    size?: 'sm' | 'default';
}) {
    const sizeClasses = size === 'sm'
        ? "w-8 h-8"
        : "w-9 h-9 sm:w-10 sm:h-10";

    return (
        <button
            onClick={onClick}
            className={cn(
                sizeClasses,
                "flex items-center justify-center rounded-lg",
                "border-2 border-black dark:border-white",
                "shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]",
                "transition-all duration-150",
                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff]",
                "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                active ? activeColor : "bg-white dark:bg-zinc-800 text-black dark:text-white"
            )}
        >
            {children}
        </button>
    );
}
