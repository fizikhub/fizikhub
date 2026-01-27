"use client";

import { SocialProfileHeader } from "./social/social-profile-header";
import { SocialTabs } from "./social/social-tabs";
import { SocialProfileFeed } from "./social/social-profile-feed";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SocialProfileViewProps {
    profile: any;
    isOwnProfile: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges: any[];
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    unreadCount: number;
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
}

export function SocialProfileView({
    profile,
    isOwnProfile,
    stats,
    userBadges,
    articles,
    questions,
    answers,
    drafts,
    unreadCount,
    bookmarkedArticles,
    bookmarkedQuestions
}: SocialProfileViewProps) {
    const [activeTab, setActiveTab] = useState("articles");

    // Prepare Feed Data based on Tab
    let feedItems: any[] = [];
    let feedType: "article" | "question" | "answer" | "draft" | "bookmark" = "article";

    switch (activeTab) {
        case "articles":
            feedItems = articles || [];
            feedType = "article";
            break;
        case "tweets": // Renamed to 'tweets' internally for questions/discussions
            feedItems = questions || [];
            feedType = "question";
            break;
        case "replies":
            feedItems = answers || [];
            feedType = "answer";
            break;
        case "saved":
            feedItems = [
                ...(bookmarkedArticles || []).map((b: any) => ({ ...b, type: 'article' })),
                ...(bookmarkedQuestions || []).map((b: any) => ({ ...b, type: 'question' }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            feedType = "bookmark";
            break;
        case "drafts":
            feedItems = drafts || [];
            feedType = "draft";
            break;
    }

    const tabs = [
        { value: "articles", label: "Makaleler" },
        { value: "tweets", label: "Sorular" },
        { value: "replies", label: "Yanıtlar" },
        ...(isOwnProfile ? [
            { value: "saved", label: "Kaydedilenler" },
            { value: "drafts", label: "Taslaklar" }
        ] : [])
    ];

    return (
        <div className="min-h-screen bg-background border-x border-neutral-200 dark:border-neutral-800 max-w-2xl mx-auto shadow-sm">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center gap-6">
                <Link href="/" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-black text-foreground">{profile?.full_name || "Profil"}</h2>
                    <p className="text-xs text-muted-foreground">{stats.articlesCount + stats.questionsCount} Gönderi</p>
                </div>
            </div>

            <SocialProfileHeader
                profile={profile}
                user={{ email: profile?.email }}
                isOwnProfile={isOwnProfile}
                stats={stats}
                unreadCount={unreadCount}
            />

            <SocialTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="mt-2"
            />

            <SocialProfileFeed
                items={feedItems}
                type={feedType}
            />
        </div>
    );
}
