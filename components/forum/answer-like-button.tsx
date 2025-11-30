"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleAnswerLike } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnswerLikeButtonProps {
    answerId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    isLoggedIn: boolean;
}

export function AnswerLikeButton({ answerId, initialLikeCount, initialIsLiked, isLoggedIn }: AnswerLikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isPending, startTransition] = useTransition();

    const handleLike = async () => {
        if (!isLoggedIn) {
            toast.error("Beğenmek için giriş yapmalısın ulan!");
            return;
        }

        // Optimistic update
        const previousLikeCount = likeCount;
        const previousIsLiked = isLiked;

        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        startTransition(async () => {
            const result = await toggleAnswerLike(answerId);

            if (!result.success) {
                // Revert on error
                setIsLiked(previousIsLiked);
                setLikeCount(previousLikeCount);
                toast.error(result.error || "Bir hata oluştu hocam");
            } else {
                // Update with server values
                setLikeCount(result.likeCount ?? previousLikeCount);
                setIsLiked(result.isLiked ?? previousIsLiked);
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isPending}
            className={cn(
                "gap-1.5 transition-all duration-200",
                isLiked && "text-red-500 hover:text-red-600"
            )}
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-all",
                    isLiked && "fill-current scale-110"
                )}
            />
            <span className="text-sm font-medium">{likeCount}</span>
        </Button>
    );
}
