"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReputationDisplayProps {
    reputation: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function ReputationDisplay({
    reputation,
    showLabel = true,
    size = "md",
    className
}: ReputationDisplayProps) {
    const sizeClasses = {
        sm: "text-sm gap-1",
        md: "text-base gap-1.5",
        lg: "text-lg gap-2"
    };

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    // Color based on reputation
    const getColor = (rep: number) => {
        if (rep >= 1000) return "text-yellow-500";
        if (rep >= 500) return "text-purple-500";
        if (rep >= 100) return "text-blue-500";
        return "text-muted-foreground";
    };

    const color = getColor(reputation);

    return (
        <div className={cn(
            "inline-flex items-center font-semibold",
            sizeClasses[size],
            color,
            className
        )}>
            <TrendingUp className={cn(iconSizes[size])} />
            <span>{reputation.toLocaleString('tr-TR')}</span>
            {showLabel && size !== "sm" && (
                <span className="text-xs text-muted-foreground ml-1">puan</span>
            )}
        </div>
    );
}
