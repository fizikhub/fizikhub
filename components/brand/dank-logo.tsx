"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-default">
            {/* 
        V16 HYPER-LOGO 
        - Solid Yellow (Clean)
        - Italic, Heavy
        - liquid Shimmer Animation
      */}
            <div className="relative z-10 overflow-hidden py-1">
                <motion.h1
                    className="font-black text-[28px] sm:text-3xl italic tracking-tighter leading-none text-[#FFC800] drop-shadow-sm"
                    style={{ fontFamily: "var(--font-heading)" }}
                    initial={{ skewX: -10 }}
                    whileHover={{ skewX: -15, scale: 1.05 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* Liquid Shimmer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-[50%] skew-x-[-20deg] animate-[shimmer_2.5s_infinite] mix-blend-overlay" />
            </div>

            {/* Subtitle Badge - Sticker Style */}
            <motion.div
                className="self-start -mt-1 ml-1"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 2, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <span className="bg-white border-2 border-black text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#000] tracking-widest inline-block">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
