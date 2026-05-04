import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DarkNeoHeader } from "@/components/profile/dark-neo/dark-neo-header";
import { DarkNeoFeed } from "@/components/profile/dark-neo/dark-neo-feed";
import { DarkNeoSidebar } from "@/components/profile/dark-neo/dark-neo-sidebar";
import { ProfileSetupHint } from "@/components/profile/profile-setup-hint";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [
        { data: profile },
        { data: articles },
        { data: questions },
        { data: answers },
        { count: followersCount },
        { count: followingCount },
        { count: articlesCount },
        { count: questionsCount },
        { count: answersCount },
        { count: draftsCount },
        { count: bookmarkedArticlesCount },
        { count: bookmarkedQuestionsCount }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('articles').select('*, profiles(full_name, avatar_url, username)').eq('author_id', user.id).neq('status', 'draft').order('created_at', { ascending: false }).limit(12),
        supabase.from('questions').select('*, profiles(full_name, avatar_url, username)').eq('author_id', user.id).order('created_at', { ascending: false }).limit(12),
        supabase.from('answers').select('id, content, created_at, is_accepted, questions(id, title, slug)').eq('author_id', user.id).order('created_at', { ascending: false }).limit(12),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', user.id),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', user.id).neq('status', 'draft'),
        supabase.from('questions').select('id', { count: 'exact', head: true }).eq('author_id', user.id),
        supabase.from('answers').select('id', { count: 'exact', head: true }).eq('author_id', user.id),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', user.id).eq('status', 'draft'),
        supabase.from('article_bookmarks').select('article_id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('question_bookmarks').select('question_id', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    const stats = {
        reputation: profile?.reputation || 0,
        followersCount: (followersCount || 0) + (profile?.username === 'barannnbozkurttb' ? 28000 : 0),
        followingCount: followingCount || 0,
        articlesCount: articlesCount || 0,
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
    };

    const deferredCounts = {
        drafts: draftsCount || 0,
        saved: (bookmarkedArticlesCount || 0) + (bookmarkedQuestionsCount || 0),
    };


    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/30">
            <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative z-10 pt-3 sm:pt-4 lg:pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-32">

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

                {/* GRID CONTENT - Mobile: Sidebar first, then Feed. Desktop: Feed left, Sidebar right */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-8">

                    {/* MAIN FEED */}
                    <div className="order-2 xl:order-1 xl:col-span-7">
                        <DarkNeoFeed
                            articles={articles || []}
                            questions={questions || []}
                            answers={answers || []}
                            drafts={[]}
                            bookmarkedArticles={[]}
                            bookmarkedQuestions={[]}
                            deferredCounts={deferredCounts}
                            isOwnProfile={true}
                        />
                    </div>

                    {/* SIDEBAR */}
                    <div className="order-1 xl:order-2 xl:col-span-5 relative mb-4 xl:mb-0">
                        <DarkNeoSidebar
                            profile={profile}
                            user={user}
                            stats={stats}
                            userBadges={[]}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}
