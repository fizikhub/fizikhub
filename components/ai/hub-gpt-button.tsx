"use client";

import { useState, useEffect } from "react";
import { HubGPTChat } from "@/components/ai/hub-gpt-chat";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function HubGPTButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    // Scroll Detection logic
    useEffect(() => {
        if (pathname !== "/") return; // Only track scroll on homepage

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, pathname]);

    // ONLY show on Homepage as requested
    if (pathname !== "/") return null;

    return (
        <>
            {/* FLOATING TRIGGER BUTTON */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 50 }}
                        className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-[90] flex flex-col items-start gap-2 pointer-events-none"
                    >
                        {/* TOOLTIP */}
                        <AnimatePresence>
                            {isHovered && !isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="bg-white text-black px-3 py-1.5 rounded-lg border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] font-black uppercase text-xs pointer-events-auto"
                                >
                                    HubGPT ile Konuş! 🚀
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={() => setIsOpen(true)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 md:w-16 md:h-16 bg-[#FFC800] text-black rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden group pointer-events-auto"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                            <Bot className="w-8 h-8 md:w-9 md:h-9 relative z-10 stroke-[2.5px]" />

                            {/* Badge */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-[2px] border-black animate-pulse" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CHAT INTERFACE OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="fixed bottom-0 md:bottom-24 right-0 md:right-8 w-full md:w-[450px] h-[85vh] md:h-[600px] z-[101] md:rounded-xl overflow-hidden pointer-events-auto shadow-2xl"
                        >
                            <HubGPTChat onClose={() => setIsOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
