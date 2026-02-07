"use client";

import { motion } from "framer-motion";
import { Atom, Telescope, Sparkles, BookOpen, Archive } from "lucide-react";
import { SearchInput } from "@/components/blog/search-input";

export function MagazineArchiveHeader() {
    return (
        <header className="relative mb-8 sm:mb-12 overflow-hidden">
            {/* Background Gradient Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFC800]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute top-4 right-8 text-[#FFC800]/20"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity }
                    }}
                >
                    <Atom className="w-16 h-16 sm:w-24 sm:h-24" />
                </motion.div>

                <motion.div
                    className="absolute bottom-8 right-1/4 text-cyan-400/15 hidden sm:block"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Telescope className="w-12 h-12" />
                </motion.div>

                <motion.div
                    className="absolute top-16 left-[10%] text-purple-400/10 hidden md:block"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <Sparkles className="w-8 h-8" />
                </motion.div>
            </div>

            <div className="relative z-10 py-8 sm:py-12 border-b-[4px] border-black dark:border-white">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs sm:text-sm font-black uppercase tracking-[0.15em] transform -rotate-1 shadow-[4px_4px_0px_rgba(255,200,0,0.6)] border-2 border-black dark:border-white">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Archive className="w-4 h-4 text-[#FFC800]" />
                        </motion.div>
                        <span>FizikHub Bilim Arşivi</span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <BookOpen className="w-4 h-4 text-[#FFC800]" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Main Title Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div className="flex-1">
                        {/* Giant Title */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            {/* DERGI - Main solid text */}
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] text-black dark:text-white leading-[0.85] uppercase select-none">
                                {Array.from("DERGİ").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block hover:text-[#FFC800] transition-colors duration-200 cursor-default"
                                        initial={{ opacity: 0, y: 30, rotate: -5 }}
                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                        transition={{
                                            delay: 0.2 + i * 0.08,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: Math.random() * 6 - 3,
                                            color: "#FFC800"
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </h1>

                            {/* ARŞİVİ - Stroke outline text */}
                            <div className="mt-1 sm:mt-2">
                                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.02em] leading-[0.9] uppercase select-none">
                                    {Array.from("ARŞİVİ").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block text-transparent cursor-default"
                                            style={{
                                                WebkitTextStroke: '2px currentColor',
                                                color: 'transparent'
                                            }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.06 }}
                                            whileHover={{
                                                WebkitTextStroke: '0px',
                                                color: '#FFC800',
                                            } as any}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            </div>

                            {/* Subtitle */}
                            <motion.p
                                className="mt-4 sm:mt-6 text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400 max-w-md tracking-wide uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                Evrenin sırlarını çözen makaleler. FizikHub yazarlarından bilimsel içerikler.
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Search Section */}
                    <motion.div
                        className="w-full lg:max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                    >
                        <div className="relative group">
                            {/* Glow effect on hover */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC800] via-orange-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500" />
                            <div className="relative">
                                <SearchInput />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Issue Counter - Magazine style */}
                <motion.div
                    className="absolute top-4 right-4 sm:top-8 sm:right-8 hidden sm:flex flex-col items-end"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="bg-[#FFC800] border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_#000] transform rotate-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black">Sayı</span>
                        <span className="block text-2xl font-black text-black leading-none">#∞</span>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
