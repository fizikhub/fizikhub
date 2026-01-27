"use client";

import { cn } from "@/lib/utils";

interface NeoStatsCardProps {
    label: string;
    value: number | string;
    icon?: any;
    color?: "yellow" | "purple" | "white" | "black";
    className?: string;
}

export function NeoStatsCard({
    label,
    value,
    icon: Icon,
    color = "white",
    className
}: NeoStatsCardProps) {
    const colorStyles = {
        yellow: "bg-[#facc15] text-black",
        purple: "bg-[#8b5cf6] text-white",
        white: "bg-white text-black",
        black: "bg-black text-white border-white",
    };

    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            colorStyles[color],
            className
        )}>
            {Icon && <Icon className="w-6 h-6 mb-2 opacity-80" />}
            <span className="text-3xl font-black tracking-tighter tabular-nums leading-none">
                {value}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70 mt-1">
                {label}
            </span>
        </div>
    );
}
