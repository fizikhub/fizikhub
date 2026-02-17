"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, MessageCircle, Bookmark, FileText, Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";

// True Royal Blue
const ROYAL_BLUE = "#1E3A5F";

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
        { id: "posts", label: "Gönderiler", icon: LayoutList, color: "bg-white text-black" },
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, color: "bg-[#FF6B00] text-black" },
        ...(isOwnProfile ? [
            { id: "saved", label: "Kayıtlı", icon: Bookmark, color: "bg-zinc-800 text-white" },
            { id: "drafts", label: "Taslaklar", icon: FileText, color: "bg-yellow-400 text-black" }
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
            {/* TABS - Sharp Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2 border-2 border-black font-black uppercase tracking-wide text-xs transition-all whitespace-nowrap flex-shrink-0",
                                isActive
                                    ? `${tab.color} shadow-[4px_4px_0px_0px_#000] -translate-y-1`
                                    : "bg-[#0a0a0a] text-zinc-500 hover:text-white hover:border-zinc-500"
                            )}
                        >
                            <Icon className={cn("w-3.5 h-3.5", isActive && "stroke-[2.5px]")} />
                            {tab.label}
                            {counts[tab.id as keyof typeof counts] > 0 && (
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 border border-black",
                                    isActive ? "bg-black text-white" : "bg-zinc-800 text-zinc-400"
                                )}>
                                    {counts[tab.id as keyof typeof counts]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === "posts" && <UnifiedFeed items={feedItems} />}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-[#0a0a0a] border-2 border-zinc-900 p-5 hover:border-white/50 transition-all cursor-pointer group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                                                    <MessageCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1 bg-green-500 text-black px-2 py-0.5 border border-black text-[9px] font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                                                        ✓ Kabul
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-base text-white mb-3 group-hover:text-[#FF6B00] transition-colors leading-snug">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-zinc-400 text-sm leading-relaxed pl-4 border-l-4 border-zinc-800 group-hover:border-[#FF6B00] transition-colors">
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
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-800 bg-zinc-900/20">
            <div className="w-16 h-16 bg-black border-2 border-zinc-800 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
                <Icon className="w-6 h-6 text-zinc-500" />
            </div>
            <p className="text-white font-black text-lg mb-2 uppercase tracking-wide">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed font-medium">{description}</p>
        </div>
    );
}
