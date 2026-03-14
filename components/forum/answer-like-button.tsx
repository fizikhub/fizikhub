"use client";

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { toggleAnswerLike } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { m as motion, AnimatePresence } from "framer-motion";
import { useUiSounds } from "@/hooks/use-ui-sounds";

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
    const { playInteractSound } = useUiSounds();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error("Beğenmek için giriş yapmalısınız.");
            return;
        }

        if (isLoading) return;

        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);
        setIsLoading(true);
        playInteractSound();

        try {
            const result = await toggleAnswerLike(answerId);
            if (!result.success) {
                setIsLiked(isLiked);
                setLikeCount(likeCount);
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
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
            whileTap={{ scale: 0.92 }}
            className={cn(
                "flex items-center gap-1.5 px-3 h-9 rounded-lg transition-all duration-200 border-[2px] font-bold text-sm",
                isLiked
                    ? "bg-[#FFBD2E] text-black border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)]"
                    : "bg-white dark:bg-zinc-800 text-black dark:text-zinc-300 border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:bg-[#FFBD2E]/20",
                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] dark:hover:shadow-[1px_1px_0_0_rgba(255,255,255,0.06)]"
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
                            "h-5 w-5 transition-all",
                            isLiked && "fill-current"
                        )}
                    />
                </motion.div>
            </AnimatePresence>

            <motion.span
                key={likeCount}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="tabular-nums"
            >
                {likeCount}
            </motion.span>
        </motion.button>
    );
}
