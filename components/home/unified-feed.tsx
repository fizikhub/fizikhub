"use client";

import { NeoArticleCard } from "@/components/articles/neo-article-card";
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
import { ScienceStories } from "@/components/science-cards/science-stories";

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
        <div className="flex flex-col gap-3 sm:gap-6">
            {/* Feed Container - Bold & Spacious */}
            <div className="flex flex-col gap-8">
                {items.map((item, index) => (
                    <motion.div
                        key={`${item.type}-${item.data.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: "backOut" }}
                        className="group relative"
                    >
                        {/* Decorative Line for some items */}
                        {index % 3 === 0 && index !== 0 && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-border/20 rounded-full mb-4" />
                        )}

                        {item.type === 'article' && (
                            <div className="transform transition-transform duration-300 hover:-rotate-1">
                                <NeoArticleCard
                                    article={item.data}
                                    initialLikes={item.data.likes_count || 0}
                                    initialComments={item.data.comments_count || 0}
                                    initialIsLiked={item.data.is_liked}
                                    initialIsBookmarked={item.data.is_bookmarked}
                                />
                            </div>
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
                            <div className="border-2 border-black dark:border-white rounded-xl overflow-hidden shadow-neo">
                                <ExperimentCard
                                    article={item.data}
                                    index={index}
                                />
                            </div>
                        )}

                        {item.type === 'book-review' && (
                            <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                <BookReviewCard
                                    article={item.data}
                                    index={index}
                                />
                            </div>
                        )}

                        {item.type === 'term' && (
                            <TermCard
                                article={item.data}
                                index={index}
                            />
                        )}

                        {item.type === 'question' && (
                            <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card/50 p-4 hover:border-black dark:hover:border-white transition-all">
                                <QuestionCard
                                    question={item.data}
                                    badgeLabel="SORU"
                                    badgeClassName="bg-yellow-400 text-black px-2 py-0.5 rounded-md font-bold text-xs border border-black shadow-[2px_2px_0_0_#000]"
                                />
                            </div>
                        )}

                        {/* Injected Content - Pop Style w/ NeoBrutalistCard wrapper concept (inline styles for now) */}
                        {index === 2 && (
                            <div className="mt-8 mb-4">
                                <CommunityInviteBanner />
                            </div>
                        )}

                        {index === 5 && (
                            <div className="mt-8 rounded-xl border-2 border-black dark:border-white overflow-hidden shadow-neo">
                                <ForumTeaserCard />
                            </div>
                        )}

                        {/* Rapid Science Stories Injection */}
                        {index === 6 && (
                            <div className="mt-10 mb-10 -mx-4 sm:mx-0 py-4 bg-yellow-400/10 border-y-2 border-black/5 dark:border-white/5 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-3 py-1 font-black text-xs uppercase border-2 border-black transform -rotate-2">
                                    Hızlı Bilim
                                </div>
                                <ScienceStories />
                            </div>
                        )}

                        {index === 8 && (
                            <div className="mt-8 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 border-2 border-amber-500 shadow-neo">
                                <h3 className="font-black text-lg uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-6 text-center flex items-center justify-center gap-2">
                                    <span className="text-2xl">🤔</span> Haftanın Sorusu
                                </h3>
                                <QuestionOfTheWeek />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Suggested Users Footer */}
            <div className="mt-12 rounded-xl border-2 border-black dark:border-white bg-card p-6 shadow-neo">
                <h3 className="font-black text-xl uppercase tracking-wide text-foreground mb-6 text-center">
                    Önerilen Araştırmacılar
                </h3>
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        </div>
    );
}
