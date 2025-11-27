"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/app/profil/actions";
import { toast } from "sonner";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
}

export function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
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
                    toast.success(previousState ? "Takipten çıkıldı." : "Takip ediliyor.");
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
            onClick={handleFollowToggle}
            disabled={isPending}
            className="gap-2 min-w-[120px]"
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
