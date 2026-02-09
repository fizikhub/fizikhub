"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Settings, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function VCHeader({ profile, user, stats, isOwnProfile }: VCHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="relative mb-4">
            {/* 1. Vibrant Gradient Banner (Compact Height) */}
            <div className="h-28 w-full bg-gradient-to-r from-neo-vibrant-pink/90 via-purple-500/90 to-neo-vibrant-cyan/90 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
                {isOwnProfile && (
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Avatar & Info Container */}
            <div className="px-4 flex flex-col items-start relative">
                {/* Avatar Overlap */}
                <div className="-mt-10 mb-3 relative">
                    <div className="rounded-2xl p-1 bg-white shadow-lg">
                        <Avatar className="w-20 h-20 rounded-xl border border-gray-100">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-2xl font-black bg-gray-100 text-gray-900 rounded-xl">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Name & Badge Row */}
                <div className="flex justify-between items-start w-full mb-1">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            {profile?.full_name || "New User"}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">@{profile?.username}</p>
                    </div>
                    {/* Level Badge (Right aligned) */}
                    <Badge variant="outline" className="bg-neo-vibrant-lime/20 text-black border-neo-vibrant-lime font-bold">
                        Lvl {Math.floor((stats.reputation || 0) / 100) + 1}
                    </Badge>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 leading-snug mb-3 max-w-md">
                    {profile?.bio || "Bilim ve fizik tutkunu. FizikHub üyesi."}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium items-center mb-4">
                    {profile?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {profile.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Joined {new Date(user?.created_at).getFullYear()}
                    </div>
                </div>

                {/* Action Buttons */}
                {isOwnProfile ? (
                    <button className="w-full py-2 bg-gray-100 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors text-gray-800 border border-gray-200">
                        Profili Düzenle
                    </button>
                ) : (
                    <div className="flex gap-2 w-full">
                        <button className="flex-1 py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-colors">
                            Takip Et
                        </button>
                        <button className="flex-1 py-2 bg-gray-100 text-black font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                            Mesaj
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
