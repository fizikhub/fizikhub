"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, MessageCircle, Bookmark, FileText } from "lucide-react";
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
        { id: "posts", label: "Gönderiler", icon: LayoutList },
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
            {/* TABS - Custom "Switch" Style */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            data-state={activeTab === tab.id ? "active" : "inactive"}
                            className="neo-tab flex-1 sm:flex-none min-w-[100px]"
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                            <span className="ml-2 opacity-60 text-[10px] scale-90">
                                {counts[tab.id as keyof typeof counts]}
                            </span>
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
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === "posts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyNeoState label="Henüz Gönderi Yok" description="Bir şeyler paylaşmaya başla." />
                            )
                        )}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="neo-box p-4 md:p-6 group cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                    <span>•</span>
                                                    <span>Soruya Yanıt</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="bg-green-400 text-black px-2 py-0.5 text-[10px] font-black border border-black uppercase shadow-[2px_2px_0_0_#000]">
                                                        Kabul Edildi
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-black text-lg text-foreground mb-3 group-hover:underline decoration-2 underline-offset-4">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-muted-foreground text-sm pl-4 border-l-4 border-black dark:border-white opacity-80 line-clamp-3">
                                                {answer.content.replace(/<[^>]*>?/gm, "")}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyNeoState label="Henüz Yanıt Yok" description="Verdiğin cevaplar burada görünür." />
                                )}
                            </div>
                        )}

                        {activeTab === "saved" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyNeoState label="Kayıtlı İçerik Yok" description="Beğendiğin şeyleri kaydet." />
                            )
                        )}

                        {activeTab === "drafts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyNeoState label="Taslak Yok" description="Fikirlerini taslak olarak kaydet." />
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyNeoState({ label, description }: { label: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 border-3 border-dashed border-black/10 dark:border-white/10 rounded-none bg-black/5 dark:bg-white/5">
            <h3 className="text-xl font-black uppercase tracking-tight text-foreground/50 mb-1">{label}</h3>
            <p className="text-sm font-medium text-muted-foreground/80">{description}</p>
        </div>
    );
}
