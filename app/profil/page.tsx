import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileContentFeed } from "@/components/profile/profile-content-feed";
import { ProfileAboutCard } from "@/components/profile/profile-about-card";
import { ProfileStatsCard } from "@/components/profile/profile-stats-card";
import { BadgeDisplay } from "@/components/badge-display";

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
        /* V16 BACKGROUND: Clean Zinc-50 for professionalism */
        <div className="min-h-screen bg-zinc-50 py-6 pb-20">
            <div className="container max-w-5xl mx-auto px-4 md:px-6">

                {/* 1. HEADER CARD (Full Width) */}
                <ProfileHero
                    profile={profile}
                    user={user}
                    isOwnProfile={true}
                    stats={stats}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-5">
                        <ProfileAboutCard
                            bio={profile?.bio}
                            fullName={profile?.full_name}
                            role={profile?.role}
                        />

                        {/* Portfolio Card */}
                        <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] p-6">
                            <h2 className="text-lg font-black uppercase tracking-tight mb-5 flex items-center gap-2 text-black">
                                Portfolyo
                                <div className="h-0.5 flex-1 bg-black/10 rounded-full" />
                            </h2>
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

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-5">
                        <ProfileStatsCard stats={stats} />

                        {/* Badges */}
                        {formattedBadges && formattedBadges.length > 0 && (
                            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] p-6">
                                <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
                                    Rozetler
                                    <div className="text-xs font-bold bg-amber-300 text-black px-2 py-0.5 rounded border border-black">
                                        {formattedBadges.length}
                                    </div>
                                </h2>
                                <BadgeDisplay userBadges={formattedBadges} size="md" maxDisplay={8} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
