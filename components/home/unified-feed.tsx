"use client";

import dynamic from "next/dynamic";
import { NeoArticleCard } from "@/components/articles/neo-article-card";

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

// Formerly ForumTeaserCard, now removed/replaced
// const ForumTeaserCard = ...

const QuestionOfTheWeek = dynamic(() => import("@/components/forum/question-of-the-week").then(mod => mod.QuestionOfTheWeek), {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-2xl" />
});

import { useState, useEffect } from "react";

export interface FeedItem {
    type: 'article' | 'blog' | 'question' | 'experiment' | 'book-review' | 'term' | 'answer';
    data: any;
    sortDate: string;
}

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
}

export function UnifiedFeed({ items, suggestedUsers = [] }: UnifiedFeedProps) {
    // Progressive hydration: Render first 3 items immediately (SSR/initial load)
    // to avoid freezing the main thread, then render the rest during idle time.
    const [renderCount, setRenderCount] = useState(3);

    useEffect(() => {
        if (items.length > 3) {
            const idleCallback = window.requestIdleCallback ?
                window.requestIdleCallback(() => setRenderCount(items.length), { timeout: 2000 }) :
                setTimeout(() => setRenderCount(items.length), 500);

            return () => {
                if (window.cancelIdleCallback && typeof idleCallback === 'number') window.cancelIdleCallback(idleCallback);
                else clearTimeout(idleCallback as any);
            };
        }
    }, [items.length]);

    const visibleItems = items.slice(0, renderCount);

    return (
        <div className="flex flex-col gap-3 sm:gap-6">
            <div className="flex flex-col gap-5 sm:gap-6">
                {visibleItems.map((item, index) => (
                    <div
                        key={`${item.type}-${item.data.id}`}
                        className="feed-item-appear will-change-transform"
                        style={{ animationDelay: index < 3 ? `${index * 50}ms` : undefined }}
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
                                article={item.data}
                                index={index}
                            />
                        )}

                        {item.type === 'term' && (
                            <TermCard
                                article={item.data}
                                index={index}
                            />
                        )}

                        {item.type === 'question' && (
                            <div className="rounded-2xl border border-border/60 bg-card/50 p-4 hover:border-border hover:bg-card transition-colors">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-semibold text-xs"
                                />
                            </div>
                        )}

                        {index === 2 && <div className="mt-6"><CommunityInviteBanner /></div>}
                        {index === 8 && (
                            <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 border border-amber-500/10">
                                <h3 className="font-bold text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-4 text-center">
                                    Haftanın Sorusu
                                </h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-2xl bg-muted/20 border border-border/40 p-6">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">
                    Önerilen Araştırmacılar
                </h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
