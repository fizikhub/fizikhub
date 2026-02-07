"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, ArrowUpRight } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";

interface JournalCardProps {
    article: Article;
    variant?: 'cover' | 'feature' | 'standard' | 'minimal';
    initialLikes?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
}

export function JournalCard({
    article,
    variant = 'standard',
    initialLikes = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
}: JournalCardProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const { triggerHaptic } = useHaptic();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        triggerHaptic();
        const prev = isLiked;
        setIsLiked(!isLiked);
        const result = await toggleArticleLike(article.id);
        if (!result.success) {
            setIsLiked(prev);
            if (result.error === "Giriş yapmalısınız.") toast.error("Giriş yapmalısınız!");
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        triggerHaptic();
        const prev = isBookmarked;
        setIsBookmarked(!isBookmarked);
        const result = await toggleArticleBookmark(article.id);
        if (!result.success) {
            setIsBookmarked(prev);
            if (result.error === "Giriş yapmalısınız.") toast.error("Giriş yapmalısınız!");
        } else if (!prev) {
            toast.success("Kaydedildi!");
        }
    };

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";
    const previewText = article.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) || article.summary || "";

    // Cover - Ana haber, büyük görsel
    if (variant === 'cover') {
        return (
            <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="group relative"
            >
                <Link href={`/blog/${article.slug}`} className="block">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm">
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <div className="max-w-3xl">
                                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-amber-400 mb-3">
                                    {article.category || "Genel"}
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
                                    {article.title}
                                </h2>
                                <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl mb-4">
                                    {previewText}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                                            <Image src={authorAvatar} alt={authorName} width={32} height={32} className="object-cover" />
                                        </div>
                                        <span className="text-sm font-medium text-white/90">{authorName}</span>
                                    </div>
                                    <span className="text-sm text-white/60">
                                        {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    }

    // Feature - Orta boy, yatay layout
    if (variant === 'feature') {
        return (
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group"
            >
                <Link href={`/blog/${article.slug}`} className="block">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                            <Image
                                src={article.image_url || "/images/placeholder-article.webp"}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="py-2">
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                                {article.category || "Genel"}
                            </span>
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-black dark:text-white leading-snug mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                                {previewText}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                        <Image src={authorAvatar} alt={authorName} width={24} height={24} className="object-cover" />
                                    </div>
                                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{authorName}</span>
                                    <span className="text-xs text-neutral-400">·</span>
                                    <span className="text-xs text-neutral-400">
                                        {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={handleLike} className={cn("p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors", isLiked && "text-red-500")}>
                                        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                    </button>
                                    <button onClick={handleBookmark} className={cn("p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors", isBookmarked && "text-amber-500")}>
                                        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    }

    // Standard - Dikey kart
    if (variant === 'standard') {
        return (
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group"
            >
                <Link href={`/blog/${article.slug}`} className="block">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-sm mb-4">
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                        {article.category || "Genel"}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-black dark:text-white leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                        {previewText}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-medium">{authorName}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}</span>
                    </div>
                </Link>
            </motion.article>
        );
    }

    // Minimal - Sadece başlık
    return (
        <motion.article
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group border-b border-neutral-200 dark:border-neutral-800 py-4 last:border-0"
        >
            <Link href={`/blog/${article.slug}`} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
                        {article.category || "Genel"}
                    </span>
                    <h4 className="text-base font-serif font-semibold text-black dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {article.title}
                    </h4>
                    <span className="text-xs text-neutral-500 mt-1 block">
                        {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                    </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-1" />
            </Link>
        </motion.article>
    );
}
