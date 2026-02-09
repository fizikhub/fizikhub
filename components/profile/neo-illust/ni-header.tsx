"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Share2, Plus } from "lucide-react";

interface NIHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function NIHeader({ profile, user, stats, isOwnProfile }: NIHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="mb-4">
            {/* Illustrated Header Banner */}
            <div className="relative h-32 bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 rounded-t-3xl overflow-hidden">
                {/* Decorative Elements - Doodles/Illustrations */}
                <div className="absolute inset-0 opacity-80">
                    {/* Stars */}
                    <div className="absolute top-4 left-6 text-yellow-300 text-2xl">✦</div>
                    <div className="absolute top-8 right-12 text-pink-400 text-xl">✦</div>
                    <div className="absolute bottom-6 left-16 text-cyan-300 text-lg">✦</div>
                    <div className="absolute top-12 left-1/3 text-lime-400 text-sm">✧</div>

                    {/* Shapes */}
                    <div className="absolute top-4 right-8 w-6 h-6 border-2 border-yellow-400 rotate-12"></div>
                    <div className="absolute bottom-4 right-20 w-4 h-4 bg-pink-500 rounded-full"></div>
                    <div className="absolute top-6 left-1/4 text-orange-400 font-black text-xs rotate-6">EXHIBIT</div>

                    {/* Decorative lines */}
                    <div className="absolute bottom-8 left-8 w-8 h-1 bg-lime-400 rounded-full"></div>
                    <div className="absolute top-16 right-6 w-6 h-1 bg-cyan-400 rounded-full rotate-45"></div>

                    {/* Illustrated Character placeholder */}
                    <div className="absolute bottom-0 right-4 text-3xl">🦋</div>
                    <div className="absolute top-2 left-10 text-2xl">🚀</div>
                    <div className="absolute bottom-2 left-1/2 text-xl">✨</div>
                </div>

                {/* Avatar - Overlapping */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white p-1 rounded-2xl border-2 border-black shadow-[3px_3px_0_#000]">
                        <Avatar className="w-20 h-20 rounded-xl">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-2xl font-black bg-neo-vibrant-yellow text-black rounded-xl">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    {/* Badge under avatar */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Badge className="bg-neo-vibrant-cyan text-black border-2 border-black text-[10px] font-bold px-2 py-0.5 shadow-[2px_2px_0_#000]">
                            Pro
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Content Area - Cream/Beige */}
            <div className="bg-[#FFF8E7] border-2 border-t-0 border-black rounded-b-3xl pt-14 pb-4 px-4">
                {/* Name & Handle */}
                <div className="text-center mb-3">
                    <h1 className="text-xl font-black text-black">
                        {profile?.full_name || "New User"}
                    </h1>
                    <p className="text-sm text-gray-600 font-medium">
                        @{profile?.username}
                    </p>
                </div>

                {/* Bio */}
                <p className="text-xs text-gray-700 text-center leading-relaxed mb-4 max-w-xs mx-auto">
                    {profile?.bio || "Fizik tutkunu. FizikHub üyesi. 🔬"}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <StatBox value={stats.articlesCount + stats.questionsCount} label="posts" />
                    <StatBox value={stats.followersCount} label="followers" />
                    <StatBox value={stats.followingCount} label="following" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {isOwnProfile ? (
                        <button className="flex-1 py-2.5 bg-white border-2 border-black rounded-full font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
                            <Settings className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <button className="flex-1 py-2.5 bg-white border-2 border-black rounded-full font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
                            <span>Get Inspired</span>
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                    <button className="flex-1 py-2.5 bg-white border-2 border-black rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatBox({ value, label }: { value: number, label: string }) {
    return (
        <div className="bg-white border-2 border-black rounded-xl py-2 px-3 text-center shadow-[2px_2px_0_#000]">
            <div className="text-lg font-black text-black">{value.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 font-medium">{label}</div>
        </div>
    );
}
