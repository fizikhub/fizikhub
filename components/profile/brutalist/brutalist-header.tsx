"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BrutalistHeaderProps {
    profile: any;
    stats: any;
    isOwnProfile: boolean;
}

export function BrutalistHeader({ profile, stats, isOwnProfile }: BrutalistHeaderProps) {
    const initial = profile?.full_name?.[0]?.toUpperCase() || "U";

    return (
        <div className="w-full">
            {/* ILLUSTRATED HERO BANNER - Like the reference image */}
            <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-[2rem] border-[3px] border-b-0 border-black">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900" />

                {/* Illustrated Elements - Doodles */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Stars */}
                    <span className="absolute top-6 left-8 text-yellow-400 text-3xl animate-pulse">✦</span>
                    <span className="absolute top-12 right-16 text-pink-400 text-2xl">✦</span>
                    <span className="absolute bottom-8 left-20 text-cyan-400 text-xl">✧</span>
                    <span className="absolute top-8 left-1/3 text-lime-400 text-sm">✧</span>
                    <span className="absolute bottom-12 right-1/3 text-yellow-300 text-lg">★</span>

                    {/* Shapes */}
                    <div className="absolute top-6 right-10 w-8 h-8 border-[3px] border-yellow-400 rotate-12" />
                    <div className="absolute bottom-10 right-24 w-5 h-5 bg-pink-500 rounded-full" />
                    <div className="absolute top-16 left-12 w-4 h-4 bg-lime-500 rotate-45" />

                    {/* Text decorations */}
                    <span className="absolute top-4 right-6 text-white/30 font-black text-xs tracking-widest rotate-6">EXHIBIT</span>

                    {/* Illustrated Creatures */}
                    <span className="absolute bottom-2 right-6 text-4xl opacity-80">🦋</span>
                    <span className="absolute top-4 left-16 text-3xl opacity-70">🚀</span>
                    <span className="absolute bottom-6 left-1/2 text-2xl">✨</span>

                    {/* Decorative lines */}
                    <div className="absolute bottom-14 left-6 w-10 h-1.5 bg-lime-400 rounded-full" />
                    <div className="absolute top-20 right-8 w-8 h-1.5 bg-cyan-400 rounded-full rotate-45" />

                    {/* Triangle */}
                    <div className="absolute bottom-4 left-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-yellow-400 rotate-12" />

                    {/* Crosses */}
                    <span className="absolute top-10 right-1/4 text-pink-500 font-black text-xl">✕</span>
                    <span className="absolute bottom-16 left-1/4 text-pink-400 font-black text-lg">✕</span>
                </div>
            </div>

            {/* CONTENT CARD - Cream/Beige background */}
            <div className="relative bg-[#FFF8E7] border-[3px] border-black rounded-b-[2rem] pt-16 pb-6 px-5 -mt-px">

                {/* FLOATING AVATAR */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div className="w-28 h-28 bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0_#000] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Badge under avatar */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-[#22c55e] hover:bg-[#22c55e] text-white border-[2px] border-black text-[10px] font-black px-3 py-1 shadow-[2px_2px_0_#000] rounded-full">
                                Pro
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* NAME & HANDLE */}
                <div className="text-center mb-4 mt-2">
                    <h1 className="text-2xl font-black text-black tracking-tight">
                        {profile?.full_name || "New User"}
                    </h1>
                    <p className="text-sm text-gray-500 font-semibold">
                        @{profile?.username || "username"}
                    </p>
                </div>

                {/* BIO */}
                <p className="text-sm text-gray-600 text-center leading-relaxed mb-5 max-w-xs mx-auto">
                    {profile?.bio || "Fizik tutkunu. FizikHub üyesi. Evrenin sırlarını keşfetmeye çalışıyorum. 🔬"}
                </p>

                {/* STATS ROW - 3 columns with borders */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <StatCard value={stats.articlesCount + stats.questionsCount} label="posts" />
                    <StatCard value={stats.followersCount} label="followers" />
                    <StatCard value={stats.followingCount} label="following" />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-white border-[3px] border-black rounded-full font-black text-sm text-black hover:bg-gray-50 transition-all shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] flex items-center justify-center gap-2">
                        <span>{isOwnProfile ? "Edit Profile" : "Get Inspired"}</span>
                        {!isOwnProfile && <span className="text-lg">+</span>}
                    </button>
                    <button className="flex-1 py-3 bg-white border-[3px] border-black rounded-full font-black text-sm text-black hover:bg-gray-50 transition-all shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]">
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label }: { value: number; label: string }) {
    return (
        <div className="bg-white border-[3px] border-black rounded-xl py-3 text-center shadow-[3px_3px_0_#000]">
            <div className="text-xl font-black text-black">{value.toLocaleString()}</div>
            <div className="text-[11px] text-gray-500 font-semibold">{label}</div>
        </div>
    );
}
