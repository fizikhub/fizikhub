import { createClient, createStaticClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";
import { cache } from "react";
import { DarkNeoHeader } from "@/components/profile/dark-neo/dark-neo-header";
import { DarkNeoFeed } from "@/components/profile/dark-neo/dark-neo-feed";
import { DarkNeoSidebar } from "@/components/profile/dark-neo/dark-neo-sidebar";
import { getSiteUrl, isIndexableProfile } from "@/lib/seo-utils";

interface PageProps {
    params: Promise<{ username: string }>;
}

const getCachedProfile = cache(async (username: string) => {
    const supabase = createStaticClient();
    const cleanUsername = decodeURIComponent(username).trim();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, cover_url, cover_offset_y, bio, website, created_at, updated_at, reputation, role, is_writer, is_verified')
        .ilike('username', cleanUsername)
        .maybeSingle();
    return profile;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    
    // Using cached static client call for fast metadata generation
    const profile = await getCachedProfile(username);

    if (!profile) return { title: 'Profil Bulunamadı' };

    const supabase = createStaticClient();
    const [{ count: articleCount }, { count: questionCount }, { count: answerCount }] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', profile.id).eq('status', 'published'),
        supabase.from('questions').select('id', { count: 'exact', head: true }).eq('author_id', profile.id).eq('status', 'published'),
        supabase.from('answers').select('id', { count: 'exact', head: true }).eq('author_id', profile.id),
    ]);

    const displayName = profile.full_name || `@${profile.username}`;
    const description = profile.bio
        ? `${displayName} — ${profile.bio.substring(0, 140)}`
        : `${displayName} adlı kullanıcının FizikHub profili. Makaleler, sorular ve bilimsel katkılar.`;
    const shouldIndex = isIndexableProfile({
        ...profile,
        articleCount,
        questionCount,
        answerCount,
    });
    const canonicalUrl = `${getSiteUrl()}/kullanici/${profile.username}`;

    return {
        title: `${displayName} (@${profile.username})`,
        description,
        robots: {
            index: shouldIndex,
            follow: true,
            googleBot: {
                index: shouldIndex,
                follow: true,
            },
        },
        openGraph: {
            title: `${displayName} — FizikHub Profil`,
            description,
            type: 'profile',
            url: canonicalUrl,
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
            canonical: canonicalUrl,
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Fetch profile (cached) and current user concurrently
    const [
        profile,
        { data: { user } }
    ] = await Promise.all([
        getCachedProfile(username),
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
            .select('id, title, slug, excerpt, summary, cover_url, image_url, category, created_at, likes_count, comments_count, profiles(full_name, avatar_url, username)')
            .eq('author_id', profile.id)
            .eq('status', 'published')
            .order('created_at', { ascending: false }),

        // 5. User questions
        supabase
            .from('questions')
            .select('id, title, content, created_at, category, votes, tags, profiles(full_name, avatar_url, username)')
            .eq('author_id', profile.id)
            .eq('status', 'published')
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
    const expertise = [
        profile.is_writer ? "Fizik yazarlığı" : null,
        profile.is_verified ? "Doğrulanmış FizikHub profili" : null,
        ...(articles || []).slice(0, 4).map((article) => article.category || "Bilim"),
    ].filter(Boolean) as string[];


    // JSON-LD for E-E-A-T Profile
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `https://www.fizikhub.com/kullanici/${profile.username}`,
        mainEntityOfPage: `https://www.fizikhub.com/kullanici/${profile.username}`,
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
            knowsAbout: expertise.length > 0 ? expertise : ["Fizik", "Bilim"],
            subjectOf: (articles || []).slice(0, 6).map((article) => ({
                '@type': 'Article',
                name: article.title,
                url: `https://www.fizikhub.com/makale/${article.slug}`,
            })),
            interactionStatistic: [
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/WriteAction',
                    userInteractionCount: stats.articlesCount + stats.answersCount + stats.questionsCount
                }
            ],
            // Adding E-E-A-T credibility details (GEO)
            ...(profile.is_writer && {
                jobTitle: "Fizik ve Bilim Yazarı",
                affiliation: {
                    '@type': 'Organization',
                    name: "Fizikhub",
                    url: "https://www.fizikhub.com"
                }
            }),
            ...(profile.is_verified && {
                award: "Doğrulanmış Bilim Katkıcısı"
            }),
            // Adding known social links if available in future
            ...(profile.website && { sameAs: [profile.website] })
        }
    };

    return (
        <main className="min-h-screen bg-background relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative z-10 pt-3 sm:pt-4 lg:pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-32">

                {/* 1. HERO SECTION (Full Width) */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <DarkNeoHeader
                        profile={profile}
                        user={user || { created_at: profile.created_at }} // Fallback
                        isOwnProfile={isOwnProfile}
                        isFollowing={isFollowing}
                        stats={stats}
                    />
                </div>

                {(profile.bio || profile.is_writer || profile.is_verified || stats.articlesCount > 0) && (
                    <section className="mb-4 rounded-lg border border-border bg-card p-4 text-card-foreground sm:mb-6" aria-label="Yazar güven sinyalleri">
                        <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
                            {profile.is_verified && <span className="rounded-md border border-emerald-500/40 px-2 py-1 text-emerald-400">Doğrulanmış profil</span>}
                            {profile.is_writer && <span className="rounded-md border border-sky-500/40 px-2 py-1 text-sky-400">FizikHub yazarı</span>}
                            <span className="rounded-md border border-border px-2 py-1">{stats.articlesCount} yayın</span>
                            <span className="rounded-md border border-border px-2 py-1">{stats.answersCount} cevap</span>
                            <span className="rounded-md border border-border px-2 py-1">{stats.questionsCount} soru</span>
                        </div>
                        {expertise.length > 0 && (
                            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                                Uzmanlık ve katkı alanları: {Array.from(new Set(expertise)).join(", ")}.
                            </p>
                        )}
                    </section>
                )}

                {/* 2. GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">

                    {/* LEFT: MAIN FEED (7 Columns) */}
                    <div className="order-2 space-y-6 lg:col-span-12 xl:order-1 xl:col-span-7">
                        <DarkNeoFeed
                            articles={(articles || []).map(a => ({ ...a, content: '' }))}
                            questions={(questions || []).map(q => ({ ...q, content: q.content ? q.content.slice(0, 300) : '' }))}
                            answers={(answers || []).map(ans => ({ ...ans, content: ans.content ? ans.content.slice(0, 300) : '' }))}
                            drafts={[]} // No drafts on public profile
                            bookmarkedArticles={[]} // No bookmarks on public profile
                            bookmarkedQuestions={[]}
                            isOwnProfile={isOwnProfile}
                        />
                    </div>

                    {/* RIGHT: SIDEBAR (5 Columns) */}
                    <div className="order-1 relative xl:order-2 xl:col-span-5">
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
