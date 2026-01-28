"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-0.5 select-none cursor-pointer group", className)}>

            {/* BOX 1: BLACK */}
            <div className="bg-black text-white px-3 py-1 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all">
                <span className="text-xl sm:text-2xl font-black tracking-tighter leading-none">FIZIK</span>
            </div>

            {/* BOX 2: YELLOW */}
            <div className="bg-[#FFC900] text-black px-2 py-1 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                <span className="text-xl sm:text-2xl font-black tracking-tighter leading-none italic">HUB</span>
            </div>

        </div>
    );
}
