"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { DMHeader } from "./dm-header";
import { DMStats } from "./dm-stats";
import { DMFeed } from "./dm-feed";
import { cn } from "@/lib/utils";

interface DMProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function DMProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: DMProfileLayoutProps) {
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
        { id: "all", label: "All Activity" },
        { id: "articles", label: "Articles" },
        { id: "questions", label: "Questions" },
    ];
    if (isOwnProfile && drafts.length > 0) {
        tabs.push({ id: "drafts", label: "Drafts" });
    }

    return (
        <div className="w-full max-w-lg mx-auto p-4 md:p-0 min-h-screen pb-20">
            <DMHeader profile={profile} user={user} isOwnProfile={isOwnProfile} />
            <DMStats stats={stats} />

            {/* Filter Segmented Control */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 mb-6 relative backdrop-blur-md">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 relative z-10",
                            activeTab === tab.id
                                ? "text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <DMFeed items={displayedItems} />

            {/* Bottom Fade */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
    );
}
