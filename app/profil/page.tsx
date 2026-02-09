import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { BrutalistProfileLayout } from "@/components/profile/brutalist/brutalist-profile-layout";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Parallel Data Fetching
    const [
        { data: profile },
        { data: articles },
        { data: questions },
        followStats,
        { data: drafts },
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count').eq('author_id', user.id).neq('status', 'draft').order('created_at', { ascending: false }),
        supabase.from('questions').select('id, title, slug, created_at, category, views, answers_count').eq('author_id', user.id).order('created_at', { ascending: false }),
        getFollowStats(user.id),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, status').eq('author_id', user.id).eq('status', 'draft').order('created_at', { ascending: false }),
    ]);

    const stats = {
        reputation: profile?.reputation || 0,
        followersCount: followStats.followersCount,
        followingCount: followStats.followingCount,
        articlesCount: articles?.length || 0,
        questionsCount: questions?.length || 0,
    };

    return (
        <main className="min-h-screen bg-[#c1f07c] flex justify-center items-start">
            <BrutalistProfileLayout
                profile={profile}
                user={user}
                stats={stats}
                articles={articles || []}
                questions={questions || []}
                drafts={drafts || []}
                isOwnProfile={true}
            />
        </main>
    );
}
