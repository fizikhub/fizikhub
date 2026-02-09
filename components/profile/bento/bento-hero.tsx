"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Settings, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
}

export function BentoHero({ profile, user, isOwnProfile }: BentoHeroProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="bg-white rounded-3xl border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,0.1)] relative overflow-hidden group hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neo-vibrant-lime/10 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-neo-vibrant-pink/10 rounded-tr-[80px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                    <div className="bg-gradient-to-br from-neo-vibrant-lime to-neo-vibrant-cyan p-1 rounded-full">
                        <Avatar className="w-24 h-24 border-4 border-white">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-3xl font-black bg-white text-black">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    {isOwnProfile && (
                        <button className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white hover:bg-gray-800 transition-colors shadow-sm">
                            <Edit3 className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Name & Handle */}
                <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-1">
                    {profile?.full_name || "New User"}
                </h1>
                <p className="text-sm font-medium text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full">
                    @{profile?.username}
                </p>

                {/* Bio */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
                    {profile?.bio || "No bio yet. Just a mysterious physics enthusiast floating in the digital void."}
                </p>

                {/* Actions */}
                <div className="flex gap-3 w-full justify-center">
                    {isOwnProfile ? (
                        <>
                            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm active:translate-y-0.5">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:border-black transition-colors active:translate-y-0.5">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="flex-1 max-w-[140px] py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm active:translate-y-0.5">
                                Follow
                            </button>
                            <button className="flex-1 max-w-[140px] py-2.5 bg-white border-2 border-gray-200 text-black rounded-xl font-bold text-sm hover:border-black transition-colors active:translate-y-0.5">
                                Message
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
