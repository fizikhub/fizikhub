"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, PenTool, X, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/icons/site-logo";

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
                setIsOpen(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Only show on homepage
    if (pathname !== "/") return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-20 right-3 z-50 md:bottom-6 md:right-6"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <AnimatePresence>
                        {isOpen && (
                            <div className="flex flex-col gap-2 mb-3 items-end">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: 15 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.05 }}
                                >
                                    <Link
                                        href="/yazar/yeni"
                                        className="flex items-center gap-2 bg-white/60 dark:bg-black/50 backdrop-blur-2xl text-foreground px-3 py-2 rounded-xl border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] font-medium text-xs hover:bg-white/80 dark:hover:bg-black/70 transition-all"
                                    >
                                        <div className="p-1 bg-gradient-to-br from-emerald-400 to-green-500 rounded-md">
                                            <PenTool size={12} className="text-white" />
                                        </div>
                                        <span>İçerik Paylaş</span>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: 15 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <Link
                                        href="/forum/soru-sor"
                                        className="flex items-center gap-2 bg-white/60 dark:bg-black/50 backdrop-blur-2xl text-foreground px-3 py-2 rounded-xl border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] font-medium text-xs hover:bg-white/80 dark:hover:bg-black/70 transition-all"
                                    >
                                        <div className="p-1 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md">
                                            <MessageSquarePlus size={12} className="text-white" />
                                        </div>
                                        <span>Soru Sor</span>
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Main FAB Button - Premium Liquid Glass */}
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                            "relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-colors duration-300",
                            "backdrop-blur-2xl",
                            "shadow-[0_4px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]",
                            isOpen
                                ? "bg-rose-500/80"
                                : "bg-slate-900/70 dark:bg-white/15"
                        )}
                    >
                        {/* Glass layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />

                        {/* Border */}
                        <div className="absolute inset-0 rounded-xl border border-white/30" />

                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="relative z-10"
                                >
                                    <X size={20} className="text-white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="relative z-10"
                                >
                                    <Plus size={24} className="text-white" strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
