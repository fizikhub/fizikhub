"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Bookmark, Eye, Clock, ArrowRight } from "lucide-react";
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
            className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 overflow-hidden group"
        >
            {/* Top Section - Author & Meta */}
            <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                    <Link href={`/kullanici/${article.author?.username}`} className="relative">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all">
                            <Image
                                src={article.author?.avatar_url || "/images/default-avatar.png"}
                                alt={article.author?.full_name || "Yazar"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
                    </Link>

                    <div className="flex-1 min-w-0">
                        <Link href={`/kullanici/${article.author?.username}`} className="block">
                            <h3 className="font-bold text-white hover:text-amber-400 transition-colors truncate">
                                {article.author?.full_name || article.author?.username || "Fizikhub"}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full font-medium">
                                Yazar
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <Link href={`/blog/${article.slug}`} className="block px-6 pb-4">
                {article.image_url && (
                    <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={() => setImgSrc("/images/placeholder-article.jpg")}
                        />
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Category badge on image */}
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/10">
                                {article.category}
                            </span>
                        </div>

                        {/* Reading time on image */}
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/10 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {getReadingTime(article.content)} dk
                            </span>
                        </div>
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <Link href={`/blog/${article.slug}`} className="block px-6 pb-5">
                <h2 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {article.title}
                </h2>

                {/* Summary - Prominent */}
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-4">
                    {article.summary || "Bu makalede bilimsel konular ele alınıyor ve detaylı bir şekilde inceleniyor. Okumak için tıklayın."}
                </p>

                {/* Read more link */}
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 group/link">
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </div>
            </Link>

            {/* Actions Bar */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLiked(!isLiked);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isLiked
                                ? 'text-rose-400 bg-rose-500/10'
                                : 'text-white/40 hover:text-rose-400 hover:bg-rose-500/10'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 100) + 20}</span>
                    </button>

                    <Link
                        href={`/blog/${article.slug}#comments`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white/40 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 30)}</span>
                    </Link>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsBookmarked(!isBookmarked);
                    }}
                    className={`p-2.5 rounded-full transition-all ${isBookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-white/40 hover:text-amber-400 hover:bg-amber-500/10'
                        }`}
                >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
            </div>
        </motion.article>
    );
}
