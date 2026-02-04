"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SimulationTheoryProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function SimulationTheory({ title = "Nasıl Çalışır?", children, className }: SimulationTheoryProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("border-t-2 border-zinc-100 dark:border-zinc-800", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">
                        {title}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white dark:bg-zinc-900 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-3 border-b-2 border-zinc-100 dark:border-zinc-800">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
