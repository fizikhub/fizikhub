"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { NBHeader } from "./nb-header";
import { NBTabs } from "./nb-tabs";
import { NBFeed } from "./nb-feed";

interface NBProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function NBProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: NBProfileLayoutProps) {
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
        tabs.push({ id: "drafts", label: "Taslak" });
    }

    return (
        <div className="w-full max-w-lg mx-auto p-4 md:p-6 min-h-screen pb-24">
            <NBHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />
            <NBTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            <NBFeed items={displayedItems} />
        </div>
    );
}
