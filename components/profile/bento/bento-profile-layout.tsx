"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { BentoHero } from "./bento-hero";
import { BentoStats } from "./bento-stats";
import { BentoFeed } from "./bento-feed";
import { cn } from "@/lib/utils";

interface BentoProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function BentoProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: BentoProfileLayoutProps) {
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
        { id: "all", label: "Overview" },
        { id: "articles", label: "Posts" },
        { id: "questions", label: "Questions" },
    ];
    if (isOwnProfile && drafts.length > 0) {
        tabs.push({ id: "drafts", label: "Drafts" });
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 min-h-screen">

            {/* Top Grid: Hero + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <BentoHero profile={profile} user={user} isOwnProfile={isOwnProfile} />
                <BentoStats stats={stats} />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm border-2",
                            activeTab === tab.id
                                ? "bg-black text-white border-black shadow-md transform -translate-y-0.5"
                                : "bg-white text-gray-500 border-transparent hover:bg-gray-50 hover:text-black hover:border-gray-200"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <BentoFeed items={displayedItems} />

        </div>
    );
}
