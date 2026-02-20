"use client";

import dynamic from "next/dynamic";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { QuestionCard } from "@/components/forum/question-card";
import { ExperimentCard } from "@/components/experiment/experiment-card";
import { BookReviewCard } from "@/components/book-review/book-review-card";
import { TermCard } from "@/components/term/term-card";

const SuggestedUsersCard = dynamic(() => import("@/components/home/suggested-users-card").then(mod => mod.SuggestedUsersCard), {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-2xl" />
});

// Replaced WriterApplicationCard with GoldenTicketCTA
const GoldenTicketCTA = dynamic(() => import("@/components/ui/golden-ticket-cta").then(mod => mod.GoldenTicketCTA));

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
            {/* Feed Container - Clean cards */}
            <div className="flex flex-col gap-5 sm:gap-6">
                {items.map((item, index) => (
                    <div
                        key={`${item.type}-${item.data.id}`}
                        className="feed-item-appear"
                        style={{ animationDelay: index < 5 ? `${index * 60}ms` : undefined }}
                    >
                        {item.type === 'article' && (
                            <NeoArticleCard
                                article={item.data}
                                initialLikes={item.data.likes_count || 0}
                                initialComments={item.data.comments_count || 0}
                                initialIsLiked={item.data.is_liked}
                                initialIsBookmarked={item.data.is_bookmarked}
                            />
                        )}

                        {item.type === 'blog' && (
                            <NeoArticleCard
                                article={item.data}
                                initialLikes={item.data.likes_count || 0}
                                initialIsLiked={item.data.is_liked}
                                initialIsBookmarked={item.data.is_bookmarked}
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

                        {/* Injected Content */}
                        {index === 2 && (
                            <div className="mt-6">
                                <CommunityInviteBanner />
                            </div>
                        )}

                        {/* REPLACED "Kafanda Soru mu Var?" (ForumTeaserCard) with GOLDEN TICKET */}
                        {index === 5 && (
                            <div className="mt-6">
                                <GoldenTicketCTA />
                            </div>
                        )}

                        {index === 8 && (
                            <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 border border-amber-500/10">
                                <h3 className="font-bold text-sm uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-4 text-center">
                                    Haftanın Sorusu
                                </h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Suggested Users Footer */}
            <div className="mt-8 rounded-2xl bg-muted/30 border border-border/50 p-6">
                <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4 text-center">
                    Önerilen Araştırmacılar
                </h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
