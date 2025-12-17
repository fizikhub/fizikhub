"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, ArrowUpRight, BookOpen } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";

interface EditorialCardProps {
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

export function EditorialCard({ article, index = 0 }: EditorialCardProps) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        >
            <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container - Enhanced */}
                <div className="relative aspect-[16/10] w-full overflow-hidden mb-5 bg-white/5 border-2 border-white/10 group-hover:border-amber-500/60 transition-all duration-500">
                    <Image
                        src={imgSrc}
                        alt={article.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-110"
                        onError={() => setImgSrc("/images/placeholder-article.jpg")}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-block bg-black/70 backdrop-blur-sm text-white font-semibold text-xs px-2.5 py-1 uppercase tracking-wider border border-white/10">
                            {article.category}
                        </span>
                    </div>

                    {/* Reading time badge */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                        <span className="flex items-center gap-1.5 bg-amber-500 text-black font-semibold text-xs px-2.5 py-1">
                            <BookOpen className="w-3 h-3" />
                            {getReadingTime(article.content)} dk
                        </span>
                    </div>

                    {/* Corner accent on hover */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-amber-500 rotate-45" />
                        <ArrowUpRight className="absolute bottom-2 right-2 w-4 h-4 text-black" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                    {/* Meta info */}
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                        <span className="font-semibold text-amber-400">
                            {article.author?.full_name || article.author?.username || "Fizikhub"}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold leading-tight mb-3 text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-2 tracking-tight">
                        {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-white/40 text-sm line-clamp-2 leading-relaxed mb-4 flex-1 group-hover:text-white/50 transition-colors duration-300">
                        {article.summary}
                    </p>

                    {/* Read more link */}
                    <div className="flex items-center text-sm font-semibold text-amber-400 mt-auto overflow-hidden">
                        <motion.span
                            animate={{ x: isHovered ? 0 : 0 }}
                            className="flex items-center"
                        >
                            Okumaya Başla
                            <motion.span
                                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -2 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowUpRight className="w-4 h-4 ml-1" />
                            </motion.span>
                        </motion.span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
