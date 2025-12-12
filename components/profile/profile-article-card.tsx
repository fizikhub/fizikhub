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
            <div className="group h-full bg-card border border-gray-300/50 dark:border-gray-700/50 rounded-2xl overflow-hidden  shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.12)] dark:hover:shadow-[5px_5px_0px_rgba(255,255,255,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                {/* Cover Image */}
                {article.cover_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                        <img
                            src={article.cover_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Status badge on image */}
                        {article.status === 'draft' && (
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-0 font-semibold">
                                    Taslak
                                </Badge>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Category Badge */}
                    {article.category && (
                        <Badge
                            variant="outline"
                            className="mb-3 w-fit border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 rounded-lg font-semibold text-xs"
                        >
                            {article.category}
                        </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-cyan-500 transition-colors duration-300 line-clamp-2 flex-grow-0">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3 leading-relaxed flex-grow">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Footer Meta */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-300/30 dark:border-gray-700/30 mt-auto">
                        {/* Reading Time */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{readingTime} dk</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{article.views || 0}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
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
