import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { ModernProfileHeader } from "@/components/profile/modern/modern-profile-header";
import { ModernProfileFeed } from "@/components/profile/modern/modern-profile-feed";

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
        <div className="min-h-screen bg-background border-x border-border max-w-[600px] mx-auto pb-32">
            {/* 
                We remove the 'container' and 'px' constraints to allow full-bleed cover image 
                and max-width mimics the Twitter timeline width.
             */}

            <ModernProfileHeader
                profile={profile}
                user={user || { created_at: profile.created_at }}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                stats={stats}
                userBadges={formattedBadges}
            />

            <div className="border-t border-border mt-4">
                <ModernProfileFeed
                    articles={articles || []}
                    questions={questions || []}
                    answers={answers || []}
                    bookmarkedArticles={[]}
                    bookmarkedQuestions={[]}
                    isOwnProfile={isOwnProfile}
                />
            </div>
        </div>
    );
}
