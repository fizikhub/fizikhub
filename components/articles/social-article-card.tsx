"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BookOpen, ChevronUp, ChevronDown, Share } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/blog/actions";
import { toast } from "sonner";

interface SocialArticleCardProps {
    article: Article;
    index?: number;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
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
    initialIsBookmarked = false
}: SocialArticleCardProps) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");

    // Optimistic UI States
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLikeLoading) return;

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

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="group bg-card border border-gray-300/60 dark:border-gray-700/60 rounded-2xl cursor-pointer transition-all duration-300 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.12)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] overflow-hidden"
        >
            {/* Cosmic background effect */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="px-3 py-5 sm:px-5 sm:py-5 relative z-10">
                {/* Author Row - Enable pointer events for interactive elements */}
                <div className="flex items-center gap-3 mb-3 pointer-events-auto w-fit">
                    <Link href={`/kullanici/${article.author?.username}`} className="flex-shrink-0 relative group/avatar z-20">
                        <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover/avatar:ring-amber-500/20 transition-all duration-300">
                            <AvatarImage src={article.author?.avatar_url || ""} />
                            <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold">
                                {article.author?.username?.[0]?.toUpperCase() || "F"}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <Link href={`/kullanici/${article.author?.username}`} className="font-semibold text-foreground hover:underline text-[15px] hover:text-amber-500 transition-colors">
                                {article.author?.full_name || article.author?.username || "Fizikhub"}
                            </Link>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">Yazar</span>
                        </div>
                        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
                            <span>{article.category}</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                        </div>
                    </div>
                </div>

                <div className="block group/content">
                    {/* Title */}
                    <h3 className="font-heading font-bold text-[18px] sm:text-[19px] leading-[1.4] mb-3 text-foreground/95 group-hover/content:text-amber-500 transition-colors">
                        {article.title}
                    </h3>

                    {/* Summary */}
                    <div className="text-[15.5px] text-foreground/85 leading-[1.7] font-sans mb-4 line-clamp-3">
                        {article.summary || "Bu makalede bilimsel konular ele alınıyor ve detaylı bir şekilde inceleniyor."}
                    </div>

                    {/* Read More Button - Forum Style */}
                    <div className="flex justify-start mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 hover:bg-secondary/60 border border-border/50 hover:border-primary/40 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm group/btn">
                            <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">Devamını Oku</span>
                            <ChevronDown className="w-4 h-4 -rotate-90 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Image */}
                    {article.image_url && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-300/30 dark:border-gray-700/30 mb-4 group-hover/content:border-amber-500/20 transition-colors">
                            <Image
                                src={imgSrc}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/content:scale-[1.02]"
                                onError={() => setImgSrc("/images/placeholder-article.jpg")}
                            />
                        </div>
                    )}
                </div>

                {/* Action Bar - Brutalist Space Style */}
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-300/30 dark:border-gray-700/30 pointer-events-auto">
                    {/* Like Pill */}
                    <div
                        className={cn(
                            "flex items-center rounded-xl border border-gray-300/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]",
                            isLiked ? "bg-rose-500/10 border-rose-500/30" : "bg-transparent"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleLike}
                            disabled={isLikeLoading}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-200/80 dark:active:bg-gray-700/50",
                                isLiked && "text-rose-500 font-bold"
                            )}
                        >
                            <Heart className={cn(
                                "w-4 h-4 stroke-[2px]",
                                isLiked ? "fill-current" : ""
                            )} />
                            <span className="text-sm font-semibold min-w-[16px] text-center">
                                {likeCount}
                            </span>
                        </button>
                    </div>

                    {/* Comments - Brutalist */}
                    <Link
                        href={`/blog/${article.slug}#comments`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent"
                    >
                        <MessageCircle className="w-4 h-4 stroke-[1.8px]" />
                        <span className="text-sm font-semibold">{initialComments}</span>
                    </Link>

                    {/* Read Time - Brutalist */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300/60 dark:border-gray-700/60 text-muted-foreground text-xs font-medium">
                        <BookOpen className="w-3.5 h-3.5" />
                        {getReadingTime(article.content)} dk
                    </div>

                    {/* Share & Bookmark Group */}
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={handleBookmark}
                            className={cn(
                                "p-1.5 rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent",
                                isBookmarked && "text-amber-500 border-amber-500/30 bg-amber-500/10"
                            )}
                        >
                            <Bookmark className={cn("w-4 h-4 stroke-[1.8px]", isBookmarked && "fill-current")} />
                        </button>

                        <button
                            className="p-1.5 rounded-xl border border-gray-300/60 dark:border-gray-700/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-300 active:scale-95 bg-transparent"
                            onClick={handleShare}
                        >
                            <Share className="w-4 h-4 stroke-[1.8px]" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
