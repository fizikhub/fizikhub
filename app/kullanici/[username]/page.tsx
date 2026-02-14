import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { NeoProfileHero } from "@/components/profile/neo/neo-profile-hero";
import { NeoProfileFeedWrapper } from "@/components/profile/neo/neo-profile-feed-wrapper";
import { NeoProfileSidebar } from "@/components/profile/neo/neo-profile-sidebar";
import { BackgroundWrapper } from "@/components/home/background-wrapper";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, bio')
        .eq('username', username)
        .single();

    const displayName = profile?.full_name || `@${username}`;
    const description = profile?.bio
        ? `${displayName} — ${profile.bio.substring(0, 140)}`
        : `${displayName} adlı kullanıcının FizikHub profili. Makaleler, sorular ve bilimsel katkılar.`;

    return {
        title: `${displayName} (@${username})`,
        description,
        openGraph: {
            title: `${displayName} — FizikHub Profil`,
            description,
            type: 'profile',
            url: `https://fizikhub.com/kullanici/${username}`,
            ...(profile?.avatar_url && {
                images: [{ url: profile.avatar_url, width: 200, height: 200, alt: displayName }]
            }),
        },
        twitter: {
            card: 'summary',
            title: `${displayName} — FizikHub`,
            description,
            ...(profile?.avatar_url && { images: [profile.avatar_url] }),
        },
        robots: {
            index: true,
            follow: true,
        },
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
            .select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count')
            .eq('author_id', profile.id)
            .eq('status', 'published')
            .order('created_at', { ascending: false }),

        // 5. User questions
        supabase
            .from('questions')
            .select('id, title, slug, created_at, category, views, answers_count')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false }),

        // 6. User answers
        supabase
            .from('answers')
            .select('id, content, created_at, is_accepted, questions(id, title, slug)')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false })
    ]);

    const { isFollowing } = followStatus;
    const { followersCount, followingCount } = followStats;

    // Construct stats object
    const stats = {
        reputation: profile?.reputation || 0,
        followersCount,
        followingCount,
        articlesCount: articles?.length || 0,
        questionsCount: questions?.length || 0,
        answersCount: answers?.length || 0,
    };

    // Fix for BadgeDisplay type mismatch
    const formattedBadges = userBadges?.map((ub: any) => ({
        awarded_at: ub.awarded_at,
        badges: Array.isArray(ub.badges) ? ub.badges[0] : ub.badges
    }))?.filter(ub => ub.badges) || [];

    return (
        <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
            <BackgroundWrapper />

            <div className="container max-w-7xl mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-4 lg:pt-8 pb-32">

                {/* 1. HERO SECTION (Full Width) */}
                <div className="mb-8">
                    <NeoProfileHero
                        profile={profile}
                        user={user || { created_at: profile.created_at }} // Fallback if no user
                        isOwnProfile={isOwnProfile}
                        isFollowing={isFollowing}
                        stats={stats}
                    />
                </div>

                {/* 2. GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                    {/* LEFT: MAIN FEED (7 Columns) */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                        <NeoProfileFeedWrapper
                            articles={articles || []}
                            questions={questions || []}
                            answers={answers || []}
                            drafts={[]} // No drafts on public profile
                            bookmarkedArticles={[]} // No bookmarks on public profile
                            bookmarkedQuestions={[]}
                            isOwnProfile={isOwnProfile}
                        />
                    </div>

                    {/* RIGHT: SIDEBAR (5 Columns) */}
                    <div className="hidden xl:block xl:col-span-5 relative">
                        <NeoProfileSidebar
                            profile={profile}
                            user={user || { created_at: profile.created_at }}
                            stats={stats}
                            userBadges={formattedBadges}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}
