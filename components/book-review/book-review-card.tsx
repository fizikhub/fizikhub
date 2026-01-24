"use client";

import Link from "next/link";
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
    const authorInitials = authorName.substring(0, 2).toUpperCase();

    return (
        <Link href={`/makale/${article.slug}`} className="block group font-sans h-full">
            <article className={cn(
                "relative flex flex-col sm:flex-row h-full overflow-hidden transition-all duration-300",
                // NEO-BRUTALIST V9 CONTAINER
                "bg-white dark:bg-[#27272a]",
                "border-[3px] border-black rounded-[8px]",
                "shadow-[4px_4px_0px_0px_#000]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
            )}>
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* BOOK COVER SECTION - Neo Style */}
                <div className="relative w-full sm:w-40 shrink-0 bg-[#FFC800] dark:bg-[#FFC800] border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black flex items-center justify-center p-6 z-10">
                    <div className="relative w-24 sm:w-28 aspect-[2/3] shadow-[4px_4px_0px_0px_#000] border-2 border-black bg-white group-hover:-rotate-2 transition-transform duration-300">
                        {article.cover_url ? (
                            <Image
                                src={article.cover_url}
                                alt={bookTitle}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                <BookOpen className="w-8 h-8 text-black opacity-20" />
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 p-5 flex flex-col justify-between z-10 relative">
                    <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                                İNCELEME
                            </span>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-3.5 h-3.5 stroke-[2px] stroke-black",
                                            i < rating ? "fill-[#FFC800]" : "fill-transparent text-neutral-300"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Title & Author */}
                        <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black text-black dark:text-zinc-50 leading-none uppercase tracking-tighter mb-2 group-hover:underline decoration-4 decoration-[#FFC800] underline-offset-4">
                            {bookTitle}
                        </h3>
                        <p className="text-xs font-mono font-bold text-neutral-500 mb-4 uppercase tracking-wide">
                            YAZAR: <span className="text-black dark:text-zinc-300">{bookAuthor}</span>
                        </p>

                        {/* Excerpt */}
                        <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                            {displayExcerpt}
                        </p>
                    </div>

                    {/* Footer - Dashed Separator */}
                    <div className="mt-4 pt-3 border-t-[2px] border-dashed border-black/10 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden bg-white">
                                <Image
                                    src={article.author?.avatar_url || "/images/default-avatar.png"}
                                    alt={authorName}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase text-black dark:text-zinc-400">
                                {authorName}
                            </span>
                        </div>
                        <time className="text-[10px] font-bold text-neutral-400 uppercase">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </time>
                    </div>
                </div>
            </article>
        </Link>
    );
}
