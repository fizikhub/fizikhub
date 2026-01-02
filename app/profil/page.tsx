import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileAboutSidebar } from "@/components/profile/profile-about-sidebar";
import { ProfileContentFeed } from "@/components/profile/profile-content-feed";
import { HubAlien } from "@/components/game/hub-alien";

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
        { data: userBadges },
        followStats,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions },
        { data: drafts }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('articles')
            .select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count')
            .eq('author_id', user.id)
            .neq('status', 'draft')
            .order('created_at', { ascending: false }),
        supabase.from('questions')
            .select('id, title, slug, created_at, category, views, answers_count')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),
        supabase.from('answers')
            .select('id, content, created_at, is_accepted, questions(id, title, slug)')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),
        supabase.from('user_badges')
            .select('awarded_at, badges(id, name, description, icon, category)')
            .eq('user_id', user.id)
            .order('awarded_at', { ascending: false }),
        getFollowStats(user.id),
        supabase.from('article_bookmarks')
            .select('created_at, articles(id, title, slug, excerpt, created_at, category, cover_url, author:profiles(full_name, username))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase.from('question_bookmarks')
            .select('created_at, questions(id, title, slug, content, created_at, category, profiles(full_name, username), answers(count))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase.from('articles')
            .select('id, title, slug, excerpt, created_at, category, cover_url, status')
            .eq('author_id', user.id)
            .eq('status', 'draft')
            .order('created_at', { ascending: false })
    ]);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <ProfileHero
                profile={profile}
                user={user}
                isOwnProfile={true}
            />

            {/* Main Content */}
            <div className="container max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
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

                        {/* Hub Alien Pet */}
                        <div className="hidden lg:block">
                            <HubAlien />
                        </div>
                    </div>

                    {/* Main Content Feed */}
                    <ProfileContentFeed
                        articles={articles || []}
                        questions={questions || []}
                        answers={answers || []}
                        bookmarkedArticles={bookmarkedArticles || []}
                        bookmarkedQuestions={bookmarkedQuestions || []}
                        drafts={drafts || []}
                    />
                </div>
            </div>
        </div>
    );
}
