"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Star, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

interface BookReviewCardProps {
    article: {
        id: number;
        title: string;
        excerpt: string | null;
        content: string;
        slug: string;
        cover_url: string | null;
        created_at: string;
        author: {
            username: string | null;
            full_name: string | null;
            avatar_url: string | null;
        } | null;
    };
    index?: number;
}

export function BookReviewCard({ article, index = 0 }: BookReviewCardProps) {
    // Parse Metadata
    let metadata: any = {};
    if (article.content) {
        try {
            const match = article.content.match(/^<!--meta\s+(.*?)\s+-->/);
            if (match && match[1]) {
                metadata = JSON.parse(match[1]);
            }
        } catch (e) {
            console.error("Failed to parse book review metadata", e);
        }
    }

    const bookTitle = metadata.bookTitle || article.title;
    const bookAuthor = metadata.bookAuthor || "Bilinmeyen Yazar";
    const rating = metadata.rating || 0;

    // Clean excerpt if it contains the formatted string we added
    const displayExcerpt = article.excerpt || "";

    const authorName = article.author?.full_name || article.author?.username || "Anonim";
    const authorInitials = authorName.substring(0, 2).toUpperCase();

    return (
        <Link href={`/makale/${article.slug}`} className="block group">
            <article className={cn(
                "relative flex flex-col sm:flex-row overflow-hidden bg-card border-l-4 border-l-emerald-500 border-y border-r border-border rounded-r-xl transition-all duration-300",
                "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]",
                "hover:-translate-y-1"
            )}>
                {/* Book Cover Visualization */}
                <div className="relative w-full sm:w-48 h-64 sm:h-auto shrink-0 bg-muted/30 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-border">
                    {/* Background Blur */}
                    {article.cover_url && (
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-20 blur-md"
                            style={{ backgroundImage: `url(${article.cover_url})` }}
                        />
                    )}

                    {/* Spine/Cover */}
                    <div className="relative shadow-xl rounded-md overflow-hidden w-32 aspect-[2/3] transition-transform group-hover:scale-105 group-hover:rotate-1">
                        {article.cover_url ? (
                            <img
                                src={article.cover_url}
                                alt={bookTitle}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-emerald-800 flex flex-col items-center justify-center p-2 text-center text-emerald-100">
                                <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs font-bold leading-tight line-clamp-3">{bookTitle}</span>
                            </div>
                        )}
                        {/* Rating Badge overlap */}
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black font-black text-xs px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            {rating}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Kitap İncelemesi</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold font-heading leading-tight text-foreground group-hover:text-emerald-500 transition-colors">
                                    {bookTitle}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mt-1">
                                    <span className="opacity-70">Yazar:</span>
                                    <span className="text-foreground">{bookAuthor}</span>
                                </p>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm sm:text-base">
                            {displayExcerpt}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 border border-border">
                                <AvatarImage src={article.author?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px]">{authorInitials}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {authorName}
                            </span>
                        </div>

                        <time className="text-xs font-bold text-muted-foreground/60 whitespace-nowrap">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </time>
                    </div>
                </div>
            </article>
        </Link>
    );
}
