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
            className="group relative"
        >
            {/* Gradient Border Background Effect */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 opacity-70 group-hover:from-amber-500/50 group-hover:to-cyan-500/50 group-hover:opacity-100 transition-all duration-500 blur-[1px] pointer-events-none" />

            {/* Main Card Content */}
            <div className="relative h-full bg-card/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden active:scale-[0.995] transition-transform duration-200">

                {/* Main Navigation Link - covers entire card */}
                <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-[1]" prefetch={false}>
                    <span className="sr-only">{article.title}</span>
                </Link>

                <div className="p-4 sm:p-5 relative z-10 pointer-events-none flex flex-col h-full">
                    {/* Header: Author & Date */}
                    <div className="flex items-center justify-between mb-4 pointer-events-auto">
                        <div className="flex items-center gap-3">
                            <Link href={`/kullanici/${article.author?.username}`} className="relative z-20 group/avatar">
                                <Avatar className="w-10 h-10 ring-2 ring-white/10 group-hover/avatar:ring-amber-500/30 transition-all shadow-lg">
                                    <AvatarImage src={article.author?.avatar_url || ""} />
                                    <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-500 font-bold">
                                        {article.author?.username?.[0]?.toUpperCase() || "F"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div className="flex flex-col">
                                <Link href={`/kullanici/${article.author?.username}`} className="font-bold text-sm text-foreground hover:text-amber-500 transition-colors z-20 w-fit">
                                    {article.author?.full_name || article.author?.username || "Fizikhub"}
                                </Link>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
                                    <span className="text-amber-500/80">@{article.author?.username}</span>
                                    <span>·</span>
                                    <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Badge */}
                        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {article.category}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-4">
                        <h3 className="font-heading font-bold text-xl leading-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                            {article.title}
                        </h3>

                        {article.summary && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                {article.summary}
                            </p>
                        )}

                        {/* Image Preview - if exists */}
                        {article.image_url && (
                            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl border border-white/10 shadow-inner group-hover:shadow-2xl transition-all duration-500">
                                <Image
                                    src={imgSrc}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={() => setImgSrc("/images/placeholder-article.jpg")}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                            </div>
                        )}
                    </div>

                    {/* Footer: Actions */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center gap-2">
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                disabled={isLikeLoading}
                                className={cn(
                                    "flex h-9 items-center gap-2 px-3 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all duration-300 active:scale-95",
                                    isLiked
                                        ? "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_10px_-4px_rgba(244,63,94,0.5)]"
                                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                <span>{likeCount}</span>
                            </button>

                            {/* Comments Button */}
                            <Link
                                href={`/blog/${article.slug}#comments`}
                                className="flex h-9 items-center gap-2 px-3 rounded-lg border border-white/10 bg-white/5 text-muted-foreground text-xs font-semibold backdrop-blur-md hover:bg-white/10 hover:text-foreground transition-all duration-300 active:scale-95 z-20"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>{initialComments}</span>
                            </Link>

                            {/* Reading Time */}
                            <div className="flex h-9 items-center gap-2 px-3 rounded-lg text-xs font-medium text-muted-foreground/60">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{getReadingTime(article.content)} dk</span>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleBookmark}
                                className={cn(
                                    "h-9 w-9 flex items-center justify-center rounded-lg border transition-all duration-300 active:scale-95",
                                    isBookmarked
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_10px_-4px_rgba(245,158,11,0.5)]"
                                        : "bg-transparent border-transparent text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-all duration-300 active:scale-95"
                            >
                                <Share className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
