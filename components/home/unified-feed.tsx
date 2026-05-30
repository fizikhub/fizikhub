"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { createClient } from "@/lib/supabase";
import { processFeedData } from "@/lib/feed-helpers";
import { ArrowUp, RefreshCw } from "lucide-react";

// Lazy load non-critical feed cards to minimize initial JS bundle size and TBT
const QuestionCard = dynamic(() => import("@/components/forum/question-card").then(mod => mod.QuestionCard));
const ExperimentCard = dynamic(() => import("@/components/experiment/experiment-card").then(mod => mod.ExperimentCard));
const BookReviewCard = dynamic(() => import("@/components/book-review/book-review-card").then(mod => mod.BookReviewCard));
const TermCard = dynamic(() => import("@/components/term/term-card").then(mod => mod.TermCard));

const SuggestedUsersCard = dynamic(() => import("@/components/home/suggested-users-card").then(mod => mod.SuggestedUsersCard), {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-2xl" />
});

// Lazy load heavy injected components
const CommunityInviteBanner = dynamic(() => import("@/components/explore/community-invite-banner").then(mod => mod.CommunityInviteBanner), {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-2xl" />
});

const QuestionOfTheWeek = dynamic(() => import("@/components/forum/question-of-the-week").then(mod => mod.QuestionOfTheWeek), {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-2xl" />
});

import { Article, Question } from "@/lib/api";

// Dynamic Loader Skeleton for pagination
const DynamicSkeleton = () => (
    <div className="w-full h-64 bg-white dark:bg-[#1e1e21] border-[3px] border-black dark:border-zinc-700 rounded-[10px] shadow-[4px_4px_0px_0px_#000] p-6 space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/30" />
            <div className="space-y-2 flex-1">
                <div className="h-3 w-1/4 bg-muted/30 rounded" />
                <div className="h-2 w-1/6 bg-muted/30 rounded" />
            </div>
        </div>
        <div className="h-4 w-3/4 bg-muted/30 rounded" />
        <div className="h-16 w-full bg-muted/20 rounded" />
    </div>
);

// ─── STABLE TYPE DEFINITIONS ─────────────────────────────────────
export interface FeedAuthor {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    is_writer?: boolean | null;
    is_verified?: boolean | null;
}

export type FeedArticleData = Article & {
    likes_count?: number;
    comments_count?: number;
    is_liked?: boolean;
    is_bookmarked?: boolean;
    [key: string]: unknown;
};

export type FeedQuestionData = Question & {
    answer_count?: number;
    answers?: { count?: number | null }[] | null;
    [key: string]: unknown;
};

export type FeedItem =
    | { type: 'article' | 'blog' | 'experiment' | 'book-review' | 'term'; data: FeedArticleData; sortDate: string; }
    | { type: 'question'; data: FeedQuestionData; sortDate: string; };

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
    showExtras?: boolean;
}

