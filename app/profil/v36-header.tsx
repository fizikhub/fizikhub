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
    return (
        <div className="w-full mb-8 relative group">

            {/* === MOBILE ID CARD LAYOUT (VISIBLE ONLY ON MOBILE) === */}
            <div className="sm:hidden w-full">
                <div className="relative bg-[#F4F4F5] dark:bg-[#18181b] border-[3px] border-black rounded-[0px] shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
                    {/* Hole Punch Visual */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/10 rounded-full blur-[1px] z-20 pointer-events-none"></div>
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#09090b] rounded-full z-20 border border-zinc-700"></div>

                    {/* Header Strip */}
                    <div className={cn("h-16 w-full border-b-[3px] border-black flex items-center justify-center bg-gradient-to-r", coverGradient)}>
                        <span className="bg-black/80 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                            FIZIKHUB KIMLIK
                        </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex flex-col items-center relative">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full border-[3px] border-black -mt-14 z-10 bg-white dark:bg-zinc-900 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                            <img
                                src={profile?.avatar_url || "https://github.com/shadcn.png"}
                                alt={profile?.username}
                                className="w-full h-full object-cover rounded-full p-1"
                            />
                        </div>

                        {/* Identity */}
                        <div className="text-center mt-3 mb-6">
                            <h1 className="text-2xl font-black text-black dark:text-white leading-none uppercase tracking-tighter flex items-center justify-center gap-1">
                                {profile?.full_name || "İsimsiz"}
                                {profile?.is_verified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                            </h1>
                            <p className="text-zinc-500 font-mono text-xs mt-1">@{profile?.username}</p>
                            {profile?.bio && (
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 max-w-[200px] mx-auto leading-relaxed border-t border-dashed border-zinc-700/50 pt-2">
                                    {profile.bio}
                                </p>
                            )}
                        </div>

                        {/* Barcode / Stats */}
                        <div className="w-full grid grid-cols-3 gap-2 border-t-[3px] border-dashed border-black/20 pt-4 mt-2">
                            <div className="text-center">
                                <div className="text-lg font-black text-black dark:text-white">{stats.followersCount}</div>
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">TAKİP</div>
                            </div>
                            <div className="text-center border-x border-dashed border-black/20">
                                <div className="text-lg font-black text-black dark:text-white">{stats.articlesCount}</div>
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">YAZI</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-black text-black dark:text-white">{stats.reputation}</div>
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">PUAN</div>
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwnProfile && (
                            <div className="flex gap-3 mt-6 w-full">
                                <Link href="/profil/duzenle" className="flex-1 bg-white border-2 border-black text-black text-xs font-bold py-2 rounded-lg text-center shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all">
                                    DÜZENLE
                                </Link>
                                <Link href="/mesajlar" className="flex-1 bg-black border-2 border-black text-white text-xs font-bold py-2 rounded-lg text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none transition-all relative">
                                    MESAJLAR
                                    {unreadCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFC800] text-black rounded-full flex items-center justify-center text-[10px] border-2 border-black">{unreadCount}</span>}
                                </Link>
                            </div>
                        )}
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
