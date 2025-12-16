"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    children: React.ReactNode;
    variant?: "default" | "primary" | "ghost";
}

export function RippleButton({
    children,
    className,
    variant = "default",
    ...props
}: RippleButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "relative overflow-hidden transition-all duration-300",
                variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
                variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}

// Animated Focus Input
interface AnimatedInputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
    label?: string;
}

export function AnimatedInput({ label, className, ...props }: AnimatedInputProps) {
    return (
        <div className="relative">
            <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "w-full px-4 py-2 border-2 border-border rounded-lg transition-all duration-300",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
                    "placeholder:text-muted-foreground",
                    className
                )}
                {...props}
            />
            {label && (
                <motion.label
                    initial={{ y: 0 }}
                    className="absolute left-3 -top-2.5 px-1 bg-background text-xs font-medium text-primary"
                >
                    {label}
                </motion.label>
            )}
        </div>
    );
}

// Bouncing Icon
export function BouncingIcon({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Pulse Effect
export function PulseEffect({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
