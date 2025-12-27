"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, PenTool, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/icons/site-logo";

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Only show on homepage
    if (pathname !== "/") return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-4 items-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                        >
                            <Link
                                href="/yazar/yeni"
                                className="flex items-center gap-2.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl text-foreground px-4 py-2.5 rounded-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-semibold text-sm hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-all group"
                            >
                                <div className="p-1.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg shadow-lg">
                                    <PenTool size={14} className="text-white" />
                                </div>
                                <span className="whitespace-nowrap">İçerik Paylaş</span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Link
                                href="/forum/soru-sor"
                                className="flex items-center gap-2.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl text-foreground px-4 py-2.5 rounded-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-semibold text-sm hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-all group"
                            >
                                <div className="p-1.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg">
                                    <MessageSquarePlus size={14} className="text-white" />
                                </div>
                                <span className="whitespace-nowrap">Soru Sor</span>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main FAB Button - Premium Liquid Glass */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]",
                    isOpen
                        ? "bg-gradient-to-br from-red-400/90 to-rose-500/90"
                        : "bg-gradient-to-br from-primary/90 to-orange-500/90"
                )}
            >
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                {/* Inner glow */}
                <div className={cn(
                    "absolute inset-0 opacity-50",
                    isOpen
                        ? "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]"
                        : "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]"
                )} />

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/30" />

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative z-10"
                        >
                            <X size={24} className="text-white drop-shadow-md" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative z-10"
                        >
                            <SiteLogo className="w-7 h-7 text-white drop-shadow-md" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Animated ring when closed */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-white/40"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
            </motion.button>
        </div>
    );
}
