"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none cursor-pointer group font-mono", className)}>

            {/* ICON: WARNING PLATE */}
            <div className="w-10 h-10 bg-[#FF4D00] border-2 border-black flex items-center justify-center relative shadow-[2px_2px_0px_0px_#000]">
                <Zap className="w-6 h-6 text-black fill-black" />
                {/* Bolt heads */}
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full" />
                <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-black rounded-full" />
            </div>

            {/* TEXT: STENCIL */}
            <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-black uppercase" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.1)" }}>
                    FIZIK_HUB
                </span>
                <span className="text-[10px] font-bold text-[#FF4D00] bg-black px-1 self-start tracking-widest">
                    EST. 2024
                </span>
            </div>

        </div>
    );
}
