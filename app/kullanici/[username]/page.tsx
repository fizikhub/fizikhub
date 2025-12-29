import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileAboutSidebar } from "@/components/profile/profile-about-sidebar";
import { ProfileContentFeed } from "@/components/profile/profile-content-feed";
import { SpaceBackground } from "@/components/home/space-background";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `@${username} - FizikHub Profil`,
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (!profile) {
        notFound();
    }

    // Fetch current user to check if it's own profile
    const { data: { user } } = await supabase.auth.getUser();
    const isOwnProfile = user?.id === profile.id;

    // Run all independent queries in parallel
    const [
        followStatus,
        followStats,
        { data: userBadges },
        { data: articles },
        { data: questions },
        { data: answers }
    ] = await Promise.all([
        // 1. Follow status (only if logged in and not own profile)
        user && !isOwnProfile ? getFollowStatus(profile.id) : Promise.resolve({ isFollowing: false }),

        // 2. Follow stats
        getFollowStats(profile.id),

        // 3. User badges
        supabase
            .from('user_badges')
            .select('awarded_at, badges(id, name, description, icon, category)')
            .eq('user_id', profile.id)
            .order('awarded_at', { ascending: false }),

        // 4. User articles
        supabase
            .from('articles')
            .select('*')
            .eq('author_id', profile.id)
            .eq('status', 'published') // Only show published articles for public view
            .order('created_at', { ascending: false }),

        // 5. User questions
        supabase
            .from('questions')
            .select('*, profiles(username, full_name), answers(count)')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false }),

        // 6. User answers
        supabase
            .from('answers')
            .select('*, questions(id, title)')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false })
    ]);

    const { isFollowing } = followStatus;
    const { followersCount, followingCount } = followStats;

    // --- RETRO PROFILE CHECK ---
    if (username.toLowerCase() === "baranbozkurt") {
        const { RetroProfileView } = await import("@/components/profile/retro-profile-view");

        // Prepare simple stats object for the retro view
        const retroStats = {
            followersCount: followStats.followersCount,
            followingCount: followStats.followingCount,
            articlesCount: articles?.length || 0,
            questionsCount: questions?.length || 0,
        };

        return (
            <RetroProfileView
                profile={profile}
                articles={articles || []}
                questions={questions || []}
                userBadges={userBadges || []}
                stats={retroStats}
            />
        );
    }
    // ---------------------------

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-20">
            {/* Space Background */}
            <SpaceBackground />

            {/* Hero Section */}
            <div className="relative z-10">
                <ProfileHero
                    profile={profile}
                    user={user}
                    isOwnProfile={isOwnProfile}
                    isFollowing={isFollowing}
                    targetUserId={profile.id}
                />
            </div>

            {/* Main Content */}
            <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProfileAboutSidebar
                            profile={profile}
                            stats={{
                                articlesCount: articles?.length || 0,
                                questionsCount: questions?.length || 0,
                                answersCount: answers?.length || 0,
                                followersCount,
                                followingCount
                            }}
                            badges={userBadges || []}
                            createdAt={profile.created_at}
                        />
                    </div>

                    {/* Main Content Feed */}
                    <ProfileContentFeed
                        articles={articles || []}
                        questions={questions || []}
                        answers={answers || []}
                        bookmarkedArticles={[]} // Don't show bookmarks for public profiles
                        bookmarkedQuestions={[]} // Don't show bookmarks for public profiles
                        isOwnProfile={isOwnProfile}
                    />
                </div>
            </div>
        </div>
    );
}
