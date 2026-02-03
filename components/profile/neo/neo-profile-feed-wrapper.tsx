"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UnifiedFeed } from "@/components/home/unified-feed";
import { BookOpen, MessageCircle, Bookmark, FileText, Inbox, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NeoProfileFeedWrapperProps {
    articles: any[];
    questions: any[];
    answers: any[];
    drafts?: any[];
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
    isOwnProfile: boolean;
}

type TabType = 'posts' | 'replies' | 'saved' | 'drafts';

export function NeoProfileFeedWrapper({
    articles = [],
    questions = [],
    answers = [],
    drafts = [],
    bookmarkedArticles = [],
    bookmarkedQuestions = [],
    isOwnProfile
}: NeoProfileFeedWrapperProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    // --- PREPARE DATA FOR UNIFIED FEED ---
    const postsItems = [
        ...articles.map(a => ({ type: 'article' as const, data: a, sortDate: a.created_at })),
        ...questions.map(q => ({ type: 'question' as const, data: q, sortDate: q.created_at }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    const savedItems = [
        ...(bookmarkedArticles || []).map((bm: any) => ({ type: 'article' as const, data: bm.articles, sortDate: bm.created_at })),
        ...(bookmarkedQuestions || []).map((bm: any) => ({ type: 'question' as const, data: bm.questions, sortDate: bm.created_at }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    const draftsItems = (drafts || []).map(d => ({
        type: 'article' as const,
        data: { ...d, title: `[DRAFT] ${d.title}` },
        sortDate: d.created_at
    })).sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    return (
        <div className="space-y-0 font-mono">

            {/* --- BRUTALIST TABS --- */}
            <div className="flex items-center border-[2px] border-white bg-black sticky top-[60px] z-30">
                <TabButton
                    label="POSTS"
                    count={postsItems.length}
                    icon={FileText}
                    isActive={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                />
                <TabButton
                    label="REPLIES"
                    count={answers.length}
                    icon={MessageCircle}
                    isActive={activeTab === 'replies'}
                    onClick={() => setActiveTab('replies')}
                />
                <TabButton
                    label="SAVED"
                    count={savedItems.length}
                    icon={Bookmark}
                    isActive={activeTab === 'saved'}
                    onClick={() => setActiveTab('saved')}
                />
                {isOwnProfile && drafts.length > 0 && (
                    <TabButton
                        label="DRAFTS"
                        count={drafts.length}
                        icon={BookOpen}
                        isActive={activeTab === 'drafts'}
                        onClick={() => setActiveTab('drafts')}
                        colorClass="text-red-500"
                    />
                )}
            </div>

            {/* --- CONTENT AREA (Grid Container) --- */}
            <div className="min-h-[500px] border-l-2 border-r-2 border-b-2 border-white bg-black p-0">
                <AnimatePresence mode="wait">
                    {activeTab === 'posts' && (
                        <div key="posts">
                            {postsItems.length > 0 ? (
                                <UnifiedFeed items={postsItems} />
                            ) : (
                                <EmptyState label="NO_DATA" description="No entries found in database." />
                            )}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div key="saved">
                            {savedItems.length > 0 ? (
                                <UnifiedFeed items={savedItems} />
                            ) : (
                                <EmptyState label="EMPTY_SET" description="Collection is null." icon={Bookmark} />
                            )}
                        </div>
                    )}

                    {activeTab === 'drafts' && (
                        <div key="drafts">
                            <UnifiedFeed items={draftsItems} />
                        </div>
                    )}

                    {activeTab === 'replies' && (
                        <div key="replies" className="flex flex-col">
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <div key={answer.id} className="border-b border-white/20 p-5 hover:bg-white hover:text-black transition-colors group">
                                        <div className="flex items-center gap-2 mb-2 text-[9px] text-zinc-500 group-hover:text-black/60 font-bold uppercase tracking-wider">
                                            <Terminal className="w-3 h-3 text-[#FACC15]" />
                                            <span>RE:: {answer.questions?.id?.slice(0, 6)}</span>
                                        </div>
                                        <h4 className="font-bold text-sm mb-2 group-hover:underline">
                                            {answer.questions?.title}
                                        </h4>
                                        <p className="text-zinc-400 text-xs leading-relaxed font-mono line-clamp-3 group-hover:text-black">
                                            {">"} {answer.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState label="SILENT" description="No interaction logs." icon={MessageCircle} />
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ label, count, icon: Icon, isActive, onClick, colorClass }: { label: string, count?: number, icon: any, isActive: boolean, onClick: () => void, colorClass?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest transition-all uppercase outline-none select-none border-r border-white/20 last:border-r-0 hover:bg-white/10",
                isActive
                    ? "bg-white text-black"
                    : "bg-black text-zinc-500",
                colorClass && !isActive && colorClass
            )}
        >
            <Icon className={cn("w-3 h-3", isActive ? "text-black" : "opacity-50")} />
            <span className="hidden sm:inline">{label}</span>
            {count !== undefined && <span className={cn("text-[9px] px-1.5 border", isActive ? "border-black text-black" : "border-zinc-700 text-zinc-600")}>{count}</span>}
        </button>
    );
}

function EmptyState({ label, description, icon: Icon }: { label: string, description: string, icon?: any }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-zinc-800 flex items-center justify-center mb-4">
                {Icon ? <Icon className="w-6 h-6 text-zinc-600" /> : <Inbox className="w-6 h-6 text-zinc-600" />}
            </div>
            <p className="text-white font-mono font-bold text-lg mb-1">{label}</p>
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">{description}</p>
        </div>
    );
}
