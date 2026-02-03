"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface NeoBrutalistCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "interactive" | "featured" | "plain";
    accentColor?: "yellow" | "purple" | "green" | "pink" | "blue" | "orange";
}

const variants = {
    default: "bg-background border-2 border-border shadow-neo",
    interactive:
        "bg-background border-2 border-border shadow-neo hover:shadow-neo-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer",
    featured: "bg-accent/10 border-2 border-accent shadow-neo font-bold",
    plain: "bg-card border-2 border-border",
};

const accents = {
    yellow: "border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]",
    purple: "border-purple-500 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]",
    green: "border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] hover:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)]",
    pink: "border-pink-500 shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)]",
    blue: "border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)]",
    orange: "border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:shadow-[6px_6px_0px_0px_rgba(249,115,22,1)]",
};

export const NeoBrutalistCard = React.forwardRef<HTMLDivElement, NeoBrutalistCardProps>(
    ({ children, className, variant = "default", accentColor, ...props }, ref) => {
        // If accentColor is provided, we override the default border/shadow
        const accentClass = accentColor ? accents[accentColor] : "";

        // Base classes based on variant, but if accent is present, we might need to remove default shadow from variant
        // Actually, let's just append the accent class which has higher specificity or cascades later

        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-xl overflow-hidden relative", // Rounded corners for that 'Pop' feel, but strict borders
                    variants[variant],
                    accentClass,
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

NeoBrutalistCard.displayName = "NeoBrutalistCard";
