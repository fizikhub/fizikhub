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

            {/* --- TABS (Neo-Brutalist Buttons) --- */}
            <div className="sticky top-[60px] z-30 bg-[#f0f0f0]/95 dark:bg-[#09090b]/95 backdrop-blur-sm py-3 -mx-2 px-2 border-b-[3px] border-black dark:border-white">
                <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] pb-1">
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
                            label={`TASLAKLAR`}
                            icon={BookOpen}
                            isActive={activeTab === 'drafts'}
                            onClick={() => setActiveTab('drafts')}
                        />
                    )}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                        >
                            {postsItems.length > 0 ? (
                                <div className="space-y-6">
                                    <UnifiedFeed items={postsItems} />
                                </div>
                            ) : (
                                <EmptyState label="HENÜZ BİR ŞEY YOK" description="Bilimsel yolculuk boş bir sayfayla başlar. İlk adımını at." />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'saved' && (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {savedItems.length > 0 ? (
                                <UnifiedFeed items={savedItems} />
                            ) : (
                                <EmptyState label="KOLEKSİYON BOŞ" description="İlham verici içerikleri buraya kaydedebilirsin." icon={Bookmark} />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'drafts' && (
                        <motion.div key="drafts">
                            <UnifiedFeed items={draftsItems} />
                        </motion.div>
                    )}

                    {activeTab === 'replies' && (
                        <motion.div
                            key="replies"
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <motion.div
                                        key={answer.id}
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1 }
                                        }}
                                        className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl p-5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 mb-3 text-[10px] text-black font-black uppercase tracking-wider bg-[#FACC15] w-fit px-2 py-1 rounded border border-black">
                                            <MessageCircle className="w-3 h-3 text-black" />
                                            <span>YANITLADI</span>
                                        </div>
                                        <h4 className="text-black dark:text-white font-black mb-2 group-hover:underline transition-colors line-clamp-1 text-lg font-[family-name:var(--font-outfit)]">
                                            {answer.questions?.title}
                                        </h4>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 border-l-[3px] border-zinc-300 dark:border-zinc-700 pl-3">
                                            {answer.content}
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <EmptyState label="SESSİZLİK..." description="Henüz hiçbir tartışmaya katılmadın." icon={MessageCircle} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ label, icon: Icon, isActive, onClick }: { label: string, icon: any, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex shrink-0 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black tracking-widest transition-all select-none border-2",
                isActive
                    ? "bg-[#4169E1] text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    : "bg-white dark:bg-zinc-900 text-zinc-500 border-transparent hover:border-black dark:hover:border-zinc-600 hover:text-black dark:hover:text-white"
            )}
        >
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white stroke-[2.5px]" : "opacity-70")} />
            {label}
        </button>
    );
}

function EmptyState({ label, description, icon: Icon }: { label: string, description: string, icon?: any }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center border-[3px] border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <div className="w-20 h-20 bg-white dark:bg-black rounded-xl flex items-center justify-center mb-6 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-3">
                {Icon ? <Icon className="w-8 h-8 text-black dark:text-white" /> : <Inbox className="w-8 h-8 text-black dark:text-white" />}
            </div>
            <p className="text-black dark:text-white font-black text-xl mb-2 font-[family-name:var(--font-outfit)] uppercase tracking-tight">{label}</p>
            <p className="text-zinc-500 text-sm max-w-[250px] leading-relaxed mx-auto font-bold">{description}</p>
        </div>
    );
}
