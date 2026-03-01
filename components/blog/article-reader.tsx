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
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    return (
        <div className="relative">
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

                        {/* Content - Evrim Ağacı / Wired Style */}
                        <div className={cn(
                            "prose sm:prose-lg dark:prose-invert max-w-none mb-12 sm:mb-20",
                            // Headings
                            "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground",
                            "prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mb-6 sm:prose-h1:mb-8 prose-h1:leading-tight",
                            "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 sm:prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-[6px] prose-h2:border-[#FFC800] prose-h2:pl-4 prose-h2:leading-tight",
                            "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 sm:prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-bold",
                            // Content
                            "prose-p:text-foreground/90 prose-p:text-base sm:prose-p:text-lg prose-p:leading-[1.8] sm:prose-p:leading-[1.9] prose-p:mb-6 md:prose-p:mb-8 prose-p:font-medium",
                            "prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#FFC800] transition-colors break-words",
                            "prose-li:text-foreground/90 prose-li:text-base sm:prose-li:text-lg prose-li:leading-[1.8] sm:prose-li:leading-relaxed prose-li:marker:text-[#FFC800] prose-li:marker:font-black",
                            "prose-ul:pl-5 sm:prose-ul:pl-8 prose-ol:pl-5 sm:prose-ol:pl-8",
                            // Blockquotes
                            "prose-blockquote:border-l-[4px] sm:prose-blockquote:border-l-[6px] prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:bg-neutral-100 dark:prose-blockquote:bg-neutral-900 prose-blockquote:py-4 sm:prose-blockquote:py-6 prose-blockquote:px-5 sm:prose-blockquote:px-8 prose-blockquote:my-8 sm:prose-blockquote:my-10 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-base sm:prose-blockquote:text-xl prose-blockquote:leading-relaxed prose-blockquote:shadow-sm",
                            // Code
                            "prose-code:bg-neutral-200 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#d63384] dark:prose-code:text-[#ff79c6] prose-code:font-mono prose-code:text-[0.85em] sm:prose-code:text-[0.9em] prose-code:font-bold prose-code:before:content-none prose-code:after:content-none",
                            "prose-pre:bg-[#1e1e1e] prose-pre:border-[2px] prose-pre:border-black/20 dark:prose-pre:border-white/20 prose-pre:rounded-xl prose-pre:shadow-xl overflow-x-auto",
                            // Images & Media
                            "prose-img:rounded-xl prose-img:border-[2px] prose-img:border-black/10 dark:prose-img:border-white/10 prose-img:shadow-lg prose-img:my-8 sm:prose-img:my-12 prose-img:mx-auto",
                            "prose-strong:text-foreground prose-strong:font-black"
                        )}>
                            <MarkdownRenderer
                                content={article.content || ""}
                                className=""
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                            />
                        </div>

                        {/* Footer Section */}
                        {!isZenMode && (
                            <div className="mt-12 space-y-12 sm:space-y-16">
                                {/* Control Panel (Action Bar) */}
                                <div className="p-4 sm:p-6 bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl border-[2px] border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 shadow-sm">
                                    <div className="flex items-center justify-center sm:justify-start gap-4 flex-1">
                                        <div className="flex items-center p-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg shadow-sm">
                                            <LikeButton
                                                articleId={article.id}
                                                initialLiked={initialLiked}
                                                initialCount={likeCount || 0}
                                            />
                                        </div>
                                        <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
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
                                    <div className="flex justify-center sm:justify-end border-t border-black/5 dark:border-white/5 sm:border-0 pt-4 sm:pt-0">
                                        <ShareButtons title={article.title} slug={article.slug} />
                                    </div>
                                </div>

                                {/* Author */}
                                <div className="border-t-[3px] border-dashed border-black/10 dark:border-white/10 pt-10 sm:pt-12">
                                    <AuthorCard author={article.author || {}} />
                                </div>

                                {/* Related Articles */}
                                {relatedArticles.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#FFC800]" />
                                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Benzer Makaleler</h3>
                                        </div>
                                        <RelatedArticles articles={relatedArticles} />
                                    </div>
                                )}

                                {/* Comments */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-black dark:bg-white" />
                                        <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">
                                            Yorumlar {comments.length > 0 && `(${comments.length})`}
                                        </h3>
                                    </div>
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
