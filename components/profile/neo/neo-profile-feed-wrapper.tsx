"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UnifiedFeed } from "@/components/home/unified-feed";
import { BookOpen, MessageCircle, Bookmark, FileText, Inbox } from "lucide-react";
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
        data: { ...d, title: `[TASLAK] ${d.title}` },
        sortDate: d.created_at
    })).sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    return (
        <div className="space-y-6">

            {/* --- TABS (Matte Pills) --- */}
            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] pb-2 sticky top-[60px] z-30 bg-background/95 backdrop-blur-sm pt-4">
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
                        colorClass="text-red-500"
                    />
                )}
            </div>

            {/* --- CONTENT --- */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {postsItems.length > 0 ? (
                                <div className="space-y-4">
                                    <UnifiedFeed items={postsItems} />
                                </div>
                            ) : (
                                <EmptyState label="Henüz gönderi yok" description="Bilimsel yolculuk boş bir sayfayla başlar." />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'saved' && (
                        <div key="saved">
                            {savedItems.length > 0 ? (
                                <UnifiedFeed items={savedItems} />
                            ) : (
                                <EmptyState label="Koleksiyon boş" description="Henüz bir şey kaydetmedin." icon={Bookmark} />
                            )}
                        </div>
                    )}

                    {activeTab === 'drafts' && (
                        <div key="drafts">
                            <UnifiedFeed items={draftsItems} />
                        </div>
                    )}

                    {activeTab === 'replies' && (
                        <div key="replies" className="space-y-4">
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <div key={answer.id} className="bg-[#050505] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group">
                                        <div className="flex items-center gap-2 mb-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                            <MessageCircle className="w-3 h-3 text-[#FACC15]" />
                                            <span>YANITLADI</span>
                                        </div>
                                        <h4 className="text-white font-bold mb-2 group-hover:text-[#FACC15] transition-colors line-clamp-1 text-base">
                                            {answer.questions?.title}
                                        </h4>
                                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                            {answer.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState label="Sessiz.." description="Henüz bir tartışmaya katılmadın." icon={MessageCircle} />
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ label, icon: Icon, isActive, onClick, colorClass }: { label: string, icon: any, isActive: boolean, onClick: () => void, colorClass?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all select-none border",
                isActive
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "bg-black/40 text-zinc-500 border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20",
                colorClass && !isActive && colorClass
            )}
        >
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-black" : "opacity-70")} />
            {label}
        </button>
    );
}

function EmptyState({ label, description, icon: Icon }: { label: string, description: string, icon?: any }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                {Icon ? <Icon className="w-6 h-6 text-zinc-500" /> : <Inbox className="w-6 h-6 text-zinc-500" />}
            </div>
            <p className="text-white font-bold text-lg mb-1">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed mx-auto">{description}</p>
        </div>
    );
}
