"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show after scrolling down 300px
            if (currentScrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
                    className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-4 pb-2"
                >
                    <div className="bg-card/95 backdrop-blur-xl border-2 border-border/80 rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex items-center justify-between px-4 py-3">
                        {/* Vote Display */}
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold",
                            hasVoted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            <ChevronUp className="w-4 h-4" />
                            <span>{votes}</span>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors active:scale-95"
                        >
                            <Share2 className="w-5 h-5 text-muted-foreground" />
                        </button>

                        {/* Answer Button - Primary CTA */}
                        <button
                            onClick={scrollToAnswerForm}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Cevap Yaz</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
