"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { VCHeader } from "./vc-header";
import { VCStats } from "./vc-stats";
import { VCFeed } from "./vc-feed";
import { cn } from "@/lib/utils";

interface VCProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function VCProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: VCProfileLayoutProps) {
    const [activeTab, setActiveTab] = useState("all");

    // Unified feed
    const allItems = [
        ...(articles || []).map(a => ({ ...a, type: 'article' })),
        ...(questions || []).map(q => ({ ...q, type: 'question' })),
        ...(drafts || []).map(d => ({ ...d, type: 'draft' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Filter logic
    const displayedItems = activeTab === 'all'
        ? allItems
        : allItems.filter(item => item.type === activeTab.replace('s', '')); // 'articles' -> 'article'

    const tabs = [
        { id: "all", label: "Tümü" },
        { id: "articles", label: "Yazılar" },
        { id: "questions", label: "Sorular" },
    ];
    if (isOwnProfile && drafts.length > 0) {
        tabs.push({ id: "drafts", label: "Taslaklar" });
    }

    return (
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative z-10">
            {/* Header */}
            <VCHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

            {/* Stats */}
            <VCStats stats={stats} />

            {/* Sticky Tabs */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-4">
                <div className="flex px-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4",
                                activeTab === tab.id
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Feed */}
            <VCFeed items={displayedItems} />
        </div>
    );
}
