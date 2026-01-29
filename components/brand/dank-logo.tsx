"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V27: THE POP-ART STICKER (SIFIRDAN)
               - Font: Bangers (Google Font)
               - Concept: Comic Book / Mythbusters / YouTube
               - Style: No Box. Huge Text. Thick Stroke.
            */}

            <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                {/* TEXT CONTENT with OUTLINE */}
                <h1
                    className="text-3xl sm:text-4xl text-white tracking-wide leading-none select-none drop-shadow-[4px_4px_0px_#000]"
                    style={{
                        fontFamily: 'var(--font-bangers)',
                        WebkitTextStroke: '1.5px black',
                        paintOrder: 'stroke fill'
                    }}
                >
                    <span className="text-[#FACC15]">FIZIK</span>
                    <span className="text-white">HUB</span>
                </h1>

                {/* POP ELEMENT (OPTIONAL) - A small starburst behind or near */}
                <motion.div
                    className="absolute -top-1 -right-2 text-[#FACC15]"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                        <path d="M12 2L15 9L22 9L16 14L18 21L12 17L6 21L8 14L2 9L9 9L12 2Z" />
                    </svg>
                </motion.div>

            </motion.div>

        </div>
    );
}
