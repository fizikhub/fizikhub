"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, Edit, MessageCircle, ShieldCheck, MapPin, Calendar, Link as LinkIcon } from "lucide-react";

interface V36ProfileHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
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

export function V36ProfileHeader({ profile, user, stats, isOwnProfile }: V36ProfileHeaderProps) {
    const coverGradient = getGradient(profile?.username || "user");

    return (
        <div className="w-full mb-8 relative group">

            {/* 1. COVER PHOTO (Generative / Default) */}
            <div className={cn(
                "h-48 sm:h-64 w-full rounded-b-3xl sm:rounded-3xl relative overflow-hidden",
                "bg-gradient-to-br", coverGradient
            )}>
                <div className="absolute inset-0 bg-black/20" />
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                {/* Floating Stats (Desktop) */}
                <div className="hidden sm:flex absolute top-6 right-6 gap-6 bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
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

            {/* 2. PROFILE INFO (Overlapping) */}
            <div className="px-4 sm:px-10 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-end sm:items-end gap-6">

                {/* Avatar */}
                <div className="relative group/avatar">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-black p-1.5 shadow-2xl">
                        <img
                            src={profile?.avatar_url || "https://github.com/shadcn.png"}
                            alt={profile?.username}
                            className="w-full h-full object-cover rounded-2xl bg-zinc-800"
                        />
                    </div>
                    {/* Online Status (Mock) */}
                    <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-[3px] border-black rounded-full" />
                </div>

                {/* Identity & Bio */}
                <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                {profile?.full_name || "İsimsiz Bilimci"}
                                {profile?.is_verified && <ShieldCheck className="w-6 h-6 text-blue-500" />}
                            </h1>
                            <p className="text-zinc-400 font-medium text-base sm:text-lg">@{profile?.username}</p>
                        </div>

                        {/* Mobile Actions (Right aligned) */}
                        <div className="sm:hidden flex gap-2">
                            {/* Mobile Edit/Settings handled below or here? */}
                        </div>
                    </div>

                    {/* Bio / Metadata */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500 font-medium">
                        {profile?.bio && <p className="w-full text-zinc-300 mb-2 leading-relaxed">{profile.bio}</p>}

                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Katılım: {new Date(user.created_at).getFullYear()}</span>
                        </div>
                        {/* Mock Location if we had it */}
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>Dünya</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Actions Row */}
                <div className="flex gap-3 pb-2 w-full sm:w-auto mt-4 sm:mt-0">
                    {isOwnProfile ? (
                        <>
                            <Link href="/profil/duzenle" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
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
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                            <MessageCircle className="w-4 h-4" />
                            <span>Mesaj Gönder</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Stats Row (Below everything) */}
            <div className="flex sm:hidden justify-around mt-8 border-t border-b border-white/5 py-4 bg-black/20">
                <div className="text-center">
                    <div className="text-lg font-black text-white">{stats.followersCount}</div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-wider">TAKİPÇİ</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-black text-white">{stats.articlesCount}</div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-wider">YAZI</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-black text-white">{stats.reputation}</div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-wider">PUAN</div>
                </div>
            </div>
        </div>
    );
}
