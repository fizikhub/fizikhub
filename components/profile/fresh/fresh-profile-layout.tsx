"use client";

import { useState } from "react";
import { FreshHeader } from "./fresh-header";
import { StatsRow } from "./stats-row";
import { FreshFeedItem } from "./fresh-feed-item";
import { Hash, SlidersHorizontal } from "lucide-react";

interface FreshProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    isOwnProfile: boolean;
}

export function FreshProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    answers,
    drafts,
    bookmarkedArticles,
    bookmarkedQuestions,
    isOwnProfile
}: FreshProfileLayoutProps) {
    const [activeTab, setActiveTab] = useState("articles");

    const tabs = [
        { id: "articles", label: "Yazılar", count: articles?.length || 0 },
        { id: "questions", label: "Sorular", count: questions?.length || 0 },
        { id: "bookmarks", label: "Kayıtlı", count: (bookmarkedArticles?.length || 0) + (bookmarkedQuestions?.length || 0) },
    ];

    if (isOwnProfile && drafts?.length > 0) {
        tabs.push({ id: "drafts", label: "Taslak", count: drafts.length });
    }

    return (
        <div className="max-w-xl mx-auto min-h-screen pb-24 px-4 pt-4">
            {/* Header */}
            <FreshHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

            {/* Minimal Stats */}
            <StatsRow stats={stats} />

            {/* Filter / Tabs */}
            <div className="flex items-center justify-between mb-6 sticky top-4 z-20 bg-neo-off-white/80 backdrop-blur-md py-2 px-1 rounded-xl">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300
                                ${activeTab === tab.id ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'}
                            `}
                        >
                            {tab.label}
                            {tab.count > 0 && activeTab !== tab.id && (
                                <span className="ml-1.5 w-1.5 h-1.5 bg-neo-vibrant-cyan rounded-full inline-block align-middle" />
                            )}
                        </button>
                    ))}
                </div>
                <button className="p-2 text-gray-400 hover:text-black transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Masonry-ish Feed */}
            <div className="space-y-3">
                {activeTab === "articles" && articles?.map((item) => (
                    <FreshFeedItem key={item.id} item={item} type="article" />
                ))}
                {activeTab === "questions" && questions?.map((item) => (
                    <FreshFeedItem key={item.id} item={item} type="question" />
                ))}
                {activeTab === "drafts" && drafts?.map((item) => (
                    <FreshFeedItem key={item.id} item={item} type="draft" />
                ))}

                {/* Empty States */}
                {activeTab === "articles" && articles?.length === 0 && <EmptyState type="Yazı" />}
                {activeTab === "questions" && questions?.length === 0 && <EmptyState type="Soru" />}
                {activeTab === "drafts" && drafts?.length === 0 && <EmptyState type="Taslak" />}
                {activeTab === "bookmarks" && bookmarkedArticles?.length === 0 && bookmarkedQuestions?.length === 0 && <EmptyState type="Kayıtlı" />}
            </div>
        </div>
    );
}

function EmptyState({ type }: { type: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 rounded-2xl mx-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
                <Hash className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-400">Henüz {type} Yok</p>
        </div>
    );
}
