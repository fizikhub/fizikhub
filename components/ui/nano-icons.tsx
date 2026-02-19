"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Shared Props
interface NanoIconProps {
    className?: string;
    isActive?: boolean;
}

// 1. STANDARD HOME 
// "Doğru düzgün" - Just a clean, bold house.
export function IconHome({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2} // Bold stroke
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isActive ? "currentColor" : "none"} // Solid fill on active
                initial={false}
                animate={{
                    fill: isActive ? "currentColor" : "transparent",
                    scale: isActive ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
        </svg>
    );
}

// 2. STANDARD EXPLORE (Compass/Discovery)
// No atoms. Just a bold compass or grid.
export function IconExplore({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            <motion.path
                d="M14.5 9.5L9.5 14.5" // Simple needle/cross
                stroke={isActive ? "white" : "currentColor"} // Invert color on fill
                strokeWidth={2}
                strokeLinecap="round"
                className="dark:stroke-black"
            />
            <motion.path
                d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" // Compass star
                stroke={isActive ? "white" : "currentColor"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-black"
                animate={{ rotate: isActive ? 45 : 0 }}
            />
        </svg>
    );
}

// 3. STANDARD FORUM (Chat Bubbles)
// No floating bubbles. Just grounded, solid bubbles.
export function IconForum({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M21 11.5C21 16.1944 16.9706 20 12 20C9.6631 20 7.5387 19.1557 5.96803 17.7661L3 19L3.92482 16.489C2.72124 15.1146 2 13.3854 2 11.5C2 6.80558 6.47715 3 12 3C17.5228 3 21 6.80558 21 11.5Z"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isActive ? "currentColor" : "none"}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            {/* Detail lines inside */}
            <motion.circle cx="8" cy="11.5" r="1" fill={isActive ? "white" : "currentColor"} className="dark:fill-black" />
            <motion.circle cx="12" cy="11.5" r="1" fill={isActive ? "white" : "currentColor"} className="dark:fill-black" />
            <motion.circle cx="16" cy="11.5" r="1" fill={isActive ? "white" : "currentColor"} className="dark:fill-black" />
        </svg>
    );
}

// 4. STANDARD PROFILE (User)
// No astronaut. 
export function IconProfile({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
                animate={{ scale: isActive ? 1.1 : 1 }}
            />
            <motion.path
                d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isActive ? "currentColor" : "none"}
                animate={{
                    d: isActive ? "M20 21V19C20 15 18 14 12 14C6 14 4 15 4 19V21" : "M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21",
                    scale: isActive ? 1.1 : 1
                }}
            />
        </svg>
    );
}

// 5. HUBGPT LOGO (Hexagon + Lightning) - Based on generated concept
export function HubGPTLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-full h-full", className)}>
            {/* Bold Hexagon Container */}
            <motion.path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="text-black dark:text-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            />

            {/* Lightning Bolt Center */}
            <motion.path
                d="M13 3L6 14H12L11 21L18 10H12L13 3Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </svg>
    );
}
