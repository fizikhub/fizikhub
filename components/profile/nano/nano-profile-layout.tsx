"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { NanoHeader } from "./nano-header";
import { NanoTabs } from "./nano-tabs";
import { NanoGrid } from "./nano-grid";
import { cn } from "@/lib/utils";

interface NanoProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function NanoProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: NanoProfileLayoutProps) {
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
        { id: "all", label: "Tümü", count: allItems.length },
        { id: "articles", label: "Yazı", count: articles.length },
        { id: "questions", label: "Soru", count: questions.length },
    ];
    if (isOwnProfile && drafts.length > 0) {
        tabs.push({ id: "drafts", label: "Taslak", count: drafts.length });
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-xs">
            <div className="max-w-md mx-auto bg-white min-h-screen border-x-2 border-black shadow-2xl">
                <NanoHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

                <div className="sticky top-0 z-20">
                    <NanoTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Scrollable Area */}
                <div className="bg-gray-50 min-h-[50vh]">
                    {displayedItems.length > 0 ? (
                        <NanoGrid items={displayedItems} />
                    ) : (
                        <div className="p-8 text-center text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                             // NO_DATA_FOUND
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-2 text-center border-t border-black bg-gray-100">
                    <p className="text-[9px] font-mono text-gray-400">FIZIKHUB v5.0 // NANO_CORE</p>
                </div>
            </div>
        </div>
    );
}
