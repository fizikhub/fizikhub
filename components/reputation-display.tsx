"use client";

import { TrendingUp, Sparkles, Zap, Crown, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface ReputationDisplayProps {
    reputation: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    showProgress?: boolean;
}

export function ReputationDisplay({
    reputation,
    showLabel = true,
    size = "md",
    className,
    showProgress = false
}: ReputationDisplayProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [animatedRep, setAnimatedRep] = useState(0);

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
            bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/10",
            border: "border-amber-500/30",
            icon: Crown,
            label: "Efsane",
            nextTier: null,
            progress: 100
        };
        if (rep >= 500) return {
            color: "text-purple-500",
            bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/10",
            border: "border-purple-500/30",
            icon: Sparkles,
            label: "Uzman",
            nextTier: 1000,
            progress: ((rep - 500) / 500) * 100
        };
        if (rep >= 100) return {
            color: "text-blue-500",
            bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
            border: "border-blue-500/30",
            icon: Zap,
            label: "Aktif",
            nextTier: 500,
            progress: ((rep - 100) / 400) * 100
        };
        return {
            color: "text-muted-foreground",
            bg: "bg-muted/50",
            border: "border-border/50",
            icon: Target,
            label: "Yeni",
            nextTier: 100,
            progress: (rep / 100) * 100
        };
    };

    const tier = getTierInfo(reputation);
    const Icon = tier.icon;

    // Animate reputation count
    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = reputation;
            const duration = 1500;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setAnimatedRep(end);
                    clearInterval(timer);
                } else {
                    setAnimatedRep(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, reputation]);

    if (showProgress && size === "lg") {
        // Large version with circular progress
        return (
            <div ref={ref} className={cn("relative inline-flex items-center gap-4", className)}>
                {/* Circular Progress */}
                <div className="relative">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-muted/20"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className={tier.color}
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: tier.progress / 100 } : { pathLength: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{
                                strokeDasharray: "283",
                                strokeDashoffset: 0
                            }}
                        />
                    </svg>
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
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
                            className={tier.color}
                        >
                            <Icon className="h-8 w-8" />
                        </motion.div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                        <span className={cn("text-3xl font-bold", tier.color)}>
                            {animatedRep.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-sm text-muted-foreground uppercase font-medium tracking-wider">
                            puan
                        </span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        {tier.label}
                    </div>
                    {tier.nextTier && (
                        <div className="text-xs text-muted-foreground">
                            {tier.nextTier - reputation} puan kaldı
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Compact version
    return (
        <motion.div
            ref={ref}
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
                <span className="font-bold tracking-tight">{animatedRep.toLocaleString('tr-TR')}</span>
                {showLabel && size !== "sm" && (
                    <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider">
                        {tier.label}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
