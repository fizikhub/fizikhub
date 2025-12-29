"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GeoCitiesProfileView } from "@/components/profile/geocities-profile-view";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileAboutSidebar } from "@/components/profile/profile-about-sidebar";
import { ProfileContentFeed } from "@/components/profile/profile-content-feed";
import { SpaceBackgroundWrapper } from "@/components/home/space-background-wrapper";
import { HubAlien } from "@/components/game/hub-alien";

interface ProfileViewWrapperProps {
    profile: any;
    user: any;
    articles: any[];
    questions: any[];
    answers: any[];
    userBadges: any[];
    followStats: {
        followersCount: number;
        followingCount: number;
    };
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    drafts: any[];
}

export function ProfileViewWrapper({
    profile,
    user,
    articles,
    questions,
    answers,
    userBadges,
    followStats,
    bookmarkedArticles,
    bookmarkedQuestions,
    drafts
}: ProfileViewWrapperProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden pb-20">
                <SpaceBackgroundWrapper />
                <div className="relative z-10">
                    <ProfileHero
                        profile={profile}
                        user={user}
                        isOwnProfile={true}
                    />
                </div>
                <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
                            <ProfileAboutSidebar
                                profile={profile}
                                stats={{
                                    articlesCount: articles?.length || 0,
                                    questionsCount: questions?.length || 0,
                                    answersCount: answers?.length || 0,
                                    followersCount: followStats.followersCount,
                                    followingCount: followStats.followingCount
                                }}
                                badges={userBadges || []}
                                createdAt={user.created_at}
                            />
                            <div className="w-full">
                                <HubAlien />
                            </div>
                        </div>
                        <ProfileContentFeed
                            articles={articles || []}
                            questions={questions || []}
                            answers={answers || []}
                            bookmarkedArticles={bookmarkedArticles || []}
                            bookmarkedQuestions={bookmarkedQuestions || []}
                            drafts={drafts || []}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // GeoCities Theme - Show Retro View
    if (theme === "geocities") {
        return (
            <GeoCitiesProfileView
                profile={profile}
                articles={articles}
                questions={questions}
                userBadges={userBadges}
                stats={{
                    followersCount: followStats.followersCount,
                    followingCount: followStats.followingCount,
                    articlesCount: articles?.length || 0,
                    questionsCount: questions?.length || 0
                }}
            />
        );
    }

    // Default Theme - Normal Profile View
    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-20">
            <SpaceBackgroundWrapper />
            <div className="relative z-10">
                <ProfileHero
                    profile={profile}
                    user={user}
                    isOwnProfile={true}
                />
            </div>
            <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
                        <ProfileAboutSidebar
                            profile={profile}
                            stats={{
                                articlesCount: articles?.length || 0,
                                questionsCount: questions?.length || 0,
                                answersCount: answers?.length || 0,
                                followersCount: followStats.followersCount,
                                followingCount: followStats.followingCount
                            }}
                            badges={userBadges || []}
                            createdAt={user.created_at}
                        />
                        <div className="w-full">
                            <HubAlien />
                        </div>
                    </div>
                    <ProfileContentFeed
                        articles={articles || []}
                        questions={questions || []}
                        answers={answers || []}
                        bookmarkedArticles={bookmarkedArticles || []}
                        bookmarkedQuestions={bookmarkedQuestions || []}
                        drafts={drafts || []}
                    />
                </div>
            </div>
        </div>
    );
}
