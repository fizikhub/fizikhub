"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SearchInput } from "@/components/blog/search-input";
import { Atom, Compass, Activity, Zap } from "lucide-react";

export function JournalHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const smoothedY = useSpring(y, springConfig);

    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            ref={containerRef}
            style={{ y: smoothedY, opacity, scale, filter: `blur(${blur}px)` }}
            className="relative min-h-[70vh] flex flex-col items-center justify-center pt-12 pb-24 overflow-hidden"
        >
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.05),transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Top Meta Hub */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative z-10 w-full max-w-6xl px-6 flex items-center justify-between mb-16 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400"
            >
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-amber-500" />
                        Live Edition
                    </span>
                    <span className="hidden sm:inline text-neutral-600">/</span>
                    <span className="hidden sm:inline">Vol. 2026.02</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-blue-500" />
                        {currentTime}
                    </span>
                    <span className="hidden sm:inline text-neutral-600">/</span>
                    <span className="hidden sm:inline">Istanbul, TR</span>
                </div>
            </motion.div>

            {/* Immersive Title Layer */}
            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative inline-block"
                >
                    {/* Shadow Text */}
                    <h1 className="absolute inset-0 text-7xl sm:text-8xl md:text-9xl lg:text-[14rem] font-black tracking-[-0.05em] text-neutral-100 dark:text-neutral-900 select-none blur-[40px] translate-y-4 opacity-50">
                        JOURNAL
                    </h1>

                    {/* Main Text */}
                    <div className="relative flex flex-col items-center">
                        <motion.span
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-amber-500 text-xs sm:text-sm font-black tracking-[1em] mb-4"
                        >
                            THE SCIENTIFIC
                        </motion.span>
                        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[13rem] font-black tracking-[-0.07em] leading-[0.75] text-black dark:text-white group">
                            <span className="inline-block hover:italic transition-all duration-500 cursor-default">FizikHub</span>
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1, duration: 1, ease: "circInOut" }}
                            className="h-1 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent mt-8 opacity-20"
                        />
                    </div>
                </motion.div>

                {/* Sub-Masthead */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-12 text-sm sm:text-base font-medium text-neutral-500 max-w-xl mx-auto leading-relaxed"
                >
                    Evrenin en derin sırlarını, kuantum dünyasının gizemlerini ve geleceğin teknolojilerini keşfettiğimiz dijital kütüphane.
                </motion.p>
            </div>

            {/* Search Integration */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="relative z-10 mt-16 w-full max-w-2xl px-6"
            >
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-3xl rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-2 shadow-2xl shadow-black/5">
                    <SearchInput />
                </div>
            </motion.div>

            {/* Floating Decorative Icons */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
                <BinaryPulse position="top-1/4 right-10" color="text-amber-500" />
                <BinaryPulse position="bottom-1/4 left-10" color="text-blue-500" />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-400"
            >
                <Compass className="w-6 h-6 animate-spin-slow" />
            </motion.div>
        </motion.section>
    );
}

function BinaryPulse({ position, color }: { position: string; color: string }) {
    return (
        <motion.div
            className={`absolute ${position} ${color} flex flex-col gap-1 font-mono text-[8px] sm:text-[10px] font-bold`}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            <span>01011010</span>
            <span>11001011</span>
            <span>00110101</span>
        </motion.div>
    );
}

function GridOverlay() {
    return (
        <div className="absolute inset-x-0 top-0 h-96 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none overflow-hidden [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
        </div>
    );
}
