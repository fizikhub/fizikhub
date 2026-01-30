"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Star, BookOpen, Quote } from "lucide-react";

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
                "relative flex flex-col sm:flex-row h-full overflow-hidden transition-all duration-300",
                // TACTILE CONTAINER
                "bg-[#fdfaf6] dark:bg-[#202022]",
                "border-[3px] border-black rounded-[12px]",
                "shadow-[5px_5px_0px_0px_#000]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
            )}>
                {/* TEXTURE OVERLAY */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                />

                {/* LEFT: BOOK SPINE & COVER PRESENTATION */}
                <div className="w-full sm:w-[160px] shrink-0 bg-[#e5e5e5] dark:bg-[#111] flex flex-col items-center justify-center p-6 border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black relative z-10 overflow-hidden">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "10px 10px" }} />

                    {/* 3D Floating Cover */}
                    <div className="relative w-28 sm:w-full aspect-[2/3] shadow-[0px_10px_20px_rgba(0,0,0,0.3)] group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 ease-out origin-bottom">
                        {/* Spine Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-white/20 z-20 backdrop-blur-[1px]" />

                        {article.cover_url ? (
                            <Image
                                src={article.cover_url}
                                alt={bookTitle}
                                fill
                                className="object-cover rounded-r-[2px]"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#333] text-white p-2 text-center rounded-r-[2px]">
                                <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-[10px] font-bold leading-tight line-clamp-3">{bookTitle}</span>
                            </div>
                        )}

                        {/* Glossy sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none rounded-r-[2px]" />
                    </div>
                </div>

                {/* RIGHT: CONTENT & REVIEW */}
                <div className="flex-1 p-6 flex flex-col justify-between z-10 relative">

                    {/* RATING STICKER (Absolute) */}
                    <div className="absolute -top-3 -right-3 z-30 group-hover:rotate-12 transition-transform duration-300">
                        <div className="bg-[#FFC800] text-black w-14 h-14 rounded-full border-[3px] border-black flex flex-col items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                            <span className="text-xl font-black leading-none">{rating}</span>
                            <div className="flex gap-[1px]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("w-1.5 h-1.5", i < Math.floor(Number(rating)) ? "fill-black stroke-none" : "stroke-black fill-none")} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Header Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                                İNCELEME
                            </span>
                        </div>

                        {/* Title & Author */}
                        <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black text-black dark:text-white leading-[1.1] mb-2 pr-8 tracking-tight group-hover:underline decoration-[3px] decoration-[#FFC800] underline-offset-4">
                            {bookTitle}
                        </h3>
                        <p className="text-sm font-bold font-mono text-neutral-500 mb-4 uppercase tracking-wide">
                            YAZAR: <span className="text-black dark:text-white">{bookAuthor}</span>
                        </p>

                        {/* Excerpt with Quote Icon */}
                        <div className="relative pl-4 border-l-[3px] border-[#FFC800]">
                            <Quote className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-[#fdfaf6] dark:bg-[#202022] text-[#FFC800] fill-current" />
                            <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                                {displayExcerpt}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t-[2px] border-black/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-neutral-200 overflow-hidden border border-black">
                                {article.author?.avatar_url && <img src={article.author.avatar_url} className="w-full h-full object-cover" />}
                            </div>
                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                                {authorName}
                            </span>
                        </div>
                        <time className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </time>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
