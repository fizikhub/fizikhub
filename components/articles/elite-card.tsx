"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, Eye, ArrowUpRight, Clock, MessageCircle } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";
import { triggerSmallConfetti } from "@/lib/confetti";

interface EliteCardProps {
    article: Article;
    index?: number;
    variant?: 'hero' | 'spotlight' | 'card' | 'list';
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
}

export function EliteCard({
    article,
    index = 0,
    variant = 'card',
    initialLikes = 0,
    initialComments = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
}: EliteCardProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isHovered, setIsHovered] = useState(false);
    const { triggerHaptic } = useHaptic();
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D tilt magic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
    const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.9, 1, 1.1]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || variant === 'list') return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
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
    const previewText = article.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) || article.summary || "";

    // HERO VARIANT
    if (variant === 'hero') {
        return (
            <motion.article
                ref={cardRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="group relative"
            >
                <Link href={`/blog/${article.slug}`}>
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative aspect-[21/9] overflow-hidden rounded-2xl"
                    >
                        {/* Image */}
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                        {/* Shine effect on hover */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: isHovered ? "100%" : "-100%", opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.6 }}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-3xl"
                            >
                                {/* Category + Meta */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-black rounded-full">
                                        {article.category || "Genel"}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-white/70">
                                        <Eye className="w-3.5 h-3.5" />
                                        {article.views || 0}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-white/70">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 group-hover:text-amber-400 transition-colors duration-300">
                                    {article.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl mb-6">
                                    {previewText}
                                </p>

                                {/* Author + Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500">
                                                <Image src={authorAvatar} alt={authorName} width={40} height={40} className="object-cover" />
                                            </div>
                                            <motion.div
                                                className="absolute -inset-1 rounded-full border border-amber-500/50"
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{authorName}</p>
                                            <p className="text-xs text-white/60">Yazar</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ActionButton onClick={handleLike} active={isLiked} activeColor="bg-red-500">
                                            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                            {likeCount > 0 && <span className="ml-1 text-xs">{likeCount}</span>}
                                        </ActionButton>
                                        <ActionButton onClick={handleBookmark} active={isBookmarked} activeColor="bg-amber-500">
                                            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                                        </ActionButton>
                                        <ActionButton onClick={handleShare}>
                                            <Share2 className="w-4 h-4" />
                                        </ActionButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </Link>
            </motion.article>
        );
    }

    // SPOTLIGHT VARIANT (Featured, horizontal)
    if (variant === 'spotlight') {
        return (
            <motion.article
                ref={cardRef}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="group"
            >
                <Link href={`/blog/${article.slug}`}>
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="grid md:grid-cols-2 gap-6 items-center p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                            <Image
                                src={article.image_url || "/images/placeholder-article.webp"}
                                alt={article.title}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-105"
                                style={{ filter: `brightness(${brightness.get()})` }}
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />

                            {/* Read indicator */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                                className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-black/90 rounded-full text-xs font-semibold"
                            >
                                Oku <ArrowUpRight className="w-3 h-3" />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="py-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md">
                                    {article.category || "Genel"}
                                </span>
                                <span className="text-xs text-neutral-500">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white leading-snug mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                                {previewText}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <Image src={authorAvatar} alt={authorName} width={32} height={32} className="object-cover" />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{authorName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1">
                                        <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-red-500 text-red-500")} />
                                        {likeCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        {initialComments}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </motion.article>
        );
    }

    // CARD VARIANT (Standard grid card)
    if (variant === 'card') {
        return (
            <motion.article
                ref={cardRef}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="group h-full"
            >
                <Link href={`/blog/${article.slug}`} className="block h-full">
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="h-full flex flex-col bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors shadow-sm hover:shadow-xl"
                    >
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                                src={article.image_url || "/images/placeholder-article.webp"}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Category */}
                            <div className="absolute top-3 left-3">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-black/70 text-white backdrop-blur-sm rounded-md"
                                >
                                    {article.category || "Genel"}
                                </motion.span>
                            </div>

                            {/* Hover arrow */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <ArrowUpRight className="w-5 h-5 text-black" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                            </div>

                            <h3 className="text-lg font-bold text-black dark:text-white leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 flex-1">
                                {previewText}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                        <Image src={authorAvatar} alt={authorName} width={24} height={24} className="object-cover" />
                                    </div>
                                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 truncate max-w-[100px]">{authorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={handleLike} className={cn("p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors", isLiked && "text-red-500")}>
                                        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                    </button>
                                    <button onClick={handleBookmark} className={cn("p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors", isBookmarked && "text-amber-500")}>
                                        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </motion.article>
        );
    }

    // LIST VARIANT (Minimal horizontal list)
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ x: 8 }}
            className="group py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
        >
            <Link href={`/blog/${article.slug}`} className="flex items-center gap-4">
                {/* Number */}
                <span className="text-3xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-amber-400 transition-colors w-8 flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        {article.category || "Genel"}
                    </span>
                    <h4 className="text-sm font-semibold text-black dark:text-white leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {article.title}
                    </h4>
                </div>

                {/* Arrow */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ArrowUpRight className="w-5 h-5 text-amber-500" />
                </motion.div>
            </Link>
        </motion.article>
    );
}

function ActionButton({ children, onClick, active, activeColor }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; active?: boolean; activeColor?: string }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                active ? `${activeColor || 'bg-amber-500'} text-white` : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            )}
        >
            {children}
        </motion.button>
    );
}
