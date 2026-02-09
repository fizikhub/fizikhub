"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, PenTool } from "lucide-react";

interface FunkyHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function FunkyHeader({ profile, user, stats, isOwnProfile }: FunkyHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="relative mb-12">
            {/* Graffiti Banner */}
            <div className="h-48 w-full bg-[#1A1A2E] relative overflow-hidden rounded-b-[3rem] border-b-4 border-black">
                {/* Abstract Graffiti Elements */}
                <div className="absolute top-4 left-4 text-funky-lime opacity-80 pointer-events-none">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                        <path d="M20 20 L80 80 M80 20 L20 80" />
                    </svg>
                </div>
                <div className="absolute bottom-8 right-12 text-pink-500 opacity-90 pointer-events-none rotate-12">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
                        <circle cx="50" cy="50" r="30" />
                        <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute top-10 right-1/4 text-yellow-400 opacity-70 pointer-events-none">
                    <svg width="50" height="50" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                    </svg>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[-20px] right-[-20px] w-60 h-60 bg-blue-600 rounded-full blur-3xl opacity-40" />
            </div>

            {/* Avatar - Centered & Overlapping */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2rem] border-[6px] border-funky-lime bg-white overflow-hidden shadow-[0_8px_0_rgba(0,0,0,1)] rotate-[-3deg] hover:rotate-0 transition-transform duration-300 z-10">
                        <Avatar className="w-full h-full rounded-none">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-4xl font-black bg-black text-white rounded-none">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-3 -right-3 z-20 bg-blue-500 text-white border-4 border-white px-3 py-1 rounded-full text-sm font-black shadow-md rotate-[6deg]">
                        Lvl {Math.floor((stats.reputation || 0) / 100) + 1}
                    </div>
                </div>
            </div>

            {/* Action Buttons (Absolute Top) */}
            {isOwnProfile && (
                <div className="absolute top-4 right-4 flex gap-3">
                    <button className="p-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <Settings className="w-5 h-5 text-black" />
                    </button>
                    <button className="p-2 bg-funky-lime border-2 border-black rounded-lg shadow-[4px_4px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <PenTool className="w-5 h-5 text-black" />
                    </button>
                </div>
            )}
        </div>
    );
}
