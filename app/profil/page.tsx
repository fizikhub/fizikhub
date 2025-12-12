import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileAboutSidebar } from "@/components/profile/profile-about-sidebar";
import { ProfileContentFeed } from "@/components/profile/profile-content-feed";
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
        { data: articles },
        { data: questions },
        { data: answers },
        { data: userBadges },
        followStats,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions }
    ] = await Promise.all([
        // 1. Fetch Profile
        supabase.from('profiles').select('*').eq('id', user.id).single(),

        // 2. Fetch Articles
        supabase.from('articles').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 3. Fetch Questions
        supabase.from('questions').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 4. Fetch Answers
        supabase.from('answers').select('*, questions(id, title)').eq('author_id', user.id).order('created_at', { ascending: false }),

        // 5. Fetch Badges
        supabase.from('user_badges').select('awarded_at, badges(id, name, description, icon, category)').eq('user_id', user.id).order('awarded_at', { ascending: false }),

        // 6. Fetch Follow Stats
        getFollowStats(user.id),

        // 7. Fetch Bookmarked Articles
        supabase.from('article_bookmarks').select('created_at, articles(id, title, slug, excerpt, created_at, category, cover_url, author:profiles(full_name, username))').eq('user_id', user.id).order('created_at', { ascending: false }),

        // 8. Fetch Bookmarked Questions
        supabase.from('question_bookmarks').select('created_at, questions(id, title, content, created_at, category, profiles(full_name, username), answers(count))').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-20">
            {/* Space Background */}
            <SpaceBackground />

            {/* Hero Section */}
            <div className="relative z-10">
                <ProfileHero
                    profile={profile}
                    user={user}
                    isOwnProfile={true}
                />
            </div>

            {/* Main Content */}
            <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProfileAboutSidebar
                            profile={profile}
                            stats={{
                                articlesCount: articles?.length || 0,
                                questionsCount: questions?.length || 0,
                                answersCount: answers?.length || 0,
                                followersCount: followStats.followersCount,
                                followingCount: followStats.followingCount
                            }}
                            badges={userBadges || []}
                            createdAt={user.created_at}
                        />
                    </div>

                    {/* Main Content Feed */}
                    <ProfileContentFeed
                        articles={articles || []}
                        questions={questions || []}
                        answers={answers || []}
                        bookmarkedArticles={bookmarkedArticles || []}
                        bookmarkedQuestions={bookmarkedQuestions || []}
                    />
                </div>
            </div>
        </div>
    );
}
