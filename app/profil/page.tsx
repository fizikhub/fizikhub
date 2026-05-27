import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { DarkNeoHeader } from "@/components/profile/dark-neo/dark-neo-header";
import { DarkNeoFeed } from "@/components/profile/dark-neo/dark-neo-feed";
import { DarkNeoSidebar } from "@/components/profile/dark-neo/dark-neo-sidebar";
import { ProfileSetupHint } from "@/components/profile/profile-setup-hint";

export const metadata: Metadata = {
    title: 'Profilim — Fizikhub',
    robots: {
        index: false,
        follow: false,
    },
};

// --- DATA LOADERS (Non-blocking & Parallelized) ---

async function getProfileAndStats(userId: string) {
    const supabase = await createClient();
    const [
        { data: profile },
        { count: followersCount },
        { count: followingCount },
        { count: articlesCount },
        { count: questionsCount },
        { count: answersCount }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', userId).neq('status', 'draft'),
        supabase.from('questions').select('id', { count: 'exact', head: true }).eq('author_id', userId),
        supabase.from('answers').select('id', { count: 'exact', head: true }).eq('author_id', userId),
    ]);

    const stats = {
        reputation: profile?.reputation || 0,
        followersCount: (followersCount || 0) + (profile?.username === 'barannnbozkurttb' ? 28000 : 0),
        followingCount: followingCount || 0,
        articlesCount: articlesCount || 0,
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
    };

    return { profile, stats };
}

async function getProfileFeedData(userId: string) {
    const supabase = await createClient();
    const [
        { data: articles },
        { data: questions },
        { data: answers },
        { count: draftsCount },
        { count: bookmarkedArticlesCount },
        { count: bookmarkedQuestionsCount }
    ] = await Promise.all([
        supabase.from('articles').select('*, profiles(full_name, avatar_url, username)').eq('author_id', userId).neq('status', 'draft').order('created_at', { ascending: false }).limit(12),
        supabase.from('questions').select('*, profiles(full_name, avatar_url, username)').eq('author_id', userId).order('created_at', { ascending: false }).limit(12),
        supabase.from('answers').select('id, content, created_at, is_accepted, questions(id, title, slug)').eq('author_id', userId).order('created_at', { ascending: false }).limit(12),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', userId).eq('status', 'draft'),
        supabase.from('article_bookmarks').select('article_id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('question_bookmarks').select('question_id', { count: 'exact', head: true }).eq('user_id', userId)
    ]);

    const deferredCounts = {
        drafts: draftsCount || 0,
        saved: (bookmarkedArticlesCount || 0) + (bookmarkedQuestionsCount || 0),
    };

    return { articles, questions, answers, deferredCounts };
}

// --- NEO-BRUTALIST PERFORMANCE SKELETONS ---

function HeaderSkeleton() {
    return (
        <div className="w-full h-[180px] sm:h-[240px] rounded-xl border-[3px] border-black bg-zinc-900/50 p-4 sm:p-6 overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-end gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-[3px] border-black bg-zinc-800" />
                <div className="space-y-2 mb-2">
                    <div className="h-6 w-32 sm:w-48 bg-zinc-800 rounded" />
                    <div className="h-4 w-20 sm:w-32 bg-zinc-800 rounded" />
                </div>
            </div>
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <div className="rounded-xl border-[3px] border-black bg-zinc-900/30 p-4 sm:p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <div className="h-6 w-1/3 bg-zinc-800 rounded border-b border-zinc-800 pb-2" />
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-2/3 bg-zinc-800 rounded" />
            <div className="h-10 w-full bg-zinc-800 rounded-lg mt-4" />
        </div>
    );
}

function FeedSkeleton() {
    return (
        <div className="space-y-4 sm:space-y-6 animate-pulse">
            <div className="flex gap-3 pb-2 border-b border-zinc-800">
                <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
                <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
                <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
            </div>
            {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-xl border-[3px] border-black bg-zinc-900/30 p-4 sm:p-6 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800" />
                        <div className="h-4 w-24 bg-zinc-800 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-12 w-full bg-zinc-800 rounded" />
                </div>
            ))}
        </div>
    );
}

// --- STREAMING SECTION COMPONENTS ---

async function ProfileHeaderSection({ userId, user }: { userId: string; user: any }) {
    const { profile, stats } = await getProfileAndStats(userId);
    return (
        <DarkNeoHeader
            profile={profile}
            user={user}
            stats={stats}
            isOwnProfile={true}
            isFollowing={false}
        />
    );
}

async function ProfileSidebarSection({ userId, user }: { userId: string; user: any }) {
    const { profile, stats } = await getProfileAndStats(userId);
    return (
        <DarkNeoSidebar
            profile={profile}
            user={user}
            stats={stats}
            userBadges={[]}
        />
    );
}

async function ProfileFeedSection({ userId }: { userId: string }) {
    const { articles, questions, answers, deferredCounts } = await getProfileFeedData(userId);
    return (
        <DarkNeoFeed
            articles={(articles || []).map(a => ({ ...a, content: a.content ? a.content.slice(0, 300) : '' }))}
            questions={(questions || []).map(q => ({ ...q, content: q.content ? q.content.slice(0, 300) : '' }))}
            answers={(answers || []).map(ans => ({ ...ans, content: ans.content ? ans.content.slice(0, 300) : '' }))}
            drafts={[]}
            bookmarkedArticles={[]}
            bookmarkedQuestions={[]}
            deferredCounts={deferredCounts}
            isOwnProfile={true}
        />
    );
}

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-background relative">
            <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative z-10 pt-3 sm:pt-4 lg:pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-32">

                {/* HERO SECTION */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <ProfileSetupHint />
                    <Suspense fallback={<HeaderSkeleton />}>
                        <ProfileHeaderSection userId={user.id} user={user} />
                    </Suspense>
                </div>

                {/* GRID CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-8">

                    {/* MAIN FEED */}
                    <div className="order-2 xl:order-1 xl:col-span-7">
                        <Suspense fallback={<FeedSkeleton />}>
                            <ProfileFeedSection userId={user.id} />
                        </Suspense>
                    </div>

                    {/* SIDEBAR */}
                    <div className="order-1 xl:order-2 xl:col-span-5 relative mb-4 xl:mb-0">
                        <Suspense fallback={<SidebarSkeleton />}>
                            <ProfileSidebarSection userId={user.id} user={user} />
                        </Suspense>
                    </div>

                </div>
            </div>
        </main>
    );
}
