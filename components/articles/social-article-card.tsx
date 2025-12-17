"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BookOpen } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";

interface SocialArticleCardProps {
    article: Article;
    index?: number;
}

// Calculate reading time
function getReadingTime(content: string | null): number {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function SocialArticleCard({ article, index = 0 }: SocialArticleCardProps) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
        >
            {/* Header - Author Info */}
            <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                    <Link href={`/kullanici/${article.author?.username}`} className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-amber-500/30 hover:ring-amber-500/60 transition-all">
                        <Image
                            src={article.author?.avatar_url || "/images/default-avatar.png"}
                            alt={article.author?.full_name || "Yazar"}
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <Link href={`/kullanici/${article.author?.username}`} className="font-semibold text-white hover:text-amber-400 transition-colors truncate">
                                {article.author?.full_name || article.author?.username || "Fizikhub"}
                            </Link>
                            <span className="text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Yazar</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <span>@{article.author?.username || "fizikhub"}</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <Link href={`/blog/${article.slug}`} className="block group">
                {/* Category & Reading Time */}
                <div className="px-4 pb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                        {article.category}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="flex items-center gap-1 text-xs text-white/40">
                        <BookOpen className="w-3 h-3" />
                        {getReadingTime(article.content)} dk okuma
                    </span>
                </div>

                {/* Title */}
                <h2 className="px-4 text-lg sm:text-xl font-bold text-white leading-snug mb-2 group-hover:text-amber-400 transition-colors">
                    {article.title}
                </h2>

                {/* Summary */}
                <p className="px-4 text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
                    {article.summary}
                </p>

                {/* Image */}
                {article.image_url && (
                    <div className="mx-4 mb-3 relative aspect-video overflow-hidden rounded-xl border border-white/10 group-hover:border-amber-500/30 transition-colors">
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            onError={() => setImgSrc("/images/placeholder-article.jpg")}
                        />
                    </div>
                )}
            </Link>

            {/* Actions - Social Media Style */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${isLiked
                                ? 'text-rose-400 bg-rose-500/10'
                                : 'text-white/40 hover:text-rose-400 hover:bg-rose-500/10'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/40 hover:text-sky-400 hover:bg-sky-500/10 transition-all">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{Math.floor(Math.random() * 20)}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-full transition-all ${isBookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-white/40 hover:text-amber-400 hover:bg-amber-500/10'
                        }`}
                >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
            </div>
        </motion.article>
    );
}
