"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Star, BookOpen } from "lucide-react";

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
    const displayExcerpt = article.excerpt || "";
    const authorName = article.author?.full_name || article.author?.username || "Anonim";

    return (
        <ViewTransitionLink href={`/makale/${article.slug}`} className="block group font-sans h-full">
            <article className={cn(
                "relative flex flex-row h-full overflow-hidden transition-all duration-300",
                // NEO-BRUTALIST V9 CONTAINER
                "bg-card border border-border/50 rounded-xl",
                "shadow-sm hover:shadow-md hover:border-border/80 hover:translate-x-[2px] hover:translate-y-[2px]"
            )}>
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* LEFT SIDEBAR (30%) - PURE BLACK for Premium Contrast */}
                <div className="w-[120px] sm:w-[140px] shrink-0 bg-black flex items-center justify-center p-4 border-r border-border/50 relative z-10">
                    <div className="relative w-full aspect-[2/3] shadow-[0px_0px_20px_rgba(255,255,255,0.1)] border border-white/10 group-hover:-rotate-2 transition-transform duration-300">
                        {article.cover_url ? (
                            <Image
                                src={article.cover_url}
                                alt={bookTitle}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-900 border border-neutral-800">
                                <BookOpen className="w-8 h-8 text-neutral-700" />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CONTENT (70%) */}
                <div className="flex-1 p-5 flex flex-col justify-between z-10 relative">

                    {/* RED RIBBON (Neo-Brutalist Bookmark) */}
                    <div className="absolute top-0 right-4">
                        <div className="bg-[#E11D48] text-white text-[12px] font-black uppercase py-2.5 px-1.5 w-9 flex flex-col items-center shadow-sm group-hover:-translate-y-1 transition-transform z-20">
                            <div className="w-full h-2 absolute bottom-[-8px] left-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#E11D48]" />
                            <Star className="w-4 h-4 fill-white stroke-none mb-1" />
                            <span className="leading-none">{rating}</span>
                        </div>
                    </div>

                    <div>
                        {/* Header Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-white/10 text-neutral-500 dark:text-zinc-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] tracking-wider border border-black/5 dark:border-white/5">
                                İNCELEME
                            </span>
                        </div>

                        {/* Title & Author - PREMIUM TYPOGRAPHY */}
                        <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black text-black dark:text-white leading-[1.1] mb-2 pr-10 tracking-tight">
                            {bookTitle}
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[3px] bg-[#E11D48]" />
                            <p className="text-sm font-bold font-mono text-neutral-600 dark:text-zinc-400 uppercase tracking-widest">
                                {bookAuthor}
                            </p>
                        </div>

                        {/* Excerpt - High Legibility */}
                        <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                            {displayExcerpt}
                        </p>
                    </div>

                    {/* Footer - Minimalist Author */}
                    <div className="mt-4 pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                {authorName}
                            </span>
                            <span className="text-[10px] opacity-50">•</span>
                            <time className="text-[10px] font-bold uppercase tracking-wide opacity-75">
                                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                            </time>
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
