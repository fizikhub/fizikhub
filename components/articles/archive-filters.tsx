"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Clock, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptic } from "@/hooks/use-haptic";

interface ArchiveFiltersProps {
    categories: string[];
    activeCategory?: string;
    activeSort?: string;
}

export function ArchiveFilters({
    categories,
    activeCategory,
    activeSort = 'latest'
}: ArchiveFiltersProps) {
    const { triggerHaptic } = useHaptic();

    const handleClick = () => {
        triggerHaptic();
    };

    return (
        <motion.div
            className="sticky top-14 z-40 bg-background/95 backdrop-blur-md py-4 -mx-3 px-3 sm:mx-0 sm:px-0 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Filter header for mobile */}
            <div className="flex items-center gap-2 mb-3 sm:hidden">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filtrele</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                {/* All */}
                <Link
                    href="/makale"
                    onClick={handleClick}
                    className="flex-shrink-0"
                >
                    <motion.div
                        className={cn(
                            "px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap",
                            "border-[2px] border-black dark:border-white rounded-full",
                            "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]",
                            "transition-all duration-200",
                            "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff]",
                            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            !activeCategory && activeSort === 'latest'
                                ? "bg-[#FFC800] text-black"
                                : "bg-white dark:bg-zinc-800 text-black dark:text-white"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Tümü
                        </span>
                    </motion.div>
                </Link>

                {/* Popular */}
                <Link
                    href="/makale?sort=popular"
                    onClick={handleClick}
                    className="flex-shrink-0"
                >
                    <motion.div
                        className={cn(
                            "px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap",
                            "border-[2px] border-black dark:border-white rounded-full",
                            "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]",
                            "transition-all duration-200",
                            "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff]",
                            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            activeSort === 'popular' && !activeCategory
                                ? "bg-[#FF5500] text-white"
                                : "bg-white dark:bg-zinc-800 text-black dark:text-white"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-1.5">
                            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Popüler
                        </span>
                    </motion.div>
                </Link>

                {/* Latest */}
                <Link
                    href="/makale?sort=latest"
                    onClick={handleClick}
                    className="flex-shrink-0"
                >
                    <motion.div
                        className={cn(
                            "px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap",
                            "border-[2px] border-black dark:border-white rounded-full",
                            "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]",
                            "transition-all duration-200",
                            "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff]",
                            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            activeSort === 'latest' && !activeCategory
                                ? "bg-cyan-400 text-black"
                                : "bg-white dark:bg-zinc-800 text-black dark:text-white"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            En Yeni
                        </span>
                    </motion.div>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-black/20 dark:bg-white/20 flex-shrink-0 hidden sm:block" />

                {/* Category Pills */}
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/makale?category=${encodeURIComponent(cat)}`}
                        onClick={handleClick}
                        className="flex-shrink-0"
                    >
                        <motion.div
                            className={cn(
                                "px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap",
                                "border-[2px] border-black dark:border-white rounded-full",
                                "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]",
                                "transition-all duration-200",
                                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff]",
                                "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                activeCategory === cat
                                    ? "bg-purple-500 text-white"
                                    : "bg-white dark:bg-zinc-800 text-black dark:text-white"
                            )}
                            whileTap={{ scale: 0.98 }}
                        >
                            {cat}
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        </motion.div>
    );
}
