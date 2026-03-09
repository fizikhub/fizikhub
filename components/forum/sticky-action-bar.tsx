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
                    <div className="bg-white dark:bg-[#18181b] border-[3px] border-black rounded-[8px] shadow-[4px_4px_0_0_#000] flex items-center justify-between px-3 py-3 gap-2">
                        {/* Vote Display */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-2 text-sm font-black border-[3px] border-black rounded-[4px] shadow-[2px_2px_0_0_#000]",
                            hasVoted ? "bg-neo-blue text-black" : "bg-neutral-100 dark:bg-black text-black dark:text-white"
                        )}>
                            <ChevronUp className="w-5 h-5 stroke-[3px]" />
                            <span className="text-base">{votes}</span>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="p-3 border-[3px] border-black rounded-[4px] bg-[#FFBD2E] text-black shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            <Share2 className="w-5 h-5 stroke-[2.5px]" />
                        </button>

                        {/* Answer Button - Primary CTA */}
                        <button
                            onClick={scrollToAnswerForm}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 border-[3px] border-black bg-neo-pink text-white rounded-[4px] font-black tracking-widest uppercase text-sm sm:text-base shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
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
