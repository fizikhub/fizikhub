import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { getTotalUnreadCount } from "@/app/mesajlar/actions";
import { DarkNeoHeader } from "@/components/profile/dark-neo/dark-neo-header";
import { DarkNeoFeed } from "@/components/profile/dark-neo/dark-neo-feed";
import { DarkNeoSidebar } from "@/components/profile/dark-neo/dark-neo-sidebar";
import { BackgroundWrapper } from "@/components/home/background-wrapper";
import { ProfileSetupHint } from "@/components/profile/profile-setup-hint";

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
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
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

    // Fix for BadgeDisplay type mismatch
    const formattedBadges = userBadges?.map((ub: any) => ({
        awarded_at: ub.awarded_at,
        badges: Array.isArray(ub.badges) ? ub.badges[0] : ub.badges
    }))?.filter(ub => ub.badges) || [];

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/30">
            <BackgroundWrapper />

            <div className="container max-w-7xl mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-2 sm:pt-4 lg:pt-8 pb-24 sm:pb-32">

                {/* HERO SECTION */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <ProfileSetupHint />
                    <DarkNeoHeader
                        profile={profile}
                        user={user}
                        stats={stats}
                        isOwnProfile={true}
                        isFollowing={false}
                    />
                </div>

                {/* GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">

                    {/* MAIN FEED */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <DarkNeoFeed
                            articles={articles || []}
                            questions={questions || []}
                            answers={answers || []}
                            drafts={drafts || []}
                            bookmarkedArticles={bookmarkedArticles || []}
                            bookmarkedQuestions={bookmarkedQuestions || []}
                            isOwnProfile={true}
                        />
                    </div>

                    {/* SIDEBAR - Hidden on mobile */}
                    <div className="hidden xl:block xl:col-span-5 relative">
                        <DarkNeoSidebar
                            profile={profile}
                            user={user}
                            stats={stats}
                            userBadges={formattedBadges}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}
