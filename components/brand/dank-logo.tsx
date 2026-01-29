"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="group flex items-center gap-3 select-none cursor-pointer p-1">
            {/* 1. THE MARK: "ENERGY BOX" */}
            <div className="relative">
                {/* Back Shadow Layer */}
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black rounded-none" />

                {/* Main Yellow Box */}
                <motion.div
                    whileHover={{ x: 2, y: 2 }}
                    whileTap={{ x: 4, y: 4 }}
                    className={cn(
                        "relative w-11 h-11",
                        "bg-[#FFC800] border-[3px] border-black",
                        "flex items-center justify-center",
                        "transition-all duration-100 ease-out"
                    )}
                >
                    {/* Icon: Brutalist Bolt */}
                    <Zap className="w-7 h-7 fill-black stroke-black stroke-[1.5]" />

                    {/* Corner Accents for "Tech" feel */}
                    <div className="absolute top-1 right-1 w-1 h-1 bg-black" />
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-black" />
                </motion.div>
            </div>

            {/* 2. THE TYPE: STACKED & BRANDED */}
            <div className="flex flex-col justify-center h-full gap-[2px]">
                {/* MAIN HEADLINE */}
                <div className="relative overflow-hidden">
                    <h1
                        className="text-[26px] leading-[0.8] font-black text-black tracking-tighter"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIKHUB
                    </h1>
                </div>

                {/* SUBTITLE: THE "WARNING TAPE" */}
                <div className="flex">
                    <motion.div
                        className="bg-black px-1.5 py-[1px] border border-black transform origin-left"
                        whileHover={{ rotate: -2, scale: 1.05 }}
                    >
                        <span className="block text-[9px] font-bold text-[#FFC800] tracking-[0.2em] leading-none uppercase font-mono">
                            BİLİM PLATFORMU
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
