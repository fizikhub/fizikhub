"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Menu, ArrowUp, MessageSquare, X } from "lucide-react";

export function QuickNav() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsOpen(false);
    };

    const scrollToAnswerForm = () => {
        const form = document.getElementById("answer-form");
        if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });

            // Highlight the form briefly
            form.classList.add("ring-4", "ring-[#FFBD2E]", "ring-offset-2", "dark:ring-offset-black");
            setTimeout(() => {
                form.classList.remove("ring-4", "ring-[#FFBD2E]", "ring-offset-2", "dark:ring-offset-black");
            }, 1000);
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute bottom-16 right-0 flex flex-col gap-2 w-48"
                    >
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] text-black dark:text-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)] font-black uppercase text-xs tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <ArrowUp className="w-4 h-4 stroke-[3px]" />
                            <span>Başa Dön</span>
                        </button>
                        <button
                            onClick={scrollToAnswerForm}
                            className="flex items-center gap-3 px-4 py-3 bg-[#FFBD2E] text-black border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)] font-black uppercase text-xs tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <MessageSquare className="w-4 h-4 stroke-[3px]" />
                            <span>Senin Görüşün Ne?</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-[#FFBD2E] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[#FFD268]"
            >
                {isOpen ? (
                    <X className="w-6 h-6 stroke-[3px] text-black" />
                ) : (
                    <Menu className="w-6 h-6 stroke-[3px] text-black" />
                )}
            </button>
        </div>
    );
}
