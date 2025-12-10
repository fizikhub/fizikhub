"use client";

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { toggleAnswerLike } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AnswerLikeButtonProps {
    answerId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    isLoggedIn: boolean;
}

export function AnswerLikeButton({
    answerId,
    initialLikeCount,
    initialIsLiked,
    isLoggedIn
}: AnswerLikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error("Beğenmek için giriş yapmalısınız.");
            return;
        }

        if (isLoading) return;

        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);
        setIsLoading(true);

        try {
            const result = await toggleAnswerLike(answerId);
            if (!result.success) {
                // Revert on error
                setIsLiked(isLiked);
                setLikeCount(likeCount);
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            // Revert on error
            setIsLiked(isLiked);
            setLikeCount(likeCount);
            toast.error("Bağlantı hatası.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors",
                isLiked
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
            )}
            title={isLiked ? "Beğeniyi geri al" : "Beğen"}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLiked ? "liked" : "not-liked"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <ArrowBigUp
                        className={cn(
                            "h-6 w-6 transition-all",
                            isLiked && "fill-primary"
                        )}
                    />
                </motion.div>
            </AnimatePresence>

            <motion.span
                key={likeCount}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "text-xs font-medium tabular-nums",
                    isLiked && "font-bold"
                )}
            >
                {likeCount}
            </motion.span>
        </motion.button>
    );
}
