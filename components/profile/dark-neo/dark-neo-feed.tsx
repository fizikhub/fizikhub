"use client";

import { useState, useMemo, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { LayoutList, MessageCircle, Bookmark, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { useUiSounds } from "@/hooks/use-ui-sounds";
import { getDeferredProfileFeed } from "@/app/profil/actions";

interface DarkNeoFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    deferredCounts?: {
        saved: number;
        drafts: number;
    };
    isOwnProfile: boolean;
}

export function DarkNeoFeed({
    articles,
    questions,
    answers,
    drafts,
    bookmarkedArticles,
    bookmarkedQuestions,
    deferredCounts,
    isOwnProfile
}: DarkNeoFeedProps) {
    const [activeTab, setActiveTab] = useState("posts");
    const [deferredFeed, setDeferredFeed] = useState({
        drafts,
        bookmarkedArticles,
        bookmarkedQuestions,
    });
    const [hasLoadedDeferredFeed, setHasLoadedDeferredFeed] = useState(
        drafts.length > 0 || bookmarkedArticles.length > 0 || bookmarkedQuestions.length > 0
    );
    const [isLoadingDeferredFeed, setIsLoadingDeferredFeed] = useState(false);
    const { playInteractSound } = useUiSounds();

    const loadDeferredFeed = async () => {
        if (hasLoadedDeferredFeed || isLoadingDeferredFeed) return;

        setIsLoadingDeferredFeed(true);
        try {
            const result = await getDeferredProfileFeed();
            if (result.success) {
                setDeferredFeed({
                    drafts: result.drafts,
                    bookmarkedArticles: result.bookmarkedArticles,
                    bookmarkedQuestions: result.bookmarkedQuestions,
                });
                setHasLoadedDeferredFeed(true);
            }
        } finally {
            setIsLoadingDeferredFeed(false);
        }
    };

    useEffect(() => {
        if (!isOwnProfile || hasLoadedDeferredFeed) return;

        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(() => loadDeferredFeed(), { timeout: 4000 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeout = setTimeout(() => loadDeferredFeed(), 2500);
        return () => clearTimeout(timeout);
    }, [hasLoadedDeferredFeed, isOwnProfile]);

    const counts = {
        posts: articles.length + questions.length,
        replies: answers.length,
        saved: deferredCounts?.saved ?? deferredFeed.bookmarkedArticles.length + deferredFeed.bookmarkedQuestions.length,
        drafts: deferredCounts?.drafts ?? deferredFeed.drafts.length
    };

    const tabs = [
        { id: "posts", label: "Gönderiler", icon: LayoutList, color: "bg-[#23A9FA] text-black" }, // Vivid Blue
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, color: "bg-[#FFC800] text-black" }, // Vivid Yellow
        ...(isOwnProfile ? [
            { id: "saved", label: "Kayıtlı", icon: Bookmark, color: "bg-[#FF3366] text-white" }, // Vivid Pink
            { id: "drafts", label: "Taslaklar", icon: FileText, color: "bg-[#00F050] text-black" } // Vivid Green
        ] : [])
    ];

    const feedItems = useMemo(() => {
        let items: FeedItem[] = [];
        if (activeTab === 'posts') {
            const articleItems = articles.map(a => {
                // Map category to type for UnifiedFeed
                let type: FeedItem['type'] = 'article';
                if (a.category === 'Blog') type = 'blog';
                else if (a.category === 'Deney') type = 'experiment';
                else if (a.category === 'Kitap İncelemesi') type = 'book-review';
                else if (a.category === 'Terim') type = 'term';

                return {
                    type,
                    data: {
                        ...a,
                        summary: a.summary || a.excerpt,
                        author: a.author || a.profiles
                    },
                    sortDate: a.created_at
                };
            });

            const questionItems = questions.map(q => ({
                type: 'question',
                data: {
                    ...q,
                    author: q.author || q.profiles
                },
                sortDate: q.created_at
            } as FeedItem));
            items = [...articleItems as FeedItem[], ...questionItems];
        } else if (activeTab === 'saved') {
            const savedArticles = deferredFeed.bookmarkedArticles
                .filter(b => b.articles)
                .map(b => {
                    const a = Array.isArray(b.articles) ? b.articles[0] : b.articles;
                    
                    // Map category to type for UnifiedFeed
                    let type: FeedItem['type'] = 'article';
                    if (a?.category === 'Blog') type = 'blog';
                    else if (a?.category === 'Deney') type = 'experiment';
                    else if (a?.category === 'Kitap İncelemesi') type = 'book-review';
                    else if (a?.category === 'Terim') type = 'term';

                    return {
                        type,
                        data: {
                            ...a,
                            summary: a?.summary || a?.excerpt,
                            author: a?.author || a?.profiles
                        },
                        sortDate: b.created_at
                    } as FeedItem;
                });
            const savedQuestions = deferredFeed.bookmarkedQuestions
                .filter(b => b.questions)
                .map(b => {
                    const q = Array.isArray(b.questions) ? b.questions[0] : b.questions;
                    return {
                        type: 'question',
                        data: {
                            ...q,
                            author: q?.author || q?.profiles
                        },
                        sortDate: b.created_at
                    } as FeedItem;
                });
            items = [...savedArticles, ...savedQuestions];
        } else if (activeTab === 'replies') {
            items = answers.map(a => ({ type: 'answer', data: a, sortDate: a.created_at } as FeedItem));
        } else if (activeTab === 'drafts') {
            items = deferredFeed.drafts.map(d => ({
                type: 'article',
                data: {
                    ...d,
                    summary: d.summary || d.excerpt,
                    author: d.author || d.profiles
                },
                sortDate: d.created_at
            } as FeedItem));
        }
        return items.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
    }, [activeTab, articles, questions, answers, deferredFeed]);

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            {/* TABS - Vivid & Chunky & Sticky */}
            <div className="sticky top-[53px] z-40 mb-2 border-b-2 border-dashed border-black/20 bg-background/95 pt-2 pb-2 backdrop-blur-sm sm:top-[72px] sm:mb-3 sm:pb-3 md:top-0">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    const handleTabClick = () => {
                        playInteractSound();
                        if (tab.id === "saved" || tab.id === "drafts") {
                            loadDeferredFeed();
                        }
                        setActiveTab(tab.id);
                    };

                    return (
                        <button
                            key={tab.id}
                            onClick={handleTabClick}
                            className={cn(
                                "group relative flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 px-2.5 py-2 text-[11px] font-black transition-all active:scale-95 sm:min-h-11 sm:flex-shrink-0 sm:justify-start sm:gap-2 sm:px-4 sm:text-xs",
                                isActive
                                    ? `${tab.color} border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]`
                                    : "bg-background border-black dark:border-zinc-800 text-zinc-500 hover:text-foreground hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            )}
                        >
                            <Icon className={cn("h-3.5 w-3.5 shrink-0 stroke-[2.5px]", isActive && "stroke-current")} />
                            <span className="truncate">{tab.label}</span>
                            {counts[tab.id as keyof typeof counts] > 0 && (
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-md font-black border border-black/10",
                                    isActive ? "bg-black/20 text-current" : "bg-black/5 text-zinc-500 group-hover:text-zinc-400 group-hover:bg-black/20"
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
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "posts" && <UnifiedFeed items={feedItems} showExtras={false} />}

                        {activeTab === "replies" && (
                            <div className="space-y-4">
                                {answers.length > 0 ? (
                                    answers.map((answer) => (
                                        <div key={answer.id} className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-black bg-background p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-zinc-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-zinc-800 dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:hover:bg-zinc-900/50 dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] sm:p-5 sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                                            <h4 className="font-black text-base text-foreground mb-2 group-hover:text-[#FFC800] transition-colors leading-snug relative z-10">
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
                            isLoadingDeferredFeed ? (
                                <EmptyState
                                    icon={Bookmark}
                                    label="Yükleniyor"
                                    description="Kayıtlı içerikler hazırlanıyor."
                                />
                            ) : feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} showExtras={false} />
                            ) : (
                                <EmptyState
                                    icon={Bookmark}
                                    label="Kayıtlı İçerik Yok"
                                    description="Beğendiğin içerikleri kaydet, sonra buradan ulaş."
                                />
                            )
                        )}

                        {activeTab === "drafts" && (
                            isLoadingDeferredFeed ? (
                                <EmptyState
                                    icon={FileText}
                                    label="Yükleniyor"
                                    description="Taslakların hazırlanıyor."
                                />
                            ) : feedItems.length > 0 ? (
                                <UnifiedFeed items={feedItems} showExtras={false} />
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
        <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-[3px] border-black bg-[#27272a] px-5 py-16 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:py-24">
            <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] border-4 border-black bg-[#FF3366] shadow-[4px_4px_0px_0px_#000] transition-transform duration-300 group-hover:rotate-[5deg] sm:mb-6 sm:h-16 sm:w-16">
                <Icon className="h-7 w-7 text-white stroke-[3px] sm:h-8 sm:w-8" />
            </div>
            <p className="relative z-10 mb-2 text-lg font-black uppercase tracking-tight text-white drop-shadow-sm sm:text-xl">{label}</p>
            <p className="relative z-10 max-w-[280px] text-sm font-bold leading-relaxed text-zinc-300">{description}</p>
        </div>
    );
}
