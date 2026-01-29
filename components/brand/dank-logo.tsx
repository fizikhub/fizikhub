"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none flex-col items-center justify-center p-2">

            {/* 
               V18: THE QUANTUM SCALE
               - Font: Syncopate (Google Font) - Wide, Futuristic, Premium
               - Concept: Precision Measurement / Scientific Scale
               - Style: High-End Tech, Minimalist, Detail-Oriented
            */}

            <motion.div
                className="relative flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* 1. TYPOGRAPHY ROW */}
                <div className="flex items-baseline gap-1 sm:gap-2">
                    <h1
                        className="text-xl sm:text-3xl font-bold uppercase tracking-widest text-black"
                        style={{ fontFamily: 'var(--font-syncopate)' }}
                    >
                        FIZIK
                    </h1>
                    <h1
                        className="text-xl sm:text-3xl font-normal uppercase tracking-widest text-black/80"
                        style={{ fontFamily: 'var(--font-syncopate)' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* 2. THE SCALE (Ruler) */}
                <div className="mt-1 w-full flex items-end justify-between border-b-[2px] border-black pb-1 relative">
                    {/* Ticks */}
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-[1px] bg-black ${i % 5 === 0 ? 'h-2' : 'h-1'}`}
                        />
                    ))}

                    {/* The "Current Value" Indicator */}
                    <motion.div
                        className="absolute bottom-[-4px] h-3 w-[2px] bg-[#FACC15] z-10" // Yellow Indicator
                        initial={{ left: "10%" }}
                        animate={{ left: ["10%", "80%", "45%"] }} // Random scanning movement
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatType: "mirror"
                        }}
                    />
                </div>

                {/* 3. TAGLINE */}
                <div className="mt-1 w-full flex justify-between px-0.5">
                    <span className="text-[6px] font-mono text-black/60">BİLİM</span>
                    <span className="text-[6px] font-mono text-black/60">PLATFORMU</span>
                    <span className="text-[6px] font-mono text-[#FACC15]">v18.0</span>
                </div>

            </motion.div>

        </div>
    );
}
