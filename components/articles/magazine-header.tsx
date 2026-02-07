"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Atom, Sparkles, Zap } from "lucide-react";
import { SearchInput } from "@/components/blog/search-input";
import { useRef } from "react";

export function MagazineHeader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <header ref={containerRef} className="relative mb-8 pb-8 border-b-[3px] border-black dark:border-white overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y, opacity }}
            >
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFC800]/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        y: [0, 20, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
                />
            </motion.div>

            {/* Floating Decorations */}
            <div className="absolute top-0 right-0 hidden lg:block">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Atom className="w-24 h-24 text-[#FFC800]/30" strokeWidth={1} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest rounded-lg mb-4"
                    >
                        <motion.div
                            animate={{ rotate: [0, 180, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap className="w-3.5 h-3.5" />
                        </motion.div>
                        FizikHub Dergisi
                    </motion.div>

                    {/* Title with Staggered Animation */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.9] select-none"
                    >
                        <span className="block overflow-hidden">
                            {Array.from("BİLİM").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.1 + i * 0.05,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        color: "#FFC800",
                                        scale: 1.1,
                                        rotate: Math.random() * 10 - 5
                                    }}
                                    className="inline-block cursor-default transition-colors"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                        <span className="block overflow-hidden mt-1">
                            {Array.from("DERGİSİ").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.3 + i * 0.04,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        color: "#FFC800",
                                        scale: 1.1
                                    }}
                                    className="inline-block cursor-default transition-colors text-transparent"
                                    style={{
                                        WebkitTextStroke: '2px currentColor',
                                        color: 'transparent'
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400 max-w-md"
                    >
                        Evrenin sırlarını çözen yazarlardan, bilimin en güncel konuları.
                    </motion.p>
                </div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-full lg:w-auto lg:min-w-[300px]"
                >
                    <div className="relative group">
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-1 bg-gradient-to-r from-[#FFC800] to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"
                        />
                        <div className="relative">
                            <SearchInput />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sparkle decoration */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 text-neutral-400"
            >
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Keşfetmeye Başla</span>
                <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </header>
    );
}
