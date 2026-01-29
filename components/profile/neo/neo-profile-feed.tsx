"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { QuestionCard } from "@/components/forum/question-card";

interface NeoProfileFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    drafts?: any[];
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
    isOwnProfile: boolean;
}

type TabType = 'posts' | 'replies' | 'likes' | 'drafts' | 'media';

export function NeoProfileFeed({
    articles = [],
    questions = [],
    answers = [],
    drafts = [],
    bookmarkedArticles = [],
    bookmarkedQuestions = [],
    isOwnProfile
}: NeoProfileFeedProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    // Combine Articles and Questions for "Posts" tab
    const posts = [...articles.map(a => ({ ...a, type: 'article' })), ...questions.map(q => ({ ...q, type: 'question' }))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="w-full min-h-[600px] bg-neutral-950">
            {/* === NEO TABS === */}
            <div className="sticky top-0 z-40 bg-neutral-950 border-b-[4px] border-black shadow-[0px_4px_0px_rgba(255,255,255,0.05)]">
                <div className="flex w-full overflow-x-auto no-scrollbar p-2 gap-2">
                    <NeoTabButton
                        label="GÖNDERİLER"
                        isActive={activeTab === 'posts'}
                        onClick={() => setActiveTab('posts')}
                    />
                    <NeoTabButton
                        label="YANITLAR"
                        isActive={activeTab === 'replies'}
                        onClick={() => setActiveTab('replies')}
                    />
                    <NeoTabButton
                        label="KAYDEDİLENLER"
                        isActive={activeTab === 'likes'}
                        onClick={() => setActiveTab('likes')}
                    />
                    {isOwnProfile && drafts.length > 0 && (
                        <NeoTabButton
                            label={`TASLAKLAR (${drafts.length})`}
                            isActive={activeTab === 'drafts'}
                            onClick={() => setActiveTab('drafts')}
                        />
                    )}
                </div>
            </div>

            {/* === CONTENT AREA === */}
            <div className="p-4 sm:p-6">
                {activeTab === 'posts' && (
                    <div className="flex flex-col gap-6">
                        {posts.length > 0 ? (
                            posts.map((item) => (
                                <div key={item.id} className="relative group">
                                    {/* Sidebar Decor */}
                                    <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-neutral-800 group-hover:bg-[#FFC800] transition-colors" />

                                    {item.type === 'article' ? (
                                        <div className="pl-4">
                                            <NeoArticleCard article={item} />
                                        </div>
                                    ) : (
                                        <div className="pl-4">
                                            <QuestionCard question={item} />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <NeoEmptyState label="SİSTEMDE VERİ BULUNAMADI" subLabel="Henüz herhangi bir gönderi paylaşılmamış." />
                        )}
                    </div>
                )}

                {activeTab === 'replies' && (
                    <div className="flex flex-col gap-4">
                        {answers.length > 0 ? (
                            answers.map((answer) => (
                                <div key={answer.id} className="bg-neutral-900 border-[2px] border-neutral-800 p-4 relative group hover:border-[#FFC800] transition-colors">
                                    <div className="text-[#FFC800] text-xs font-bold mb-2 uppercase tracking-wide">
                                        RE: {answer.questions?.title}
                                    </div>
                                    <p className="text-neutral-300 font-mono text-sm leading-relaxed">
                                        {answer.content}
                                    </p>
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-neutral-800 group-hover:bg-[#FFC800]" />
                                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-neutral-800 group-hover:bg-[#FFC800]" />
                                </div>
                            ))
                        ) : (
                            <NeoEmptyState label="ETKİLEŞİM YOK" subLabel="Henüz bir yanıt kaydı bulunmuyor." />
                        )}
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div className="flex flex-col gap-6">
                        {/* Render Bookmarks - Merged */}
                        {bookmarkedArticles.length > 0 || bookmarkedQuestions.length > 0 ? (
                            <>
                                {bookmarkedArticles.map((bm: any) => (
                                    <div key={bm.articles.id} className="pl-4 relative">
                                        <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-cyan-700" />
                                        <NeoArticleCard article={bm.articles} />
                                    </div>
                                ))}
                                {bookmarkedQuestions.map((bm: any) => (
                                    <div key={bm.questions.id} className="pl-4 relative">
                                        <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-purple-700" />
                                        <QuestionCard question={bm.questions} />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <NeoEmptyState label="VERİTABANI BOŞ" subLabel="Kaydedilen içerik bulunmuyor." />
                        )}
                    </div>
                )}

                {activeTab === 'drafts' && (
                    <div className="flex flex-col gap-6">
                        {drafts.length > 0 ? (
                            drafts.map((draft) => (
                                <div key={draft.id} className="relative group opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-red-500/50 group-hover:bg-red-500" />
                                    <div className="pl-4">
                                        {/* Mocking article structure for card if needed or using same card */}
                                        <NeoArticleCard article={{ ...draft, type: 'article', title: `[TASLAK] ${draft.title}` }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NeoEmptyState label="TASLAK YOK" subLabel="Kaydedilmiş bir taslak bulunmuyor." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function NeoTabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-[2px]",
                isActive
                    ? "bg-[#FFC800] text-black border-black shadow-[4px_4px_0px_#000] translate-y-[-2px]"
                    : "bg-neutral-900 text-neutral-500 border-neutral-700 hover:border-neutral-500 hover:text-white"
            )}
        >
            {label}
        </button>
    );
}

function NeoEmptyState({ label, subLabel }: { label: string, subLabel: string }) {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center px-4 border-[2px] border-dashed border-neutral-800 bg-neutral-900/30">
            <h3 className="text-neutral-400 font-bold mb-1 text-lg">{label}</h3>
            <p className="text-neutral-600 font-mono text-sm">{subLabel}</p>
        </div>
    );
}
