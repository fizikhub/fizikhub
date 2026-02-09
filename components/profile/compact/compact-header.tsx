import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Settings } from "lucide-react";

interface CompactHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
}

export function CompactHeader({ profile, user, stats, isOwnProfile }: CompactHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="flex items-center gap-4 p-4 bg-neo-off-white border-b-2 border-black">
            {/* Small Avatar */}
            <div className="relative">
                <div className="w-20 h-20 rounded-lg border-2 border-black overflow-hidden shadow-neo-sm bg-white">
                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={profile?.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-2xl font-black bg-neo-vibrant-cyan text-black rounded-none">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <Badge className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] border border-white px-1.5 py-0.5">
                    Lvl {Math.floor((stats.reputation || 0) / 100) + 1}
                </Badge>
            </div>

            {/* Dense Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-black font-heading truncate leading-none">
                        {profile?.full_name || "İsimsiz Fizikçi"}
                    </h1>
                    {isOwnProfile && (
                        <div className="flex gap-2">
                            <button className="p-1.5 border-2 border-black bg-white hover:bg-neo-vibrant-yellow transition-colors rounded shadow-neo-xs">
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 border-2 border-black bg-white hover:bg-neo-vibrant-pink transition-colors rounded shadow-neo-xs">
                                <Settings className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-sm font-bold text-gray-500 truncate mb-1">
                    @{profile?.username || user?.email?.split('@')[0]}
                </p>

                <p className="text-xs text-gray-800 line-clamp-2 leading-tight mb-2">
                    {profile?.bio || "FizikHub'da bilim yolculuğuna devam ediyor."}
                </p>

                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
                    {profile?.location && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 whitespace-nowrap">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 whitespace-nowrap">
                        <Calendar className="w-3 h-3" />
                        {new Date(user?.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    );
}
