"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, MessageCircle, Bookmark, FileText, Search, Filter } from "lucide-react";
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
        { id: "posts", label: "Gönderiler", icon: LayoutList, color: "from-purple-500 to-purple-700" },
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, color: "from-cyan-500 to-cyan-700" },
        ...(isOwnProfile ? [
            { id: "saved", label: "Kaydedilenler", icon: Bookmark, color: "from-pink-500 to-pink-700" },
            { id: "drafts", label: "Taslaklar", icon: FileText, color: "from-yellow-500 to-yellow-700" }
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
            {/* TABS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl p-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all whitespace-nowrap border-2",
                                    isActive
                                        ? `bg-gradient-to-r ${tab.color} text-white border-transparent shadow-[3px_3px_0_rgba(0,0,0,0.5)]`
                                        : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5px]")} />
                                {tab.label}
                                {counts[tab.id as keyof typeof counts] > 0 && (
                                    <span className={cn(
                                        "ml-1 text-[10px] px-1.5 py-0.5 rounded border",
                                        isActive ? "bg-white/20 text-white border-white/30" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    )}>
                                        {counts[tab.id as keyof typeof counts]}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Filter controls */}
                <div className="flex items-center gap-2 border-l border-zinc-700 pl-4">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-sm font-bold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all">
                        <Filter className="w-4 h-4" />
                        <span className="hidden lg:inline">Filtrele</span>
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "posts" && <UnifiedFeed items={feedItems} />}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-zinc-900 border-2 border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0_rgba(6,182,212,0.2)] hover:border-cyan-500/50 transition-all cursor-pointer group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/50 text-xs font-black uppercase">
                                                        ✓ Kabul Edildi
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-zinc-400 text-sm line-clamp-3 pl-3 border-l-4 border-zinc-700">
                                                {answer.content.replace(/<[^>]*>?/gm, "")}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MessageCircle}
                                        label="Henüz Yanıt Yok"
                                        description="Bu kullanıcı henüz hiçbir soruya yanıt vermemiş."
                                        color="cyan"
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === "saved" && <UnifiedFeed items={feedItems} />}
                        {activeTab === "drafts" && <UnifiedFeed items={feedItems} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, label, description, color }: any) {
    const colorClasses = {
        cyan: "shadow-[4px_4px_0_rgba(6,182,212,0.3)] border-cyan-500/30",
        purple: "shadow-[4px_4px_0_rgba(168,85,247,0.3)] border-purple-500/30",
        pink: "shadow-[4px_4px_0_rgba(236,72,153,0.3)] border-pink-500/30",
        yellow: "shadow-[4px_4px_0_rgba(250,204,21,0.3)] border-yellow-500/30"
    };

    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-zinc-900/50",
            colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan
        )}>
            <div className="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border-2 border-zinc-700 shadow-[4px_4px_0_rgba(0,0,0,0.3)] rotate-3">
                <Icon className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-white font-black text-xl mb-2 uppercase tracking-tight">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed mx-auto font-medium">{description}</p>
        </div>
    );
}
