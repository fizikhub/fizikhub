"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V17: THE UNBOUNDED FUTURE
               - Font: Unbounded (Google Font)
               - Concept: Kinetic Typography / Web3 / Modern Science
               - Style: Pure Text, High Contrast, No Containers
            */}

            <motion.div
                className="relative flex items-baseline gap-0.5"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* PART 1: FIZIK (Solid Black) */}
                <h1
                    className="text-2xl sm:text-4xl font-black text-black tracking-tighter"
                    style={{ fontFamily: 'var(--font-unbounded)' }}
                >
                    FIZIK
                </h1>

                {/* PART 2: HUB (Outlined / Stroke) */}
                <h1
                    className="text-2xl sm:text-4xl font-black text-transparent tracking-tighter relative"
                    style={{
                        fontFamily: 'var(--font-unbounded)',
                        WebkitTextStroke: '1.5px black',
                    }}
                >
                    HUB
                    {/* Hover Fill Effect */}
                    <motion.span
                        className="absolute inset-0 text-[#FACC15] opacity-0"
                        style={{ WebkitTextStroke: '0px' }}
                        whileHover={{ opacity: 1 }}
                    >
                        HUB
                    </motion.span>
                </h1>

                {/* TAGLINE: Floating Orbit */}
                <motion.div
                    className="absolute -bottom-2 right-0 hidden sm:block"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-[8px] font-bold text-black uppercase tracking-[0.2em] bg-[#FACC15] px-1"
                        style={{ fontFamily: 'var(--font-unbounded)' }}>
                        BİLİM PLATFORMU
                    </span>
                </motion.div>

                {/* MOBILE TAGLINE (Simpler) */}
                <div className="absolute -bottom-1.5 left-0 right-0 sm:hidden flex justify-center">
                    <div className="h-[2px] w-full bg-black rounded-full" />
                </div>

            </motion.div>

        </div>
    );
}
