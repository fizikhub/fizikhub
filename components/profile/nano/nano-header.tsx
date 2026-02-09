"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Edit3, MapPin, Link as LinkIcon, Calendar } from "lucide-react";

interface NanoHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function NanoHeader({ profile, user, stats, isOwnProfile }: NanoHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="bg-white border-b-2 border-black p-3 flex gap-3 items-start">
            {/* Left: Avatar & Level */}
            <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 border-2 border-black bg-gray-200">
                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={profile?.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-xl font-black bg-neo-vibrant-lime text-black rounded-none">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <Badge className="bg-black text-white text-[10px] px-1 py-0 h-4 rounded-none border border-black hover:bg-black">
                    LVL {Math.floor((stats.reputation || 0) / 100) + 1}
                </Badge>
            </div>

            {/* Right: Info & Dense Stats */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2">

                {/* Top Row: Name & Handle & Actions */}
                <div className="flex justify-between items-start leading-none">
                    <div>
                        <h1 className="text-sm font-black uppercase truncate">{profile?.full_name || "Anonymous"}</h1>
                        <p className="text-[10px] font-mono text-gray-500">@{profile?.username}</p>
                    </div>
                    {isOwnProfile && (
                        <div className="flex gap-1">
                            <button className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
                                <Edit3 className="w-3 h-3" />
                            </button>
                            <button className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
                                <Settings className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Bio (Truncated tightly) */}
                <p className="text-[10px] leading-tight line-clamp-2 text-gray-700">
                    {profile?.bio || "No bio set."}
                </p>

                {/* Meta Row */}
                <div className="flex flex-wrap gap-2 text-[9px] font-mono text-gray-500 items-center">
                    {profile?.location && (
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{profile.location}</span>
                    )}
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{new Date(user?.created_at).getFullYear()}</span>
                </div>

                {/* Stats Row (Inline) */}
                <div className="flex gap-4 border-t border-black/10 pt-1 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black leading-none">{stats.followersCount}</span>
                        <span className="text-[8px] uppercase text-gray-400 leading-none">Takipçi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black leading-none">{stats.followingCount}</span>
                        <span className="text-[8px] uppercase text-gray-400 leading-none">Takip</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black leading-none text-neo-vibrant-pink">{stats.reputation}</span>
                        <span className="text-[8px] uppercase text-gray-400 leading-none">Puan</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
