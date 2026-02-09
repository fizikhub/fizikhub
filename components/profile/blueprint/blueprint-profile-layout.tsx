"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { BlueprintHeader } from "./blueprint-header";
import { BlueprintFeed } from "./blueprint-feed";
import { cn } from "@/lib/utils";

interface BlueprintProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function BlueprintProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: BlueprintProfileLayoutProps) {
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
        { id: "all", label: "ALL_DATA" },
        { id: "articles", label: "LOGS" },
        { id: "questions", label: "QUERIES" },
    ];
    if (isOwnProfile && drafts.length > 0) {
        tabs.push({ id: "drafts", label: "TEMP" });
    }

    return (
        <div className="w-full max-w-lg bg-white min-h-screen border-x-2 border-black shadow-[8px_8px_0_rgba(0,0,0,0.2)]">
            <BlueprintHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

            {/* Technical Tabs */}
            <div className="flex border-b-2 border-black bg-gray-100 sticky top-0 z-20">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-2 font-mono text-[10px] font-bold uppercase tracking-widest border-r border-black last:border-r-0 transition-colors relative",
                            activeTab === tab.id
                                ? "bg-neo-vibrant-lime text-black"
                                : "hover:bg-white text-gray-500"
                        )}
                    >
                        {tab.label}
                        {/* Active Indicator Line */}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                        )}
                    </button>
                ))}
            </div>

            <BlueprintFeed items={displayedItems} />

            <div className="p-4 bg-gray-50 border-t-2 border-black font-mono text-[10px] text-center text-gray-400">
                // END OF TRANSMISSION
            </div>
        </div>
    );
}
