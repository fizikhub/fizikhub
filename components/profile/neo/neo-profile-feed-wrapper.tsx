"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UnifiedFeed } from "@/components/home/unified-feed";
import { BookOpen, MessageCircle, Bookmark, FileText } from "lucide-react";

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
    // UnifiedFeed expects items with { type, data, sortDate }

    // 1. POSTS TAB
    const postsItems = [
        ...articles.map(a => ({ type: 'article' as const, data: a, sortDate: a.created_at })),
        ...questions.map(q => ({ type: 'question' as const, data: q, sortDate: q.created_at }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    // 2. SAVED TAB
    const savedItems = [
        ...(bookmarkedArticles || []).map((bm: any) => ({ type: 'article' as const, data: bm.articles, sortDate: bm.created_at })),
        ...(bookmarkedQuestions || []).map((bm: any) => ({ type: 'question' as const, data: bm.questions, sortDate: bm.created_at }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    // 3. DRAFTS TAB
    const draftsItems = (drafts || []).map(d => ({
        type: 'article' as const,
        data: { ...d, title: `[TASLAK] ${d.title}` }, // Visual indicator
        sortDate: d.created_at
    })).sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    // 4. REPLIES TAB (UnifiedFeed usually doesn't handle pure answers nicely, so we might need custom render or mock it)
    // For now, let's treat answers as a simple list or try to adapt content. 
    // Actually UnifiedFeed renders `FeedItem` components. We don't have an `AnswerCard` in UnifiedFeed yet.
    // Let's render answers manually if activeTab is replies, otherwise use UnifiedFeed.

    return (
        <div className="space-y-6">

            {/* --- TABS --- */}
            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] pb-1 border-b border-white/10 sticky top-[60px] z-30 bg-background/95 backdrop-blur-sm pt-2">
                <TabButton
                    label="GÖNDERİLER"
                    icon={FileText}
                    isActive={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                />
                <TabButton
                    label="YANITLAR"
                    icon={MessageCircle}
                    isActive={activeTab === 'replies'}
                    onClick={() => setActiveTab('replies')}
                />
                <TabButton
                    label="KAYDEDİLENLER"
                    icon={Bookmark}
                    isActive={activeTab === 'saved'}
                    onClick={() => setActiveTab('saved')}
                />
                {isOwnProfile && drafts.length > 0 && (
                    <TabButton
                        label={`TASLAKLAR (${drafts.length})`}
                        icon={BookOpen}
                        isActive={activeTab === 'drafts'}
                        onClick={() => setActiveTab('drafts')}
                        colorClass="text-red-500 border-red-500/30"
                    />
                )}
            </div>

            {/* --- CONTENT --- */}
            <div className="min-h-[500px]">
                {activeTab === 'posts' && (
                    <UnifiedFeed items={postsItems} />
                )}

                {activeTab === 'saved' && (
                    <UnifiedFeed items={savedItems} />
                )}

                {activeTab === 'drafts' && (
                    <UnifiedFeed items={draftsItems} />
                )}

                {activeTab === 'replies' && (
                    <div className="space-y-4">
                        {answers.length > 0 ? (
                            answers.map((answer) => (
                                <div key={answer.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500 font-bold uppercase tracking-wider">
                                        <MessageCircle className="w-3 h-3 text-[#FFC800]" />
                                        <span>YANITLADI:</span>
                                    </div>
                                    <h4 className="text-white font-bold mb-2 group-hover:text-[#FFC800] transition-colors line-clamp-1">
                                        {answer.questions?.title}
                                    </h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed font-mono">
                                        {answer.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <EmptyState label="Henüz bir yanıt yok." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ label, icon: Icon, isActive, onClick, colorClass }: { label: string, icon: any, isActive: boolean, onClick: () => void, colorClass?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border",
                isActive
                    ? "bg-white text-black border-white shadow-[0px_0px_10px_rgba(255,255,255,0.2)]"
                    : cn("bg-transparent text-neutral-500 border-transparent hover:bg-white/5 hover:text-neutral-300", colorClass)
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-neutral-500 font-mono text-sm">{label}</p>
        </div>
    );
}
