"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V13: THE KINETIC STICKER
               - Font: Outfit Black (Geometric)
               - Concept: Die-Cut Sticker
               - Style: Thick White Outline + Hard Shadow + Rotation
            */}

            <motion.div
                className="relative"
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 0, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* LAYER 1: HARD DROP SHADOW (The distance from surface) */}
                <div className="absolute inset-0 translate-x-[4px] translate-y-[4px] opacity-100">
                    <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-black"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            WebkitTextStroke: '6px black'
                        }}>
                        FIZIKHUB
                    </span>
                </div>

                {/* LAYER 2: STICKER PAPER (The White Outline) */}
                <div className="absolute inset-0 z-10">
                    <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            WebkitTextStroke: '6px white', // Thick sticker edge
                            paintOrder: 'stroke fill'
                        }}>
                        FIZIKHUB
                    </span>
                </div>

                {/* LAYER 3: CONTENT (The Ink) */}
                <div className="relative z-20 flex">
                    <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-black"
                        style={{ fontFamily: 'var(--font-heading)' }}>
                        FIZIK
                    </span>
                    <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-[#FACC15]" // Yellow
                        style={{ fontFamily: 'var(--font-heading)' }}>
                        HUB
                    </span>
                </div>

                {/* TAGLINE STICKER (Slapped over) */}
                <motion.div
                    className="absolute -bottom-2 right-0 z-30"
                    initial={{ rotate: 5 }}
                >
                    <div className="border-[1.5px] border-black bg-white px-1 shadow-[2px_2px_0px_0px_#000]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-black"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </motion.div>

            </motion.div>

        </div>
    );
}
