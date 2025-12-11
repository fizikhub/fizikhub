"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleCommentLike } from "@/app/forum/actions";
import { toast } from "sonner";

interface CommentLikeButtonProps {
    commentId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    isLoggedIn: boolean;
}

export function CommentLikeButton({
    commentId,
    initialLikeCount,
    initialIsLiked,
    isLoggedIn
}: CommentLikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error("Beğenmek için giriş yapmalısınız");
            return;
        }

        // Optimistic update
        const previousIsLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsAnimating(true);

        try {
            const result = await toggleCommentLike(commentId);
            if (!result.success) {
                // Revert on error
                setIsLiked(previousIsLiked);
                setLikeCount(previousCount);
                toast.error(result.error || "Bir hata oluştu");
            }
        } catch (error) {
            // Revert on error
            setIsLiked(previousIsLiked);
            setLikeCount(previousCount);
            toast.error("Bağlantı hatası");
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200",
                isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            <Heart
                className={cn(
                    "h-3 w-3 transition-all",
                    isLiked && "fill-current",
                    isAnimating && "scale-125"
                )}
            />
            {likeCount > 0 && (
                <span className="text-[10px] font-bold">{likeCount}</span>
            )}
        </button>
    );
}
