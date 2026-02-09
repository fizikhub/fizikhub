"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutList, MessageCircle, Bookmark, FileText,
    MoreHorizontal, Filter, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { Button } from "@/components/ui/button";

interface NeoProfileFeedWrapperProps {
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    isOwnProfile: boolean;
}

export function NeoProfileFeedWrapper({
    articles,
    questions,
    answers,
    drafts,
    bookmarkedArticles,
    bookmarkedQuestions,
    isOwnProfile
}: NeoProfileFeedWrapperProps) {
    const [activeTab, setActiveTab] = useState("posts");

    // Calculate total counts for badges
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
            { id: "saved", label: "Kaydedilenler", icon: Bookmark },
            { id: "drafts", label: "Taslaklar", icon: FileText }
        ] : [])
    ];

    // Helper to transform data to FeedItems
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

            {/* 1. TABS & CONTROLS HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white rounded-xl p-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)]">

                {/* Scrollable Tabs Container */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all select-none border-2 whitespace-nowrap",
                                    isActive
                                        ? "bg-[#4169E1] text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                                        : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-black/20 hover:text-black dark:hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "")} />
                                {tab.label}

                                {counts[tab.id as keyof typeof counts] > 0 && (
                                    <span className={cn(
                                        "ml-1 text-[10px] px-1.5 py-0.5 rounded border-2 border-black",
                                        isActive ? "bg-white text-black" : "bg-zinc-200 text-zinc-600"
                                    )}>
                                        {counts[tab.id as keyof typeof counts]}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Filters / Search Trigger */}
                <div className="flex items-center gap-2 border-l-2 border-zinc-200 dark:border-zinc-800 pl-2 lg:pl-4 w-full sm:w-auto justify-end">
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-bold border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-black transition-all">
                        <Filter className="w-4 h-4" />
                        <span className="hidden lg:inline">Filtrele</span>
                    </button>
                </div>
            </div>

            {/* 2. CONTENT AREA */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "posts" && (
                            <UnifiedFeed
                                items={feedItems}
                            />
                        )}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform cursor-pointer group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                                    <MessageCircle className="w-4 h-4 text-[#4169E1]" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded border-2 border-green-600 text-xs font-black uppercase">
                                                        <CheckIcon className="w-3 h-3" />
                                                        Kabul Edildi
                                                    </div>
                                                )}
                                            </div>

                                            <h4 className="font-bold text-lg mb-2 group-hover:text-[#4169E1] transition-colors">
                                                {answer.questions?.title}
                                            </h4>

                                            <div className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 pl-3 border-l-4 border-zinc-200 dark:border-zinc-800">
                                                {/* Strip HTML tags for preview usually, simplistic here */}
                                                {answer.content.replace(/<[^>]*>?/gm, "")}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MessageCircle}
                                        label="Henüz Yanıt Yok"
                                        description="Bu kullanıcı henüz hiçbir soruya yanıt vermemiş."
                                    />
                                )}
                            </div>
                        )}

                        {/* Add other tabs content similarly if needed */}
                        {activeTab === "saved" && (
                            <UnifiedFeed
                                items={feedItems}
                            />
                        )}

                        {activeTab === "drafts" && (
                            <UnifiedFeed
                                items={feedItems}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper Components
function CheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function EmptyState({ icon: Icon, label, description }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border-[3px] border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="w-20 h-20 bg-white dark:bg-black rounded-xl flex items-center justify-center mb-6 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-3">
                <Icon className="w-8 h-8 text-black dark:text-white" />
            </div>
            <p className="text-black dark:text-white font-black text-xl mb-2 font-head uppercase tracking-tight">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed mx-auto font-bold">{description}</p>
        </div>
    )
}
