"use client";

import { useState } from "react";
import { CompactHeader } from "./compact-header";
import { StatBar } from "./stat-bar";
import { CompactTabs } from "./compact-tabs";
import { CompactFeedItem } from "./compact-feed-item";
import { ActionDock } from "../vibrant/action-dock"; // Reusing the dock as it is absolute/fixed
import { Hash } from "lucide-react";

interface CompactProfileFeedWrapperProps {
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

export function CompactProfileFeedWrapper({
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
}: CompactProfileFeedWrapperProps) {
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
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl border-x-2 border-black relative pb-20">
            {/* Header Section */}
            <CompactHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

            {/* Stats Bar */}
            <StatBar stats={stats} />

            {/* Sticky Tabs */}
            <div className="sticky top-0 z-30 shadow-sm">
                <CompactTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Dense Feed */}
            <div className="divide-y divide-gray-100">
                {activeTab === "articles" && articles?.map((item) => (
                    <CompactFeedItem key={item.id} item={item} type="article" />
                ))}
                {activeTab === "questions" && questions?.map((item) => (
                    <CompactFeedItem key={item.id} item={item} type="question" />
                ))}
                {activeTab === "drafts" && drafts?.map((item) => (
                    <CompactFeedItem key={item.id} item={item} type="draft" />
                ))}

                {/* Empty States */}
                {activeTab === "articles" && articles?.length === 0 && <EmptyState type="Yazı" />}
                {activeTab === "questions" && questions?.length === 0 && <EmptyState type="Soru" />}
                {activeTab === "drafts" && drafts?.length === 0 && <EmptyState type="Taslak" />}
                {activeTab === "bookmarks" && bookmarkedArticles?.length === 0 && bookmarkedQuestions?.length === 0 && <EmptyState type="Kayıtlı" />}
            </div>

            {/* Action Dock (Bottom Center) */}
            <ActionDock isOwnProfile={isOwnProfile} className="bottom-4 !scale-90 origin-bottom" />
        </div>
    );
}

function EmptyState({ type }: { type: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 text-gray-300">
                <Hash className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Henüz {type} Yok</p>
        </div>
    );
}
