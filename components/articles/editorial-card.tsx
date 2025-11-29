"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/api";

interface EditorialCardProps {
    article: Article;
}

export function EditorialCard({ article }: EditorialCardProps) {
    return (
        <Link href={`/blog/${article.slug}`} className="group flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4 bg-muted">
                <Image
                    src={article.image_url || "/images/placeholder-article.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background border-0 shadow-sm">
                        {article.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-primary">
                        {article.author?.full_name || article.author?.username || "Fizikhub"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>

                <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 font-serif tracking-tight">
                    {article.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center text-sm font-semibold text-primary mt-auto group/link">
                    Devamını Oku
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </div>
            </div>
        </Link>
    );
}
