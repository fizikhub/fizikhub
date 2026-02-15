"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, MessageCircle, Bookmark, FileText, FolderOpen } from "lucide-react";
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
        { id: "posts", label: "GÖNDERİLER", icon: LayoutList, color: "var(--pop-pink)" },
        { id: "replies", label: "YANITLAR", icon: MessageCircle, color: "var(--pop-lime)" },
        ...(isOwnProfile ? [
            { id: "saved", label: "KAYITLI", icon: Bookmark, color: "var(--pop-cyan)" },
            { id: "drafts", label: "TASLAKLAR", icon: FileText, color: "var(--pop-yellow)" }
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
        <div className="w-full space-y-0">
            {/* FOLDER TABS - Physical Tab Look */}
            <div className="flex flex-wrap items-end px-4 gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative px-4 py-2 text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2",
                                isActive
                                    ? "bg-white text-black border-3 border-black border-b-0 z-10 translate-y-[3px] py-3 rounded-t-lg shadow-none"
                                    : "bg-gray-200 text-gray-500 border-b-3 border-black hover:bg-gray-300 translate-y-0 rounded-t-md hover:-translate-y-1"
                            )}
                            style={{
                                backgroundColor: isActive ? "#FFF" : undefined
                            }}
                        >
                            <Icon className={cn("w-4 h-4", isActive && "text-black")} style={{ color: isActive ? tab.color : undefined }} />
                            {tab.label}
                            {counts[tab.id as keyof typeof counts] > 0 && (
                                <span className={cn(
                                    "ml-1 w-5 h-5 flex items-center justify-center rounded-full text-[9px] border-2 border-black",
                                    isActive ? "opacity-100" : "opacity-50"
                                )}
                                    style={{ backgroundColor: tab.color }}
                                >
                                    {counts[tab.id as keyof typeof counts]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* MAIN CONTENT BOX - The "Folder" Body */}
            <div className="border-3 border-black bg-white dark:bg-black min-h-[400px] shadow-[8px_8px_0_0_#000] p-4 sm:p-6 relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "posts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyPopState label="BOMBOŞ!" description="Burada henüz hiçbir şey yok." color="var(--pop-pink)" />
                            )
                        )}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="neo-box-lime p-4 group cursor-pointer hover:bg-[hsl(var(--pop-lime))] transition-colors border-2 border-black shadow-[4px_4px_0_0_#000]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                                                    {new Date(answer.created_at).toLocaleDateString("tr-TR")}
                                                </span>
                                                {answer.is_accepted && (
                                                    <div className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase transform rotate-2">
                                                        Kabul Edildi
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-black text-lg text-black mb-2 group-hover:underline">
                                                {answer.questions?.title}
                                            </h4>
                                            <div className="text-black text-sm pl-3 border-l-4 border-black line-clamp-3 font-medium">
                                                {answer.content.replace(/<[^>]*>?/gm, "")}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyPopState label="SES YOK" description="Henüz kimseye yanıt vermemişsin." color="var(--pop-lime)" />
                                )}
                            </div>
                        )}

                        {activeTab === "saved" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyPopState label="KASA BOŞ" description="Henüz bir şey kaydetmedin." color="var(--pop-cyan)" />
                            )
                        )}

                        {activeTab === "drafts" && (
                            feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} />
                            ) : (
                                <EmptyPopState label="KAĞITLAR BOŞ" description="Taslaklarında bir şey yok." color="var(--pop-yellow)" />
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyPopState({ label, description, color }: { label: string; description: string; color: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 border-3 border-dashed border-black rounded-lg bg-gray-50/50">
            <div className="w-16 h-16 mb-4 rounded-full border-3 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]" style={{ backgroundColor: color }}>
                <FolderOpen className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-1">{label}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{description}</p>
        </div>
    );
}
