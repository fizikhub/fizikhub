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
        <Link href={`/makale/${article.slug}`} className="block group font-sans">
            <article className={cn(
                "relative flex flex-row overflow-hidden rounded-2xl transition-all duration-300",
                "bg-card border-2 border-slate-200 dark:border-slate-800",
                "hover:border-rose-500/50 dark:hover:border-rose-500/50",
                "shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1"
            )}>
                {/* Visual Bookmark Element */}
                <div className="absolute top-0 right-8 w-8 h-12 bg-rose-600 shadow-md z-20 flex flex-col items-center justify-end pb-1 clip-path-ribbon transition-transform duration-300 group-hover:-translate-y-1">
                    <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <style jsx>{`
                    .clip-path-ribbon {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
                    }
                `}</style>

                {/* Book Cover Section - Enhanced */}
                <div className="relative w-32 sm:w-40 md:w-56 h-auto shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-3 md:p-6 overflow-hidden border-r border-border/50">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Spine/Cover with 3D effect */}
                    <div className="relative shadow-2xl rounded-[2px] overflow-hidden w-20 sm:w-24 md:w-36 aspect-[2/3] transition-all duration-500 will-change-transform group-hover:scale-105 group-hover:-rotate-2 group-hover:shadow-rose-900/20 [perspective:1000px]">
                        {article.cover_url ? (
                            <img
                                src={article.cover_url}
                                alt={bookTitle}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-rose-900 flex flex-col items-center justify-center p-4 text-center text-rose-100 border-l-2 border-white/10">
                                <BookOpen className="w-8 h-8 mb-3 opacity-70" />
                                <span className="text-xs font-serif leading-tight line-clamp-3">{bookTitle}</span>
                            </div>
                        )}

                        {/* Lighting effect/Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/20 z-10" /> {/* Spine highlight */}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 md:p-7 flex flex-col justify-between relative bg-gradient-to-br from-card to-rose-50/50 dark:to-rose-950/10">
                    <div>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                                        Kitap İncelemesi
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-3 h-3",
                                                    i < rating ? "fill-current" : "text-slate-300 dark:text-slate-600 fill-transparent"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold font-heading leading-tight text-foreground group-hover:text-rose-600 transition-colors pt-1 md:pt-2 line-clamp-2 md:line-clamp-none">
                                    {bookTitle}
                                </h3>

                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 pt-1">
                                    <span className="w-4 h-[1px] bg-rose-400 inline-block" />
                                    <span className="italic text-foreground/80">{bookAuthor}</span>
                                </p>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed text-xs sm:text-sm md:text-base mb-2 md:mb-6 font-medium">
                            {displayExcerpt}
                        </p>
                    </div>

                    {/* Footer - Elegant */}
                    <div className="flex items-center justify-between pt-3 md:pt-5 border-t border-dashed border-border/60">
                        <div className="flex items-center gap-2 md:gap-3">
                            <Avatar className="w-8 h-8 border-2 border-background ring-1 ring-border">
                                <AvatarImage src={article.author?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] bg-rose-50 text-rose-600 font-bold">
                                    {authorInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground group-hover:text-rose-600 transition-colors">
                                    {authorName}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                    Eleştirmen
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <time className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                            </time>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
