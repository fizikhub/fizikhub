"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { SearchInput } from "@/components/blog/search-input";

export function NeoArticleHeader() {
    return (
        <header className="mb-6 sm:mb-10 pb-6 sm:pb-8 border-b-[3px] border-black dark:border-white">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                {/* Title Section */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <BookOpen className="w-5 h-5 text-[#FFC800]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                            FizikHub Yazarlarından
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight leading-none"
                    >
                        Bilim Arşivi
                    </motion.h1>
                </div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]"
                >
                    <SearchInput />
                </motion.div>
            </div>
        </header>
    );
}
