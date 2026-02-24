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
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";

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
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    const authorName = article.author?.full_name || article.author?.username || "FizikHub Editörü";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

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
                    "container mx-auto pb-10",
                    isZenMode ? "max-w-3xl" : "max-w-4xl px-4 sm:px-0 pt-6 sm:pt-10 space-y-8"
                )}>
                    {/* Back Button */}
                    {!isZenMode && (
                        <div className="flex items-center justify-between">
                            <Link href="/makale" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                                <div className="w-8 h-8 rounded-full border-[3px] border-black flex items-center justify-center transition-transform hover:-translate-x-1 hover:bg-yellow-400 hover:text-black bg-background">
                                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                                </div>
                                <span className="hidden sm:inline">Makale Arşivi</span>
                            </Link>
                        </div>
                    )}

                    {/* Article Content */}
                    <article>
                        {/* Zen Mode Title */}
                        {isZenMode && (
                            <div className="mb-10 text-center mt-10">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                    {article.title}
                                </h1>
                                <p className="text-muted-foreground text-sm">{readingTime}</p>
                            </div>
                        )}

                        {!isZenMode && (
                            <div className="bg-card border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col gap-0 relative mb-12">

                                {/* Cover Image Header */}
                                {(article.cover_url || article.image_url) && (
                                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-black border-b-[3px] border-black group overflow-hidden">
                                        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
                                        <Image
                                            src={article.cover_url || article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 1200px"
                                        />
                                    </div>
                                )}

                                {/* Top Meta Area (Yellow Tint) */}
                                <div className="p-5 sm:p-8 sm:px-10 border-b-[3px] border-black bg-yellow-400/10 space-y-6">

                                    {/* Title */}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tighter uppercase">
                                        {article.title}
                                    </h1>

                                    {/* Meta Controls */}
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
                                        {/* Category */}
                                        <div className="inline-flex items-center px-4 py-2 bg-yellow-400 border-[3px] border-black shadow-[2px_2px_0px_0px_#000] rotate-1 hover:rotate-0 transition-transform w-max">
                                            <span className="text-xs font-black uppercase text-black tracking-widest flex items-center gap-2">
                                                <Tag className="w-4 h-4 stroke-[3]" />
                                                {article.category || "GENEL"}
                                            </span>
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center gap-2 sm:gap-3 bg-background border-[3px] border-black px-3 py-1.5 h-11 sm:h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1 sm:flex-none">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-black overflow-hidden bg-muted shrink-0">
                                                <Image src={authorAvatar} alt={authorName} width={32} height={32} className="object-cover w-full h-full" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[120px] sm:max-w-[200px]">{authorName}</span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 bg-background border-[3px] border-black px-3 py-1.5 h-11 sm:h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1 sm:flex-none">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground stroke-[3] shrink-0" />
                                            <span className="text-xs sm:text-sm font-bold text-foreground truncate uppercase">
                                                {format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}
                                            </span>
                                        </div>

                                        {/* Reading Time */}
                                        <div className="flex items-center gap-2 bg-background border-[3px] border-black px-3 py-1.5 h-11 sm:h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1 sm:flex-none">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground stroke-[3] shrink-0" />
                                            <span className="text-xs sm:text-sm font-bold text-foreground truncate uppercase">{readingTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 sm:p-10 md:p-14 bg-background flex flex-col">
                                    <div className={cn(
                                        "prose prose-lg dark:prose-invert max-w-none",
                                        // Headings
                                        "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground",
                                        "prose-h1:text-4xl prose-h1:mb-8",
                                        "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-[6px] prose-h2:border-[#FFC800] prose-h2:pl-4",
                                        "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-bold",
                                        // Content
                                        "prose-p:text-foreground/90 prose-p:leading-[1.9] prose-p:mb-6 prose-p:font-medium",
                                        "prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#FFC800] transition-colors",
                                        "prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:marker:text-[#FFC800] prose-li:marker:font-black",
                                        // Blockquotes
                                        "prose-blockquote:border-l-[4px] prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:bg-neutral-100 dark:prose-blockquote:bg-neutral-900 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-lg prose-blockquote:shadow-sm",
                                        // Code
                                        "prose-code:bg-neutral-200 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#d63384] dark:prose-code:text-[#ff79c6] prose-code:font-mono prose-code:text-[0.9em] prose-code:font-bold prose-code:before:content-none prose-code:after:content-none",
                                        "prose-pre:bg-[#1e1e1e] prose-pre:border-[2px] prose-pre:border-black/20 dark:prose-pre:border-white/20 prose-pre:rounded-xl prose-pre:shadow-xl",
                                        // Images & Media
                                        "prose-img:rounded-xl prose-img:border-[2px] prose-img:border-black/10 dark:prose-img:border-white/10 prose-img:shadow-lg prose-img:my-10",
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
                                </div>

                                {/* Footer Controls */}
                                <div className="p-4 sm:p-6 border-t-[3px] border-black bg-[#f4f4f5] dark:bg-[#18181b] flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                                        <div className="flex items-center p-1 bg-white dark:bg-black border-[3px] border-black rounded-lg shadow-[2px_2px_0px_#000] shrink-0">
                                            <LikeButton
                                                articleId={article.id}
                                                initialLiked={initialLiked}
                                                initialCount={likeCount || 0}
                                            />
                                        </div>
                                        <div className="shrink-0">
                                            <BookmarkButton
                                                type="article"
                                                itemId={article.id}
                                                initialBookmarked={initialBookmarked}
                                                className="border-[3px] border-black shadow-[2px_2px_0px_#000] rounded-lg"
                                            />
                                        </div>
                                        <div className="shrink-0 border-[3px] border-black shadow-[2px_2px_0px_#000] rounded-lg overflow-hidden flex items-center justify-center p-0">
                                            <ReportButton
                                                contentType="article"
                                                contentId={article.id}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-auto flex justify-end">
                                        <ShareButtons title={article.title} slug={article.slug} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isZenMode && (
                            <div className={cn(
                                "prose prose-lg dark:prose-invert max-w-none mb-20",
                                // Headings
                                "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground",
                                "prose-h1:text-4xl prose-h1:mb-8",
                                "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-[6px] prose-h2:border-[#FFC800] prose-h2:pl-4",
                                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-bold",
                                // Content
                                "prose-p:text-foreground/90 prose-p:leading-[1.9] prose-p:mb-6 prose-p:font-medium",
                                "prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#FFC800] transition-colors",
                                "prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:marker:text-[#FFC800] prose-li:marker:font-black",
                                // Blockquotes
                                "prose-blockquote:border-l-[4px] prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:bg-neutral-100 dark:prose-blockquote:bg-neutral-900 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-lg prose-blockquote:shadow-sm",
                                // Code
                                "prose-code:bg-neutral-200 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#d63384] dark:prose-code:text-[#ff79c6] prose-code:font-mono prose-code:text-[0.9em] prose-code:font-bold prose-code:before:content-none prose-code:after:content-none",
                                "prose-pre:bg-[#1e1e1e] prose-pre:border-[2px] prose-pre:border-black/20 dark:prose-pre:border-white/20 prose-pre:rounded-xl prose-pre:shadow-xl",
                                // Images & Media
                                "prose-img:rounded-xl prose-img:border-[2px] prose-img:border-black/10 dark:prose-img:border-white/10 prose-img:shadow-lg prose-img:my-10",
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
                        )}

                        {/* Footer Section */}
                        {!isZenMode && (
                            <div className="mt-12 space-y-16">

                                {/* Author */}
                                <div className="border-t-2 border-dashed border-black/10 dark:border-white/10 pt-12">
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
