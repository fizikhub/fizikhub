"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Share2, MapPin, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DMHeaderProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
}

export function DMHeader({ profile, user, isOwnProfile }: DMHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="relative mb-8">
            {/* Background Glow behind Avatar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />

            <div className="flex flex-col items-center relative z-10">
                {/* Avatar with Neon Ring */}
                <div className="relative mb-4 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200 animate-pulse-slow"></div>
                    <div className="relative bg-[#0a0a0a] rounded-full p-1">
                        <Avatar className="w-28 h-28 border border-white/10">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-3xl font-bold bg-[#111] text-white">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {isOwnProfile && (
                        <button className="absolute bottom-1 right-1 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-full hover:bg-white/20 transition-all">
                            <Settings className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Name & Title */}
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 tracking-tight">
                    {profile?.full_name || "New Explorer"}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-cyan-400 font-mono tracking-wide">
                        @{profile?.username}
                    </span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 text-[10px] px-2 py-0.5">
                        PRO
                    </Badge>
                </div>

                {/* Bio (Glass Box) */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm max-w-sm w-full text-center shadow-2xl mb-6">
                    <p className="text-sm text-gray-300 leading-relaxed font-light">
                        {profile?.bio || "Exploring the quantum realm of physics and code."}
                    </p>
                </div>

                {/* Meta Row */}
                <div className="flex gap-4 text-xs text-gray-500 font-medium mb-6">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                            {profile.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        Joined {new Date(user?.created_at).getFullYear()}
                    </div>
                </div>

                {/* Action Buttons (Neon Outline) */}
                <div className="flex gap-3 w-full max-w-sm">
                    {isOwnProfile ? (
                        <button className="flex-1 py-3 rounded-xl border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 hover:border-cyan-500/60 transition-all shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]">
                            Edit Profile
                        </button>
                    ) : (
                        <button className="flex-1 py-3 rounded-xl bg-cyan-600 text-black font-bold text-sm hover:bg-cyan-500 transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
                            Follow
                        </button>
                    )}
                    <button className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
