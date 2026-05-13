"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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


export interface FeedItem {
    type: 'article' | 'blog' | 'question' | 'experiment' | 'book-review' | 'term' | 'answer';
    data: any;
    sortDate: string;
}

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
    showExtras?: boolean;
}

export function UnifiedFeed({ items, suggestedUsers = [], showExtras = true }: UnifiedFeedProps) {
    const [visibleCount, setVisibleCount] = useState(12);
    
    const visibleItems = items.slice(0, visibleCount);
    const hasMore = visibleCount < items.length;

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 sm:gap-6">
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
                            <div className="rounded-[10px] bg-white dark:bg-[#1e1e21] hover:bg-neutral-50 dark:hover:bg-[#252529] transition-colors p-1 sm:p-2 border-[3px] border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-black text-[#FFBD2E] px-2 py-0.5 rounded-md font-black uppercase text-xs tracking-wider"
                                />
                            </div>
                        )}

                        {showExtras && index === 2 && (
                            <LazyMount className="mt-6 min-h-40">
                                <CommunityInviteBanner />
                            </LazyMount>
                        )}
                        {showExtras && index === 8 && (
                            <LazyMount className="mt-6 min-h-40 rounded-[10px] bg-gradient-to-br from-[#FFBD2E] to-[#FFD466] p-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
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

            {hasMore && (
                <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="w-full py-4 mt-2 font-black text-sm uppercase tracking-widest bg-[#FFBD2E] text-black border-[3px] border-black rounded-[8px] sm:rounded-[10px] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    Daha Fazla İçerik Göster
                </button>
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
