"use client";

import { useState } from "react";
import { BrutalistHeader } from "./brutalist-header";
import { BrutalistTabs } from "./brutalist-tabs";
import { BrutalistFeed } from "./brutalist-feed";

interface BrutalistProfileLayoutProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    drafts: any[];
    isOwnProfile: boolean;
}

export function BrutalistProfileLayout({
    profile,
    user,
    stats,
    articles,
    questions,
    drafts,
    isOwnProfile
}: BrutalistProfileLayoutProps) {
    const [activeTab, setActiveTab] = useState("creatives");

    // Combine all items
    const allItems = [
        ...(articles || []).map(a => ({ ...a, type: 'article' })),
        ...(questions || []).map(q => ({ ...q, type: 'question' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const tabs = [
        { id: "creatives", label: "Creatives" },
        { id: "activity", label: "Activity" },
    ];

    return (
        <div className="w-full max-w-md mx-auto px-4 py-6 min-h-screen pb-28">
            <BrutalistHeader
                profile={profile}
                stats={stats}
                isOwnProfile={isOwnProfile}
            />

            <div className="mt-5">
                <BrutalistTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                />

                <BrutalistFeed items={allItems} />
            </div>
        </div>
    );
}
