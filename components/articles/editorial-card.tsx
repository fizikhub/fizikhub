"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/api";
import { useState } from "react";

interface EditorialCardProps {
    article: Article;
}

export function EditorialCard({ article }: EditorialCardProps) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");

    return (
        <Link href={`/blog/${article.slug}`} className="group flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4 bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                <Image
                    src={imgSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImgSrc("/images/placeholder-article.jpg")}
                />

                {/* Overlay gradient for text readability if needed, usually not with separate content, but good for style */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 left-3">
                    <Badge className="bg-black/50 backdrop-blur-md text-white border border-white/10 shadow-sm hover:bg-black/70">
                        {article.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-1">
                <div className="flex items-center gap-2 text-xs text-blue-200/60 mb-2">
                    <span className="font-medium text-cyan-400">
                        {article.author?.full_name || article.author?.username || "Fizikhub"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold leading-tight mb-2 text-white group-hover:text-cyan-300 transition-colors line-clamp-2 tracking-tight drop-shadow-sm">
                    {article.title}
                </h3>

                <p className="text-blue-100/60 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center text-sm font-semibold text-cyan-400 mt-auto group/link">
                    Okumaya Başla
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </div>
            </div>
        </Link>
    );
}