export function UnifiedFeed({ items: initialItems, suggestedUsers = [], showExtras = true }: UnifiedFeedProps) {
    const [items, setItems] = useState<FeedItem[]>(initialItems);
    const [pendingItems, setPendingItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [beforeDate, setBeforeDate] = useState<string>(
        initialItems.length > 0 ? initialItems[initialItems.length - 1].sortDate : new Date().toISOString()
    );

    const [supabase] = useState(() => createClient());
    const observerRef = useRef<HTMLDivElement>(null);

    // Dynamic Cursor Pagination Fetcher
    const loadMoreItems = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const articleSelect = '*, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)';
            
            // Keyset Pagination: Fetch items older than the current cursor date (beforeDate)
            const [articlesResult, questionsResult] = await Promise.all([
                supabase
                    .from('articles')
                    .select(articleSelect)
                    .eq('status', 'published')
                    .lt('created_at', beforeDate)
                    .order('created_at', { ascending: false })
                    .limit(6),
                supabase
                    .from('questions')
                    .select('id, title, content, created_at, category, votes, tags, author:profiles(username, full_name, avatar_url, is_verified), answers(count)')
                    .lt('created_at', beforeDate)
                    .order('created_at', { ascending: false })
                    .limit(6)
            ]);

            const articles = (articlesResult.data || []) as unknown as FeedArticleData[];
            const questions = (questionsResult.data || []) as unknown as FeedQuestionData[];

            if (articles.length === 0 && questions.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const processedNewItems = processFeedData(articles, questions);

            if (processedNewItems.length > 0) {
                setItems(prev => {
                    // Prevent duplicate elements
                    const existingIds = new Set(prev.map(item => `${item.type}-${item.data.id}`));
                    const uniqueNewItems = processedNewItems.filter(item => !existingIds.has(`${item.type}-${item.data.id}`));
                    return [...prev, ...uniqueNewItems];
                });
                
                // Advance the cursor date to the last processed item date
                setBeforeDate(processedNewItems[processedNewItems.length - 1].sortDate);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more feed items:", error);
        } finally {
            setLoading(false);
        }
    }, [beforeDate, hasMore, loading, supabase]);

    // Intersection Observer setup for automatic loading on scroll
    useEffect(() => {
        const observerTarget = observerRef.current;
        if (!observerTarget || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMoreItems();
                }
            },
            { rootMargin: "250px 0px" }
        );

        observer.observe(observerTarget);
        return () => {
            if (observerTarget) observer.unobserve(observerTarget);
        };
    }, [loadMoreItems, hasMore, loading]);

    // Supabase Real-time Listener (Twitter/Instagram style "New Posts" notification)
    useEffect(() => {
        const articleSelect = '*, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)';

        const channel = supabase
            .channel("realtime-feed-updates")
            // 1. Listen for new articles
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "articles" },
                async (payload) => {
                    const newArticleRow = payload.new;
                    if (newArticleRow && newArticleRow.status === 'published') {
                        // Fetch relation data (author details) which is not sent in raw real-time inserts
                        const { data: fullArticle } = await supabase
                            .from('articles')
                            .select(articleSelect)
                            .eq('id', newArticleRow.id)
                            .single();

                        if (fullArticle) {
                            const processed = processFeedData([fullArticle as unknown as FeedArticleData], []);
                            if (processed.length > 0) {
                                setPendingItems(prev => {
                                    const exists = prev.some(item => `${item.type}-${item.data.id}` === `${processed[0].type}-${processed[0].data.id}`);
                                    return exists ? prev : [processed[0], ...prev];
                                });
                            }
                        }
                    }
                }
            )
            // 2. Listen for new forum questions
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "questions" },
                async (payload) => {
                    const newQuestionRow = payload.new;
                    if (newQuestionRow) {
                        const { data: fullQuestion } = await supabase
                            .from('questions')
                            .select('id, title, content, created_at, category, votes, tags, author:profiles(username, full_name, avatar_url, is_verified), answers(count)')
                            .eq('id', newQuestionRow.id)
                            .single();

                        if (fullQuestion) {
                            const processed = processFeedData([], [fullQuestion as unknown as FeedQuestionData]);
                            if (processed.length > 0) {
                                setPendingItems(prev => {
                                    const exists = prev.some(item => `${item.type}-${item.data.id}` === `${processed[0].type}-${processed[0].data.id}`);
                                    return exists ? prev : [processed[0], ...prev];
                                });
                            }
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    // Prepend pending realtime posts to the feed and scroll to top smoothly
    const applyPendingItems = () => {
        if (pendingItems.length === 0) return;

        setItems(prev => {
            const existingIds = new Set(prev.map(item => `${item.type}-${item.data.id}`));
            const uniquePending = pendingItems.filter(item => !existingIds.has(`${item.type}-${item.data.id}`));
            return [...uniquePending, ...prev];
        });
        setPendingItems([]);
        
        // Twitter-like smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 relative">
            
            {/* FLOATING REAL-TIME BADGE (PILL) */}
            {pendingItems.length > 0 && (
                <div className="sticky top-20 z-50 flex justify-center w-full pointer-events-none">
                    <button
                        onClick={applyPendingItems}
                        className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#EAB308] text-black border-[3px] border-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-[4px] active:shadow-none transition-all animate-bounce"
                    >
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        Yeni Paylaşımlar Var! ({pendingItems.length})
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:gap-6">
                {items.map((item, index) => (
                    <div
                        key={`${item.type}-${item.data.id}`}
                        className="feed-item-appear will-change-transform"
                        style={{ 
                            animationDelay: index < 3 ? `${index * 50}ms` : undefined,
                            contentVisibility: index > 4 ? 'auto' : undefined,
                            containIntrinsicSize: index > 4 ? '0 450px' : undefined
                        }}
                    >
                        {(item.type === 'article' || item.type === 'blog') && (
                            <NeoArticleCard
                                article={item.data}
                                initialLikes={item.data.likes_count || 0}
                                initialComments={item.data.comments_count || 0}
                                initialIsLiked={item.data.is_liked}
                                initialIsBookmarked={item.data.is_bookmarked}
                                priority={index < 1}
                            />
                        )}

                        {item.type === 'experiment' && (
                            <ExperimentCard
                                article={item.data}
                                index={index}
                            />
                        )}

                        {item.type === 'book-review' && (
                            <BookReviewCard
                                article={{
                                    ...item.data,
                                    id: Number(item.data.id),
                                    excerpt: item.data.excerpt || null,
                                    content: item.data.content || "",
                                    cover_url: item.data.cover_url || null,
                                    author: item.data.author ? {
                                        username: item.data.author.username || null,
                                        full_name: item.data.author.full_name || null,
                                        avatar_url: item.data.author.avatar_url || null,
                                    } : null
                                }}
                                index={index}
                            />
                        )}

                        {item.type === 'term' && (
                            <TermCard
                                article={{
                                    ...item.data,
                                    content: item.data.content || undefined,
                                    excerpt: item.data.excerpt || null,
                                    summary: item.data.summary || null,
                                    author: item.data.author ? {
                                        full_name: item.data.author.full_name || null,
                                        avatar_url: item.data.author.avatar_url || null,
                                    } : null
                                }}
                                index={index}
                            />
                        )}

                        {item.type === 'question' && (
                            <div className="rounded-[10px] bg-white dark:bg-[#1e1e21] hover:bg-neutral-50 dark:hover:bg-[#252529] transition-colors p-1 sm:p-2 border-[3px] border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-black text-[#EAB308] px-2 py-0.5 rounded-md font-black uppercase text-xs tracking-wider"
                                />
                            </div>
                        )}

                        {showExtras && index === 2 && (
                            <LazyMount className="mt-6 min-h-40">
                                <CommunityInviteBanner />
                            </LazyMount>
                        )}
                        {showExtras && index === 8 && (
                            <LazyMount className="mt-6 min-h-40 rounded-[10px] bg-gradient-to-br from-[#EAB308] to-[#EAB308] p-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest text-black mb-4 text-center">
                                        Haftanın Sorusu
                                    </h3>
                                    <QuestionOfTheWeek />
                                </div>
                            </LazyMount>
                        )}
                    </div>
                ))}
            </div>

            {/* INFINITE SCROLL OBSERVER TARGET */}
            <div ref={observerRef} className="w-full pt-4">
                {loading && (
                    <div className="flex flex-col gap-4">
                        <DynamicSkeleton />
                    </div>
                )}
            </div>

            {/* MANUAL LOAD FALLBACK & accessibility */}
            {!loading && hasMore && (
                <button
                    onClick={loadMoreItems}
                    className="w-full py-4 mt-2 font-black text-sm uppercase tracking-widest bg-[#EAB308] text-black border-[3px] border-black rounded-[8px] sm:rounded-[10px] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Daha Fazla İçerik Göster
                </button>
            )}

            {!hasMore && (
                <div className="w-full text-center py-6 text-neutral-500 font-bold uppercase text-xs tracking-wider border-2 border-dashed border-neutral-300 dark:border-zinc-800 rounded-xl">
                    🚀 Harika! Akışın Sonuna Ulaştın. Yeni Bilgiler İçin Bizi Takip Etmeye Devam Et.
                </div>
            )}

            {showExtras && (
                <LazyMount className="mt-6 rounded-[10px] bg-white dark:bg-[#1e1e21] border-[3px] border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] p-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-neutral-500 dark:text-zinc-400 mb-4 text-center">
                        Önerilen Araştırmacılar
                    </h3>
                    <SuggestedUsersCard users={suggestedUsers} />
                </LazyMount>
            )}
        </div>
    );
}

function LazyMount({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || isVisible) return;

        if (!("IntersectionObserver" in window)) {
            const timeout = setTimeout(() => setIsVisible(true), 0);
            return () => clearTimeout(timeout);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "180px 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : <div className="h-40 rounded-[10px] bg-muted/20 animate-pulse" />}
        </div>
    );
}
