"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSettingsButton } from "@/components/profile/profile-settings-button";
import { ProfileMessagesButton } from "@/components/profile/profile-messages-button";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { FollowButton } from "@/components/profile/follow-button";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CyberProfileHero } from "@/components/themes/cybernetic/cyber-profile-hero";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    // Optional props for public profiles
    isFollowing?: boolean;
    targetUserId?: string;
}

export function ProfileHero({ profile, user, isOwnProfile, isFollowing, targetUserId }: ProfileHeroProps) {
    const [isRepositioning, setIsRepositioning] = useState(false);
    // Use local state for immediate feedback, initialize with DB value or default 50
    const [offsetY, setOffsetY] = useState(profile?.cover_offset_y ?? 50);
    const [isSaving, setIsSaving] = useState(false);
    const dragStartY = useRef<number | null>(null);
    const initialOffset = useRef<number>(50);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';

    // Update local state if profile changes (e.g. initial load)
    useEffect(() => {
        setOffsetY(profile?.cover_offset_y ?? 50);
    }, [profile?.cover_offset_y]);

    // Check for reposition param
    useEffect(() => {
        if (searchParams.get('reposition') === 'true') {
            setIsRepositioning(true);
            // Clean up URL
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('reposition');
            router.replace(`?${newParams.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    const handleStartReposition = () => {
        setIsRepositioning(true);
        initialOffset.current = offsetY;
    };

    const handleCancelReposition = () => {
        setIsRepositioning(false);
        setOffsetY(profile?.cover_offset_y ?? 50);
    };

    const handleSaveReposition = async () => {
        setIsSaving(true);
        try {
            // Dynamically import to avoid server/client issues if any, though here it's client comp
            const { updateProfile } = await import("@/app/profil/actions");
            const result = await updateProfile({ cover_offset_y: offsetY });

            if (result.success) {
                toast.success("Kapak konumu güncellendi");
                setIsRepositioning(false);
            } else {
                toast.error("Güncelleme başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isRepositioning) return;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        dragStartY.current = clientY;
        initialOffset.current = offsetY;
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isRepositioning || dragStartY.current === null) return;

        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const deltaY = clientY - dragStartY.current;

        // Sensitivity: 1px moves 0.2% (adjust as needed)
        // If dragging DOWN (positive delta), image should move DOWN, meaning we see HIGHER % of the image (top hidden)?
        // background-position-y: 0% = top of image. 100% = bottom of image.
        // If we drag mouse DOWN, we want to pull the image DOWN.
        // Pulling image DOWN means showing more of the TOP. So we go towards 0%.
        // Wait. CSS bg-pos-y: 0% aligns top of image with top of container.
        // 100% aligns bottom of image with bottom of container.
        // If I drag user finger DOWN, I expect the image to slide DOWN.
        // Sliding image DOWN means the viewed area moves UP relative to image.
        // So we approach 0%.
        // So positive Delta Y (down drag) -> Decrease Percentage.

        const sensitivity = 0.2;
        const newOffset = Math.max(0, Math.min(100, initialOffset.current - (deltaY * sensitivity)));
        setOffsetY(newOffset);
    };

    const handleMouseUp = () => {
        dragStartY.current = null;
    };

    const handleEditProfile = () => {
        router.push("/ayarlar");
    };

    // ----------------------------------------------------------------------
    // RENDER: CYBERNETIC THEME
    // ----------------------------------------------------------------------
    if (isCybernetic) {
        return (
            <CyberProfileHero
                profile={profile}
                isOwnProfile={isOwnProfile}
                onEdit={handleEditProfile}
            />
        );
    }

    // ----------------------------------------------------------------------
    // RENDER: STANDARD THEME
    // ----------------------------------------------------------------------
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
        <div className="relative w-full border-b-2 border-foreground/10 group">
            {/* Cover Image / Gradient */}
            <div
                className={`relative h-[200px] md:h-[240px] w-full overflow-hidden ${isRepositioning ? 'cursor-move select-none touch-none' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => {
                    // Prevent scroll on mobile when dragging starts
                    if (isRepositioning) {
                        e.stopPropagation(); // Stop event bubbling
                    }
                    handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                    // Prevent scroll on mobile when dragging
                    if (isRepositioning && dragStartY.current !== null) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    handleMouseMove(e);
                }}
                onTouchEnd={handleMouseUp}
            >
                import Image from "next/image";

                // ... (other imports)

                // Inside ProfileHero component return statement
                // ...
                {profile?.cover_url ? (
                    <div className="absolute inset-0">
                        <Image
                            src={profile.cover_url}
                            alt="Cover"
                            fill
                            className="object-cover"
                            style={{
                                objectPosition: `center ${offsetY}%`,
                                transition: isRepositioning ? 'none' : 'object-position 0.2s ease-out'
                            }}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                            quality={85}
                        />
                        <div
                            className="absolute inset-0 bg-black/20"
                            style={{ backdropFilter: "grayscale(30%)" }} // Mimic previous grayscale filter
                        />
                    </div>
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${coverGradient}`} />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

                {/* Grid overlay */}
                <div className={cn("absolute inset-0 pointer-events-none", isCybernetic ? "opacity-30" : "opacity-5")}>
                    <div className="w-full h-full" style={{
                        backgroundImage: isCybernetic
                            ? 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)'
                            : 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                        backgroundSize: isCybernetic ? '40px 40px' : '50px 50px'
                    }} />
                    {isCybernetic && (
                        <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400/60 uppercase tracking-widest border border-cyan-500/30 px-2 py-1 bg-black/40 backdrop-blur-sm">
                            SYS.USER_PROFILE_V8.2 // {profile?.username?.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Reposition Controls Overlay */}
                {isRepositioning && (
                    <div className="absolute inset-x-0 top-4 flex justify-center gap-4 z-50 pointer-events-auto px-4">
                        <div className="bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-4 border border-white/20">
                            <span className="hidden sm:inline">Konumu ayarlamak için sürükleyin</span>
                            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 hover:bg-white/10 text-white hover:text-white"
                                onClick={handleCancelReposition}
                                disabled={isSaving}
                            >
                                İptal
                            </Button>
                            <Button
                                size="sm"
                                className="h-7 bg-white text-black hover:bg-white/90 font-bold"
                                onClick={handleSaveReposition}
                                disabled={isSaving}
                            >
                                {isSaving ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Reposition Trigger Button (Top Right) */}
                {isOwnProfile && profile?.cover_url && !isRepositioning && (
                    <div className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border-0 font-medium text-xs gap-2"
                            onClick={handleStartReposition}
                        >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            Konumu Ayarla
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className={`container max-w-7xl mx-auto px-4 relative ${isRepositioning ? 'pointer-events-none opacity-50' : ''}`}>
                {/* Avatar & Info Section */}
                <div className="relative -mt-14 md:-mt-16 flex flex-col md:flex-row md:items-end gap-5 pb-5">
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
                            <div className={cn(
                                "relative w-28 h-28 md:w-32 md:h-32 rounded-lg border-4 border-background bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden",
                                isCybernetic && "cyber-avatar-ring"
                            )}>
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                                    <AvatarFallback className="text-3xl bg-gradient-to-br from-gray-600 to-gray-800 text-white font-bold rounded-none">
                                        {profile?.full_name?.charAt(0) || profile?.username?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Verified Badge */}
                            {profile?.is_verified && (
                                <div className="absolute -bottom-1 -right-1 bg-background border-2 border-foreground/20 p-0.5">
                                    <BadgeCheck className="w-4 h-4 text-foreground" />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Name & Actions */}
                    <div className="flex-1 text-center md:text-left space-y-2 pb-2">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <h1 className={cn(
                                "text-2xl md:text-3xl font-black text-foreground mb-1 tracking-tight",
                                isCybernetic && "cyber-text"
                            )}>
                                {profile?.full_name || "Anonim Kullanıcı"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                                <span className="text-base text-muted-foreground font-bold">
                                    @{profile?.username || "kullanici"}
                                </span>
                                {profile?.role === 'admin' && (
                                    <Badge className="bg-foreground text-background border-0 font-bold uppercase text-[10px] h-5">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex gap-2 justify-center md:justify-start flex-wrap"
                        >
                            {isOwnProfile ? (
                                <>
                                    <Link href="/makale/yeni">
                                        <Button size="sm" className="h-8 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 text-xs font-bold">
                                            <PenSquare className="w-3.5 h-3.5" />
                                            <span>Blog Yaz</span>
                                        </Button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link href="/yazar">
                                            <Button size="sm" className="h-8 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 text-xs font-bold">
                                                <PenSquare className="w-3.5 h-3.5" />
                                                <span>Yazar Paneli</span>
                                            </Button>
                                        </Link>
                                    )}
                                    <div className="scale-90 origin-left">
                                        <ProfileMessagesButton />
                                    </div>
                                    <div className="scale-90 origin-left">
                                        <ProfileSettingsButton
                                            currentUsername={profile?.username || null}
                                            currentFullName={profile?.full_name || null}
                                            currentBio={profile?.bio || null}
                                            currentAvatarUrl={profile?.avatar_url || null}
                                            currentCoverUrl={profile?.cover_url || null}
                                            currentWebsite={profile?.website || null}
                                            currentSocialLinks={profile?.social_links || null}
                                            userEmail={user?.email || null}
                                            usernameChangeCount={profile?.username_changes_count || 0}
                                        />
                                    </div>
                                </>
                            ) : (
                                user && targetUserId && (
                                    <>
                                        {/* Import needed components at top of file */}
                                        <StartChatButton otherUserId={targetUserId} />
                                        <FollowButton targetUserId={targetUserId} initialIsFollowing={isFollowing || false} />
                                    </>
                                )
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
