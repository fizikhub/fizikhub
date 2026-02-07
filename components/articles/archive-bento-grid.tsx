"use client";

import { motion } from "framer-motion";
import { ArchiveJournalCard } from "./archive-journal-card";
import { Article } from "@/lib/api";
import { Telescope, BookOpen } from "lucide-react";
import Link from "next/link";

interface ArticleWithInteractions extends Article {
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
}

interface ArchiveBentoGridProps {
    articles: ArticleWithInteractions[];
}

export function ArchiveBentoGrid({ articles }: ArchiveBentoGridProps) {
    if (!articles || articles.length === 0) {
        return <EmptyState />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    // Featured article (first one)
    const featured = articles[0];
    // Rest of the articles
    const rest = articles.slice(1);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Featured Article - Full Width */}
            {featured && (
                <ArchiveJournalCard
                    article={featured}
                    variant="featured"
                    index={0}
                    initialLikes={featured.likes_count}
                    initialComments={featured.comments_count}
                    initialIsLiked={featured.is_liked}
                    initialIsBookmarked={featured.is_bookmarked}
                />
            )}

            {/* Bento Grid for remaining articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {rest.map((article, index) => {
                    // Create visual variety with different span patterns
                    const gridIndex = index;
                    const isLargeCard = gridIndex % 5 === 0; // Every 5th card is larger

                    return (
                        <div
                            key={article.id}
                            className={isLargeCard ? "sm:col-span-2 lg:col-span-2" : ""}
                        >
                            <ArchiveJournalCard
                                article={article}
                                variant="standard"
                                index={index + 1}
                                initialLikes={article.likes_count}
                                initialComments={article.comments_count}
                                initialIsLiked={article.is_liked}
                                initialIsBookmarked={article.is_bookmarked}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Writer CTA Section - Magazine Style */}
            {articles.length > 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                >
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#FF8800] to-[#FF5500] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] p-6 sm:p-8 rounded-xl transform hover:rotate-0 transition-transform rotate-1">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider mb-3 rounded">
                                    <BookOpen className="w-3 h-3" />
                                    <span>Yazar Ol</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase drop-shadow-[2px_2px_0px_black] leading-none mb-2">
                                    SEN DE YAZAR OL!
                                </h3>
                                <p className="text-sm font-bold text-white/90 max-w-sm">
                                    Kendi bilimsel makalelerini yayınla, topluluğa katkı sağla ve bilim dünyasında izini bırak.
                                </p>
                            </div>

                            <Link
                                href="/yazar"
                                className="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-black text-black font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all rounded-lg"
                            >
                                Başvuru Yap
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-24 bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] rounded-xl"
        >
            <motion.div
                animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <Telescope className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-[#FFC800]" />
            </motion.div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white mb-3 tracking-tight">
                Henüz Makale Yok
            </h3>
            <p className="text-sm sm:text-base font-bold text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto px-4">
                Bu kategoride henüz bir makale paylaşılmamış. Hemen ilk makaleyi sen yazar mısın?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
                <Link
                    href="/makale"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#FFC800] border-2 border-black font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-black rounded-lg"
                >
                    Tüm Makalelere Dön
                </Link>
                <Link
                    href="/yazar"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] transition-all text-black dark:text-white rounded-lg"
                >
                    Yazar Ol
                </Link>
            </div>
        </motion.div>
    );
}
