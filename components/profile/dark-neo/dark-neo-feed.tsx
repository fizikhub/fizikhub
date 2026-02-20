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
        { id: "posts", label: "Gönderiler", icon: LayoutList, color: "bg-[#23A9FA] text-black" }, // Vivid Blue
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, color: "bg-[#FFC800] text-black" }, // Vivid Yellow
        ...(isOwnProfile ? [
            { id: "saved", label: "Kayıtlı", icon: Bookmark, color: "bg-[#FF3366] text-white" }, // Vivid Pink
            { id: "drafts", label: "Taslaklar", icon: FileText, color: "bg-[#00F050] text-black" } // Vivid Green
        ] : [])
    ];

    const getFeedItems = (type: string): FeedItem[] => {
        let items: FeedItem[] = [];
        if (type === 'posts') {
            const articleItems = articles.map(a => ({ type: 'article', data: a, sortDate: a.created_at } as FeedItem));
            const questionItems = questions.map(q => ({ type: 'question', data: q, sortDate: q.created_at } as FeedItem));
            items = [...articleItems, ...questionItems];
        } else if (type === 'saved') {
            const savedArticles = bookmarkedArticles
                .filter(b => b.articles)
                .map(b => ({
                    type: 'article',
                    data: Array.isArray(b.articles) ? b.articles[0] : b.articles,
                    sortDate: b.created_at
                } as FeedItem));
            const savedQuestions = bookmarkedQuestions
                .filter(b => b.questions)
                .map(b => ({
                    type: 'question',
                    data: Array.isArray(b.questions) ? b.questions[0] : b.questions,
                    sortDate: b.created_at
                } as FeedItem));
            items = [...savedArticles, ...savedQuestions];
        } else if (type === 'replies') {
            items = answers.map(a => ({ type: 'answer', data: a, sortDate: a.created_at } as FeedItem));
        } else if (type === 'drafts') {
            items = drafts.map(d => ({ type: 'article', data: d, sortDate: d.created_at } as FeedItem));
        }
        return items.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
    };

    const feedItems = getFeedItems(activeTab);

    return (
        <div className="w-full space-y-6">
            {/* TABS - Vivid & Chunky */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 border-b-2 border-dashed border-black/20">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2 border-2 rounded-xl font-black text-xs transition-all whitespace-nowrap flex-shrink-0 active:scale-95 group",
                                isActive
                                    ? `${tab.color} border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]`
                                    : "bg-white dark:bg-[#27272a] border-black text-zinc-500 hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            )}
                        >
                            <Icon className={cn("w-3.5 h-3.5 stroke-[2.5px]", isActive && "stroke-current")} />
                            {tab.label}
                            {counts[tab.id as keyof typeof counts] > 0 && (
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-md ml-1.5 font-black border border-black/10",
                                    isActive ? "bg-black/20 text-current" : "bg-black/5 text-zinc-500 group-hover:text-zinc-400 group-hover:bg-black/20"
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
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "posts" && <UnifiedFeed items={feedItems} />}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-[#27272a] border-2 border-black rounded-xl p-5 hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group hover:bg-[#2a2a2d] shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] relative overflow-hidden">
                                            {/* Top Line Accent */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC800] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                            <div className="flex items-start justify-between mb-3 relative z-10">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                                                    <MessageCircle className="w-3.5 h-3.5 text-[#FFC800] stroke-[2.5px]" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1 bg-green-500 text-black px-2 py-0.5 rounded border-2 border-black text-[9px] font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                                                        ✓ Kabul
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-black text-base text-zinc-100 mb-2 group-hover:text-[#FFC800] transition-colors leading-snug relative z-10">
                                                {Array.isArray(answer.questions) ? answer.questions[0]?.title : answer.questions?.title || "Soru Başlığı Bulunamadı"}
                                            </h4>
                                            <div className="text-zinc-400 text-sm leading-relaxed pl-3 border-l-2 border-zinc-700 group-hover:border-[#FFC800] transition-colors relative z-10">
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
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/20">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <Icon className="w-5 h-5 text-zinc-500 stroke-[2.5px]" />
            </div>
            <p className="text-zinc-300 font-black text-base mb-1">{label}</p>
            <p className="text-zinc-500 text-xs max-w-[250px] leading-relaxed font-bold">{description}</p>
        </div>
    );
}
