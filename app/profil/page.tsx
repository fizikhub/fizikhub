import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { getTotalUnreadCount } from "@/app/mesajlar/actions";
import { NeoButton } from "@/components/neo/NeoButton";
import { NeoCard } from "@/components/neo/NeoCard";
import { NeoBadge } from "@/components/neo/NeoBadge";
import {
    Settings, LogOut, Share2, Award, BookOpen, Flame, MapPin,
    Link as LinkIcon, Edit, User as UserIcon, Home, Search,
    FileText, MessageCircle, MoreHorizontal, ArrowRight
} from "lucide-react";
import Link from "next/link";

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
        { data: drafts },
        unreadMessagesCount,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count').eq('author_id', user.id).neq('status', 'draft').order('created_at', { ascending: false }),
        supabase.from('questions').select('id, title, slug, created_at, category, views, answers_count').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('answers').select('id, content, created_at, is_accepted, questions(id, title, slug)').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_badges').select('awarded_at, badges(id, name, description, icon, category)').eq('user_id', user.id).order('awarded_at', { ascending: false }),
        getFollowStats(user.id),
        supabase.from('articles').select('id, title, slug, excerpt, created_at, category, cover_url, status').eq('author_id', user.id).eq('status', 'draft').order('created_at', { ascending: false }),
        getTotalUnreadCount(),
        supabase.from('article_bookmarks').select('created_at, articles(id, title, slug, category)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('question_bookmarks').select('created_at, questions(id, title, slug, category)').eq('user_id', user.id).order('created_at', { ascending: false })
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
        <div className="min-h-screen bg-neo-white text-black font-sans pb-24">

            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-2 border-black bg-white px-4 py-3 shadow-neo-sm">
                <h1 className="font-heading text-xl font-bold tracking-tight uppercase">Profile</h1>
                <Link href="/settings">
                    <NeoButton size="icon" variant="ghost" className="h-10 w-10">
                        <Settings className="h-6 w-6" />
                    </NeoButton>
                </Link>
            </nav>

            <main className="container mx-auto px-4 pt-20">

                {/* Profile Header */}
                <section className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-full border-4 border-black bg-neo-yellow overflow-hidden shadow-neo">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-neo-yellow text-4xl font-bold">
                                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <Link href="/profil/duzenle">
                            <NeoButton size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-black shadow-neo-sm hover:translate-x-0 hover:translate-y-0 active:translate-x-[2px] active:translate-y-[2px]">
                                <Edit className="h-4 w-4" />
                            </NeoButton>
                        </Link>
                    </div>

                    <h2 className="font-heading text-3xl font-black mb-1 uppercase">{profile?.username || "User"}</h2>
                    <p className="text-muted-foreground font-medium mb-4 max-w-xs mx-auto">{profile?.bio || "No bio yet."}</p>

                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {profile?.location && (
                            <NeoBadge variant="outline" className="gap-1 bg-white">
                                <MapPin className="h-3 w-3" /> {profile.location}
                            </NeoBadge>
                        )}
                        {profile?.website && (
                            <NeoBadge variant="outline" className="gap-1 bg-white">
                                <LinkIcon className="h-3 w-3" /> {profile.website.replace(/^https?:\/\//, '')}
                            </NeoBadge>
                        )}
                        <NeoBadge variant="neo-black" className="gap-1">
                            <Award className="h-3 w-3" /> {stats.reputation} Rep
                        </NeoBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                        <NeoButton className="w-full shadow-neo" variant="default">
                            {stats.followersCount} Followers
                        </NeoButton>
                        <NeoButton className="w-full shadow-neo" variant="outline">
                            {stats.followingCount} Following
                        </NeoButton>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 gap-4 mb-8">
                    <NeoCard className="bg-neo-pink text-white border-black p-4 flex flex-col items-center justify-center text-center shadow-neo">
                        <FileText className="h-8 w-8 mb-2 stroke-[2.5]" />
                        <div className="font-heading text-3xl font-black">{stats.articlesCount}</div>
                        <div className="text-xs font-bold opacity-90">ARTICLES</div>
                    </NeoCard>

                    <NeoCard className="bg-neo-cyan text-black border-black p-4 flex flex-col items-center justify-center text-center shadow-neo">
                        <MessageCircle className="h-8 w-8 mb-2 stroke-[2.5]" />
                        <div className="font-heading text-3xl font-black">{stats.questionsCount + stats.answersCount}</div>
                        <div className="text-xs font-bold opacity-90">DISCUSSIONS</div>
                    </NeoCard>
                </section>

                {/* Content Tabs */}
                <section>
                    <div className="flex border-b-2 border-black mb-6">
                        <div className="flex-1 py-3 text-center font-bold border-r-2 border-black bg-neo-yellow cursor-default">
                            LATEST
                        </div>
                        <div className="flex-1 py-3 text-center font-bold bg-white text-muted-foreground hover:bg-gray-50 cursor-pointer">
                            SAVED
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Render Articles */}
                        {articles && articles.map((article: any) => (
                            <NeoCard key={article.id} className="flex flex-col p-0 shadow-neo-sm overflow-hidden">
                                {article.cover_url && (
                                    <div className="h-32 w-full border-b-2 border-black">
                                        <img src={article.cover_url} alt={article.title} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <NeoBadge variant="outline" className="text-[10px] uppercase">{article.category}</NeoBadge>
                                        <span className="text-xs font-bold text-muted-foreground">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg leading-tight mb-2">{article.title}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-bold flex items-center gap-1">
                                            <Flame className="h-3 w-3" /> {article.likes_count || 0}
                                        </span>
                                        <Link href={`/makale/${article.slug}`}>
                                            <NeoButton size="sm" variant="ghost" className="h-8 px-2">
                                                Read <ArrowRight className="ml-1 h-3 w-3" />
                                            </NeoButton>
                                        </Link>
                                    </div>
                                </div>
                            </NeoCard>
                        ))}

                        {(!articles || articles.length === 0) && (
                            <div className="text-center py-10 border-2 border-dashed border-black rounded-lg">
                                <p className="font-bold">No articles yet.</p>
                                <Link href="/makale/yeni">
                                    <NeoButton variant="link" className="mt-2">Write something</NeoButton>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Logout */}
                <div className="mt-8">
                    <form action="/auth/signout" method="post">
                        <NeoButton variant="destructive" className="w-full shadow-neo" type="submit">
                            <LogOut className="mr-2 h-4 w-4" /> Log Out
                        </NeoButton>
                    </form>
                </div>

            </main>

            {/* Floating Dock Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-2 bg-black rounded-xl border-2 border-black shadow-neo-lg scale-90 sm:scale-100">
                    <Link href="/">
                        <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
                            <Home className="h-6 w-6" />
                        </NeoButton>
                    </Link>
                    <Link href="/search">
                        <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
                            <Search className="h-6 w-6" />
                        </NeoButton>
                    </Link>
                    <Link href="/saved">
                        <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
                            <BookOpen className="h-6 w-6" />
                        </NeoButton>
                    </Link>
                    <Link href="/profil">
                        <NeoButton variant="default" size="icon" className="rounded-lg shadow-none border-transparent bg-neo-yellow text-black hover:bg-white">
                            <UserIcon className="h-6 w-6" />
                        </NeoButton>
                    </Link>
                </div>
            </div>

        </div>
    );
}
