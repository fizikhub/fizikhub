import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, ShieldCheck } from "lucide-react";

interface VibrantHeaderProps {
    profile: any;
    user: any;
    stats: any;
}

export function VibrantHeader({ profile, user, stats }: VibrantHeaderProps) {
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U";

    return (
        <div className="w-full bg-neo-off-white border-3 border-black rounded-xl p-6 shadow-neo mb-6 relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neo-vibrant-yellow rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                {/* Avatar Section */}
                <div className="flex-shrink-0 relative">
                    <div className="w-32 h-32 rounded-xl border-3 border-black overflow-hidden shadow-neo-sm rotate-2 transition-transform group-hover:rotate-0 bg-white">
                        <Avatar className="w-full h-full rounded-none">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-4xl font-black bg-neo-vibrant-cyan text-black rounded-none">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    {/* Level Label */}
                    <div className="absolute -bottom-3 -right-3 rotate-[-5deg]">
                        <Badge className="bg-black text-white border-2 border-white shadow-lg text-xs hover:bg-black px-3 py-1">
                            Level {Math.floor((stats.reputation || 0) / 100) + 1}
                        </Badge>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3 pt-2">
                    <div>
                        <h1 className="text-3xl font-black font-heading tracking-tight leading-none mb-1">
                            {profile?.full_name || "İsimsiz Fizikçi"}
                        </h1>
                        <p className="text-lg font-medium text-gray-600">
                            @{profile?.username || user?.email?.split('@')[0]}
                        </p>
                    </div>

                    <p className="text-base text-gray-800 font-medium max-w-2xl leading-relaxed">
                        {profile?.bio || "Henüz bir biyografi eklenmemiş. FizikHub'da bilim yolculuğuna devam ediyor."}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-black/10">
                                <MapPin className="w-4 h-4" />
                                {profile.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-black/10">
                            <Calendar className="w-4 h-4" />
                            Katıldı: {new Date(user?.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-neo-vibrant-cyan hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200">
                                <LinkIcon className="w-4 h-4" />
                                Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
