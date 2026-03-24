"use client";

import { useState } from "react";
import { ReadingControls } from "./reading-controls";
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() => import("@/components/markdown-renderer").then(mod => mod.MarkdownRenderer), {
    loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-xl" />
});
import { cn } from "@/lib/utils";
import { AnimatePresence, m as motion } from "framer-motion";
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
    references?: any[];
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
    references = []
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

                        {/* Content - NeoBrutalist High Contrast */}
                        <div className={cn(
                            "prose sm:prose-[1.125rem] dark:prose-invert max-w-none mb-12 sm:mb-20",
                            // Headings
                            "prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground",
                            "prose-h1:text-3xl sm:prose-h1:text-5xl prose-h1:mb-8 sm:prose-h1:mb-10 prose-h1:leading-[1.15]",
                            "prose-h2:text-2xl sm:prose-h2:text-4xl prose-h2:mt-12 sm:prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-[8px] prose-h2:border-[#FFC800] prose-h2:pl-5 prose-h2:leading-[1.2]",
                            "prose-h3:text-xl sm:prose-h3:text-3xl prose-h3:mt-10 sm:prose-h3:mt-12 prose-h3:mb-5 prose-h3:font-bold",
                            // Paragraphs & Text
                            "prose-p:text-[#111] dark:prose-p:text-zinc-300 prose-p:leading-[1.85] sm:prose-p:leading-[1.9] prose-p:mb-8 md:prose-p:mb-10 prose-p:font-medium",
                            "prose-strong:text-black dark:prose-strong:text-white prose-strong:font-black prose-strong:bg-[#FFC800]/20 dark:prose-strong:bg-[#23A9FA]/20 prose-strong:px-1 prose-strong:rounded-sm",
                            // Links
                            "prose-a:text-black dark:prose-a:text-white prose-a:font-black prose-a:no-underline prose-a:border-b-[3px] prose-a:border-[#23A9FA] dark:prose-a:border-[#FFC800] hover:prose-a:bg-[#23A9FA] dark:hover:prose-a:bg-[#FFC800] hover:prose-a:text-white dark:hover:prose-a:text-black transition-colors break-words prose-a:px-0.5",
                            // Lists
                            "prose-li:text-[#111] dark:prose-li:text-zinc-300 prose-li:leading-[1.85] sm:prose-li:leading-relaxed prose-li:marker:text-[#FFC800] prose-li:marker:font-black prose-li:font-medium",
                            "prose-ul:pl-6 sm:prose-ul:pl-8 prose-ol:pl-6 sm:prose-ol:pl-8",
                            // Blockquotes
                            "prose-blockquote:border-l-[6px] sm:prose-blockquote:border-l-[8px] prose-blockquote:border-black dark:prose-blockquote:border-[#FFC800] prose-blockquote:bg-[#FFC800]/10 dark:prose-blockquote:bg-[#FFC800]/5 prose-blockquote:py-5 sm:prose-blockquote:py-8 prose-blockquote:px-6 sm:prose-blockquote:px-10 prose-blockquote:my-10 sm:prose-blockquote:my-12 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-lg sm:prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:text-black dark:prose-blockquote:text-zinc-100",
                            // Code
                            "prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:border-2 prose-code:border-black dark:prose-code:border-zinc-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#FF3366] dark:prose-code:text-[#FFC800] prose-code:font-mono prose-code:text-[0.85em] sm:prose-code:text-[0.9em] prose-code:font-black prose-code:before:content-none prose-code:after:content-none prose-code:shadow-[2px_2px_0px_0px_#000] dark:prose-code:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]",
                            "prose-pre:bg-zinc-950 prose-pre:border-4 prose-pre:border-black dark:prose-pre:border-zinc-700 prose-pre:rounded-xl prose-pre:shadow-[8px_8px_0px_0px_#000] dark:prose-pre:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-x-auto",
                            // Images
                            "prose-img:rounded-xl prose-img:border-4 prose-img:border-black dark:prose-img:border-zinc-800 prose-img:shadow-[8px_8px_0px_0px_#000] dark:prose-img:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] prose-img:my-10 sm:prose-img:my-16 prose-img:mx-auto"
                        )}>
                            <MarkdownRenderer
                                content={article.content || ""}
                                className=""
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                            />
                        </div>

                        {/* Floating Action Dock (Reading Controls) - NeoBrutalist */}
                        {!isZenMode && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-fit max-w-[95vw] sm:max-w-max transition-all duration-300">
                                <div className="p-2 sm:p-3 bg-white dark:bg-zinc-900 rounded-2xl border-4 border-black dark:border-zinc-700 flex items-center justify-between gap-3 sm:gap-5 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <LikeButton
                                                articleId={article.id}
                                                initialLiked={initialLiked}
                                                initialCount={likeCount || 0}
                                            />
                                        </div>
                                        <div className="w-[3px] h-8 sm:h-10 bg-black/10 dark:bg-zinc-700 rounded-full" />
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <BookmarkButton
                                                type="article"
                                                itemId={article.id}
                                                initialBookmarked={initialBookmarked}
                                            />
                                        </div>
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <ReportButton
                                                contentType="article"
                                                contentId={article.id}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center border-l-[3px] border-black/10 dark:border-zinc-700 pl-3 sm:pl-5 hover:-translate-y-1 transition-transform">
                                        <ShareButtons title={article.title} slug={article.slug} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Section */}
                        {!isZenMode && (
                            <div className="mt-12 space-y-12 sm:space-y-16">
                                {/* Author */}
                                <div className="border-t-[3px] border-dashed border-black/10 dark:border-white/10 pt-10 sm:pt-12">
                                    <AuthorCard author={article.author || {}} />
                                </div>

                                {/* Source / Reference Cards */}
                                {references.length > 0 && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#23A9FA]" />
                                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Kaynaklar</h3>
                                            <span className="ml-auto text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                                                {references.length} kaynak
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {references.map((ref: any, i: number) => (
                                                <div
                                                    key={ref.id || i}
                                                    className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-shadow"
                                                >
                                                    <div className="flex gap-3">
                                                        <span className="text-xs font-black bg-[#23A9FA]/15 text-[#23A9FA] border-2 border-[#23A9FA]/30 px-2 py-0.5 rounded-md h-fit">
                                                            [{i + 1}]
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm sm:text-base text-foreground leading-snug">
                                                                {ref.title}
                                                            </p>
                                                            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                                                                {ref.authors && <span>{ref.authors}</span>}
                                                                {ref.publisher && <span>· {ref.publisher}</span>}
                                                                {ref.year && <span>· ({ref.year})</span>}
                                                                {ref.doi && <span>· DOI: {ref.doi}</span>}
                                                            </div>
                                                            {ref.url && (
                                                                <a
                                                                    href={ref.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#23A9FA] hover:underline break-all"
                                                                >
                                                                    🔗 {ref.url.length > 60 ? ref.url.substring(0, 60) + '...' : ref.url}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
