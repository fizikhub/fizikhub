"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SearchInput } from "@/components/blog/search-input";
import { Atom, Sparkles } from "lucide-react";

export function EliteJournalHeader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const headerY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const headerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                setMousePosition({ x, y });
                cursorX.set(e.clientX - rect.left);
                cursorY.set(e.clientY - rect.top);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorX, cursorY]);

    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <motion.header
            ref={containerRef}
            style={{ y: headerY, opacity: headerOpacity, scale: headerScale }}
            className="relative mb-12 pb-10 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        background: [
                            "radial-gradient(600px circle at 0% 0%, rgba(255,200,0,0.15) 0%, transparent 50%)",
                            "radial-gradient(600px circle at 100% 0%, rgba(255,200,0,0.15) 0%, transparent 50%)",
                            "radial-gradient(600px circle at 100% 100%, rgba(255,200,0,0.15) 0%, transparent 50%)",
                            "radial-gradient(600px circle at 0% 100%, rgba(255,200,0,0.15) 0%, transparent 50%)",
                            "radial-gradient(600px circle at 0% 0%, rgba(255,200,0,0.15) 0%, transparent 50%)",
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                />

                {/* Mouse-following glow */}
                <motion.div
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                        translateX: "-50%",
                        translateY: "-50%"
                    }}
                    className="absolute w-[400px] h-[400px] bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                    />
                ))}
            </div>

            {/* Top Meta Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between text-[10px] font-medium text-neutral-500 uppercase tracking-[0.25em] mb-8"
            >
                <div className="flex items-center gap-3">
                    <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span>Canlı</span>
                </div>
                <span>{dateStr}</span>
                <span>Vol. 47</span>
            </motion.div>

            {/* Main Title Area */}
            <div className="relative text-center mb-10">
                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
                />

                {/* Masthead */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative inline-block"
                >
                    {/* Glow effect behind text */}
                    <div className="absolute inset-0 blur-2xl bg-amber-400/20 scale-150" />

                    <div className="relative">
                        <motion.div
                            animate={{
                                rotateY: mousePosition.x * 5,
                                rotateX: -mousePosition.y * 5
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                        >
                            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-black via-neutral-800 to-neutral-600 dark:from-white dark:via-neutral-200 dark:to-neutral-400 leading-none select-none">
                                FİZİKHUB
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 flex items-center justify-center gap-4"
                        >
                            <motion.span
                                className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.7 }}
                            />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-600 dark:text-amber-400">
                                Bilim Dergisi
                            </span>
                            <motion.span
                                className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.7 }}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Floating Atoms */}
                <motion.div
                    className="absolute -left-4 top-1/2 -translate-y-1/2 text-amber-400/30 hidden lg:block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Atom className="w-24 h-24" strokeWidth={0.5} />
                </motion.div>
                <motion.div
                    className="absolute -right-4 top-1/2 -translate-y-1/2 text-purple-400/20 hidden lg:block"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    <Atom className="w-20 h-20" strokeWidth={0.5} />
                </motion.div>
            </div>

            {/* Category Pills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-3 mb-8"
            >
                {["Fizik", "Astronomi", "Teknoloji", "Keşif"].map((cat, i) => (
                    <motion.span
                        key={cat}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/50 rounded-full cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                        {cat}
                    </motion.span>
                ))}
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-lg mx-auto"
            >
                <div className="relative group">
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                        <SearchInput />
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-start justify-center pt-1.5"
                >
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-2 bg-amber-500 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </motion.header>
    );
}
