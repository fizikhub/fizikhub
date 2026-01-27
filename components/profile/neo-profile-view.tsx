"use client";

import { NeoProfileHeader } from "./neo/neo-profile-header";
import { NeoProfileFeed } from "./neo/neo-profile-feed";

interface NeoProfileViewProps {
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
    answers?: any[];
    drafts: any[];
    unreadCount: number;
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
}

export function NeoProfileView({
    profile,
    isOwnProfile,
    stats,
    userBadges,
    articles,
    questions,
    answers = [],
    drafts,
    unreadCount,
    bookmarkedArticles = [],
    bookmarkedQuestions = []
}: NeoProfileViewProps) {
    return (
        <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0A] pb-20">
            {/* Background Texture/Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
                {/* Header Section (Includes Stats) */}
                <NeoProfileHeader
                    profile={profile}
                    user={{ email: profile?.email }} // Assuming email might be needed or handled inside
                    isOwnProfile={isOwnProfile}
                    stats={stats}
                    userBadges={userBadges}
                    unreadCount={unreadCount}
                />

                {/* Feed Section (Tabs + Content) */}
                <NeoProfileFeed
                    articles={articles}
                    questions={questions}
                    answers={answers}
                    drafts={drafts}
                    isOwnProfile={isOwnProfile}
                    bookmarkedArticles={bookmarkedArticles}
                    bookmarkedQuestions={bookmarkedQuestions}
                />
            </div>
        </div>
    );
}
