import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { BadgeDisplay } from "@/components/badge-display";
import { NeoProfileHeader } from "@/components/profile/neo/neo-profile-header";
import { NeoProfileFeed } from "@/components/profile/neo/neo-profile-feed";

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
        { data: bookmarkedQuestions },
        { data: drafts }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count').eq('author_id', user.id).neq('status', 'draft').order('created_at', { ascending: false }),
        supabase.from('questions').select('id, title, slug, created_at, category, views, answers_count').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('answers').select('id, content, created_at, is_accepted, questions(id, title, slug)').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_badges').select('awarded_at, badges(id, name, description, icon, category)').eq('user_id', user.id).order('awarded_at', { ascending: false }),
        getFollowStats(user.id),
        supabase.from('article_bookmarks').select('created_at, articles(id, title, slug, excerpt, created_at, category, cover_url, author:profiles(full_name, username))').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('question_bookmarks').select('created_at, questions(id, title, slug, content, created_at, category, profiles(full_name, username), answers(count))').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, status').eq('author_id', user.id).eq('status', 'draft').order('created_at', { ascending: false })
    ]);

    // Construct stats object
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
        /* BACKGROUND: Clean Zinc-50 */
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-4 sm:py-8 pb-32">
            <div className="container max-w-[600px] lg:max-w-[700px] mx-auto px-4">

                {/* 1. COMPACT NEO HEADER */}
                <NeoProfileHeader
                    profile={profile}
                    user={user}
                    isOwnProfile={true}
                    stats={stats}
                />

                {/* 2. BADGES (If any) */}
                {formattedBadges && formattedBadges.length > 0 && (
                    <div className="mb-8 flex justify-center">
                        <BadgeDisplay userBadges={formattedBadges} size="md" maxDisplay={4} />
                    </div>
                )}

                {/* 3. COMPACT FEED (Tabs) */}
                <NeoProfileFeed
                    articles={articles || []}
                    questions={questions || []}
                    answers={answers || []}
                    bookmarkedArticles={bookmarkedArticles || []}
                    bookmarkedQuestions={bookmarkedQuestions || []}
                    drafts={drafts || []}
                    isOwnProfile={true}
                />

            </div>
        </div>
    );
}
