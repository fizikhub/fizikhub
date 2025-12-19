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
    return (
        <div className="w-full">
            {/* Back Button */}
            <div className="container max-w-4xl mx-auto px-4 pt-4">
                <Link href="/kesfet">
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

            {/* Cover Image - Full Width, Proper Display */}
            {(article.cover_url || (article as any).image_url) && (
                <div className="w-full mt-4">
                    <div className="container max-w-4xl mx-auto px-4">
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-800">
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
                    <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
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
        </div>
    );
}
