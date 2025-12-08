"use client";

import { useState } from "react";
import { ReadingControls } from "./reading-controls";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AuthorCard } from "@/components/blog/author-card";
import { LikeButton } from "@/components/articles/like-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReportButton } from "@/components/report-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { RelatedArticles } from "@/components/blog/related-articles";
import { CommentSection } from "@/components/articles/comment-section";

interface ArticleReaderProps {
    article: any;
    readingTime: string;
    likeCount: number;
    initialLiked: boolean;
    initialBookmarked: boolean;
    comments: any[];
    isLoggedIn: boolean;
    isAdmin: boolean;
    userAvatar?: string;
}

export function ArticleReader({
    article,
    readingTime,
    likeCount,
    initialLiked,
    initialBookmarked,
    comments,
    isLoggedIn,
    isAdmin,
    userAvatar
}: ArticleReaderProps) {
    const [isZenMode, setIsZenMode] = useState(false);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    return (
        <div className={cn("relative z-20 transition-all duration-500", isZenMode ? "z-50" : "")}>
            {/* Zen Mode Backdrop */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background z-40 transition-colors duration-500"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "transition-all duration-500",
                isZenMode ? "fixed inset-0 overflow-y-auto z-50 pt-20 px-4 sm:px-0" : ""
            )}>
                <div className={cn(
                    "container mx-auto",
                    isZenMode ? "max-w-3xl" : "max-w-7xl px-0 sm:px-6 md:px-8 -mt-10 sm:-mt-20"
                )}>
                    <div className={cn(
                        "grid grid-cols-1 gap-6 sm:gap-8 md:gap-10",
                        !isZenMode && "lg:grid-cols-12"
                    )}>
                        {/* Article Content */}
                        <article className={cn(
                            "bg-background/80 backdrop-blur-xl p-5 sm:p-8 shadow-2xl transition-all duration-500",
                            isZenMode
                                ? "shadow-none bg-transparent p-0 border-none"
                                : "lg:col-span-10 rounded-t-[32px] sm:rounded-[32px] border-x-0 sm:border border-t border-b-0 sm:border-b border-white/10 min-h-screen sm:min-h-0"
                        )}>

                            {/* Author Card - Hide in Zen Mode */}
                            {!isZenMode && (
                                <div className="mb-8 sm:mb-10">
                                    <AuthorCard author={article.author || {}} />
                                </div>
                            )}

                            {/* Title in Zen Mode */}
                            {isZenMode && (
                                <div className="mb-12 text-center space-y-4">
                                    <h1 className={cn("text-4xl sm:text-5xl font-black tracking-tight", fontFamily === 'serif' ? 'font-serif' : 'font-sans')}>
                                        {article.title}
                                    </h1>
                                    <p className="text-muted-foreground">{readingTime} okuma süresi</p>
                                </div>
                            )}

                            {/* Article Body */}
                            <MarkdownRenderer
                                content={article.content || ""}
                                className={cn(
                                    "leading-relaxed max-w-none transition-all duration-300",
                                    isZenMode ? "mx-auto" : "prose-lg sm:prose-xl"
                                )}
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                            />

                            {/* Interaction Section - Hide in Zen Mode */}
                            {!isZenMode && (
                                <>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-border/40">
                                        <div className="flex items-center gap-2">
                                            <LikeButton
                                                articleId={article.id}
                                                initialLiked={initialLiked}
                                                initialCount={likeCount || 0}
                                            />
                                            <BookmarkButton
                                                type="article"
                                                itemId={article.id}
                                                initialBookmarked={initialBookmarked}
                                            />
                                            <ReportButton
                                                contentType="article"
                                                contentId={article.id}
                                            />
                                        </div>
                                        <ShareButtons title={article.title} slug={article.slug} />
                                    </div>

                                    <div className="mt-12">
                                        <RelatedArticles currentArticleId={article.id} category={article.category || "Genel"} />
                                    </div>

                                    <div className="mt-12 sm:mt-16">
                                        <CommentSection
                                            articleId={article.id}
                                            comments={comments || []}
                                            isLoggedIn={isLoggedIn}
                                            isAdmin={isAdmin}
                                            userAvatar={userAvatar}
                                        />
                                    </div>
                                </>
                            )}
                        </article>

                        {/* Sidebar - Hide in Zen Mode */}
                        {!isZenMode && (
                            <aside className="hidden lg:block lg:col-span-2 space-y-8">
                                {/* Table of Contents would go here, managed by parent or integrated if possible */}
                            </aside>
                        )}
                    </div>
                </div>
            </div>

            <ReadingControls
                onZenModeChange={setIsZenMode}
                onFontSizeChange={setFontSize}
                onFontFamilyChange={setFontFamily}
            />
        </div>
    );
}
