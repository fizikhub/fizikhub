"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";

interface ProfileArticleCardProps {
    article: Article;
}

// Calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function ProfileArticleCard({ article }: ProfileArticleCardProps) {
    const readingTime = calculateReadingTime(article.content || "");

    return (
        <Link href={`/blog/${article.slug}`}>
            <div className="group h-full bg-card border-2 border-foreground/10 rounded-lg overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col">
                {/* Cover Image */}
                {article.cover_url && (
                    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                        <img
                            src={article.cover_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale-[20%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Status badge on image */}
                        {article.status === 'draft' && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-black/70 backdrop-blur-sm text-white border-0 font-bold text-[10px] uppercase tracking-wider">
                                    Taslak
                                </Badge>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Category Badge */}
                    {article.category && (
                        <Badge
                            variant="outline"
                            className="mb-3 w-fit border-2 border-foreground/20 text-foreground bg-foreground/5 font-bold text-[10px] uppercase tracking-wider"
                        >
                            {article.category}
                        </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-black mb-2.5 text-foreground group-hover:text-foreground/70 transition-colors duration-200 line-clamp-2 flex-grow-0 leading-tight">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-muted-foreground text-xs md:text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Footer Meta */}
                    <div className="flex items-center gap-3 pt-3 border-t-2 border-foreground/10 mt-auto">
                        {/* Reading Time */}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            <span>{readingTime}dk</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <Eye className="w-3 h-3" />
                            <span>{article.views || 0}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {formatDistanceToNow(new Date(article.created_at), {
                                    addSuffix: true,
                                    locale: tr
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
