"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
    questionId: number;
    initialVotes: number;
    initialHasVoted?: boolean;
    className?: string;
}

export function VoteButton({ questionId, initialVotes, initialHasVoted = false, className }: VoteButtonProps) {
    const [votes, setVotes] = useState(initialVotes);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        if (isVoting) return;

        // Optimistic update
        const newVotes = hasVoted ? votes - 1 : votes + 1;
        setVotes(newVotes);
        setHasVoted(!hasVoted);
        setIsVoting(true);

        try {
            const result = await voteQuestion(questionId, 1); // Always upvote logic for now
            if (!result.success) {
                // Revert on error
                setVotes(votes);
                setHasVoted(hasVoted);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Oy vermek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            }
        } catch (error) {
            // Revert on error
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 border shadow-sm",
                hasVoted
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground",
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
                    <ArrowUp className={cn("h-4 w-4", hasVoted && "stroke-[3px]")} />
                </motion.div>
            </AnimatePresence>

            <motion.span
                key={votes}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn("text-sm font-medium tabular-nums", hasVoted && "font-bold")}
            >
                {votes}
            </motion.span>
        </motion.button>
    );
}
