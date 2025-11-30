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

    // Check follow status
    const { isFollowing } = user && !isOwnProfile
        ? await getFollowStatus(profile.id)
        : { isFollowing: false };

    // Fetch follow stats
    const { followersCount, followingCount } = await getFollowStats(profile.id);

    // Fetch user's badges
    const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
            awarded_at,
            badges (
                name,
                description,
                icon
            )
        `)
        .eq('user_id', profile.id)
        .order('awarded_at', { ascending: false });

    // Fetch user's questions
    const { data: questions } = await supabase
        .from('questions')
        .select(`
            *,
            profiles(username, full_name),
            answers(count)
        `)
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false });

    // Fetch user's answers count
    const { count: answersCount } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', profile.id);

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
