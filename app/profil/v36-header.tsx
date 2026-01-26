"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, Edit, MessageCircle, ShieldCheck, MapPin, Calendar, Link as LinkIcon } from "lucide-react";

interface V36ProfileHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
    unreadCount?: number;
}

// Generate consistent gradient based on string
const getGradient = (str: string) => {
    const colors = [
        "from-blue-600 to-violet-600",
        "from-emerald-500 to-teal-900",
        "from-orange-500 to-red-900",
        "from-pink-500 to-rose-900",
        "from-indigo-500 to-blue-900",
        "from-yellow-400 to-orange-600"
    ];
    const index = (str?.length || 0) % colors.length;
    return colors[index];
};

export function V36ProfileHeader({ profile, user, stats, isOwnProfile, unreadCount = 0 }: V36ProfileHeaderProps) {
    const coverGradient = getGradient(profile?.username || "user");
    const hasUnread = unreadCount > 0;

    return (
        <div className="w-full mb-8 relative group">

            {/* === MOBILE ID CARD LAYOUT (VISIBLE ONLY ON MOBILE) === */}
            <div className="sm:hidden w-full">
                <div className="relative bg-[#18181b] border-b border-white/10 overflow-hidden">

                    {/* Blue Dotted Header */}
                    <div className="h-32 w-full bg-[#3B82F6] relative overflow-hidden">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)',
                            backgroundSize: '24px 24px'
                        }} />
                        {/* Optional Badge */}
                        <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-white/10 skew-x-[-10deg]">
                            BİLİM PLATFORMU
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="px-5 pb-6 relative">

                        {/* Avatar & Actions Row */}
                        <div className="flex justify-between items-end -mt-12 mb-3">
                            {/* Avatar (Square Rounded, White Border) */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl border-[4px] border-[#18181b] bg-[#18181b] shadow-xl relative z-10 overflow-hidden">
                                    <img
                                        src={profile?.avatar_url || "https://github.com/shadcn.png"}
                                        alt={profile?.username}
                                        className="w-full h-full object-cover rounded-xl bg-zinc-800"
                                    />
                                </div>
                                {/* Online Indicator */}
                                <div className="absolute -bottom-1 -right-1 z-20 w-5 h-5 bg-[#10B981] border-[4px] border-[#18181b] rounded-full"></div>
                            </div>
                        </div>

                        {/* Name & Actions */}
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h1 className="text-2xl font-black text-white leading-tight -ml-0.5 flex items-center gap-1.5">
                                    {profile?.full_name || "İsimsiz"}
                                    {profile?.is_verified && <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-500/20" />}
                                </h1>
                                <p className="text-zinc-400 text-sm font-medium">@{profile?.username}</p>
                                <p className="text-zinc-600 text-[10px] font-medium mt-0.5">
                                    @{profile?.username} · fizikhub.com
                                </p>
                            </div>

                            {/* Action Buttons (Right Aligned) */}
                            {isOwnProfile && (
                                <div className="flex gap-2 shrink-0">
                                    <Link href="/mesajlar" className="w-10 h-10 flex items-center justify-center bg-[#FACC15] text-black rounded-xl shadow-[0_4px_20px_rgba(250,204,21,0.2)] hover:scale-105 transition-transform relative">
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                        {unreadCount > 0 && (
                                            <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#18181b]">
                                                {unreadCount}
                                            </div>
                                        )}
                                    </Link>
                                    <Link href="/profil/duzenle" className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-400 border border-zinc-700/50 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Stats Row (Cleaner) */}
                        <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/5">
                            <div className="text-center">
                                <div className="text-xl font-black text-white">{stats.followersCount}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">TAKİPÇİ</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-white">{stats.articlesCount}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">YAZI</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-white">{stats.reputation}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">PUAN</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* === DESKTOP LAYOUT (HIDDEN ON MOBILE) === */}
            <div className="hidden sm:block">
                {/* 1. COVER PHOTO */}
                <div className={cn(
                    "h-64 w-full rounded-3xl relative overflow-hidden",
                    "bg-gradient-to-br", coverGradient
                )}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                    {/* Desktop Stats */}
                    <div className="flex absolute top-6 right-6 gap-6 bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
                        <div className="text-center">
                            <div className="text-xl font-black text-white">{stats.followersCount}</div>
                            <div className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">Takipçi</div>
                        </div>
                        <div className="w-[1px] bg-white/20 h-full" />
                        <div className="text-center">
                            <div className="text-xl font-black text-white">{stats.articlesCount}</div>
                            <div className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">Yazı</div>
                        </div>
                        <div className="w-[1px] bg-white/20 h-full" />
                        <div className="text-center">
                            <div className="text-xl font-black text-white">{stats.reputation}</div>
                            <div className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">Puan</div>
                        </div>
                    </div>
                </div>

                {/* 2. PROFILE INFO */}
                <div className="px-10 relative -mt-20 flex items-end gap-6">

                    {/* Avatar */}
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-3xl bg-black p-1.5 shadow-2xl">
                            <img
                                src={profile?.avatar_url || "https://github.com/shadcn.png"}
                                alt={profile?.username}
                                className="w-full h-full object-cover rounded-2xl bg-zinc-800"
                            />
                        </div>
                        {/* Online Status */}
                        <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-[3px] border-black rounded-full" />
                    </div>

                    {/* Identity */}
                    <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-2">
                                    {profile?.full_name || "İsimsiz Bilimci"}
                                    {profile?.is_verified && <ShieldCheck className="w-6 h-6 text-blue-500" />}
                                </h1>
                                <p className="text-zinc-400 font-medium text-lg">@{profile?.username}</p>
                            </div>
                        </div>

                        {/* Bio / Metadata */}
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500 font-medium">
                            {profile?.bio && <p className="w-full text-zinc-300 mb-2 leading-relaxed">{profile.bio}</p>}
                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{new Date(user.created_at).getFullYear()}</span></div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /><span>Dünya</span></div>
                        </div>
                    </div>

                    {/* Desktop Actions Row */}
                    <div className="flex gap-3 pb-2 w-auto">
                        {isOwnProfile ? (
                            <>
                                {/* Message Button for Owner (Desktop) */}
                                <Link
                                    href="/mesajlar"
                                    className={cn(
                                        "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all border",
                                        hasUnread
                                            ? "bg-[#FFC800] text-black border-[#FFC800] animate-pulse shadow-[0_0_20px_rgba(255,200,0,0.3)]"
                                            : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white"
                                    )}
                                >
                                    <MessageCircle className={cn("w-5 h-5", hasUnread && "fill-black")} />
                                    {hasUnread && <span className="text-xs bg-black text-[#FFC800] px-1.5 py-0.5 rounded-full font-black">{unreadCount}</span>}
                                </Link>

                                <Link href="/profil/duzenle" className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                                    <Edit className="w-4 h-4" />
                                    <span>Düzenle</span>
                                </Link>
                                <Link href="/ayarlar" className="flex items-center justify-center bg-zinc-900 border border-zinc-700 w-12 rounded-xl text-zinc-400 hover:text-white hover:border-white transition-all">
                                    <Settings className="w-5 h-5" />
                                </Link>
                                {profile?.username === 'baranbozkurt' && (
                                    <Link href="/admin" className="flex items-center justify-center bg-red-500/10 border border-red-500/50 w-12 rounded-xl text-red-500 hover:bg-red-500/20 transition-all">
                                        <ShieldCheck className="w-5 h-5" />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <button className="flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                                <MessageCircle className="w-4 h-4" />
                                <span>Mesaj Gönder</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
