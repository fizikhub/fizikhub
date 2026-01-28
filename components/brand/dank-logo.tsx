"use client";

import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("select-none cursor-pointer group", className)}>

            <div className="flex flex-col border-[1px] border-black bg-black text-white hover:bg-[#0033FF] transition-colors">

                {/* TOP ROW */}
                <div className="flex items-center justify-between px-2 pt-1 border-b border-white/20">
                    <span className="text-[10px] font-mono tracking-widest opacity-70">REF.01</span>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>

                {/* MAIN TEXT */}
                <div className="px-2 pb-1 relative overflow-hidden">
                    <h1 className="text-3xl font-black tracking-tighter leading-none -ml-0.5">
                        FIZIK
                    </h1>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold tracking-tight opacity-70">HUB</span>
                        <span className="text-[8px] font-mono border border-white px-1 ml-2">INTL.</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
