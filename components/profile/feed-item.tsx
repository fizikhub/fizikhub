"use client";

import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, ThumbsUp, Eye, ArrowUpRight, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeedItemProps {
    type: "article" | "question" | "answer" | "draft";
    title: string;
    description?: string; // For answers or excerpts
    href: string;
    date: string | Date;
    stats?: {
        views?: number;
        likes?: number; // or votes
        comments?: number; // or answers
    };
    category?: string;
    status?: string; // For drafts
    onEdit?: () => void; // Optional edit action mainly for drafts
}

export function FeedItem({
    type,
    title,
    description,
    href,
    date,
    stats,
    category,
    status,
    onEdit
}: FeedItemProps) {

    const formattedDate = format(new Date(date), 'dd MMM yyyy', { locale: tr });

    return (
        <div className="group relative border-b border-border/40 hover:bg-foreground/[0.02] transition-colors duration-200 last:border-0">
            <Link href={href} className="block w-full py-4 px-2 md:p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Meta Header */}
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground/70">
                            <span className="font-medium text-foreground/80">
                                {type === 'article' && 'Makale'}
                                {type === 'question' && 'Soru'}
                                {type === 'answer' && 'Cevap'}
                                {type === 'draft' && 'Taslak'}
                            </span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                            {category && (
                                <>
                                    <span>•</span>
                                    <span className="text-amber-500/80">{category}</span>
                                </>
                            )}
                            {status === 'draft' && (
                                <span className="ml-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">
                                    Taslak
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-amber-500/90 transition-colors line-clamp-2 md:line-clamp-1">
                            {title}
                        </h3>

                        {/* Description / Preview */}
                        {description && (
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Stats Footer */}
                        {stats && (
                            <div className="flex items-center gap-4 mt-2 pt-1">
                                {stats.likes !== undefined && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{stats.likes}</span>
                                    </div>
                                )}
                                {stats.comments !== undefined && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{stats.comments}</span>
                                    </div>
                                )}
                                {stats.views !== undefined && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                        <Eye className="w-3 h-3" />
                                        <span>{stats.views}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Icon */}
                    {onEdit ? (
                        <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity self-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={(e) => {
                                e.preventDefault();
                                onEdit();
                            }}>
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity self-center text-muted-foreground/50 pr-2">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
