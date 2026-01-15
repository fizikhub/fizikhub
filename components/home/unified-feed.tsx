"use client";

import { SocialArticleCard } from "@/components/articles/social-article-card";
import { MobileArticleCard } from "@/components/home/mobile-article-card";
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
        <div className="flex flex-col gap-8">
            {/* Feed Container - Cleaner Vertical Stack */}
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={`${item.type}-${item.data.id}`}>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            {/* Standard Mobile Article Card */}
                            {(item.type === 'article' || item.type === 'blog') && (
                                <div className="relative">
                                    <MobileArticleCard
                                        article={item.data}
                                        showCategory={true}
                                    />
                                </div>
                            )}

                            {item.type === 'question' && (
                                <div className="border border-foreground/10 rounded-xl p-4 bg-foreground/[0.02]">
                                    <QuestionCard
                                        question={item.data}
                                        badgeLabel="SORU"
                                        badgeClassName="bg-gray-200 text-black px-2 py-0.5 rounded-md font-mono text-xs scale-90 origin-left"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Injected Content - Styled as Soft Breaks */}
                        {index === 2 && (
                            <div className="my-8 rounded-2xl overflow-hidden border border-border/40">
                                <CommunityInviteBanner />
                            </div>
                        )}

                        {index === 5 && (
                            <div className="my-8">
                                <ForumTeaserCard />
                            </div>
                        )}

                        {index === 8 && (
                            <div className="my-8 rounded-2xl border border-border/40 bg-primary/5 p-4 md:p-6">
                                <h3 className="font-bold text-xs uppercase mb-4 text-primary tracking-widest text-center">Haftanın Sorusu</h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Suggested Users Footer */}
            <div className="mt-8 border-t border-dashed border-foreground/20 pt-8 pb-12">
                <h3 className="font-bold text-xs uppercase mb-6 text-center text-muted-foreground tracking-widest">Önerilen Araştırmacılar</h3>
                <div className="px-2">
                    <SuggestedUsersCard users={suggestedUsers} />
                </div>
            </div>
        </div>
    );
}
