"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquarePlus, PenTool, X, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Don't show on admin or editor pages if preferred, but user wanted it generally available.
    // Maybe hide on specific pages like login?
    if (pathname?.startsWith('/giris') || pathname?.startsWith('/kayit')) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-4 items-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link
                                href="/yazar/yeni"
                                className="flex items-center gap-3 bg-white dark:bg-zinc-900 text-foreground px-4 py-2 rounded-xl shadow-xl border border-border font-bold text-sm tracking-wide hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <span className="whitespace-nowrap">İçerik Paylaş</span>
                                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                                    <PenTool size={18} />
                                </div>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        >
                            <Link
                                href="/forum/soru-sor"
                                className="flex items-center gap-3 bg-white dark:bg-zinc-900 text-foreground px-4 py-2 rounded-xl shadow-xl border border-border font-bold text-sm tracking-wide hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <span className="whitespace-nowrap">Soru Sor</span>
                                <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                    <MessageSquarePlus size={18} />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-2 transition-colors",
                    isOpen
                        ? "bg-red-500 border-red-400 rotate-90"
                        : "bg-primary border-yellow-400"
                )}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={28} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <Rocket size={28} className="text-black transform -rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
