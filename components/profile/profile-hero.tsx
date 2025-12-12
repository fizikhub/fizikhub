"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EditProfileButton } from "@/components/profile/edit-profile-button";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
}

export function ProfileHero({ profile, user, isOwnProfile }: ProfileHeroProps) {
    // Generate gradient if no cover image
    const gradients = [
        "from-slate-600 via-gray-700 to-zinc-800",
        "from-stone-600 via-neutral-700 to-gray-800",
        "from-gray-700 via-slate-700 to-zinc-800",
        "from-neutral-600 via-gray-700 to-slate-800",
    ];
    const gradientIndex = ((profile?.username?.length || 0) + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="relative w-full border-b-2 border-foreground/10">
            {/* Cover Image / Gradient */}
            <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden">
                {profile?.cover_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center grayscale-[30%]"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${coverGradient}`} />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                {/* Grid overlay for brutalist feel */}
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>
            </div>

            {/* Content Container */}
            <div className="container max-w-7xl mx-auto px-4 relative">
                {/* Avatar & Info Section */}
                <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end gap-6 pb-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative mx-auto md:mx-0"
                    >
                        <div className="relative">
                            {/* Sharp border instead of glow */}
                            <div className="absolute -inset-1 bg-foreground/10 rounded-lg" />

                            {/* Avatar container with sharp corners */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg border-4 border-background bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-gradient-to-br from-gray-600 to-gray-800 text-white font-bold rounded-none">
                                        {profile?.full_name?.charAt(0) || profile?.username?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Verified Badge */}
                            {profile?.is_verified && (
                                <div className="absolute -bottom-1 -right-1 bg-background border-2 border-foreground/20 p-1">
                                    <BadgeCheck className="w-5 h-5 text-foreground" />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Name & Actions */}
                    <div className="flex-1 text-center md:text-left space-y-3 pb-4">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
                                {profile?.full_name || "Anonim Kullanıcı"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <span className="text-lg text-muted-foreground font-bold">
                                    @{profile?.username || "kullanici"}
                                </span>
                                {profile?.role === 'admin' && (
                                    <Badge className="bg-foreground text-background border-0 font-bold uppercase text-xs">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        {isOwnProfile && (
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="flex gap-3 justify-center md:justify-start flex-wrap"
                            >
                                <Link href="/makale/yeni">
                                    <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <PenSquare className="w-4 h-4" />
                                        <span>Makale Yaz</span>
                                    </Button>
                                </Link>
                                <EditProfileButton
                                    currentUsername={profile?.username || null}
                                    currentFullName={profile?.full_name || null}
                                    currentBio={profile?.bio || null}
                                    currentAvatarUrl={profile?.avatar_url || null}
                                    currentCoverUrl={profile?.cover_url || null}
                                    currentWebsite={profile?.website || null}
                                    currentSocialLinks={profile?.social_links || null}
                                    userEmail={user?.email || null}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
