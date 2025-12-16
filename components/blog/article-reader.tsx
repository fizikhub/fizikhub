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
    relatedArticles: any[];
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
    userAvatar,
    relatedArticles
}: ArticleReaderProps) {
    const [isZenMode, setIsZenMode] = useState(false);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('serif');

    return (
        <div className={cn("relative z-20", isZenMode ? "z-50" : "")}>
            {/* Zen Mode Backdrop */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background z-40"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "transition-all duration-300",
                isZenMode ? "fixed inset-0 overflow-y-auto z-50 pt-16 px-4" : ""
            )}>
                <div className={cn(
                    "container mx-auto",
                    isZenMode ? "max-w-2xl" : "max-w-3xl px-4 py-8"
                )}>
                    {/* Article Content */}
                    <article className="min-h-screen">
                        {/* Zen Mode Title */}
                        {isZenMode && (
                            <div className="mb-12 text-center space-y-4">
                                <h1 className={cn(
                                    "text-3xl sm:text-4xl font-bold tracking-tight",
                                    fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                                )}>
                                    {article.title}
                                </h1>
                                <p className="text-muted-foreground text-sm">{readingTime} okuma</p>
                            </div>
                        )}

                        {/* Content - Optimized for Reading */}
                        <div className={cn(
                            "prose prose-lg dark:prose-invert max-w-none",
                            "prose-headings:font-bold prose-headings:tracking-tight",
                            "prose-p:leading-relaxed prose-p:text-foreground/90",
                            "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                            "prose-strong:text-foreground prose-strong:font-semibold",
                            "prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic",
                            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
                            "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border",
                            "prose-img:rounded-lg prose-img:shadow-md",
                            fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                        )}>
                            <MarkdownRenderer
                                content={article.content || ""}
                                className="leading-relaxed"
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                            />
                        </div>

                        {/* Actions - Clean, Simple */}
                        {!isZenMode && (
                            <div className="mt-12 pt-8 border-t border-border space-y-12">
                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
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

                                {/* Author */}
                                <AuthorCard author={article.author || {}} />

                                {/* Related Articles */}
                                {relatedArticles.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold">İlgili Makaleler</h3>
                                        <RelatedArticles articles={relatedArticles} />
                                    </div>
                                )}

                                {/* Comments */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold">Yorumlar ({comments.length})</h3>
                                    <CommentSection
                                        articleId={article.id}
                                        comments={comments || []}
                                        isLoggedIn={isLoggedIn}
                                        isAdmin={isAdmin}
                                        userAvatar={userAvatar}
                                    />
                                </div>
                            </div>
                        )}
                    </article>
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
