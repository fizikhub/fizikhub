"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MemeCorner() {
    return (
        <div className="w-full relative group">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-xl",
                    "aspect-[3/1] sm:aspect-[4/1]", // Ultra-widescreen cinematic ratio
                    "flex flex-col justify-center",
                    "px-6 sm:px-12"
                )}
            >
                {/* --- CINEMATIC BACKGROUND LAYERS --- */}

                {/* 1. The Void (Deepest Black) */}
                <div className="absolute inset-0 bg-[#020205] z-0" />

                {/* 2. The Event Horizon (Subtle Edge Glows) */}
                <div
                    className="absolute inset-0 z-0 opacity-60"
                    style={{
                        background: `
                            radial-gradient(circle at 100% 100%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
                        `
                    }}
                />

                {/* 3. Starfield (Parallax/Slow Move) */}
                <motion.div
                    className="absolute inset-[-50%] z-0 opacity-80 mix-blend-screen"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* 4. Film Grain (Texture) */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')" }} />

                {/* --- CONTENT --- */}
                <div className="relative z-10 flex flex-col items-start space-y-2 select-none mix-blend-screen">

                    {/* Upper Tagline - The "Whisper" */}
                    <div className="flex items-center gap-3 overflow-hidden">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="h-[1px] w-8 bg-white/40"
                        />
                        <motion.span
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.7 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white uppercase"
                        >
                            FizikHub Originals
                        </motion.span>
                    </div>

                    {/* MAIN HERO TEXT - The "Impact" */}
                    <div className="flex flex-col leading-[0.85]">
                        <motion.h2
                            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            BİLİMİ
                        </motion.h2>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <motion.h2
                                initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white/90"
                            >
                                Tİ'YE ALIYORUZ
                            </motion.h2>
                        </div>
                    </div>

                    {/* Subtitle - The "Punchline" */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-2 pl-1"
                    >
                        <span className="text-xs sm:text-sm font-medium text-indigo-200/80 tracking-widest uppercase border-b border-indigo-500/30 pb-0.5">
                            Ama Ciddili Şekilde
                        </span>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}
