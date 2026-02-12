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
        { id: "posts", label: "Gönderiler", icon: LayoutList, color: "bg-[#1E3A5F]" },
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, color: "bg-cyan-600" },
        ...(isOwnProfile ? [
            { id: "saved", label: "Kayıtlı", icon: Bookmark, color: "bg-pink-600" },
            { id: "drafts", label: "Taslaklar", icon: FileText, color: "bg-yellow-500" }
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
        <div className="w-full space-y-4">
            {/* MOBILE OPTIMIZED TABS - Horizontal scroll */}
            <div className="bg-card border border-border/20 rounded-xl p-1.5 shadow-sm">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all whitespace-nowrap flex-shrink-0",
                                    isActive
                                        ? `${tab.color} text-white shadow-sm`
                                        : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("w-3.5 h-3.5", isActive && "stroke-[2.5px]")} />
                                {tab.label}
                                {counts[tab.id as keyof typeof counts] > 0 && (
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded",
                                        isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        {counts[tab.id as keyof typeof counts]}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
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
                            <div className="space-y-3">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="bg-card border border-border/20 rounded-xl p-4 hover:border-cyan-500/30 transition-all cursor-pointer group active:scale-[0.99]">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <MessageCircle className="w-3.5 h-3.5 text-cyan-500" />
                                                    <span>{new Date(answer.created_at).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                                {answer.is_accepted && (
                                                    <div className="flex items-center gap-1 bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                                        ✓ Kabul
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-sm text-foreground mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-muted-foreground text-xs line-clamp-2 pl-3 border-l-2 border-border">
                                                {answer.content.replace(/<[^>]*>?/gm, "")}
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
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/30 rounded-xl bg-muted/30">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4 border border-border/20">
                <Icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-black text-base mb-1">{label}</p>
            <p className="text-muted-foreground text-xs max-w-[200px] leading-relaxed">{description}</p>
        </div>
    );
}
