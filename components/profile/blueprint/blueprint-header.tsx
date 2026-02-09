"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, Terminal, Database, Cpu, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlueprintHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function BlueprintHeader({ profile, user, stats, isOwnProfile }: BlueprintHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="border-b-2 border-black bg-white">
            {/* Top Bar: System Info simulation */}
            <div className="flex justify-between items-center px-4 py-1 bg-black text-white text-[10px] font-mono tracking-widest uppercase">
                <span>SYS.USR.ID: {user.id.slice(0, 8)}</span>
                <span>STATUS: ONLINE</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-[120px_1fr] min-h-[160px]">
                {/* 1. Avatar Column (Left) */}
                <div className="border-r-2 border-black p-4 flex flex-col items-center justify-start bg-gray-50 relative">
                    {/* Decorative ruler marks */}
                    <div className="absolute top-0 left-0 w-1 h-full flex flex-col justify-between py-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-black/20" />
                        ))}
                    </div>

                    <div className="w-24 h-24 border-2 border-black bg-white mb-2 relative group">
                        {/* Corner brackets */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-black" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-black" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-black" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-black" />

                        <Avatar className="w-full h-full rounded-none">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-4xl font-black font-mono bg-neo-vibrant-cyan/20 text-black rounded-none">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <Badge variant="outline" className="w-full justify-center rounded-none border-black font-mono text-[10px] bg-neo-vibrant-lime">
                        LVL.{Math.floor((stats.reputation || 0) / 100) + 1}
                    </Badge>
                </div>

                {/* 2. Info Column (Right) */}
                <div className="p-4 flex flex-col relative overflow-hidden">
                    {/* Subtle grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-2xl font-black font-mono uppercase tracking-tighter mb-0 leading-none">
                            {profile?.full_name || "UNKNOWN_USER"}
                        </h1>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1 border border-black/10">@{profile?.username}</span>
                        </div>

                        <p className="text-xs font-mono text-gray-700 mb-4 leading-relaxed border-l-2 border-neo-vibrant-cyan pl-2">
                            {profile?.bio || "No bio parameters configured."}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4 mt-auto">
                            <StatBlock label="REP" value={stats.reputation} />
                            <StatBlock label="FLWR" value={stats.followersCount} />
                            <StatBlock label="POST" value={stats.articlesCount + stats.questionsCount} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="border-t-2 border-black flex divide-x-2 divide-black">
                {isOwnProfile ? (
                    <button className="flex-1 py-3 bg-white hover:bg-black hover:text-white transition-colors font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 group">
                        <Terminal className="w-4 h-4" />
                        <span>CONFIG_PROFILE</span>
                    </button>
                ) : (
                    <>
                        <button className="flex-1 py-3 bg-black text-white hover:bg-gray-900 transition-colors font-mono text-xs uppercase font-bold flex items-center justify-center gap-2">
                            <Cpu className="w-4 h-4" />
                            <span>CONNECT</span>
                        </button>
                        <button className="flex-1 py-3 bg-white hover:bg-gray-50 transition-colors font-mono text-xs uppercase font-bold flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" />
                            <span>SHARE_DATA</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function StatBlock({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <div className="text-[10px] font-mono text-gray-500 mb-0.5">{label}</div>
            <div className="text-sm font-bold font-mono">{value}</div>
        </div>
    );
}
