import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { PublicProfileView } from "@/components/profile/public-profile-view";

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
        { data: questions },
        { count: answersCount }
    ] = await Promise.all([
        // 1. Follow status (only if logged in and not own profile)
        user && !isOwnProfile ? getFollowStatus(profile.id) : Promise.resolve({ isFollowing: false }),

        // 2. Follow stats
        getFollowStats(profile.id),

        // 3. User badges
        supabase
            .from('user_badges')
            .select(`
                awarded_at,
                badges (
                    id,
                    name,
                    description,
                    icon,
                    category
                )
            `)
            .eq('user_id', profile.id)
            .order('awarded_at', { ascending: false }),

        // 4. User questions
        supabase
            .from('questions')
            .select(`
                *,
                profiles(username, full_name),
                answers(count)
            `)
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false }),

        // 5. User answers count
        supabase
            .from('answers')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', profile.id)
    ]);

    const { isFollowing } = followStatus;
    const { followersCount, followingCount } = followStats;

    return (
        <PublicProfileView
            profile={profile}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            followersCount={followersCount}
            followingCount={followingCount}
            userBadges={userBadges || []}
            questions={questions || []}
            answersCount={answersCount || 0}
            user={user}
        />
    );
}
