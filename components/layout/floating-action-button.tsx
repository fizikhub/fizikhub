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

    if (pathname?.startsWith('/giris') || pathname?.startsWith('/kayit')) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-2 mb-3 items-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link
                                href="/yazar/yeni"
                                className="flex items-center gap-2 bg-card text-foreground px-3 py-1.5 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] font-bold text-xs tracking-wide hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            >
                                <span className="whitespace-nowrap">İçerik Paylaş</span>
                                <PenTool size={14} className="text-emerald-500" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        >
                            <Link
                                href="/forum/soru-sor"
                                className="flex items-center gap-2 bg-card text-foreground px-3 py-1.5 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] font-bold text-xs tracking-wide hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            >
                                <span className="whitespace-nowrap">Soru Sor</span>
                                <MessageSquarePlus size={14} className="text-blue-500" />
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
                    "relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                    isOpen
                        ? "bg-red-500 border-red-400"
                        : "bg-primary border-primary"
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
                            <X size={20} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <SiteLogo className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
