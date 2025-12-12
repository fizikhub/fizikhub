"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";

interface ProfileArticleCardProps {
    article: Article;
}

export function ProfileArticleCard({ article }: ProfileArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`}>
            <div className="group bg-card border border-gray-300/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.12)] dark:hover:shadow-[5px_5px_0px_rgba(255,255,255,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Cover Image */}
                {article.cover_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                        <img
                            src={article.cover_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Category Badge */}
                    {article.category && (
                        <Badge
                            variant="outline"
                            className="mb-3 border-primary/30 text-primary/90 bg-primary/5 rounded-lg font-semibold"
                        >
                            {article.category}
                        </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Footer Meta */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-300/30 dark:border-gray-700/30">
                        {/* Views */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{article.views || 0}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                                {formatDistanceToNow(new Date(article.created_at), {
                                    addSuffix: true,
                                    locale: tr
                                })}
                            </span>
                        </div>

                        {/* Status indicator for drafts */}
                        {article.status === 'draft' && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                                Taslak
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
