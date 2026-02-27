"use client";

import { motion } from "framer-motion";
import { SearchInput } from "@/components/blog/search-input";

export function JournalHeader() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('tr-TR', options);

    return (
        <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-6">
                <span>{dateStr}</span>
                <span>Sayı 47</span>
            </div>

            {/* Masthead */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-grotesk font-bold tracking-tight text-black dark:text-white mb-2">
                        FizikHub
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-xs font-medium text-neutral-500 uppercase tracking-[0.3em]">
                        <span>Bilim</span>
                        <span className="w-1 h-1 bg-neutral-400 rounded-full" />
                        <span>Teknoloji</span>
                        <span className="w-1 h-1 bg-neutral-400 rounded-full" />
                        <span>Keşif</span>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto"
            >
                <SearchInput />
            </motion.div>
        </header>
    );
}
