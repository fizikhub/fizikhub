"use client";

import { SocialArticleCard } from "@/components/articles/social-article-card";
import { QuestionCard } from "@/components/forum/question-card";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";
import { ForumTeaserCard } from "@/components/blog/forum-teaser-card";
import { SuggestedUsersCard } from "@/components/home/suggested-users-card";
import { WriterApplicationCard } from "@/components/home/writer-application-card";
import { motion } from "framer-motion";

export interface FeedItem {
    type: 'article' | 'blog' | 'question';
    data: any; // Using any for flexibility, will cast in component
    sortDate: string;
}

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
}

import { DidYouKnow } from "@/components/ui/did-you-know";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";

export function UnifiedFeed({ items, suggestedUsers = [] }: UnifiedFeedProps) {
    console.log("UnifiedFeed Items:", items.length);
    return (
        <div className="space-y-4 px-0 sm:px-0">
            {items.map((item, index) => (
                <div key={`${item.type}-${item.data.id}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.3, delay: index < 3 ? index * 0.05 : 0 }}
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
                                badgeClassName="text-amber-500 bg-amber-500/10"
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
                                badgeClassName="text-emerald-500 bg-emerald-500/10"
                            />
                        )}

                        {item.type === 'question' && (
                            <QuestionCard
                                question={item.data}
                                badgeLabel="SORU"
                                badgeClassName="text-blue-500 bg-blue-500/10"
                            />
                        )}
                    </motion.div>

                    {/* Inject Banner after the first item (index 0) */}
                    {index === 0 && (
                        <div className="mt-6">
                            <CommunityInviteBanner />
                        </div>
                    )}

                    {/* Inject Encyclopedia (DidYouKnow) after 2nd item (index 1) */}
                    {index === 1 && (
                        <div className="mt-6">
                            <DidYouKnow />
                        </div>
                    )}

                    {/* Inject Follow Suggestions after the 4th item (index 3) */}
                    {index === 3 && (
                        <div className="mt-6 border-y border-border/40 py-2 bg-secondary/5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-2xl sm:border sm:bg-card/30">
                            <SuggestedUsersCard users={suggestedUsers} />
                        </div>
                    )}

                    {/* Inject Forum Teaser after the 6th item (index 5) */}
                    {index === 5 && (
                        <div className="mt-6">
                            <ForumTeaserCard />
                        </div>
                    )}

                    {/* Inject Forum Hypothesis Widget after 8th item (index 7) */}
                    {index === 7 && (
                        <div className="mt-6">
                            <QuestionOfTheWeek />
                        </div>
                    )}

                    {/* Inject Writer Application Card after the 11th item (index 10) */}
                    {index === 10 && (
                        <div className="mt-6">
                            <WriterApplicationCard />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
