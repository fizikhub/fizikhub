import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "@/app/mesajlar/actions";
import { getFollowStats } from "@/app/profil/actions";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileBadges } from "@/components/profile/profile-badges";
import { EditableCover } from "@/components/profile/editable-cover";

import { SpaceBackground } from "@/components/home/space-background";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Parallel Data Fetching
    const [
        { data: profile },
        { data: questions },
        { data: answers },
        { data: userBadges },
        { data: articles },
        conversations,
        followStats,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions }
    ] = await Promise.all([
        // 1. Fetch Profile
        supabase.from('profiles').select('*').eq('id', user.id).single(),

        // 2. Fetch Questions
        supabase.from('questions').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 3. Fetch Answers
        supabase.from('answers').select('*, questions(id, title)').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 4. Fetch Badges
        supabase.from('user_badges').select('awarded_at, badges(id, name, description, icon, category)').eq('user_id', user.id).order('awarded_at', { ascending: false }),

        // 5. Fetch Articles
        supabase.from('articles').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 6. Fetch Conversations
        getConversations(),

        // 7. Fetch Follow Stats
        getFollowStats(user.id),

        // 8. Fetch Bookmarked Articles
        supabase.from('article_bookmarks').select('created_at, articles(id, title, slug, excerpt, created_at, author:profiles(full_name, username))').eq('user_id', user.id).order('created_at', { ascending: false }),

        // 9. Fetch Bookmarked Questions
        supabase.from('question_bookmarks').select('created_at, questions(id, title, content, created_at, category, profiles(full_name, username), answers(count))').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    // Generate gradient for cover
    const gradients = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-orange-500 to-amber-600",
        "from-pink-500 to-rose-600",
        "from-violet-500 to-purple-600"
    ];
    const gradientIndex = (profile?.username?.length || 0 + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden bg-black">
            <SpaceBackground />

            {/* Editable Cover Image */}
            <div className="relative z-10">
                <EditableCover
                    url={profile?.cover_url}
                    gradient={coverGradient}
                    editable={true}
                />
            </div>

            <div className="container mx-auto max-w-5xl px-4 -mt-20 relative z-10">
                <ProfileHeader
                    profile={profile}
                    user={user}
                />

                <ProfileStats
                    followersCount={followStats.followersCount}
                    followingCount={followStats.followingCount}
                    questionsCount={questions?.length || 0}
                    answersCount={answers?.length || 0}
                    articlesCount={articles?.length || 0}
                />

                <ProfileBadges userBadges={userBadges || []} />

                <ProfileTabs
                    articles={articles || []}
                    questions={questions || []}
                    answers={answers || []}
                    conversations={conversations}
                    bookmarkedArticles={bookmarkedArticles || []}
                    bookmarkedQuestions={bookmarkedQuestions || []}
                    userId={user.id}
                    profile={profile}
                />
            </div>
        </div>
    );
}
