"use client";

import { SocialArticleCard } from "@/components/articles/social-article-card";
import { QuestionCard } from "@/components/forum/question-card";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";
import { ForumTeaserCard } from "@/components/blog/forum-teaser-card";
import { SuggestedUsersCard } from "@/components/home/suggested-users-card";
import { WriterApplicationCard } from "@/components/home/writer-application-card";
import { motion } from "framer-motion";

import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";
import { ExperimentCard } from "@/components/experiment/experiment-card";

import { BookReviewCard } from "@/components/book-review/book-review-card";
import { TermCard } from "@/components/term/term-card";

export interface FeedItem {
    type: 'article' | 'blog' | 'question' | 'experiment' | 'book-review' | 'term';
    data: any;
    sortDate: string;
}

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
}

export function UnifiedFeed({ items, suggestedUsers = [] }: UnifiedFeedProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Feed Container - Clean cards with subtle shadows */}
            <div className="flex flex-col gap-6">
                {items.map((item, index) => (
                    <motion.div
                        key={`${item.type}-${item.data.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                        className="group"
                    >
                        {item.type === 'article' && (
                            <SocialArticleCard
                                article={item.data}
                                index={index}
                                initialLikes={item.data.likes_count || 0}
                                initialComments={item.data.comments_count || 0}
                                initialIsLiked={item.data.is_liked}
                                initialIsBookmarked={item.data.is_bookmarked}
                                badgeLabel="MAKALE"
                                badgeClassName="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-semibold text-xs"
                            />
                        )}

                        {item.type === 'blog' && (
                            <SocialArticleCard
                                article={item.data}
                                index={index}
                                initialLikes={item.data.likes_count || 0}
                                initialComments={item.data.comments_count || 0}
                                initialIsLiked={item.data.is_liked}
                                initialIsBookmarked={item.data.is_bookmarked}
                                badgeLabel="BLOG"
                                badgeClassName="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-semibold text-xs"
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
                            <div className="rounded-2xl border border-border/60 bg-card/50 p-4 hover:border-border hover:bg-card transition-all">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-semibold text-xs"
                                />
                            </div>
                        )}

                        {/* Injected Content - Soft styling */}
                        {index === 2 && (
                            <div className="mt-6">
                                <CommunityInviteBanner />
                            </div>
                        )}

                        {index === 5 && (
                            <div className="mt-6 rounded-2xl overflow-hidden">
                                <ForumTeaserCard />
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
                    </motion.div>
                ))}
            </div>

            {/* Suggested Users Footer - Rounded and soft */}
            <div className="mt-8 rounded-2xl bg-muted/30 border border-border/50 p-6">
                <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4 text-center">
                    Önerilen Araştırmacılar
                </h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
