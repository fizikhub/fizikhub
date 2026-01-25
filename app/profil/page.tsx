import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, Edit, FileText, Zap, MessageCircle, ShieldCheck } from "lucide-react";

// V27: REFINED PROFILE HEADER

function CompactHeader({ profile, user, stats, isOwnProfile }: any) {
    return (
        <div className="w-full">
            {/* 
                V27 HEADER: CLEANER & ORGANIZED
                - Removed User Level Badge (User Requirement)
                - Added Message Button (User Requirement)
                - Better Alignment
            */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-8 relative">

                {/* 1. IDENTITY BLOCK */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Avatar - Clean, no badges */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 border-[2px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#FFC800] text-3xl font-black text-black">?</div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight">
                            {profile?.full_name || user.email?.split('@')[0]}
                        </h1>
                        <p className="text-zinc-500 font-mono text-xs mt-1">
                            @{profile?.username}
                        </p>

                        {/* Mobile Actions: Edit, Settings, Message */}
                        {isOwnProfile && (
                            <div className="flex gap-2 mt-3 sm:hidden">
                                <Link href="/profil/duzenle" className="bg-zinc-800 border border-zinc-700 p-2 rounded-md text-zinc-400 hover:text-white hover:border-white transition-all">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <Link href="/mesajlar" className="bg-zinc-800 border border-zinc-700 p-2 rounded-md text-[#3B82F6] hover:text-white hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all">
                                    <MessageCircle className="w-4 h-4" />
                                </Link>
                                <Link href="/ayarlar" className="bg-zinc-800 border border-zinc-700 p-2 rounded-md text-zinc-400 hover:text-white hover:border-white transition-all">
                                    <Settings className="w-4 h-4" />
                                </Link>
                                {profile?.username === 'baranbozkurt' && (
                                    <Link href="/admin" className="bg-red-900/20 border border-red-900/50 p-2 rounded-md text-red-500 hover:bg-red-900/40 transition-all">
                                        <ShieldCheck className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. STATS ROW - Simplified & Aligned */}
                <div className="flex gap-8 sm:ml-auto border-t sm:border-t-0 border-zinc-800 pt-4 sm:pt-0 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 items-center">
                    {[
                        { label: "YAZILAR", value: stats.articlesCount },
                        { label: "TAKİPÇİ", value: stats.followersCount },
                        { label: "PUAN", value: stats.reputation },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center sm:items-end">
                            <span className="text-[10px] font-bold text-zinc-500 tracking-wider mb-0.5">{stat.label}</span>
                            <span className="text-2xl font-black text-white leading-none">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Desktop Actions */}
                {isOwnProfile && (
                    <div className="hidden sm:flex gap-2 absolute top-0 right-0">
                        <Link href="/mesajlar" className="bg-zinc-800 hover:bg-[#3B82F6] hover:text-white border border-zinc-700 hover:border-[#3B82F6] p-2 rounded-lg text-zinc-400 transition-all group" title="Mesajlar">
                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link href="/profil/duzenle" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-2 rounded-lg text-zinc-400 hover:text-white transition-all" title="Düzenle">
                            <Edit className="w-5 h-5" />
                        </Link>
                        <Link href="/ayarlar" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-2 rounded-lg text-zinc-400 hover:text-white transition-all" title="Ayarlar">
                            <Settings className="w-5 h-5" />
                        </Link>
                        {/* Admin Link for Baran */}
                        {profile?.username === 'baranbozkurt' && (
                            <Link href="/admin" className="bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 p-2 rounded-lg text-red-500 hover:text-red-400 transition-all" title="Admin Panel">
                                <ShieldCheck className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ContentFeed({ items, emptyMsg }: any) {
    if (!items?.length) return (
        <div className="py-8 text-center border-t border-zinc-800/50">
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
                    <div className="relative bg-[#18181b] border border-black/50 sm:border-black rounded-lg p-4 transition-all hover:bg-[#202024] hover:border-[#3B82F6]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold leading-snug group-hover:text-[#3B82F6] transition-colors truncate">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    {item.category && <span className="text-zinc-400 hidden sm:inline">• {item.category}</span>}
                                    {item.views !== undefined && <span>• {item.views} OKUMA</span>}
                                </div>
                            </div>

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
        <div className="min-h-screen py-8 sm:py-12 pb-32">
            <div className="container max-w-2xl mx-auto px-4">

                {/* V27 HEADER */}
                <CompactHeader
                    profile={profile}
                    user={user}
                    stats={stats}
                    isOwnProfile={true}
                />

                {/* DIVIDER */}
                <div className="h-[1px] bg-zinc-800 w-full mb-8"></div>

                {/* SECTIONS */}
                <div className="space-y-10">
                    {/* Drafts */}
                    {drafts && drafts.length > 0 && (
                        <div>
                            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                TASLAKLAR
                            </h2>
                            <ContentFeed items={drafts} />
                        </div>
                    )}

                    {/* Articles */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-white text-xs font-black uppercase tracking-widest border-l-2 border-[#3B82F6] pl-2">
                                MAKALELER
                            </h2>
                            <span className="text-zinc-600 text-[10px] font-mono">{articles?.length || 0} KAYIT</span>
                        </div>
                        <ContentFeed items={articles} emptyMsg="Henüz bir makale yayınlanmamış." />
                    </div>

                    {/* Questions */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-white text-xs font-black uppercase tracking-widest border-l-2 border-[#FFC800] pl-2">
                                FORUM
                            </h2>
                            <span className="text-zinc-600 text-[10px] font-mono">{questions?.length || 0} KAYIT</span>
                        </div>
                        <ContentFeed items={questions} emptyMsg="Henüz bir soru sorulmamış." />
                    </div>
                </div>
            </div>
        </div>
    );
}
