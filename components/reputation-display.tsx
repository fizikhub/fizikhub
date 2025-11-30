"use client";

import { TrendingUp, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        sm: "text-sm px-2 py-0.5",
        md: "text-base px-3 py-1",
        lg: "text-lg px-4 py-1.5"
    };

    const iconSizes = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    // Determine tier and styling
    const getTierInfo = (rep: number) => {
        if (rep >= 1000) return {
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            icon: Crown,
            label: "Efsane"
        };
        if (rep >= 500) return {
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            icon: Sparkles,
            label: "Uzman"
        };
        if (rep >= 100) return {
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: Zap,
            label: "Aktif"
        };
        return {
            color: "text-muted-foreground",
            bg: "bg-muted/50",
            border: "border-border/50",
            icon: TrendingUp,
            label: "Yeni"
        };
    };

    const tier = getTierInfo(reputation);
    const Icon = tier.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
                "inline-flex items-center gap-2 font-semibold rounded-full border backdrop-blur-sm transition-colors",
                sizeClasses[size],
                tier.color,
                tier.bg,
                tier.border,
                className
            )}
        >
            <motion.div
                animate={{
                    rotate: reputation >= 500 ? [0, 15, -15, 0] : 0,
                    scale: reputation >= 1000 ? [1, 1.2, 1] : 1
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                }}
            >
                <Icon className={cn(iconSizes[size])} />
            </motion.div>

            <div className="flex items-baseline gap-1">
                <span className="font-bold tracking-tight">{reputation.toLocaleString('tr-TR')}</span>
                {showLabel && size !== "sm" && (
                    <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider">
                        {tier.label}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
