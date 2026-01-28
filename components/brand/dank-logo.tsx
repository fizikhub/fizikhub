"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("select-none cursor-pointer flex items-center overflow-hidden", className)}>

            <motion.div
                className="relative flex flex-col items-start leading-[0.8]"
                whileHover={{ y: -25 }}
            >
                {/* STATE 1: NORMAL */}
                <div className="h-6 flex items-center gap-0.5">
                    <span className="text-2xl font-black tracking-tighter text-white">FIZIK</span>
                    <span className="text-2xl font-black tracking-tighter text-[#00FF99]">HUB</span>
                </div>

                {/* STATE 2: HOVER (REVEAL) */}
                <div className="h-6 flex items-center gap-0.5 absolute top-full mt-1">
                    <span className="text-2xl font-black tracking-tighter text-white italic">FIZIK</span>
                    <span className="text-2xl font-black tracking-tighter text-[#00FF99]">APP</span>
                </div>
            </motion.div>

        </div>
    );
}
