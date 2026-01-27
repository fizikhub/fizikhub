"use client";

import { motion } from "framer-motion";
import { Telescope, Sparkles } from "lucide-react";
import { SearchInput } from "@/components/blog/search-input";

export function NeoArticleHeader() {
    return (
        <header className="mb-8 sm:mb-12 border-b-[4px] border-black pb-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC800]/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 relative z-10">
                <div className="flex-1">
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-4 transform -rotate-1 shadow-[4px_4px_0px_rgba(255,200,0,0.4)]"
                    >
                        <motion.div
                            animate={{ rotate: [0, 20, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Telescope className="w-4 h-4 text-[#FFC800]" />
                        </motion.div>
                        <span>Fizikhub Arşiv</span>
                    </motion.div>

                    {/* Animated Title */}
                    <div className="relative">
                        <motion.h1
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black dark:text-white leading-[0.8] mb-0 uppercase select-none"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            {/* Staggered Text: BİLİM */}
                            <span className="block relative z-10">
                                {Array.from("BİLİM").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block hover:text-[#FFC800] transition-colors duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>

                            {/* Staggered Text: ARŞİVİ (Hollow Stroke Effect) */}
                            <span className="block relative z-0 ml-1 sm:ml-4 text-transparent stroke-text-game">
                                {Array.from("ARŞİVİ").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        style={{
                                            WebkitTextStroke: '2px currentColor',
                                            color: 'transparent'
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        whileHover={{
                                            color: '#FFC800',
                                            WebkitTextStroke: '0px',
                                            scale: 1.1
                                        } as any}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>

                        {/* Decorative Elements */}
                        <motion.div
                            className="absolute -top-10 right-10 text-[#FFC800] opacity-50 hidden md:block"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        >
                            <Sparkles className="w-16 h-16" />
                        </motion.div>
                    </div>
                </div>

                {/* Search */}
                <motion.div
                    className="w-full max-w-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC800] to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <SearchInput />
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
