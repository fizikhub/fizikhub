"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
    showLabel?: boolean;
}

export function ProgressBar({
    current,
    total,
    className,
    showLabel = true
}: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        İlerleme
                    </span>
                    <span className="text-sm font-bold text-primary">
                        {current} / {total}
                    </span>
                </div>
            )}
            <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-primary/80 relative"
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
            </div>
            {showLabel && (
                <div className="mt-1 text-xs text-muted-foreground text-right">
                    %{percentage.toFixed(0)} tamamlandı
                </div>
            )}
        </div>
    );
}

// Circular Progress
export function CircularProgress({
    current,
    total,
    size = 120,
    strokeWidth = 8
}: ProgressBarProps & { size?: number; strokeWidth?: number }) {
    const percentage = Math.min((current / total) * 100, 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-secondary"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-primary"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                    {percentage.toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground">
                    {current}/{total}
                </span>
            </div>
        </div>
    );
}

// Step Progress (for multi-step forms)
export function StepProgress({
    steps,
    currentStep
}: {
    steps: string[];
    currentStep: number;
}) {
    return (
        <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{
                                scale: index <= currentStep ? 1 : 0.8,
                                backgroundColor: index <= currentStep ? "hsl(var(--primary))" : "hsl(var(--secondary))"
                            }}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                                index <= currentStep ? "text-primary-foreground" : "text-muted-foreground"
                            )}
                        >
                            {index + 1}
                        </motion.div>
                        <span className="text-xs mt-2 text-center max-w-[80px] truncate">
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className="flex-1 h-1 mx-2">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: index < currentStep ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-primary origin-left"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
