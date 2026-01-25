"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="flex items-center gap-2 select-none relative group cursor-pointer">
            {/* 
        V24 LOGO: PROFESSIONAL SCIENCE
        - Style: Modern, clean, technical.
        - Font: Sans-serif (Inter/Geist) + Mono accents.
        - Colors: White + Electric Blue.
        - Removed: Heavy strokes, cartoon shadows, yellow blocks.
      */}

            {/* Abstract Atom/Orbit Symbol */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 rounded-full border border-blue-500/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-1 rounded-full border border-blue-400/50"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>

            <div className="flex flex-col">
                <h1 className="font-black text-xl sm:text-2xl tracking-tighter leading-none text-white">
                    FIZIK<span className="text-blue-500">HUB</span>
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                    Bilim Platformu
                </span>
            </div>
        </div>
    );
}
