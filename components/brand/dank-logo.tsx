"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V23 LOGO: MOSKO SCIENCE (Restored)
        - Mobile: text-2xl
        - Desktop: text-4xl
        - Style: Blocky Yellow Text with Thick Black Stroke
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-2xl sm:text-4xl italic tracking-tighter leading-none text-[#FFC800] relative z-20"
                    style={{
                        WebkitTextStroke: "1.5px black",
                        fontFamily: "var(--font-heading)",
                        filter: "drop-shadow(3px 3px 0px #000)"
                    }}
                    whileHover={{
                        scale: 1.05,
                        filter: "drop-shadow(5px 5px 0px #000)"
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* Rotating Globe Accent */}
                <motion.div
                    className="absolute -top-3 -right-4 text-[#3B82F6] drop-shadow-[1px_1px_0_#000] sm:drop-shadow-[2px_2px_0_#000] bg-white rounded-full border border-black z-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7 p-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </motion.div>
            </div>

            {/* Slogan */}
            <motion.div
                className="self-start sm:self-end -mt-0.5 sm:-mr-1 z-20"
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 3 }}
            >
                <span className="bg-white border-[1.5px] border-black text-black text-[8px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 shadow-[2px_2px_0px_0px_#000] tracking-widest inline-block skew-x-[-10deg]">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
