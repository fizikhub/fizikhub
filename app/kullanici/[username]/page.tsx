import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { DarkNeoHeader } from "@/components/profile/dark-neo/dark-neo-header";
import { DarkNeoFeed } from "@/components/profile/dark-neo/dark-neo-feed";
import { DarkNeoSidebar } from "@/components/profile/dark-neo/dark-neo-sidebar";
import { BackgroundWrapper } from "@/components/home/background-wrapper";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const supabase = await createClient();

    // Minimal selection for SEO to reduce TTFB
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, bio')
        .eq('username', username)
        .maybeSingle();

    if (!profile) return { title: 'Profil Bulunamadı' };

    const displayName = profile.full_name || `@${username}`;
    const description = profile.bio
        ? `${displayName} — ${profile.bio.substring(0, 140)}`
        : `${displayName} adlı kullanıcının FizikHub profili. Makaleler, sorular ve bilimsel katkılar.`;

    return {
        title: `${displayName} (@${username})`,
        description,
        openGraph: {
            title: `${displayName} — FizikHub Profil`,
            description,
            type: 'profile',
            url: `https://www.fizikhub.com/kullanici/${username}`,
            ...(profile.avatar_url && {
                images: [{ url: profile.avatar_url, width: 200, height: 200, alt: displayName }]
            }),
        },
        twitter: {
            card: 'summary',
            title: `${displayName} — FizikHub`,
            description,
            ...(profile.avatar_url && { images: [profile.avatar_url] }),
        },
        alternates: {
            canonical: `https://www.fizikhub.com/kullanici/${username}`,
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Fetch profile and current user concurrently
    const [
        { data: profile },
        { data: { user } }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('username', username).maybeSingle(),
        supabase.auth.getUser()
    ]);

    if (!profile) {
        notFound();
    }

    // Check if it's own profile
    const isOwnProfile = user?.id === profile.id;

    // Run all independent queries in parallel
    const [
        followStatus,
        followStats,
        { data: articles },
        { data: questions },
        { data: answers }
    ] = await Promise.all([
        // 1. Follow status (only if logged in and not own profile)
        user && !isOwnProfile ? getFollowStatus(profile.id) : Promise.resolve({ isFollowing: false }),

        // 2. Follow stats
        getFollowStats(profile.id),

        // 4. User articles
        supabase
            .from('articles')
            .select('*, profiles(full_name, avatar_url, username)')
            .eq('author_id', profile.id)
            .eq('status', 'published')
            .order('created_at', { ascending: false }),

        // 5. User questions
        supabase
            .from('questions')
            .select('*, profiles(full_name, avatar_url, username)')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false }),

        // 6. User answers
        supabase
            .from('answers')
            .select('id, content, created_at, questions(id, title, slug)')
            .eq('author_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(10) // Limit answers for performance
    ]);

    const { isFollowing } = followStatus;
    const { followersCount, followingCount } = followStats;

    // Construct stats object
    const stats = {
        reputation: profile?.reputation || 0,
        followersCount,
        followingCount,
        articlesCount: articles?.length || 0,
        questionsCount: questions?.length || 0,
        answersCount: answers?.length || 0,
    };


    // JSON-LD for E-E-A-T Profile
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `https://www.fizikhub.com/kullanici/${profile.username}`,
        dateCreated: profile.created_at,
        dateModified: profile.updated_at || profile.created_at,
        mainEntity: {
            '@type': 'Person',
            '@id': `https://www.fizikhub.com/kullanici/${profile.username}#person`,
            name: profile.full_name || `@${profile.username}`,
            alternateName: profile.username,
            description: profile.bio || `${profile.full_name || profile.username} adlı kullanıcının FizikHub profili.`,
            image: profile.avatar_url || 'https://www.fizikhub.com/default-avatar.png',
            url: `https://www.fizikhub.com/kullanici/${profile.username}`,
            interactionStatistic: [
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/WriteAction',
                    userInteractionCount: stats.articlesCount + stats.answersCount + stats.questionsCount
                }
            ],
            // Adding known social links if available in future
            ...(profile.website && { sameAs: [profile.website] })
        }
    };

    return (
        <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BackgroundWrapper />

            <div className="container max-w-7xl mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-4 lg:pt-8 pb-32">

                {/* 1. HERO SECTION (Full Width) */}
                <div className="mb-8">
                    <DarkNeoHeader
                        profile={profile}
                        user={user || { created_at: profile.created_at }} // Fallback
                        isOwnProfile={isOwnProfile}
                        isFollowing={isFollowing}
                        stats={stats}
                    />
                </div>

                {/* 2. GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                    {/* LEFT: MAIN FEED (7 Columns) */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                        <DarkNeoFeed
                            articles={articles || []}
                            questions={questions || []}
                            answers={answers || []}
                            drafts={[]} // No drafts on public profile
                            bookmarkedArticles={[]} // No bookmarks on public profile
                            bookmarkedQuestions={[]}
                            isOwnProfile={isOwnProfile}
                        />
                    </div>

                    {/* RIGHT: SIDEBAR (5 Columns) */}
                    <div className="hidden xl:block xl:col-span-5 relative">
                        <DarkNeoSidebar
                            profile={profile}
                            user={user || { created_at: profile.created_at }}
                            stats={stats}
                            userBadges={[]}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}
