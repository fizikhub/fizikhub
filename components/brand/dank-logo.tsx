"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("select-none cursor-pointer flex items-center", className)}>

            {/* CONTAINER */}
            <div className="relative bg-black text-white px-3 py-1 flex items-center gap-1 border-[2px] border-black transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[-4px_4px_0px_0px_#FAFF00]">

                {/* TEXT */}
                <span className="text-xl sm:text-2xl font-black tracking-tighter leading-none">
                    FIZIKHUB
                </span>

                {/* ACCENT DOT (Signal Yellow) */}
                <span className="w-2 h-2 bg-[#FAFF00] mb-1 animate-pulse" />

            </div>

        </div>
    );
}
