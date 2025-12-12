"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Settings, PenSquare } from "lucide-react";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { CreateArticleDialog } from "@/components/profile/create-article-dialog";
import { motion } from "framer-motion";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
}

export function ProfileHero({ profile, user, isOwnProfile }: ProfileHeroProps) {
    // Generate gradient if no cover image
    const gradients = [
        "from-cyan-500 via-blue-500 to-purple-600",
        "from-violet-500 via-purple-500 to-fuchsia-600",
        "from-orange-500 via-pink-500 to-rose-600",
        "from-emerald-500 via-teal-500 to-cyan-600",
        "from-amber-500 via-orange-500 to-red-600"
    ];
    const gradientIndex = ((profile?.username?.length || 0) + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="relative w-full">
            {/* Cover Image / Gradient */}
            <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
                {profile?.cover_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${coverGradient}`} />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full blur-sm" />
                    <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45 blur-sm" />
                </div>
            </div>

            {/* Content Container */}
            <div className="container max-w-7xl mx-auto px-4 relative">
                {/* Avatar & Info Section */}
                <div className="relative -mt-20 md:-mt-24 flex flex-col md:flex-row md:items-end gap-6 pb-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative mx-auto md:mx-0"
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl" />

                            {/* Avatar container */}
                            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-background bg-background shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                                        {profile?.full_name?.charAt(0) || profile?.username?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Verified Badge */}
                            {profile?.is_verified && (
                                <div className="absolute bottom-2 right-2 bg-background border-2 border-cyan-500 rounded-full p-1.5 shadow-lg">
                                    <BadgeCheck className="w-6 h-6 text-cyan-500 fill-cyan-500/20" />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Name & Actions */}
                    <div className="flex-1 text-center md:text-left space-y-3 pb-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                                {profile?.full_name || "Anonim Kullanıcı"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <span className="text-lg text-muted-foreground font-medium">
                                    @{profile?.username || "kullanici"}
                                </span>
                                {profile?.role === 'admin' && (
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        {isOwnProfile && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex gap-3 justify-center md:justify-start flex-wrap"
                            >
                                <CreateArticleDialog />
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

            {/* Bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
    );
}
