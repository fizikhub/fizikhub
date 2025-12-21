"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
    remainingSeconds: number;
    className?: string;
}

export function CountdownTimer({ remainingSeconds, className }: CountdownTimerProps) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const isLow = remainingSeconds < 60; // Less than 1 minute
    const isCritical = remainingSeconds < 30; // Less than 30 seconds

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300",
            isCritical
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                : isLow
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "bg-white/5 border-white/10 text-white/80",
            className
        )}>
            <Clock className={cn(
                "w-4 h-4",
                isCritical && "animate-spin"
            )} />
            <span className="font-mono font-bold text-sm tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
}
