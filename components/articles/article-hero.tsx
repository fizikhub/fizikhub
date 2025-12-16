"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <div className="relative w-full bg-background">
            {/* Back Button - Fixed */}
            <div className="absolute top-4 left-4 z-50">
                <Link href="/kesfet">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Geri</span>
                    </Button>
                </Link>
            </div>

            {/* Cover Image - Optional, Clean Style */}
            {article.cover_url && (
                <div className="relative w-full h-[40vh] sm:h-[50vh] max-h-[500px]">
                    <Image
                        src={article.cover_url}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div className={`container max-w-3xl mx-auto px-4 ${article.cover_url ? '-mt-20 relative z-10' : 'pt-20'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    {/* Category */}
                    <Badge variant="secondary" className="text-xs font-medium">
                        {article.category || "Genel"}
                    </Badge>

                    {/* Title - Clean, Readable */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Author & Meta - Simple Row */}
                    <div className="flex flex-wrap items-center gap-4 py-4 border-b border-border/50">
                        {/* Author */}
                        <Link
                            href={`/kullanici/${article.author?.username || 'anonim'}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                <Image
                                    src={article.author?.avatar_url || "/images/default-avatar.png"}
                                    alt={article.author?.full_name || "Yazar"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <span className="font-medium text-foreground block text-sm">
                                    {article.author?.full_name || article.author?.username || "Anonim"}
                                </span>
                            </div>
                        </Link>

                        <div className="w-px h-6 bg-border hidden sm:block" />

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}</span>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} okuma</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
