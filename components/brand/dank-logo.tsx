"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-3 select-none cursor-pointer group", className)}>

            {/* ICON: CYCLOPS BOX */}
            <div className="relative w-12 h-12 bg-[#B8FF21] border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#000] flex items-center justify-center group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                {/* The Eye */}
                <div className="w-8 h-8 bg-white border-[3px] border-black rounded-full flex items-center justify-center overflow-hidden">
                    <motion.div
                        className="w-3 h-3 bg-black rounded-full"
                        animate={{ x: [0, 2, -2, 0], y: [0, 1, -1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-white rounded-full z-10" />
                </div>
            </div>

            {/* TEXT: STACKED BLOCK */}
            <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-black">
                    FIZIK
                </span>
                <span className="text-sm font-bold bg-black text-[#B8FF21] px-1 -ml-0.5 transform -rotate-2">
                    HUB
                </span>
            </div>

        </div>
    );
}
