import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, Edit, FileText, Bookmark, Medal, Zap } from "lucide-react";

// Inline Components for V23 Design to ensure "Fresh Start"

function ScientistIDCard({ profile, user, stats, badges, isOwnProfile }: any) {
    return (
        <div className="relative group perspective-1000 w-full max-w-2xl mx-auto">
            {/* 
                V23 ID CARD: "PHYSICS LAB ACCESS PASS"
                - Style: Industrial / Technical
                - Base: White with Blue Header
                - Border: Thick Black
            */}
            <div className={cn(
                "relative overflow-hidden",
                "bg-white border-[3px] border-black",
                "shadow-[8px_8px_0px_0px_#000]",
                "flex flex-col md:flex-row"
            )}>
                {/* LEFT: PHOTO & BASIC INFO */}
                <div className="w-full md:w-1/3 bg-[#3B82F6] p-6 flex flex-col items-center justify-center border-b-[3px] md:border-b-0 md:border-r-[3px] border-black relative">
                    {/* "Hole Punch" for lanyard */}
                    <div className="absolute top-4 w-4 h-4 rounded-full bg-[#111] border-2 border-white/20" />

                    {/* Avatar Container */}
                    <div className="relative mt-4">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-[3px] border-black overflow-hidden relative shadow-[4px_4px_0px_0px_#000]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-4xl font-black text-black/20">?</div>
                            )}
                        </div>
                        {/* Security Level Badge */}
                        <div className="absolute -bottom-3 -right-3 rotate-[-5deg]">
                            <span className="bg-[#FFC800] border-[2px] border-black px-2 py-0.5 text-xs font-black uppercase text-black shadow-sm">
                                LVL {Math.floor(stats.reputation / 100) + 1}
                            </span>
                        </div>
                    </div>

                    <h1 className="mt-6 text-xl font-black text-white uppercase text-center leading-tight drop-shadow-md">
                        {profile?.full_name || user.email?.split('@')[0]}
                    </h1>
                    <p className="text-blue-100 font-mono text-xs mt-1 bg-blue-700/50 px-2 py-0.5 rounded">
                        @{profile?.username}
                    </p>

                    {isOwnProfile && (
                        <div className="flex gap-2 mt-6 w-full">
                            <Link href="/profil/duzenle" className="flex-1 bg-white border-[2px] border-black p-2 flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none">
                                <Edit className="w-4 h-4" />
                            </Link>
                            <Link href="/ayarlar" className="flex-1 bg-white border-[2px] border-black p-2 flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none">
                                <Settings className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* RIGHT: STATS & DETAILS */}
                <div className="w-full md:w-2/3 p-6 flex flex-col bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">CLEARANCE</h3>
                            <div className="text-2xl font-black text-black">SCIENTIST CLASS A</div>
                        </div>
                        <Zap className="w-8 h-8 text-[#FFC800] fill-black stroke-black stroke-[1.5px]" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {[
                            { label: "REP", value: stats.reputation },
                            { label: "ARTICLES", value: stats.articlesCount },
                            { label: "FOLLOWERS", value: stats.followersCount },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white border-[2px] border-black p-2 shadow-[3px_3px_0px_0px_#ddd] group-hover:shadow-[3px_3px_0px_0px_#FFC800] transition-shadow">
                                <div className="text-[10px] font-bold text-zinc-500">{stat.label}</div>
                                <div className="text-lg font-black text-black leading-none mt-0.5">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <div className="text-[10px] font-mono text-zinc-400 border-t border-black/10 pt-2 flex justify-between">
                            <span>ID: {user.id.slice(0, 8).toUpperCase()}</span>
                            <span>VALID: 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResearchLog({ title, items, icon: Icon, emptyMsg, type }: any) {
    if (!items?.length) return null;
    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="flex items-center gap-2 mb-3 px-2">
                <div className="bg-black text-white p-1.5 rounded-md">
                    <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-black text-lg uppercase tracking-tight">{title}</h2>
                <div className="flex-1 h-[2px] bg-black/10 ml-2" />
            </div>

            <div className="space-y-3">
                {items.map((item: any) => (
                    <Link
                        href={type === 'article' ? `/makale/${item.slug}` : type === 'question' ? `/forum/${item.id}` : '#'}
                        key={item.id}
                        className="block group"
                    >
                        <div className="bg-white border-[2px] border-black p-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#3B82F6] transition-all flex items-start gap-3">
                            {/* Category Chip */}
                            {item.category && (
                                <div className="flex-shrink-0 mt-0.5">
                                    <span className="bg-[#FFC800] border border-black text-[10px] font-bold px-1.5 py-0.5 uppercase">
                                        {item.category.slice(0, 3)}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm sm:text-base leading-tight truncate group-hover:text-blue-600">
                                    {item.title || item.content?.slice(0, 50)}
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-zinc-500">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    {item.views !== undefined && <span>• {item.views} VIEW</span>}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Parallel Data Fetching (Preserved logic)
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
        <div className="min-h-screen bg-zinc-50 py-12 pb-32">
            <div className="container px-4 mx-auto">
                <ScientistIDCard
                    profile={profile}
                    user={user}
                    stats={stats}
                    isOwnProfile={true}
                />

                <div className="flex flex-col gap-2 mt-12 mb-8 items-center">
                    <div className="w-1 h-12 bg-black/10 mb-2"></div>
                    <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">Lab Activity Log</div>
                </div>

                {drafts && drafts.length > 0 && (
                    <div className="mb-12 opacity-80 hover:opacity-100 transition-opacity">
                        <ResearchLog title="Drafts (Private)" items={drafts} icon={FileText} type="article" />
                    </div>
                )}

                <ResearchLog title="Published Research" items={articles} icon={FileText} type="article" />
                <div className="h-8" />
                <ResearchLog title="Forum Queries" items={questions} icon={Zap} type="question" />
                <div className="h-8" />

                {(!articles?.length && !questions?.length) && (
                    <div className="text-center py-12 opacity-50 font-mono">
                        NO ACTIVITY DETECTED. START RESEARCHING.
                    </div>
                )}
            </div>
        </div>
    );
}
