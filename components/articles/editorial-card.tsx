"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, ArrowUpRight } from "lucide-react";
import { Article } from "@/lib/api";
import { useState } from "react";

interface EditorialCardProps {
    article: Article;
}

export function EditorialCard({ article }: EditorialCardProps) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");

    return (
        <Link href={`/blog/${article.slug}`} className="group flex flex-col h-full">
            {/* Image Container - Brutalist */}
            <div className="relative aspect-[16/10] w-full overflow-hidden mb-4 bg-white/5 border-2 border-white/10 group-hover:border-amber-500/50 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <Image
                    src={imgSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => setImgSrc("/images/placeholder-article.jpg")}
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Tag */}
                <div className="absolute top-3 left-3">
                    <span className="inline-block bg-black/70 text-white font-semibold text-xs px-2 py-1 uppercase tracking-wider backdrop-blur-sm">
                        {article.category}
                    </span>
                </div>

                {/* Arrow indicator on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-amber-500 text-black p-1.5">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-1">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                    <span className="font-medium text-amber-400">
                        {article.author?.full_name || article.author?.username || "Fizikhub"}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold leading-tight mb-2 text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-2 tracking-tight">
                    {article.title}
                </h3>

                <p className="text-white/50 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center text-sm font-semibold text-amber-400 mt-auto group/link">
                    Okumaya Başla
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>
        </Link>
    );
}
