"use client";

import { useState } from "react";
import { ReadingControls } from "./reading-controls";
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() => import("@/components/markdown-renderer").then(mod => mod.MarkdownRenderer), {
    loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-xl" />
});
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
    injections?: { [paragraphIndex: number]: React.ReactNode };
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
    relatedArticles,
    injections
}: ArticleReaderProps) {
    const [isZenMode, setIsZenMode] = useState(false);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    return (
        <div className={cn("relative", isZenMode ? "z-50" : "")}>
            {/* Zen Mode Backdrop */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-zinc-100 dark:bg-zinc-900 z-40"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "transition-all duration-300",
                isZenMode ? "fixed inset-0 overflow-y-auto z-50 pt-16 px-4" : ""
            )}>
                <div className={cn(
                    "container mx-auto",
                    isZenMode ? "max-w-3xl" : "max-w-4xl px-4 py-10"
                )}>
                    {/* Article Content */}
                    <article>
                        {/* Zen Mode Title */}
                        {isZenMode && (
                            <div className="mb-10 text-center">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                    {article.title}
                                </h1>
                                <p className="text-muted-foreground text-sm">{readingTime}</p>
                            </div>
                        )}

                        {/* Content - Evrim Ağacı Style: Clean, Readable */}
                        <div className={cn(
                            "prose prose-lg dark:prose-invert max-w-none",
                            // Typography
                            "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
                            "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
                            "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
                            // Paragraphs - clean reading
                            "prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-6",
                            // Links
                            "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
                            // Lists
                            "prose-li:text-foreground/90 prose-li:leading-relaxed",
                            // Blockquotes
                            "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground/80",
                            // Code
                            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
                            "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl",
                            // Images
                            "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8",
                            // Strong
                            "prose-strong:text-foreground prose-strong:font-semibold"
                        )}>
                            <MarkdownRenderer
                                content={article.content || ""}
                                className=""
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                                injections={injections}
                            />
                        </div>

                        {/* Footer Section */}
                        {!isZenMode && (
                            <div className="mt-16 space-y-12">
                                {/* Action Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border">
                                    <div className="flex items-center gap-3">
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
                                        <h3 className="text-xl font-bold text-foreground">Benzer Makaleler</h3>
                                        <RelatedArticles articles={relatedArticles} />
                                    </div>
                                )}

                                {/* Comments */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-foreground">
                                        Yorumlar {comments.length > 0 && `(${comments.length})`}
                                    </h3>
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
