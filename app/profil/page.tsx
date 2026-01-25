import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, Edit, FileText, Zap, Bookmark } from "lucide-react";

// V25: ELEGANT NEO-BRUTALIST COMPONENTS

function CompactHeader({ profile, user, stats, isOwnProfile }: any) {
    return (
        <div className="w-full">
            {/* 
                V25 HEADER: COMPACT & ELEGANT
                - Background: Dark Grey (Site BG)
                - Layout: Horizontal Flex for Mobile
            */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-8">

                {/* 1. IDENTITY BLOCK (Avatar + Name) */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 border-[2px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#FFC800] text-3xl font-black text-black">?</div>
                            )}
                        </div>
                        {/* Level Badge - Absolute */}
                        <div className="absolute -bottom-2 -right-2">
                            <div className="bg-black text-[#FFC800] text-[10px] font-black px-2 py-0.5 border border-[#FFC800] rounded-full">
                                LVL {Math.floor(stats.reputation / 100) + 1}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight">
                            {profile?.full_name || user.email?.split('@')[0]}
                        </h1>
                        <p className="text-zinc-500 font-mono text-xs mt-1">
                            @{profile?.username}
                        </p>

                        {/* Mobile Actions */}
                        {isOwnProfile && (
                            <div className="flex gap-2 mt-3 sm:hidden">
                                <Link href="/profil/duzenle" className="bg-zinc-800 border border-zinc-700 p-1.5 rounded-md text-zinc-400 hover:text-white hover:border-white transition-all">
                                    <Edit className="w-3.5 h-3.5" />
                                </Link>
                                <Link href="/ayarlar" className="bg-zinc-800 border border-zinc-700 p-1.5 rounded-md text-zinc-400 hover:text-white hover:border-white transition-all">
                                    <Settings className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. STATS ROW (Elegant) */}
                <div className="flex gap-6 sm:ml-auto border-t sm:border-t-0 border-zinc-800 pt-4 sm:pt-0 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {[
                        { label: "YAZILAR", value: stats.articlesCount },
                        { label: "TAKİPÇİ", value: stats.followersCount },
                        { label: "PUAN", value: stats.reputation },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 tracking-wider mb-0.5">{stat.label}</span>
                            <span className="text-lg font-black text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Desktop Actions */}
                {isOwnProfile && (
                    <div className="hidden sm:flex gap-2">
                        <Link href="/profil/duzenle" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            DÜZENLE
                        </Link>
                        <Link href="/ayarlar" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-2 rounded-lg text-white transition-all">
                            <Settings className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function ContentFeed({ items, emptyMsg }: any) {
    if (!items?.length) return (
        <div className="py-12 text-center border-t border-zinc-800">
            <span className="text-zinc-600 font-mono text-sm">{emptyMsg}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {items.map((item: any) => (
                <Link
                    key={item.id}
                    href={item.answers_count !== undefined ? `/forum/${item.id}` : `/makale/${item.slug}`}
                    className="block group"
                >
                    {/* 
                        V25 CARD: DARK & SLEEK
                        - Bg: Zinc-900 (matches site)
                        - Border: Black (Thick) or Zinc-700 (Thin)? User said "Neo Brutalistic".
                        - Let's do: Zinc-800 Card + Black Border + Hover Lift
                    */}
                    <div className="relative bg-[#18181b] border border-black rounded-lg p-4 transition-all hover:-translate-y-1 hover:border-[#3B82F6] hover:shadow-[4px_4px_0px_0px_#000]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-white font-bold leading-snug group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    {item.category && <span className="text-zinc-400">• {item.category}</span>}
                                    {item.views !== undefined && <span>• {item.views} OKUMA</span>}
                                </div>
                            </div>

                            {/* Icon Indicator */}
                            <div className="text-zinc-700 group-hover:text-[#FFC800] transition-colors">
                                {item.answers_count !== undefined ? <Zap className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

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

    const stats = {
        reputation: profile?.reputation || 0,
        followersCount: followStats.followersCount,
        followingCount: followStats.followingCount,
        articlesCount: articles?.length || 0,
        questionsCount: questions?.length || 0,
        answersCount: answers?.length || 0,
    };

    return (
        // Use bg-transparent so the global site background (Gray) shows through
        <div className="min-h-screen py-8 sm:py-12 pb-32">
            <div className="container max-w-2xl mx-auto px-4">

                {/* V25 HEADER */}
                <CompactHeader
                    profile={profile}
                    user={user}
                    stats={stats}
                    isOwnProfile={true}
                />

                {/* DIVIDER */}
                <div className="h-[1px] bg-zinc-800 w-full mb-8"></div>

                {/* SECTIONS */}
                <div className="space-y-8">
                    {/* Drafts (If any) */}
                    {drafts && drafts.length > 0 && (
                        <div>
                            <h2 className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                TASLAKLAR
                            </h2>
                            <ContentFeed items={drafts} />
                        </div>
                    )}

                    {/* Articles */}
                    <div>
                        <h2 className="text-white text-sm font-black uppercase tracking-widest mb-4 border-l-4 border-[#3B82F6] pl-3">
                            YAYINLANAN MAKALELER
                        </h2>
                        <ContentFeed items={articles} emptyMsg="Henüz bir makale yayınlanmamış." />
                    </div>

                    {/* Questions */}
                    <div>
                        <h2 className="text-white text-sm font-black uppercase tracking-widest mb-4 border-l-4 border-[#FFC800] pl-3">
                            FORUM TARTIŞMALARI
                        </h2>
                        <ContentFeed items={questions} emptyMsg="Henüz bir soru sorulmamış." />
                    </div>
                </div>
            </div>
        </div>
    );
}
