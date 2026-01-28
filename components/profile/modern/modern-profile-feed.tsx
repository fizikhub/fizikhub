"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
// We will reuse some existing cards or create simple wrappers. 
// For now, let's assume we can reuse the "Neo" cards but maybe strip some heavy borders if the user wants purely "Modern". 
// However, the user said "Neo-Brutalist touches", so reusing them is fine, possibly wrapped.
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { QuestionCard } from "@/components/forum/question-card";

// Assuming we have an AnswerCard or similar. If not, we'll make a simple one here or import.
// Checking previous file content, NeoProfileFeed used `AnswerCard`? No, let's check `NeoProfileFeed` source if needed.
// Actually, let's just create a simple list render for now.

interface ModernProfileFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
    isOwnProfile: boolean;
}

type TabType = 'posts' | 'replies' | 'likes' | 'media';

export function ModernProfileFeed({
    articles = [],
    questions = [],
    answers = [],
    bookmarkedArticles = [],
    bookmarkedQuestions = [],
    isOwnProfile
}: ModernProfileFeedProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    // Combine Articles and Questions for "Posts" tab
    // Sort by created_at descending
    const posts = [...articles.map(a => ({ ...a, type: 'article' })), ...questions.map(q => ({ ...q, type: 'question' }))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="w-full min-h-[500px]">
            {/* STICKY TABS */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex w-full overflow-x-auto no-scrollbar">
                    <TabButton
                        label="Gönderiler"
                        isActive={activeTab === 'posts'}
                        onClick={() => setActiveTab('posts')}
                    />
                    <TabButton
                        label="Yanıtlar"
                        isActive={activeTab === 'replies'}
                        onClick={() => setActiveTab('replies')}
                    />
                    <TabButton
                        label="Beğeniler"
                        isActive={activeTab === 'likes'}
                        onClick={() => setActiveTab('likes')}
                    />
                    <TabButton
                        label="Medya"
                        isActive={activeTab === 'media'}
                        onClick={() => setActiveTab('media')}
                    />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="">
                {activeTab === 'posts' && (
                    <div className="flex flex-col text-sm"> {/* text-sm might be too small? see */}
                        {posts.length > 0 ? (
                            posts.map((item) => (
                                <div key={item.id} className="border-b border-border p-4 hover:bg-muted/30 transition-colors">
                                    {item.type === 'article' ? (
                                        // TODO: Pass a "variant" prop to card if we want it to look less heavy? 
                                        // For now, standard card is fine, but maybe wrapped cleanly.
                                        // Actually, embedding full cards in a "Twitter Feed" style usually means 
                                        // the card ITSELF is the feed item. 
                                        <div className="scale-95 origin-left w-full">
                                            <NeoArticleCard article={item} />
                                        </div>
                                    ) : (
                                        <div className="scale-95 origin-left w-full">
                                            <QuestionCard question={item} />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <EmptyState label="Henüz bir gönderi yok." />
                        )}
                    </div>
                )}

                {activeTab === 'replies' && (
                    <div className="flex flex-col">
                        {answers.length > 0 ? (
                            answers.map((answer) => (
                                <div key={answer.id} className="p-4 border-b border-border hover:bg-muted/30 transition-colors">
                                    <div className="text-muted-foreground text-xs mb-1">
                                        <span className="font-bold text-primary">@{isOwnProfile ? "sen" : "kullanıcı"}</span> şu soruya yanıt verdi:
                                    </div>
                                    <div className="text-foreground font-medium mb-2 line-clamp-1">
                                        {answer.questions?.title}
                                    </div>
                                    <p className="text-sm text-foreground/80 line-clamp-3">
                                        {answer.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <EmptyState label="Henüz bir yanıt yok." />
                        )}
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div className="flex flex-col">
                        <EmptyState label="Beğenilenler yakında eklenecek." />
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="flex flex-col">
                        <EmptyState label="Medya yakında eklenecek." />
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 min-w-[80px] px-2 py-4 text-sm font-bold text-center relative hover:bg-muted/50 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
            )}
        >
            {label}
            {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-t-full" />
            )}
        </button>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <p className="text-muted-foreground font-medium">{label}</p>
        </div>
    );
}
