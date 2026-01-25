"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V19 "MOSKO SCIENCE" LOGO 
        - Style: Heavy Block Typography (Mosko Mappa Inspiration)
        - Color: Yellow Text on Blue context
        - Vibe: Retro Science / 90s Edu-tainment
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-4xl italic tracking-tighter leading-none text-[#FFC800] relative z-20"
                    style={{
                        WebkitTextStroke: "2.5px black", // Super thick border like Mosko
                        fontFamily: "var(--font-heading)",
                        filter: "drop-shadow(5px 5px 0px #000)" // Hard 3D Block Shadow
                    }}
                    whileHover={{
                        scale: 1.05,
                        filter: "drop-shadow(8px 8px 0px #000)"
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* "Stars Studio" Vibe - Retro Stars */}
                <motion.div
                    className="absolute -top-3 -right-4 text-white drop-shadow-[2px_2px_0_#000]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
                    </svg>
                </motion.div>
            </div>

            {/* Slogan - "Bilim Platformu" as a stamped plate */}
            <motion.div
                className="self-center sm:self-end -mt-1 sm:-mr-2 z-20"
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 3 }}
            >
                <span className="bg-white border-[2.5px] border-black text-black text-[10px] font-black uppercase px-2 py-0.5 shadow-[3px_3px_0px_0px_#000] tracking-widest inline-block skew-x-[-10deg]">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
