"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V15.5 COMPACT LOGO 
        - Reverted to simple Stroke Style (No Rainbow/Glitch)
        - Slightly smaller text for slimmer mobile bar
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-2xl sm:text-3xl italic tracking-tighter leading-none text-[#FFC800]" // Reduced mobile text size
                    style={{
                        WebkitTextStroke: "1px black", // Thinner stroke for smaller text
                        textShadow: "2px 2px 0px #000", // Smaller shadow
                        fontFamily: "var(--font-heading)",
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    FIZIKHUB
                </motion.h1>
            </div>

            {/* Subtitle - Rotated Sticker */}
            <motion.div
                className="self-start -mt-1 ml-0.5 z-20"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 0 }}
            >
                <span className="bg-white border text-black text-[8px] sm:text-[9px] font-black uppercase px-1 py-0.5 rounded-sm shadow-[1px_1px_0px_0px_#000] tracking-wider inline-block border-black">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
