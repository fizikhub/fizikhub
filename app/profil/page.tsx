import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { getTotalUnreadCount } from "@/app/mesajlar/actions";
import { NeoProfileHero } from "@/components/profile/neo/neo-profile-hero";
import { NeoProfileSidebar } from "@/components/profile/neo/neo-profile-sidebar";
import { NeoProfileFeedWrapper } from "@/components/profile/neo/neo-profile-feed-wrapper";
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
                        user={user}
                        isOwnProfile={true}
                        isFollowing={false}
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
                            drafts={drafts || []}
                            bookmarkedArticles={bookmarkedArticles || []}
                            bookmarkedQuestions={bookmarkedQuestions || []}
                            isOwnProfile={true}
                        />
                    </div>

                    {/* RIGHT: SIDEBAR (5 Columns) */}
                    <div className="hidden xl:block xl:col-span-5 relative">
                        <NeoProfileSidebar
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
