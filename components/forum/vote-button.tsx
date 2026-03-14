"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUiSounds } from "@/hooks/use-ui-sounds";

interface VoteButtonProps {
    questionId: number;
    initialVotes: number;
    initialHasVoted?: boolean;
    className?: string;
    startExpanded?: boolean;
}

export function VoteButton({ questionId, initialVotes, initialHasVoted = false, className, startExpanded = false }: VoteButtonProps) {
    const [votes, setVotes] = useState(initialVotes);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const { playInteractSound } = useUiSounds();

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isVoting) return;

        // Optimistic update
        const newVotes = hasVoted ? votes - 1 : votes + 1;
        setVotes(newVotes);
        setHasVoted(!hasVoted);
        setIsVoting(true);
        playInteractSound();

        try {
            const result = await voteQuestion(questionId, 1);
            if (!result.success) {
                setVotes(votes);
                setHasVoted(hasVoted);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Oy vermek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            }
        } catch (error) {
            setVotes(votes);
            setHasVoted(hasVoted);
            toast.error("Bağlantı hatası.");
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <motion.button
            onClick={handleVote}
            whileTap={{ scale: 0.92 }}
            className={cn(
                "flex items-center gap-1.5 px-3 h-9 rounded-lg transition-all duration-200 border-[2px] font-bold text-sm",
                hasVoted
                    ? "bg-[#FFBD2E] text-black border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)]"
                    : "bg-white dark:bg-zinc-800 text-black dark:text-zinc-300 border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:bg-[#FFBD2E]/20",
                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] dark:hover:shadow-[1px_1px_0_0_rgba(255,255,255,0.06)]",
                className
            )}
            title="Bu soruyu faydalı bulduysan oy ver"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={hasVoted ? "voted" : "not-voted"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <ArrowUp className={cn("h-4 w-4", hasVoted ? "stroke-[3px]" : "stroke-[2.5px]")} />
                </motion.div>
            </AnimatePresence>

            <motion.span
                key={votes}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="tabular-nums"
            >
                {votes}
            </motion.span>
        </motion.button>
    );
}
