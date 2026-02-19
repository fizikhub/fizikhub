"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Shared Props
interface NanoIconProps {
    className?: string;
    isActive?: boolean;
}

// 1. COSMIC HOME
export function IconHome({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M3 9.5L12 2L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H15V14.5H9V21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{
                    fill: isActive ? "currentColor" : "transparent",
                    scale: isActive ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
            />
            {/* Planet Ring Detail */}
            <motion.path
                d="M12 5C15.866 5 19 8.13401 19 12"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0}
                initial={false}
                animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
        </svg>
    );
}

// 2. ORBIT EXPLORE (Blog)
export function IconExplore({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth={isActive ? 3 : 1.5}
                animate={{ r: isActive ? 2 : 3 }}
            />
            <motion.ellipse
                cx="12"
                cy="12"
                rx="7"
                ry="3"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={false}
                animate={{
                    rotate: isActive ? 180 : 0,
                    scale: isActive ? 1.1 : 1
                }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: "center" }}
            />
            <motion.path
                d="M19.07 4.93L17.66 6.34M4.93 19.07L6.34 17.66"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
            />
        </svg>
    );
}

// 3. NEBULA FORUM
export function IconForum({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M21 11.5C21 16.1944 16.9706 20 12 20C9.6631 20 7.5387 19.1557 5.96803 17.7661L3 19L3.92482 16.489C2.72124 15.1146 2 13.3854 2 11.5C2 6.80558 6.47715 3 12 3C17.5228 3 21 6.80558 21 11.5Z"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isActive ? "currentColor" : "none"}
                animate={{
                    y: isActive ? [0, -1, 0] : 0
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.circle
                cx="8" cy="11.5" r="1"
                fill={isActive ? "white" : "currentColor"}
                animate={{ opacity: isActive ? 1 : 0 }}
            />
            <motion.circle
                cx="12" cy="11.5" r="1"
                fill={isActive ? "white" : "currentColor"}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 0.1 }}
            />
            <motion.circle
                cx="16" cy="11.5" r="1"
                fill={isActive ? "white" : "currentColor"}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 0.2 }}
            />
        </svg>
    );
}

// 4. ASTRONAUT PROFILE
export function IconProfile({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 1.5}
                fill={isActive ? "currentColor" : "none"}
            />
            <motion.path
                d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                transition={{ duration: 0.3 }}
            />
        </svg>
    );
}

// 5. HUBGPT NEURAL CORE LOGO
export function HubGPTLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-full h-full", className)}>
            {/* Outer Core Ring */}
            <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                className="opacity-50"
            />

            {/* Inner Node Network */}
            <motion.path
                d="M12 6V18M6 12H18M7.8 7.8L16.2 16.2M16.2 7.8L7.8 16.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Central Node */}
            <motion.circle
                cx="12"
                cy="12"
                r="2"
                fill="currentColor"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Orbiting Electron */}
            <motion.circle
                cx="12"
                cy="2"
                r="1"
                fill="currentColor"
                animate={{ rotate: -360 }}
                style={{ originX: "12px", originY: "12px" }} // Rotate around center
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            />
        </svg>
    );
}
