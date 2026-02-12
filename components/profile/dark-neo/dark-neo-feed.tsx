"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, MessageCircle, Bookmark, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";

interface DarkNeoFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    isOwnProfile: boolean;
}

export function DarkNeoFeed({
    articles,
    questions,
    answers,
    drafts,
    bookmarkedArticles,
    bookmarkedQuestions,
    isOwnProfile
}: DarkNeoFeedProps) {
    const [activeTab, setActiveTab] = useState("posts");

    const counts = {
        posts: articles.length + questions.length,
        replies: answers.length,
        saved: bookmarkedArticles.length + bookmarkedQuestions.length,
        drafts: drafts.length
    };

    const tabs = [
        { id: "posts", label: "Gönderiler", icon: LayoutGrid },
        { id: "replies", label: "Yanıtlar", icon: MessageCircle },
        ...(isOwnProfile ? [
            { id: "saved", label: "Kayıtlı", icon: Bookmark },
            { id: "drafts", label: "Taslaklar", icon: FileText }
        ] : [])
    ];

    const getFeedItems = (type: string): FeedItem[] => {
        let items: FeedItem[] = [];
        if (type === 'posts') {
            const articleItems = articles.map(a => ({ type: 'article', data: a, sortDate: a.created_at } as FeedItem));
            const questionItems = questions.map(q => ({ type: 'question', data: q, sortDate: q.created_at } as FeedItem));
            items = [...articleItems, ...questionItems];
        } else if (type === 'saved') {
            const savedArticles = bookmarkedArticles.map(b => ({ type: 'article', data: b.articles, sortDate: b.created_at } as FeedItem));
            const savedQuestions = bookmarkedQuestions.map(b => ({ type: 'question', data: b.questions, sortDate: b.created_at } as FeedItem));
            items = [...savedArticles, ...savedQuestions];
        } else if (type === 'drafts') {
            items = drafts.map(d => ({ type: 'article', data: d, sortDate: d.created_at } as FeedItem));
        }
        return items.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
    };

    const feedItems = getFeedItems(activeTab);

    return (
        <div className="w-full space-y-6">
            {/* CLEAN TABS */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2",
                                isActive
                                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
                                    : "bg-white dark:bg-zinc-900 text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {counts[tab.id as keyof typeof counts] > 0 && (
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full ml-1",
                                    isActive
                                        ? "bg-white/20 text-white dark:text-black"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                )}>
                                    {counts[tab.id as keyof typeof counts]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "posts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyState
                                    icon={LayoutGrid}
                                    label="Henüz Gönderi Yok"
                                    description="Paylaştığın makale ve sorular burada görünecek."
                                />
                            )
                        )}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-black/10 dark:hover:border-white/10 transition-colors group">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                        Kabul Edildi
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-base text-black dark:text-white mb-3 group-hover:underline decoration-2 decoration-yellow-400 underline-offset-2 transition-all">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                                                {answer.content.replace(/<[^>]*>?/gm, "").slice(0, 150)}...
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MessageCircle}
                                        label="Henüz Yanıt Yok"
                                        description="Henüz hiçbir soruya yanıt verilmemiş."
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === "saved" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyState
                                    icon={Bookmark}
                                    label="Kayıtlı İçerik Yok"
                                    description="Beğendiğin içerikleri kaydet, sonra buradan ulaş."
                                />
                            )
                        )}

                        {activeTab === "drafts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyState
                                    icon={FileText}
                                    label="Taslak Yok"
                                    description="Yazmaya başla, taslakların burada görünecek."
                                />
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, label, description }: { icon: any; label: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-5 border-2 border-zinc-100 dark:border-zinc-700 shadow-sm">
                <Icon className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="text-black dark:text-white font-black text-lg mb-2">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed mx-auto">{description}</p>
        </div>
    );
}
