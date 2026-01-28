"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-1 select-none cursor-pointer group", className)}>

            {/* ICON (Hidden on tiny screens) */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-black text-[#FFC800] rounded-full border-2 border-black mr-1 group-hover:rotate-12 transition-transform">
                <FlaskConical className="w-4 h-4" />
            </div>

            {/* TEXT PART 1: FIZIK (Serif / Retro) */}
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-black" style={{ fontFamily: 'var(--font-heading)' }}>
                FIZIK
            </span>

            {/* TEXT PART 2: HUB (Modern Pill) */}
            <span className="relative px-2 py-0.5 bg-[#FFC800] border-2 border-black rounded-md text-black text-sm sm:text-base font-black tracking-tight transform -rotate-3 group-hover:rotate-0 transition-transform shadow-[2px_2px_0px_0px_#000]">
                HUB
            </span>

        </div>
    );
}
