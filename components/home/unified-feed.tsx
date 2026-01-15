"use client";

import { SocialArticleCard } from "@/components/articles/social-article-card";
import { QuestionCard } from "@/components/forum/question-card";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";
import { ForumTeaserCard } from "@/components/blog/forum-teaser-card";
import { SuggestedUsersCard } from "@/components/home/suggested-users-card";
import { WriterApplicationCard } from "@/components/home/writer-application-card";
import { motion } from "framer-motion";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";

export interface FeedItem {
    type: 'article' | 'blog' | 'question';
    data: any;
    sortDate: string;
}

interface UnifiedFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
}

export function UnifiedFeed({ items, suggestedUsers = [] }: UnifiedFeedProps) {
    return (
        <div className="grid grid-cols-1 gap-4 px-0">
            {/* Note: User requested Grid layout, but the feed is logically vertical. 
            The 'Scientific Neo-Brutalism' prompt asked for an organized hierarchy. 
            I'll interpret this as a stark list with thick dividers first, to maintain readability on mobile.
            Grid columns on desktop might clutter the feed. Sticking to stark vertical list with heavy borders. */}

            <div className="border-4 border-primary bg-background shadow-[8px_8px_0px_0px_#000000]">
                {items.map((item, index) => (
                    <div key={`${item.type}-${item.data.id}`} className="group relative border-b-2 border-primary last:border-b-0">

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2 }}
                            className="p-4 sm:p-6 hover:bg-secondary/20 transition-colors"
                        >
                            {/* Raw Index Number */}
                            <div className="absolute top-2 right-2 font-mono text-[10px] text-muted-foreground opacity-30 group-hover:opacity-100">
                                #{String(index + 1).padStart(3, '0')}
                            </div>

                            {item.type === 'article' && (
                                <SocialArticleCard
                                    article={item.data}
                                    index={index}
                                    initialLikes={item.data.likes_count || 0}
                                    initialComments={item.data.comments_count || 0}
                                    initialIsLiked={item.data.is_liked}
                                    initialIsBookmarked={item.data.is_bookmarked}
                                    badgeLabel="MAKALE"
                                    badgeClassName="bg-black text-white px-2 py-0.5 rounded-none font-mono text-xs"
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
                                    badgeClassName="bg-white border border-black text-black px-2 py-0.5 rounded-none font-mono text-xs"
                                />
                            )}

                            {item.type === 'question' && (
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-gray-200 text-black px-2 py-0.5 rounded-none font-mono text-xs"
                                />
                            )}
                        </motion.div>

                        {/* Injected Content - Styled as Breaks */}
                        {index === 2 && (
                            <div className="border-t-2 border-primary bg-accent p-6 text-center">
                                <h3 className="text-xl font-black uppercase mb-2">Aramıza Katıl</h3>
                                <CommunityInviteBanner />
                            </div>
                        )}

                        {index === 5 && (
                            <div className="border-t-2 border-primary p-0">
                                <ForumTeaserCard />
                            </div>
                        )}

                        {index === 8 && (
                            <div className="border-t-2 border-primary bg-primary text-primary-foreground p-6">
                                <h3 className="font-mono text-xs uppercase mb-4">Haftanın Sorusu :: Hipotez Testi</h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Suggested Users Footer */}
            <div className="mt-8 border-2 border-dashed border-primary p-4">
                <h3 className="font-mono text-xs uppercase mb-4 text-center">Önerilen Araştırmacılar</h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
