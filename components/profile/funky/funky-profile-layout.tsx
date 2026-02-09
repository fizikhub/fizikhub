"use client";

import { FunkyHeader } from "./funky-header";
import { FunkyStats } from "./funky-stats";
import { FunkyActions } from "./funky-actions";
import { FunkyFeed } from "./funky-feed";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FunkyProfileLayoutProps {
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

export function FunkyProfileLayout({
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
}: FunkyProfileLayoutProps) {
    const [activeTab, setActiveTab] = useState("creatives"); // 'creatives' | 'activity'

    // Combine all "creative" items for the feed (articles + questions)
    const combinedFeed = [
        ...(articles || []).map(a => ({ ...a, type: 'article' })),
        ...(questions || []).map(q => ({ ...q, type: 'question' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans selection:bg-funky-lime selection:text-black">
            {/* Header Section */}
            <FunkyHeader profile={profile} user={user} stats={stats} isOwnProfile={isOwnProfile} />

            {/* Bio - Centered Text */}
            <div className="text-center px-6 mb-8 max-w-sm mx-auto">
                <h1 className="text-2xl font-black mb-1">{profile?.full_name || "Anonymous Creator"}</h1>
                <p className="text-sm font-bold text-gray-400 mb-3">@{profile?.username || "username"}</p>
                <p className="text-sm font-medium text-gray-600 leading-snug">
                    {profile?.bio || "Just an awesome physics enthusiast floating in space."}
                </p>
            </div>

            {/* Stats Grid */}
            <FunkyStats stats={stats} />

            {/* Action Buttons */}
            {isOwnProfile && <FunkyActions />}

            {/* Content Switcher (Pill Style) */}
            <div className="max-w-md mx-auto px-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('creatives')}
                        className={cn(
                            "px-4 py-1 rounded-lg text-sm font-black border-2 border-transparent transition-all",
                            activeTab === 'creatives'
                                ? "bg-orange-400 text-white border-black shadow-[2px_2px_0_black]"
                                : "text-gray-400 hover:text-black"
                        )}
                    >
                        Creatives
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={cn(
                            "px-4 py-1 rounded-lg text-sm font-black border-2 border-transparent transition-all",
                            activeTab === 'activity'
                                ? "bg-orange-400 text-white border-black shadow-[2px_2px_0_black]"
                                : "text-gray-400 hover:text-black"
                        )}
                    >
                        Activity
                    </button>
                </div>
            </div>

            {/* Feed */}
            <FunkyFeed items={combinedFeed} />

        </div>
    );
}
