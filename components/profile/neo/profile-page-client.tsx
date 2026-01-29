"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { QuestionCard } from "@/components/forum/question-card";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import {
    Calendar,
    Link as LinkIcon,
    CheckCircle2,
    Share2,
    Mail,
    FileText,
    MessageCircle,
    HelpCircle,
    Bookmark
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface ProfilePageClientProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges?: any[];
    articles: any[];
    questions: any[];
    answers: any[];
    drafts?: any[];
    bookmarkedArticles?: any[];
    bookmarkedQuestions?: any[];
    unreadCount?: number;
}

type TabType = 'posts' | 'replies' | 'saved';

// ============================================
// MAIN COMPONENT
// ============================================
export function ProfilePageClient({
    profile,
    user,
    isOwnProfile,
    isFollowing = false,
    stats,
    userBadges = [],
    articles = [],
    questions = [],
    answers = [],
    drafts = [],
    bookmarkedArticles = [],
    bookmarkedQuestions = [],
    unreadCount = 0
}: ProfilePageClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    // Combine posts
    const posts = [
        ...articles.map(a => ({ ...a, itemType: 'article' as const })),
        ...questions.map(q => ({ ...q, itemType: 'question' as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('tr-TR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

    return (
        <div className="min-h-screen bg-background">
            {/* ========== HEADER ========== */}
            <header className="relative border-b-[3px] border-black bg-neutral-900">
                {/* Cover Gradient */}
                <div className="h-32 sm:h-40 bg-gradient-to-br from-purple-900/50 via-black to-cyan-900/30" />

                <div className="container max-w-4xl mx-auto px-4 pb-6">
                    {/* Avatar + Info Row */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-black border-[4px] border-[#FFC800] shadow-[6px_6px_0px_#000] overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-4xl font-black text-neutral-500">
                                        {profile?.full_name?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                            {profile?.is_verified && (
                                <div className="absolute -bottom-1 -right-1 bg-[#FFC800] text-black p-1.5 border-[2px] border-black">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Name & Username */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-black text-white">
                                {profile?.full_name || "İsimsiz Kullanıcı"}
                            </h1>
                            <p className="text-neutral-400 font-mono">@{profile?.username}</p>

                            {/* Join Date */}
                            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-neutral-500">
                                <Calendar className="w-3 h-3" />
                                <span>Katıldı: {format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {isOwnProfile ? (
                                <>
                                    <Link
                                        href="/mesajlar"
                                        className="p-2.5 bg-black border-[2px] border-neutral-700 text-white hover:border-[#FFC800] transition-colors relative"
                                    >
                                        <Mail className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-bold flex items-center justify-center border border-black">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                    <ProfileSettingsDialog
                                        currentUsername={profile?.username}
                                        currentFullName={profile?.full_name}
                                        currentBio={profile?.bio}
                                        currentAvatarUrl={profile?.avatar_url}
                                        currentCoverUrl={profile?.cover_url}
                                        currentWebsite={profile?.website}
                                        currentSocialLinks={profile?.social_links}
                                        userEmail={user?.email}
                                        trigger={
                                            <button className="px-4 py-2 bg-[#FFC800] text-black font-bold border-[2px] border-black hover:bg-yellow-400 transition-colors shadow-[3px_3px_0px_#000]">
                                                Düzenle
                                            </button>
                                        }
                                    />
                                </>
                            ) : (
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                    variant="modern"
                                />
                            )}
                            <button
                                onClick={() => navigator.clipboard.writeText(window.location.href)}
                                className="p-2.5 bg-black border-[2px] border-neutral-700 text-white hover:border-cyan-500 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p className="mt-4 text-neutral-300 text-sm max-w-xl leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-6">
                        {[
                            { label: "Puan", value: stats.reputation, icon: "⚡" },
                            { label: "Takipçi", value: stats.followersCount, icon: "👥" },
                            { label: "Takip", value: stats.followingCount, icon: "➡️" },
                            { label: "Makale", value: stats.articlesCount, icon: "📝" },
                            { label: "Soru", value: stats.questionsCount, icon: "❓" },
                            { label: "Cevap", value: stats.answersCount, icon: "💬" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center p-3 bg-black/50 border border-neutral-800 hover:border-[#FFC800]/50 transition-colors"
                            >
                                <span className="text-lg sm:text-xl font-black text-white">{formatNumber(stat.value)}</span>
                                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ========== TABS ========== */}
            <nav className="sticky top-0 z-40 bg-background border-b-[3px] border-black">
                <div className="container max-w-4xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto no-scrollbar">
                    <TabButton icon={<FileText className="w-4 h-4" />} label="Gönderiler" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
                    <TabButton icon={<MessageCircle className="w-4 h-4" />} label="Yanıtlar" isActive={activeTab === 'replies'} onClick={() => setActiveTab('replies')} />
                    <TabButton icon={<Bookmark className="w-4 h-4" />} label="Kaydedilenler" isActive={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
                </div>
            </nav>

            {/* ========== FEED ========== */}
            <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
                {activeTab === 'posts' && (
                    posts.length > 0 ? (
                        posts.map((item) => (
                            <div key={item.id}>
                                {item.itemType === 'article' ? (
                                    <NeoArticleCard article={item} />
                                ) : (
                                    <QuestionCard question={item} />
                                )}
                            </div>
                        ))
                    ) : (
                        <EmptyState icon={<FileText />} text="Henüz bir gönderi yok." />
                    )
                )}

                {activeTab === 'replies' && (
                    answers.length > 0 ? (
                        answers.map((answer) => (
                            <div key={answer.id} className="p-4 bg-neutral-900 border-[2px] border-neutral-800 hover:border-[#FFC800]/50 transition-colors">
                                <Link href={`/forum/${answer.questions?.slug}`} className="text-[#FFC800] text-sm font-bold hover:underline">
                                    {answer.questions?.title}
                                </Link>
                                <p className="mt-2 text-neutral-300 text-sm line-clamp-3">{answer.content}</p>
                            </div>
                        ))
                    ) : (
                        <EmptyState icon={<MessageCircle />} text="Henüz bir yanıt yok." />
                    )
                )}

                {activeTab === 'saved' && (
                    (bookmarkedArticles.length > 0 || bookmarkedQuestions.length > 0) ? (
                        <>
                            {bookmarkedArticles.map((bm: any) => (
                                <NeoArticleCard key={bm.articles?.id} article={bm.articles} />
                            ))}
                            {bookmarkedQuestions.map((bm: any) => (
                                <QuestionCard key={bm.questions?.id} question={bm.questions} />
                            ))}
                        </>
                    ) : (
                        <EmptyState icon={<Bookmark />} text="Kaydedilen içerik yok." />
                    )
                )}
            </main>
        </div>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================
function TabButton({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-bold text-sm transition-all border-[2px]",
                isActive
                    ? "bg-[#FFC800] text-black border-black shadow-[3px_3px_0px_#000]"
                    : "bg-transparent text-neutral-400 border-transparent hover:text-white hover:border-neutral-700"
            )}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="py-16 flex flex-col items-center justify-center text-center text-neutral-500 gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 text-neutral-600">
                {icon}
            </div>
            <p className="font-medium">{text}</p>
        </div>
    );
}
