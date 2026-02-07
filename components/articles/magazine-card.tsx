"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, Eye, ArrowRight, Zap } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

interface MagazineCardProps {
    article: Article;
    index: number;
    variant?: 'hero' | 'featured' | 'compact';
    initialLikes?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
}

export function MagazineCard({
    article,
    index,
    variant = 'compact',
    initialLikes = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
}: MagazineCardProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const { triggerHaptic } = useHaptic();
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLiked) {
            triggerHaptic();
            triggerSmallConfetti(e.clientX, e.clientY);
        }
        const prev = isLiked;
        setIsLiked(!isLiked);
        setLikeCount(c => isLiked ? c - 1 : c + 1);
        const result = await toggleArticleLike(article.id);
        if (!result.success) {
            setIsLiked(prev);
            setLikeCount(c => prev ? c + 1 : c - 1);
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

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        triggerHaptic();
        navigator.clipboard.writeText(`${window.location.origin}/blog/${article.slug}`);
        toast.success("Link kopyalandı!");
    };

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";
    const previewText = article.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) || article.summary || "";

    // Hero variant - tam genişlik, büyük görsel
    if (variant === 'hero') {
        return (
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="group perspective-1000"
            >
                <Link href={`/blog/${article.slug}`}>
                    <article className="relative overflow-hidden rounded-2xl border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#FFC800] hover:shadow-[4px_4px_0px_0px_#FFC800] hover:translate-x-1 hover:translate-y-1 transition-all duration-300">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[350px] overflow-hidden">
                                <Image
                                    src={article.image_url || "/images/placeholder-article.webp"}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Category Badge */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute top-4 left-4"
                                >
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC800] text-black text-xs font-black uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                        <Zap className="w-3 h-3" />
                                        {article.category || "GENEL"}
                                    </span>
                                </motion.div>

                                {/* Views */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-xs font-bold">
                                    <Eye className="w-3.5 h-3.5" />
                                    {article.views || 0}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3"
                                    >
                                        {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl md:text-3xl font-black text-black dark:text-white leading-tight mb-4 group-hover:text-[#FFC800] transition-colors"
                                    >
                                        {article.title}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-6"
                                    >
                                        {previewText}...
                                    </motion.p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black/10 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                                            <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-black dark:text-white">{authorName}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ActionBtn onClick={handleLike} active={isLiked} color="bg-red-500">
                                            <Heart className={cn("w-4 h-4", isLiked && "fill-current text-white")} />
                                        </ActionBtn>
                                        <ActionBtn onClick={handleBookmark} active={isBookmarked} color="bg-purple-500">
                                            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current text-white")} />
                                        </ActionBtn>
                                        <ActionBtn onClick={handleShare}>
                                            <Share2 className="w-4 h-4" />
                                        </ActionBtn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>
            </motion.div>
        );
    }

    // Featured variant - orta boy
    if (variant === 'featured') {
        return (
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="group perspective-1000 h-full"
            >
                <Link href={`/blog/${article.slug}`} className="block h-full">
                    <article className="relative h-full overflow-hidden rounded-xl border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200">
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                                src={article.image_url || "/images/placeholder-article.webp"}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Category */}
                            <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 bg-[#FFC800] text-black text-[10px] font-black uppercase tracking-wider rounded-md border-2 border-black">
                                    {article.category || "GENEL"}
                                </span>
                            </div>

                            {/* Read indicator on hover */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Oku <ArrowRight className="w-3 h-3" />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col h-[calc(100%-theme(spacing.40))]">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                                {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                            </div>

                            <h3 className="text-lg font-black text-black dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-[#FFC800] transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 flex-1">
                                {previewText}
                            </p>

                            {/* Author row */}
                            <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-black overflow-hidden">
                                        <Image src={authorAvatar} alt={authorName} width={24} height={24} className="object-cover" />
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 truncate max-w-[80px]">{authorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={handleLike} className={cn("p-1.5 rounded-md transition-colors", isLiked ? "text-red-500" : "text-neutral-400 hover:text-red-500")}>
                                        <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
                                    </button>
                                    <button onClick={handleBookmark} className={cn("p-1.5 rounded-md transition-colors", isBookmarked ? "text-purple-500" : "text-neutral-400 hover:text-purple-500")}>
                                        <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-current")} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>
            </motion.div>
        );
    }

    // Compact variant - küçük, minimal
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className="group"
        >
            <Link href={`/blog/${article.slug}`}>
                <article className="flex gap-4 p-3 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#FFC800]/5 transition-all duration-200">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-black flex-shrink-0">
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#FFC800] bg-black px-1.5 py-0.5 rounded">
                                {article.category || "GENEL"}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400">
                                {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-black dark:text-white leading-tight line-clamp-2 group-hover:text-[#FFC800] transition-colors">
                            {article.title}
                        </h4>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-[#FFC800]" />
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}

function ActionBtn({ children, onClick, active, color }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; active?: boolean; color?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black transition-all duration-150",
                "hover:translate-x-[1px] hover:translate-y-[1px]",
                active ? color || "bg-[#FFC800]" : "bg-white dark:bg-zinc-800 text-black dark:text-white"
            )}
        >
            {children}
        </button>
    );
}
