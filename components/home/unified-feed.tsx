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
    return (
        <div className="flex flex-col gap-3 sm:gap-6">
            <div className="flex flex-col gap-5 sm:gap-6">
                {items.map((item, index) => (
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
                            <div className="rounded-[10px] border-[2.5px] border-black dark:border-zinc-700 bg-white dark:bg-[#1e1e21] p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-[#FFBD2E] text-black px-2.5 py-0.5 rounded-md font-black text-[10px] uppercase border-[1.5px] border-black shadow-[1px_1px_0px_0px_#000]"
                                />
                            </div>
                        )}

                        {index === 2 && <div className="mt-6"><CommunityInviteBanner /></div>}
                        {index === 8 && (
                            <div className="mt-6 rounded-[10px] bg-gradient-to-br from-[#FFBD2E]/5 to-orange-500/5 dark:from-[#FFBD2E]/8 dark:to-orange-500/5 p-6 border-[2px] border-[#FFBD2E]/20 dark:border-[#FFBD2E]/15">
                                <h3 className="font-black text-xs uppercase tracking-wider text-[#FFBD2E] dark:text-[#FFBD2E] mb-4 text-center">
                                    Haftanın Sorusu
                                </h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-[10px] bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]">
                <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-4 text-center">
                    Önerilen Araştırmacılar
                </h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
