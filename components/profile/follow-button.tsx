"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/app/profil/actions";
import { toast } from "sonner";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    targetUsername?: string;
    variant?: string;
    className?: string;
}

export function FollowButton({ targetUserId, initialIsFollowing, targetUsername, variant, className }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handleFollowToggle = () => {
        startTransition(async () => {
            // Optimistic update
            const previousState = isFollowing;
            setIsFollowing(!previousState);

            try {
                let result;
                if (previousState) {
                    result = await unfollowUser(targetUserId);
                } else {
                    result = await followUser(targetUserId);
                }

                if (!result.success) {
                    // Revert on failure
                    setIsFollowing(previousState);
                    toast.error(result.error || "İşlem başarısız.");
                } else {
                    if (!previousState) {
                        // Just followed
                        if (targetUsername === 'barannnbozkurttb') {
                            toast.success("Gönüllerin sultanı Hazreti Admin'i takip ediyorsun! 👑");
                        } else {
                            toast.success("Takip ediliyor.");
                        }
                    } else {
                        toast.success("Takipten çıkıldı.");
                    }
                }
            } catch (error) {
                setIsFollowing(previousState);
                toast.error("Bir hata oluştu.");
            }
        });
    };

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={() => {
                haptics.medium();
                handleFollowToggle();
            }}
            disabled={isPending}
            className={cn("gap-2 min-w-[120px]", className)}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinus className="h-4 w-4" />
                    Takibi Bırak
                </>
            ) : (
                <>
                    <UserPlus className="h-4 w-4" />
                    Takip Et
                </>
            )}
        </Button>
    );
}
