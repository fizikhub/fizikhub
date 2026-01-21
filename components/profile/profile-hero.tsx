"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, ArrowUpDown, Calendar, LinkIcon, Twitter, Github, Linkedin, Instagram, MapPin, Globe, HelpCircle } from "lucide-react";
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BadgeDisplay } from "@/components/badge-display";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    targetUserId?: string;
    stats?: {
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
        followersCount: number;
        followingCount: number;
    };
    badges?: any[];
    createdAt?: string;
}

export function ProfileHero({
    profile,
    user,
    isOwnProfile,
    isFollowing,
    targetUserId,
    stats = { articlesCount: 0, questionsCount: 0, answersCount: 0, followersCount: 0, followingCount: 0 },
    badges = [],
    createdAt
}: ProfileHeroProps) {
    const [isRepositioning, setIsRepositioning] = useState(false);
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
    const isPink = mounted && theme === 'pink';
    const isDarkPink = mounted && theme === 'dark-pink';
    const isCute = isPink || isDarkPink;

    useEffect(() => {
        setOffsetY(profile?.cover_offset_y ?? 50);
    }, [profile?.cover_offset_y]);

    useEffect(() => {
        if (searchParams.get('reposition') === 'true') {
            setIsRepositioning(true);
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

    if (isCybernetic) {
        return (
            <CyberProfileHero
                profile={profile}
                user={user}
                isOwnProfile={isOwnProfile}
                onEdit={handleEditProfile}
            />
        );
    }

    const gradients = [
        "from-slate-600 via-gray-700 to-zinc-800",
        "from-stone-600 via-neutral-700 to-gray-800",
        "from-gray-700 via-slate-700 to-zinc-800",
        "from-neutral-600 via-gray-700 to-slate-800",
    ];
    const gradientIndex = ((profile?.username?.length || 0) + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];
    const pinkGradient = "from-pink-300 via-purple-300 to-indigo-300";
    const darkPinkGradient = "from-pink-950 via-purple-950 to-indigo-950";

    const socialLinks = profile?.social_links || {};

    return (
        <div className="w-full bg-card border-b border-foreground/5 pb-2">
            {/* Cover Image */}
            <div
                className={`relative h-[180px] md:h-[280px] w-full overflow-hidden ${isRepositioning ? 'cursor-move select-none' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => {
                    if (isRepositioning) e.stopPropagation();
                    handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                    if (isRepositioning && dragStartY.current !== null) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    handleMouseMove(e);
                }}
                onTouchEnd={handleMouseUp}
            >
                {/* Image/Gradient Logic */}
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
                            sizes="100vw"
                            quality={90}
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ) : (
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        isPink ? pinkGradient : (isDarkPink ? darkPinkGradient : coverGradient)
                    )} />
                )}

                {/* Reposition Controls */}
                {isRepositioning && (
                    <div className="absolute inset-x-0 top-4 flex justify-center gap-4 z-50 px-4">
                        <div className="bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-4 border border-white/20">
                            <span className="hidden sm:inline">Konumu ayarlamak için sürükleyin</span>
                            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                            <Button size="sm" variant="ghost" className="h-7 hover:bg-white/10 text-white" onClick={handleCancelReposition} disabled={isSaving}>İptal</Button>
                            <Button size="sm" className="h-7 bg-white text-black hover:bg-white/90 font-bold" onClick={handleSaveReposition} disabled={isSaving}>{isSaving ? "Kaydediliyor..." : "Kaydet"}</Button>
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

            {/* Profile Info Container */}
            <div className={`container max-w-5xl mx-auto px-4 ${isRepositioning ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="flex flex-col relative">

                    {/* Top Row: Avatar + Actions (Refactored) */}
                    <div className="flex flex-col mb-3 -mt-[3.5rem] md:-mt-[4rem] px-1">
                        <div className="flex items-end justify-between w-full">
                            {/* Avatar Column */}
                            <div className="flex flex-col gap-3">
                                <div className="relative group/avatar">
                                    <div className={cn(
                                        "relative w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full border-[4px] border-background bg-background shadow-sm overflow-hidden",
                                        isCute && "border-[#FF1493] border-[3px]"
                                    )}>
                                        <Avatar className="w-full h-full rounded-full">
                                            <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className={cn(
                                                "text-3xl md:text-4xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 font-bold",
                                                isPink && "from-pink-100 to-pink-200 text-pink-500",
                                                isDarkPink && "from-pink-950 to-pink-900 text-pink-300"
                                            )}>
                                                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Verified Badge - Tighter Fit */}
                                    {profile?.is_verified && (
                                        <div className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[15%] bg-blue-500 text-white rounded-full p-1 border-[4px] border-background shadow-lg z-20" title="Doğrulanmış Hesap">
                                            <BadgeCheck className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons - Moved Below Avatar */}
                                <div className="flex items-center gap-2">
                                    {isOwnProfile ? (
                                        <>
                                            <ProfileMessagesButton />
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
                                            {(profile?.role === 'writer' || profile?.role === 'admin') && (
                                                <Link href="/yazar/yeni">
                                                    <Button variant="default" size="icon" className="rounded-full bg-amber-500 hover:bg-amber-600 text-black h-9 w-9" title="Makale Yaz">
                                                        <PenSquare className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        user && targetUserId && (
                                            <>
                                                <StartChatButton otherUserId={targetUserId} />
                                                <FollowButton targetUserId={targetUserId} initialIsFollowing={isFollowing || false} />
                                            </>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Empty right side or other actions if needed later */}
                        </div>
                    </div>

                    {/* Profile Text Info */}
                    <div className="space-y-3 px-1 mt-1">
                        {/* Name and Bio Block */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
                                    {profile?.full_name}
                                </h1>
                                {profile?.role === 'admin' && isOwnProfile && (
                                    <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 text-[10px] h-5 px-1.5">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                            <div className="text-muted-foreground font-medium text-sm">@{profile?.username}</div>

                            {/* Bio */}
                            {profile?.bio && (
                                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed max-w-2xl text-sm mt-3 md:mt-2">
                                    {profile.bio}
                                </p>
                            )}
                        </div>

                        {/* Link & Socials Compact Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Social Icons */}
                            <div className="flex items-center gap-1">
                                {socialLinks.twitter && (
                                    <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-[#E1306C] transition-colors">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                )}
                                {socialLinks.linkedin && (
                                    <a href={`https://linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-[#0077b5] transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            {profile?.website && (
                                <>
                                    <div className="w-px h-4 bg-border/60" />
                                    <a
                                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:underline"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        <span>{profile.website.replace(/^https?:\/\//, '').split('/')[0]}</span>
                                    </a>
                                </>
                            )}
                        </div>

                        <div className="h-px bg-border/40 w-full my-1" />

                        {/* Reddit-Style Stats & Badges Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
                            {/* Stats */}
                            <div className="flex items-center divide-x divide-border/40 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                                <div className="pr-4 md:pr-6 text-center sm:text-left">
                                    <div className="text-lg font-black text-foreground leading-none">{stats.followersCount}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-80">Takipçi</div>
                                </div>
                                <div className="px-4 md:px-6 text-center sm:text-left">
                                    <div className="text-lg font-black text-foreground leading-none">{stats.followingCount}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-80">Takip</div>
                                </div>
                                {/* Removed 'flex items-center' from parent div of this block to allow wrapping if needed, but 'divide-x' needs flex */}
                                <div className="px-4 md:px-6 text-center sm:text-left cursor-pointer relative group/hub" title="">
                                    <Link href="/puanlar-nedir">
                                        <div className="flex flex-col items-center sm:items-start group-hover/hub:scale-105 transition-transform">
                                            <div className="text-lg font-black text-amber-500 leading-none glow-text-amber flex items-center gap-1">
                                                {profile?.reputation || 0}
                                                <HelpCircle className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover/hub:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-80 group-hover/hub:text-amber-500/80 transition-colors">HubPuan</div>
                                        </div>
                                    </Link>

                                    {/* Hover/Focus Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 invisible group-hover/hub:opacity-100 group-hover/hub:visible transition-all z-50 pointer-events-none">
                                        <div className="bg-black text-white p-3 rounded-xl shadow-xl border border-white/10 text-center relative">
                                            <p className="text-xs font-bold mb-1">Hub Puanı Nedir?</p>
                                            <p className="text-[10px] text-gray-300 leading-tight">Topluluk katkılarını gösteren özel itibar puanıdır.</p>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-white/10"></div>
                                        </div>
                                    </div>
                                </div>
                                {createdAt && (
                                    <div className="pl-4 md:pl-6 text-center sm:text-left hidden xs:block">
                                        <div className="text-lg font-black text-foreground leading-none">{format(new Date(), 'yyyy', { locale: tr }) === format(new Date(createdAt), 'yyyy', { locale: tr }) ? 'Yeni' : `${new Date().getFullYear() - new Date(createdAt).getFullYear()}y`}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-80">Hesap Yaşı</div>
                                    </div>
                                )}
                            </div>

                            {/* Badges (Right Aligned or Stacked) */}
                            {badges && badges.length > 0 && (
                                <div className="sm:ml-auto pt-2 sm:pt-0">
                                    <BadgeDisplay userBadges={badges} size="sm" maxDisplay={4} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
