"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { NIHeader } from "./ni-header";
import { NITabs } from "./ni-tabs";
import { NIFeed } from "./ni-feed";

interface NIProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function NIProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: NIProfileLayoutProps) {
    const [activeTab, setActiveTab] = useState("creatives");

    // Unified feed
    const allItems = [
        ...(articles || []).map(a => ({ ...a, type: 'article' })),
        ...(questions || []).map(q => ({ ...q, type: 'question' })),
        ...(drafts || []).map(d => ({ ...d, type: 'draft' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Filter logic
    const displayedItems = activeTab === 'creatives'
        ? allItems
        : allItems.filter(item => item.type === (activeTab === 'articles' ? 'article' : 'question'));

    const tabs = [
        { id: "creatives", label: "Creatives" },
        { id: "activity", label: "Activity" },
    ];

    return (
        <div className="w-full max-w-md mx-auto p-3 min-h-screen pb-24">
            <NIHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />
            <NITabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            <NIFeed items={displayedItems} />
        </div>
    );
}
