"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <motion.div
            className="group flex items-center gap-2.5 select-none cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* MONOGRAM: The "F" Mark */}
            <div className="relative">
                {/* Hard Shadow */}
                <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-black" />

                {/* Main Badge */}
                <div
                    className={cn(
                        "relative w-10 h-10 sm:w-11 sm:h-11",
                        "bg-[#FFC800] border-[3px] border-black",
                        "flex items-center justify-center",
                        "group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                        "transition-transform duration-150"
                    )}
                >
                    <span
                        className="text-2xl sm:text-3xl font-black text-black leading-none"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        F
                    </span>
                </div>
            </div>

            {/* WORDMARK */}
            <div className="flex flex-col justify-center leading-none">
                {/* Primary: FIZIKHUB */}
                <span
                    className="text-xl sm:text-2xl font-black text-black tracking-tight"
                    style={{ fontFamily: 'var(--font-space)' }}
                >
                    FİZİKHUB
                </span>

                {/* Secondary: BILIM PLATFORMU */}
                <span
                    className="text-[9px] sm:text-[10px] font-bold text-black/70 tracking-[0.15em] uppercase mt-[2px]"
                    style={{ fontFamily: 'var(--font-space)' }}
                >
                    BİLİM PLATFORMU
                </span>
            </div>
        </motion.div>
    );
}
