"use client";

import { useState } from "react";
import { m as motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MessageSquare, Share2, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StickyActionBarProps {
    questionId: number;
    votes: number;
    hasVoted: boolean;
    onVote?: () => void;
}

export function StickyActionBar({ questionId, votes, hasVoted }: StickyActionBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Show after scrolling down 300px
        if (latest > 300) {
            if (latest < previous) {
                // Scrolling up -> show
                setIsVisible(true);
            } else if (latest > previous && latest > 300) {
                // Scrolling down -> hide
                setIsVisible(false);
            }
        } else {
            setIsVisible(false);
        }
    });

    const scrollToAnswerForm = () => {
        const form = document.getElementById("answer-form");
        if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ url, title: document.title });
            } catch {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success("Link kopyalandı!");
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-6 sm:bottom-10 left-0 right-0 z-40 md:hidden px-4 pb-2"
                >
                    <div className="bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] flex items-center justify-between px-3 py-3 gap-2">
                        {/* Vote Display */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-2 text-sm font-black border-[2px] border-black dark:border-zinc-600 rounded-lg shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)]",
                            hasVoted ? "bg-[#FFBD2E] text-black" : "bg-neutral-100 dark:bg-zinc-800 text-black dark:text-white"
                        )}>
                            <ChevronUp className="w-5 h-5 stroke-[3px]" />
                            <span className="text-base">{votes}</span>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="p-3 border-[2px] border-black dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-300 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all"
                        >
                            <Share2 className="w-5 h-5 stroke-[2.5px]" />
                        </button>

                        {/* Answer Button - Primary CTA */}
                        <button
                            onClick={scrollToAnswerForm}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 border-[2.5px] border-black dark:border-zinc-600 bg-[#FFBD2E] text-black rounded-lg font-black tracking-wider uppercase text-sm shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all"
                        >
                            <MessageSquare className="w-5 h-5 stroke-[2.5px]" />
                            <span>Cevap Yaz</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
