"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreshHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function FreshHeader({ profile, user, stats, isOwnProfile }: FreshHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="relative mb-6">
            {/* Illustrated Background Elements */}
            <div className="absolute top-0 right-0 -z-10 opacity-30 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="50" className="fill-neo-vibrant-yellow animate-pulse" />
                    <rect x="150" y="20" width="30" height="30" className="fill-neo-vibrant-pink animate-spin-slow" />
                    <path d="M20 150 L50 180 L80 150 Z" className="fill-neo-vibrant-cyan animate-bounce" />
                </svg>
            </div>

            <div className="flex items-start gap-5 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-black/5 hover:border-black/20 transition-colors">
                {/* Avatar with dynamic ring */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl shadow-neo-vibrant-pink/20 overflow-hidden relative z-10">
                        <Avatar className="w-full h-full">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-3xl font-black bg-neo-vibrant-lime text-black">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <Badge className="absolute -bottom-1 -right-1 z-20 bg-black text-white border-2 border-white px-2 py-0.5 text-xs rotate-[-6deg] group-hover:rotate-0 transition-transform">
                        Lvl {Math.floor((stats.reputation || 0) / 100) + 1}
                    </Badge>
                    {/* Decorative background blob */}
                    <div className="absolute inset-0 bg-neo-vibrant-cyan rounded-full scale-110 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Info Column */}
                <div className="flex-1 pt-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-black font-heading tracking-tight leading-tight mb-0.5">
                                {profile?.full_name || "İsimsiz Fizikçi"}
                            </h1>
                            <p className="text-sm font-bold text-gray-400 mb-2">
                                @{profile?.username || user?.email?.split('@')[0]}
                            </p>
                        </div>
                        {isOwnProfile && (
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-black/10 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-neo-vibrant-yellow border border-black/10 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed max-w-lg mb-3 line-clamp-2">
                        {profile?.bio || "Henüz bir biyografi eklenmemiş."}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                        {profile?.location && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded bg-opacity-50">
                                <MapPin className="w-3 h-3" /> {profile.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded bg-opacity-50">
                            <Calendar className="w-3 h-3" />
                            {new Date(user?.created_at).toLocaleDateString("tr-TR", { month: 'short', year: 'numeric' })}
                        </span>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-neo-vibrant-cyan hover:underline bg-cyan-50 px-2 py-1 rounded border border-cyan-100">
                                <LinkIcon className="w-3 h-3" /> Web
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
