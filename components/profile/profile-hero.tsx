"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, ArrowUpDown, Settings, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileSettingsButton } from "@/components/profile/profile-settings-button";
import { ProfileMessagesButton } from "@/components/profile/profile-messages-button";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { FollowButton } from "@/components/profile/follow-button";
import { toast } from "sonner";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    targetUserId?: string;
}

export function ProfileHero({ profile, user, isOwnProfile, isFollowing, targetUserId }: ProfileHeroProps) {
    const [isRepositioning, setIsRepositioning] = useState(false);
    const [offsetY, setOffsetY] = useState(profile?.cover_offset_y ?? 50);
    const [isSaving, setIsSaving] = useState(false);
    const dragStartY = useRef<number | null>(null);
    const initialOffset = useRef<number>(50);
    const searchParams = useSearchParams();
    const router = useRouter();

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

    const gradients = [
        "from-zinc-800 to-zinc-900",
        "from-slate-800 to-slate-900",
        "from-neutral-800 to-neutral-900",
    ];
    const gradientIndex = ((profile?.username?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="relative w-full">
            {/* Cover Image - Simple */}
            <div
                className={`relative h-32 md:h-40 w-full overflow-hidden ${isRepositioning ? 'cursor-move select-none touch-none' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => { if (isRepositioning) e.stopPropagation(); handleMouseDown(e); }}
                onTouchMove={(e) => { if (isRepositioning && dragStartY.current !== null) { e.preventDefault(); e.stopPropagation(); } handleMouseMove(e); }}
                onTouchEnd={handleMouseUp}
            >
                {profile?.cover_url ? (
                    <Image
                        src={profile.cover_url}
                        alt="Cover"
                        fill
                        className="object-cover"
                        style={{ objectPosition: `center ${offsetY}%`, transition: isRepositioning ? 'none' : 'object-position 0.2s ease-out' }}
                        priority
                        sizes="100vw"
                        quality={80}
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${coverGradient}`} />
                )}

                {/* Simple overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Reposition Controls */}
                {isRepositioning && (
                    <div className="absolute inset-x-0 top-3 flex justify-center gap-2 z-50 px-4">
                        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 border border-border">
                            <span className="hidden sm:inline text-muted-foreground">Sürükle</span>
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleCancelReposition} disabled={isSaving}>İptal</Button>
                            <Button size="sm" className="h-7 text-xs" onClick={handleSaveReposition} disabled={isSaving}>
                                {isSaving ? "..." : "Kaydet"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Reposition Button */}
                {isOwnProfile && profile?.cover_url && !isRepositioning && (
                    <div className="absolute top-2 right-2 z-40">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 bg-background/70 hover:bg-background/90 text-foreground text-xs gap-1.5"
                            onClick={handleStartReposition}
                        >
                            <ArrowUpDown className="w-3 h-3" />
                            <span className="hidden sm:inline">Ayarla</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Info Container */}
            <div className={`container max-w-4xl mx-auto px-4 relative ${isRepositioning ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="relative -mt-12 flex flex-col sm:flex-row sm:items-end gap-4 pb-4">
                    {/* Avatar */}
                    <div className="relative mx-auto sm:mx-0 shrink-0">
                        <div className="w-24 h-24 rounded-lg border-4 border-background bg-background overflow-hidden shadow-md">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="text-2xl bg-muted text-muted-foreground font-bold rounded-none">
                                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0)?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-background border border-border p-0.5 rounded">
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                            </div>
                        )}
                    </div>

                    {/* Name & Actions */}
                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <div>
                            <h1 className="text-xl font-bold text-foreground">
                                {profile?.full_name || "Anonim Kullanıcı"}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground">@{profile?.username || "kullanici"}</span>
                                {profile?.role === 'admin' && (
                                    <Badge variant="secondary" className="text-[10px] h-5">Admin</Badge>
                                )}
                                {profile?.is_writer && (
                                    <Badge variant="outline" className="text-[10px] h-5 border-amber-500/50 text-amber-600">Yazar</Badge>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                            {isOwnProfile ? (
                                <>
                                    <Link href="/makale/yeni">
                                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-medium border-border">
                                            <PenSquare className="w-3.5 h-3.5" />
                                            Blog Yaz
                                        </Button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link href="/yazar">
                                            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-medium border-amber-500/50 text-amber-600 hover:bg-amber-500/10">
                                                Yazar Paneli
                                            </Button>
                                        </Link>
                                    )}
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
                </div>
            </div>
        </div>
    );
}
