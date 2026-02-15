"use client";

import Image from "next/image";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ArticleHeroProps {
    article: Article;
    readingTime: string;
}

export function ArticleHero({ article, readingTime }: ArticleHeroProps) {
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

    const isBookReview = metadata.type === "book-review";
    const bookTitle = metadata.bookTitle || article.title;
    const bookAuthor = metadata.bookAuthor || "";
    const rating = metadata.rating || 0;

    return (
        <div className="w-full">
            {/* Back Button */}
            <div className="container max-w-4xl mx-auto px-4 pt-4">
                <Link href="/blog">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Geri Dön
                    </Button>
                </Link>
            </div>

            {isBookReview ? (
                <div className="container max-w-4xl mx-auto px-4 mt-6 sm:mt-8 mb-8 sm:mb-12">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Book Cover - Mobile Optimized */}
                        <div className="w-full md:w-1/3 shrink-0 flex justify-center md:block">
                            <div className="relative w-32 sm:w-48 md:w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-zinc-800 rotate-2 hover:rotate-0 transition-transform duration-500">
                                {article.cover_url ? (
                                    <Image
                                        src={article.cover_url}
                                        alt={bookTitle}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-900 flex items-center justify-center p-4 text-center">
                                        <span className="text-xl font-bold text-emerald-100">{bookTitle}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1 sm:mb-2">
                                Kitap İncelemesi
                            </div>

                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading leading-tight text-foreground">
                                {bookTitle}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 text-base sm:text-xl font-medium text-muted-foreground">
                                <span>Yazar:</span>
                                <span className="text-foreground font-bold">{bookAuthor}</span>
                            </div>

                            {/* Rating - Mobile Optimized */}
                            <div className="flex items-center gap-1 bg-muted/40 inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border">
                                <span className="text-xs sm:text-sm font-bold text-muted-foreground mr-1 sm:mr-2">Puan:</span>
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-[3px] sm:w-[4px] h-4 sm:h-6 rounded-full transition-all ${i < rating ? "bg-emerald-500" : "bg-muted-foreground/20"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 sm:ml-3 font-black text-lg sm:text-2xl text-emerald-600 dark:text-emerald-400">{rating}</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground font-bold self-end mb-1">/10</span>
                            </div>

                            {/* Meta Info */}
                            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <Link
                                    href={`/kullanici/${article.author?.username || 'anonim'}`}
                                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                                >
                                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-muted">
                                        {article.author?.avatar_url ? (
                                            <Image
                                                src={article.author.avatar_url}
                                                alt={article.author?.full_name || ""}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <User className="w-3 h-3 sm:w-4 sm:h-4 m-1" />
                                        )}
                                    </div>
                                    <span className="font-bold">{article.author?.full_name || "Anonim"}</span>
                                </Link>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span>{format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span>{readingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Cover Image - Full Width, Proper Display */}
                    {(article.cover_url || (article as any).image_url) && (
                        <div className="w-full mt-4">
                            <div className="container max-w-4xl mx-auto px-4">
                                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-800 shadow-lg">
                                    <Image
                                        src={article.cover_url || (article as any).image_url}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 896px"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Article Header */}
                    <div className="container max-w-4xl mx-auto px-4 mt-8">
                        {/* Category */}
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border-[1.5px] border-primary/20 rounded-full">
                                {article.category || "Genel"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                            {article.title}
                        </h1>

                        {/* Excerpt */}
                        {article.excerpt && (
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
                            {/* Author */}
                            <Link
                                href={`/kullanici/${article.author?.username || 'anonim'}`}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                    {article.author?.avatar_url ? (
                                        <Image
                                            src={article.author.avatar_url}
                                            alt={article.author?.full_name || "Yazar"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-foreground text-sm">
                                        {article.author?.full_name || article.author?.username || "Anonim"}
                                    </span>
                                </div>
                            </Link>

                            <span className="text-muted-foreground">•</span>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}</span>
                            </div>

                            <span className="text-muted-foreground">•</span>

                            {/* Reading Time */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{readingTime}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
