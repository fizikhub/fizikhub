"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UnifiedFeed } from "@/components/home/unified-feed";
import { BookOpen, MessageCircle, Bookmark, FileText } from "lucide-react";
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



    // ... existing code ...

    return (
        <div className="space-y-6">

            {/* --- TABS --- */}
            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] pb-2 sticky top-[60px] z-30 bg-background/95 backdrop-blur-sm pt-2">
                <TabButton
                    label="GÖNDERİLER"
                    icon={FileText}
                    isActive={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                    id="posts"
                />
                <TabButton
                    label="YANITLAR"
                    icon={MessageCircle}
                    isActive={activeTab === 'replies'}
                    onClick={() => setActiveTab('replies')}
                    id="replies"
                />
                <TabButton
                    label="KAYDEDİLENLER"
                    icon={Bookmark}
                    isActive={activeTab === 'saved'}
                    onClick={() => setActiveTab('saved')}
                    id="saved"
                />
                {isOwnProfile && drafts.length > 0 && (
                    <TabButton
                        label={`TASLAKLAR (${drafts.length})`}
                        icon={BookOpen}
                        isActive={activeTab === 'drafts'}
                        onClick={() => setActiveTab('drafts')}
                        id="drafts"
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
                                <UnifiedFeed items={postsItems} />
                            ) : (
                                <EmptyState label="Henüz gönderi yok" description="Bilimsel yolculuk boş bir sayfayla başlar." />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'saved' && (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {savedItems.length > 0 ? (
                                <UnifiedFeed items={savedItems} />
                            ) : (
                                <EmptyState label="Koleksiyon boş" description="Henüz bir şey kaydetmedin." icon={Bookmark} />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'drafts' && (
                        <motion.div
                            key="drafts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <UnifiedFeed items={draftsItems} />
                        </motion.div>
                    )}

                    {activeTab === 'replies' && (
                        <motion.div
                            key="replies"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <div key={answer.id} className="bg-card border-l-[3px] border-l-[#FFC800] border border-border/50 rounded-r-xl p-5 hover:bg-muted/30 transition-all group">
                                        <div className="flex items-center gap-2 mb-2 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                                            <MessageCircle className="w-3 h-3 text-[#FFC800]" />
                                            <span>YANITLADI</span>
                                        </div>
                                        <h4 className="text-foreground font-bold mb-2 group-hover:text-[#FFC800] transition-colors line-clamp-1 text-base">
                                            {answer.questions?.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-mono line-clamp-3">
                                            {answer.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState label="Sesiz.." description="Henüz bir tartışmaya katılmadın." icon={MessageCircle} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ label, icon: Icon, isActive, onClick, colorClass, id }: { label: string, icon: any, isActive: boolean, onClick: () => void, colorClass?: string, id: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex shrink-0 items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black tracking-wider transition-all uppercase outline-none select-none border-[2px]",
                isActive
                    ? "bg-[#FFC800] text-black border-black shadow-[3px_3px_0px_#000] translate-y-[-2px]"
                    : "bg-background text-muted-foreground border-border/50 hover:bg-muted hover:border-black/50 hover:text-foreground",
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
        <div className="flex flex-col items-center justify-center py-20 text-center border-[2px] border-dashed border-border/50 rounded-2xl bg-muted/10">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4 border border-border/50">
                {Icon ? <Icon className="w-6 h-6 text-muted-foreground" /> : <FileText className="w-6 h-6 text-muted-foreground" />}
            </div>
            <p className="text-foreground font-black text-lg">{label}</p>
            <p className="text-muted-foreground text-xs mt-1 font-mono max-w-[200px] leading-relaxed">{description}</p>
        </div>
    );
}
