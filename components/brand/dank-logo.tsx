"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Atom } from "lucide-react";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none relative group cursor-pointer", className)}>

            {/* LOGO ICON (Sticker Style) */}
            <motion.div
                className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#FFC800] rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_#000]"
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="absolute inset-0 bg-white opacity-20 rounded-xl" /> {/* Glare */}
                <Atom className="w-6 h-6 sm:w-7 sm:h-7 text-black stroke-[2.5px] animate-[spin_10s_linear_infinite]" />
            </motion.div>

            {/* LOGO TEXT (Stacked & Tight) */}
            <div className="flex flex-col leading-[0.85]">
                <span className="text-lg sm:text-xl font-black tracking-tighter text-black">
                    FIZIK<span className="text-[#3B82F6]">HUB</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-black text-white px-1.5 py-0.5 rounded-md inline-block transform -rotate-2 group-hover:rotate-0 transition-transform w-fit">
                    BİLİM APP
                </span>
            </div>

        </div>
    );
}
