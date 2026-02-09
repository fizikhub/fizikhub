"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share2 } from "lucide-react";

interface NBHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function NBHeader({ profile, user, stats, isOwnProfile }: NBHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="mb-6">
            {/* Main Header Card */}
            <div className="bg-neo-vibrant-yellow border-4 border-black p-6 shadow-[6px_6px_0_#000]">
                <div className="flex gap-6 items-start">
                    {/* Avatar Box */}
                    <div className="shrink-0">
                        <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0_#000] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-3xl font-black bg-neo-vibrant-pink text-black rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Info Block */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1 truncate">
                            {profile?.full_name || "NEW USER"}
                        </h1>
                        <p className="text-sm font-bold text-black/70 mb-3">
                            @{profile?.username}
                        </p>
                        <p className="text-sm font-medium text-black/80 leading-relaxed line-clamp-2">
                            {profile?.bio || "Fizik tutkunu. FizikHub üyesi."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-0 border-x-4 border-b-4 border-black">
                <StatBox value={stats.reputation} label="PUAN" bgColor="bg-neo-vibrant-cyan" />
                <StatBox value={stats.followersCount} label="TAKİPÇİ" bgColor="bg-neo-vibrant-pink" />
                <StatBox value={stats.articlesCount + stats.questionsCount} label="İÇERİK" bgColor="bg-neo-vibrant-lime" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-0 border-x-4 border-b-4 border-black">
                {isOwnProfile ? (
                    <button className="flex-1 py-3 bg-white hover:bg-gray-100 border-r-4 border-black font-black uppercase text-sm transition-colors flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>DÜZENLE</span>
                    </button>
                ) : (
                    <button className="flex-1 py-3 bg-black text-white hover:bg-gray-900 border-r-4 border-black font-black uppercase text-sm transition-colors">
                        TAKİP ET
                    </button>
                )}
                <button className="px-6 py-3 bg-white hover:bg-gray-100 font-black uppercase text-sm transition-colors flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function StatBox({ value, label, bgColor }: { value: number, label: string, bgColor: string }) {
    return (
        <div className={`${bgColor} py-4 text-center border-r-4 border-black last:border-r-0`}>
            <div className="text-2xl font-black text-black">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/70">{label}</div>
        </div>
    );
}
