"use client";

import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, ThumbsUp, Eye, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileArticleCardProps {
    article: any;
    className?: string;
    showCategory?: boolean;
}

export function MobileArticleCard({ article, className, showCategory = true }: MobileArticleCardProps) {
    const formattedDate = format(new Date(article.created_at || new Date()), 'dd MMM', { locale: tr });

    // Determine image URL
    const coverUrl = article.cover_url || article.question_images?.[0] || null;
    const isQuestion = !article.slug && article.answers; // Simple check

    return (
        <div className={cn("group block relative mb-6 last:mb-0", className)}>
            <Link href={isQuestion ? `/forum/${article.id}` : `/blog/${article.slug}`} className="block">
                <div className="flex flex-col gap-3">
                    {/* Image Area - Leading visual */}
                    {coverUrl && (
                        <div className="w-full aspect-[2/1] sm:aspect-[2.39/1] overflow-hidden rounded-xl border border-border/40 relative bg-muted/30">
                            <img
                                src={coverUrl}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Category Overlay (Optional for stylistic punch) */}
                            {showCategory && article.category && (
                                <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider bg-background/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-foreground/80">
                                    {article.category}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex flex-col gap-1.5 px-1">
                        {!coverUrl && showCategory && article.category && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                {article.category}
                            </span>
                        )}

                        <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-90">
                            {article.excerpt || article.content}
                        </p>

                        {/* Meta / Footer */}
                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/30">
                            <div className="flex items-center gap-2">
                                {article.author && (
                                    <div className="flex items-center gap-2">
                                        {article.author.avatar_url && (
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-border/50">
                                                <img src={article.author.avatar_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <span className="text-xs font-medium text-foreground/70 truncate max-w-[100px]">
                                            {article.author.full_name || article.author.username}
                                        </span>
                                    </div>
                                )}
                                <span className="text-[10px] text-muted-foreground/40">•</span>
                                <span className="text-xs text-muted-foreground/60">{formattedDate}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                {(article.likes_count > 0 || article.likes_count === undefined) && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{article.likes_count || 0}</span>
                                    </div>
                                )}
                                {(article.comments_count > 0 || article.answers_count > 0) && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{article.comments_count || article.answers_count || 0}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
