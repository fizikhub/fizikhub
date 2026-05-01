"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";
import { AnimatePresence, m as motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { AuthorCard } from "@/components/blog/author-card";
import { LikeButton } from "@/components/articles/like-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReportButton } from "@/components/report-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { RelatedArticles } from "@/components/blog/related-articles";
import { CommentSection } from "@/components/articles/comment-section";

import { ArrowUp, X, Type, Maximize2, Minimize2, Minus, Plus } from "lucide-react";
import { isAdminEmail } from "@/lib/admin-shared";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase";

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
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const [userContext, setUserContext] = useState({
        isLiked: initialLiked,
        isBookmarked: initialBookmarked,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        userAvatar: userAvatar
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) return;
                
                const isUserAdmin = isAdminEmail(user.email);
                const baseAvatar = user.user_metadata?.avatar_url;

                const [likesRes, bookmarksRes, profileRes] = await Promise.all([
                    supabase.from('article_likes').select('id').eq('article_id', article.id).eq('user_id', user.id).maybeSingle(),
                    supabase.from('article_bookmarks').select('id').eq('article_id', article.id).eq('user_id', user.id).maybeSingle(),
                    supabase.from('profiles').select('avatar_url').eq('id', user.id).maybeSingle()
                ]);

                setUserContext({
                    isLiked: !!likesRes.data,
                    isBookmarked: !!bookmarksRes.data,
                    isLoggedIn: true,
                    isAdmin: isUserAdmin,
                    userAvatar: profileRes.data?.avatar_url || baseAvatar
                });
            } catch (err) {
                // Silently fail — user context is non-critical and defaults are already set
                console.error('Failed to fetch user context:', err);
            }
        };
        fetchUserData();
    }, [article.id]);

    const { scrollYProgress } = useScroll();

    // Use framer-motion to avoid react re-renders on every scroll tick
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Toggle scroll-to-top button
        if (latest > 0.3 && !showScrollTop) {
            setShowScrollTop(true);
        } else if (latest <= 0.3 && showScrollTop) {
            setShowScrollTop(false);
        }
    });


    // Image lightbox: intercept clicks on article images
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const handleImageClick = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG' && target.closest('.prose')) {
                e.preventDefault();
                setLightboxSrc((target as HTMLImageElement).src);
            }
        };

        container.addEventListener('click', handleImageClick);
        return () => container.removeEventListener('click', handleImageClick);
    }, []);

    // Code block copy buttons: inject after render
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const cleanupFns: (() => void)[] = [];

        const timeout = setTimeout(() => {
            const codeBlocks = container.querySelectorAll('pre');
            codeBlocks.forEach((pre) => {
                if (pre.querySelector('.code-copy-btn')) return;
                
                // Wrap in a container
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                pre.parentNode?.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);

                // Create copy button
                const btn = document.createElement('button');
                btn.className = 'code-copy-btn';
                btn.textContent = 'Kopyala';
                
                const handleClick = async () => {
                    const code = pre.querySelector('code');
                    const text = code?.textContent || pre.textContent || '';
                    try {
                        if (navigator?.clipboard?.writeText) {
                            await navigator.clipboard.writeText(text);
                        } else {
                            // Fallback for WebViews without clipboard API
                            const textArea = document.createElement('textarea');
                            textArea.value = text;
                            textArea.style.position = 'fixed';
                            textArea.style.opacity = '0';
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                        }
                        btn.textContent = '✓ Kopyalandı';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = 'Kopyala';
                            btn.classList.remove('copied');
                        }, 2000);
                    } catch {
                        // Silently fail in restricted WebView environments
                    }
                };

                btn.addEventListener('click', handleClick);
                wrapper.appendChild(btn);

                // Register cleanup to prevent detached DOM memory leaks
                cleanupFns.push(() => {
                    btn.removeEventListener('click', handleClick);
                    btn.remove();
                    // Optional: revert wrapper
                    if (wrapper.parentNode) {
                        wrapper.parentNode.insertBefore(pre, wrapper);
                        wrapper.remove();
                    }
                });
            });
        }, 500);

        return () => {
            clearTimeout(timeout);
            cleanupFns.forEach(fn => fn());
        };
    }, [article.content]);

    // Lightbox close on Escape
    useEffect(() => {
        if (!lightboxSrc) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxSrc(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxSrc]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="relative" ref={contentRef}>
            {/* Reading Progress Bar has been DELETED because app/makale/[slug]/page.tsx already renders <ReadingProgress /> globally! */}

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
                    "container mx-auto overflow-x-hidden",
                    isZenMode ? "max-w-3xl" : "max-w-4xl px-4 py-10"
                )}>
                    {/* Article Content */}
                    <article className="article-body-wrapper block">
                        {/* Zen Mode Title */}
                        {isZenMode && (
                            <header className="mb-10 text-center">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                    {article.title}
                                </h1>
                                <p className="text-muted-foreground text-sm">{readingTime}</p>
                            </header>
                        )}

                        {/* Content - NeoBrutalist High Contrast */}
                        <div className={cn(
                            "prose prose-base sm:prose-lg dark:prose-invert max-w-none mb-12 sm:mb-20 overflow-x-hidden",
                            // Headings
                            "prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground",
                            "prose-h1:text-2xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:!mb-8 sm:prose-h1:!mb-12 prose-h1:leading-[1.15]",
                            "prose-h2:text-xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-10 sm:prose-h2:mt-16 prose-h2:!mb-6 sm:prose-h2:!mb-8 prose-h2:border-l-[6px] sm:prose-h2:border-l-[8px] prose-h2:border-[#FFC800] prose-h2:pl-4 sm:prose-h2:pl-5 prose-h2:leading-[1.2]",
                            "prose-h3:text-lg sm:prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-8 sm:prose-h3:mt-12 prose-h3:!mb-5 sm:prose-h3:!mb-6 prose-h3:font-bold prose-h3:border-l-[4px] sm:prose-h3:border-l-[6px] prose-h3:border-[#23A9FA] prose-h3:pl-3 sm:prose-h3:pl-4 prose-h3:leading-[1.2]",
                            "prose-h4:text-base sm:prose-h4:text-xl prose-h4:mt-6 prose-h4:!mb-4 prose-h4:font-black prose-h4:text-foreground",
                            // Paragraphs & Text — optimized for mobile readability
                            "prose-p:text-[15px] sm:prose-p:text-[17px] md:prose-p:text-[18px] prose-p:text-[#1a1a1a] dark:prose-p:text-[#e5e5e5] prose-p:leading-[1.85] sm:prose-p:leading-[1.9] prose-p:mb-6 sm:prose-p:mb-8 prose-p:font-[450]",
                            "prose-strong:text-black dark:prose-strong:text-white prose-strong:font-black prose-strong:bg-[#FFC800]/20 dark:prose-strong:bg-[#23A9FA]/20 prose-strong:px-1 prose-strong:rounded-sm",
                            // Links — break long URLs
                            "prose-a:text-black dark:prose-a:text-white prose-a:font-black prose-a:no-underline prose-a:border-b-[3px] prose-a:border-[#23A9FA] dark:prose-a:border-[#FFC800] hover:prose-a:bg-[#23A9FA] dark:hover:prose-a:bg-[#FFC800] hover:prose-a:text-white dark:hover:prose-a:text-black prose-a:break-all prose-a:px-0.5",
                            // Lists
                            "prose-li:text-[15px] sm:prose-li:text-[17px] md:prose-li:text-[18px] prose-li:text-zinc-800 dark:prose-li:text-zinc-300 prose-li:leading-[1.8] sm:prose-li:leading-relaxed prose-li:marker:text-[#FFC800] prose-li:marker:font-black prose-li:font-[450]",
                            "prose-ul:pl-5 sm:prose-ul:pl-8 prose-ol:pl-5 sm:prose-ol:pl-8",
                            // Blockquotes
                            "prose-blockquote:border-l-[5px] sm:prose-blockquote:border-l-[8px] prose-blockquote:border-black dark:prose-blockquote:border-[#FFC800] prose-blockquote:bg-[#FFC800]/10 dark:prose-blockquote:bg-[#FFC800]/5 prose-blockquote:py-4 sm:prose-blockquote:py-8 prose-blockquote:px-4 sm:prose-blockquote:px-10 prose-blockquote:my-8 sm:prose-blockquote:my-12 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-base sm:prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:text-black dark:prose-blockquote:text-zinc-100",
                            // Code
                            "prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:border-2 prose-code:border-black dark:prose-code:border-zinc-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#FF3366] dark:prose-code:text-[#FFC800] prose-code:font-mono prose-code:text-[0.8em] sm:prose-code:text-[0.9em] prose-code:font-black prose-code:before:content-none prose-code:after:content-none prose-code:shadow-[2px_2px_0px_0px_#000] dark:prose-code:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] prose-code:break-all",
                            "prose-pre:bg-zinc-950 prose-pre:border-4 prose-pre:border-black dark:prose-pre:border-zinc-700 prose-pre:rounded-xl prose-pre:shadow-[8px_8px_0px_0px_#000] dark:prose-pre:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] prose-pre:overflow-x-auto prose-pre:max-w-full",
                            // Images
                            "prose-img:rounded-xl prose-img:border-4 prose-img:border-black dark:prose-img:border-zinc-800 prose-img:shadow-[8px_8px_0px_0px_#000] dark:prose-img:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] prose-img:my-8 sm:prose-img:my-16 prose-img:mx-auto prose-img:max-w-full",
                            // HR
                            "prose-hr:border-t-[3px] prose-hr:border-dashed prose-hr:border-black/15 dark:prose-hr:border-white/10 prose-hr:my-8 sm:prose-hr:my-14"
                        )}>
                            <MarkdownRenderer
                                content={article.content || ""}
                                className="article-content"
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                isZenMode={isZenMode}
                            />
                        </div>

                        {/* Unified Floating Action Dock — ALL controls in one bar */}
                        {!isZenMode && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-fit max-w-[95vw] transition-all duration-300">
                                <div className="p-2 sm:p-3 bg-white dark:bg-zinc-900 rounded-2xl border-4 border-black dark:border-zinc-700 flex items-center gap-2 sm:gap-4 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                                    {/* Like / Bookmark / Report */}
                                    <div className="flex items-center gap-1 sm:gap-3">
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <LikeButton
                                                articleId={article.id}
                                                initialLiked={userContext.isLiked}
                                                initialCount={likeCount || 0}
                                            />
                                        </div>
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <BookmarkButton
                                                type="article"
                                                itemId={article.id}
                                                initialBookmarked={userContext.isBookmarked}
                                            />
                                        </div>
                                        <div className="flex items-center hover:-translate-y-1 transition-transform">
                                            <ReportButton
                                                contentType="article"
                                                contentId={article.id}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-[3px] h-8 bg-black/10 dark:bg-zinc-700 rounded-full flex-shrink-0" />

                                    {/* Share */}
                                    <div className="flex items-center hover:-translate-y-1 transition-transform">
                                        <ShareButtons title={article.title} slug={article.slug} variant="minimal" className="gap-1 sm:gap-2" />
                                    </div>

                                    <div className="w-[3px] h-8 bg-black/10 dark:bg-zinc-700 rounded-full flex-shrink-0" />

                                    {/* Font Settings Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 flex-shrink-0">
                                                <Type className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="top" align="end" className="w-72 border-[2px] border-black/10 dark:border-white/10 backdrop-blur-3xl p-5 rounded-2xl shadow-xl mb-4">
                                            <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">YAZI BOYUTU</span>
                                                        <span className="text-xs font-bold font-mono bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                                                            {fontSize === 'sm' && 'KÜÇÜK'}
                                                            {fontSize === 'base' && 'NORMAL'}
                                                            {fontSize === 'lg' && 'BÜYÜK'}
                                                            {fontSize === 'xl' && 'DEV'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 rounded-xl p-1.5 border border-black/5 dark:border-white/5">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg" onClick={() => { const steps: ('sm'|'base'|'lg'|'xl')[] = ['sm','base','lg','xl']; const i = steps.indexOf(fontSize); if(i>0) setFontSize(steps[i-1]); }} disabled={fontSize === 'sm'}>
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <div className="flex-1 flex gap-1 h-1.5 justify-center">
                                                            {(['sm','base','lg','xl'] as const).map((step, idx) => (
                                                                <div key={step} className={cn("flex-1 rounded-full transition-colors", idx <= ['sm','base','lg','xl'].indexOf(fontSize) ? "bg-[#FFC800]" : "bg-neutral-300 dark:bg-neutral-700")} />
                                                            ))}
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg" onClick={() => { const steps: ('sm'|'base'|'lg'|'xl')[] = ['sm','base','lg','xl']; const i = steps.indexOf(fontSize); if(i<3) setFontSize(steps[i+1]); }} disabled={fontSize === 'xl'}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">YAZI TİPİ</span>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Button variant={fontFamily === 'sans' ? 'default' : 'outline'} size="sm" className={cn("font-sans border-2 relative overflow-hidden", fontFamily === 'sans' ? "bg-black text-white hover:bg-black/90 border-black" : "border-neutral-200 dark:border-white/10 hover:bg-neutral-50")} onClick={() => setFontFamily('sans')}>
                                                            {fontFamily === 'sans' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFC800]" />}
                                                            MODERN
                                                        </Button>
                                                        <Button variant={fontFamily === 'serif' ? 'default' : 'outline'} size="sm" className={cn("font-serif tracking-wide border-2 relative overflow-hidden", fontFamily === 'serif' ? "bg-black text-white hover:bg-black/90 border-black" : "border-neutral-200 dark:border-white/10 hover:bg-neutral-50")} onClick={() => setFontFamily('serif')}>
                                                            {fontFamily === 'serif' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFC800]" />}
                                                            KLASİK
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Zen Mode */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 group flex-shrink-0"
                                        onClick={() => setIsZenMode(true)}
                                        title="Zen Modu"
                                    >
                                        <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                                    </Button>

                                    {/* Scroll to Top — only if scrolled */}
                                    <AnimatePresence>
                                        {showScrollTop && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: 'auto', opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                className="overflow-hidden flex-shrink-0"
                                            >
                                                <Button
                                                    variant="default"
                                                    size="icon"
                                                    onClick={scrollToTop}
                                                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#FFC800] dark:bg-[#23A9FA] hover:bg-[#FFC800]/90 dark:hover:bg-[#23A9FA]/90 text-black dark:text-white border-[2px] border-black dark:border-white/20"
                                                    aria-label="Başa dön"
                                                >
                                                    <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3px]" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Zen Mode Exit Button */}
                        {isZenMode && (
                            <div className="fixed bottom-6 right-6 z-50">
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="rounded-full shadow-[4px_4px_0px_#000] border-[2px] border-black font-bold tracking-wider"
                                    onClick={() => setIsZenMode(false)}
                                >
                                    <Minimize2 className="h-5 w-5 mr-2" />
                                    AYRIL
                                </Button>
                            </div>
                        )}

                        {/* Footer Section */}
                        {!isZenMode && (
                            <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-16 pb-32 sm:pb-40">


                                {/* Author */}
                                <aside className="border-t-[3px] border-dashed border-black/10 dark:border-white/10 pt-8 sm:pt-12">
                                    <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                                        <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-[#FFC800]" />
                                        <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">Yazar</h3>
                                    </div>
                                    <AuthorCard author={article.author || {}} />
                                </aside>

                                {/* Source / Reference Cards */}
                                {references.length > 0 && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-[#23A9FA]" />
                                            <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">Kaynaklar</h3>
                                            <span className="ml-auto text-[10px] sm:text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 px-2 sm:px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
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
                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-[#FFC800]" />
                                            <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">Benzer Makaleler</h3>
                                        </div>
                                        <RelatedArticles articles={relatedArticles} />
                                    </div>
                                )}

                                {/* Comments */}
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-black dark:bg-white" />
                                        <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                                            Yorumlar {comments.length > 0 && `(${comments.length})`}
                                        </h3>
                                    </div>
                                    <CommentSection
                                        articleId={article.id}
                                        comments={comments || []}
                                        isLoggedIn={userContext.isLoggedIn}
                                        isAdmin={userContext.isAdmin}
                                        userAvatar={userContext.userAvatar}
                                    />
                                </div>
                            </div>
                        )}
                    </article>
                </div>
            </div>

            {/* Image Lightbox */}
            {lightboxSrc && (
                <div className="image-lightbox" onClick={() => setLightboxSrc(null)}>
                    <button className="image-lightbox-close" onClick={() => setLightboxSrc(null)}>
                        <X className="w-5 h-5" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lightboxSrc} alt="Büyütülmüş görsel" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}
