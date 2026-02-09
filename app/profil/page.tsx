import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { getTotalUnreadCount } from "@/app/mesajlar/actions";
import { VibrantProfileFeedWrapper } from "@/components/profile/vibrant/vibrant-profile-feed-wrapper";
import { BackgroundWrapper } from "@/components/home/background-wrapper";

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
        { data: answers },
        { data: userBadges },
        followStats,
        { data: drafts },
        unreadMessagesCount,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count').eq('author_id', user.id).neq('status', 'draft').order('created_at', { ascending: false }),
        supabase.from('questions').select('id, title, slug, created_at, category, views, answers_count').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('answers').select('id, content, created_at, is_accepted, questions(id, title, slug)').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_badges').select('awarded_at, badges(id, name, description, icon, category)').eq('user_id', user.id).order('awarded_at', { ascending: false }),
        getFollowStats(user.id),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, status').eq('author_id', user.id).eq('status', 'draft').order('created_at', { ascending: false }),
        getTotalUnreadCount(),
        supabase.from('article_bookmarks').select('created_at, articles(id, title, slug, category)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('question_bookmarks').select('created_at, questions(id, title, slug, category)').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    const stats = {
        reputation: profile?.reputation || 0,
        followersCount: followStats.followersCount,
        followingCount: followStats.followingCount,
        articlesCount: articles?.length || 0,
        questionsCount: questions?.length || 0,
        answersCount: answers?.length || 0,
    };

    return (
        <main className="min-h-screen bg-neo-off-white relative selection:bg-neo-vibrant-lime/50">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neo-vibrant-pink blur-[120px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neo-vibrant-cyan blur-[120px] opacity-30" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10 pt-4 lg:pt-8">
                <VibrantProfileFeedWrapper
                    profile={profile}
                    user={user}
                    stats={stats}
                    articles={articles || []}
                    questions={questions || []}
                    answers={answers || []}
                    drafts={drafts || []}
                    bookmarkedArticles={bookmarkedArticles || []}
                    bookmarkedQuestions={bookmarkedQuestions || []}
                    isOwnProfile={true}
                />
            </div>
        </main>
    );
}
