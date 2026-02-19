"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Shared Props
interface NanoIconProps {
    className?: string;
    isActive?: boolean;
}

// 1. HOME (Ev)
// Solid, bold House.
export function IconHome({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M3 9.5L12 2L21 9.5V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9.5Z"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
            {/* Door detail for active state */}
            <motion.path
                d="M9 22V12H15V22"
                stroke={isActive ? "white" : "none"}
                fill="none"
                strokeWidth={2}
                className="dark:stroke-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
            />
        </svg>
    );
}

// 2. ARTICLES (Makale/Blog) - WAS COMPASS, NOW BOOK
// Open Book representation.
export function IconExplore({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M2 3H8C10.2091 3 12 4.79086 12 7V21C12 18.7909 10.2091 17 8 17H2V3Z"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <motion.path
                d="M22 3H16C13.7909 3 12 4.79086 12 7V21C12 18.7909 13.7909 17 16 17H22V3Z"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Page lines detail */}
            <motion.path
                d="M17 7H20M17 11H20"
                stroke={isActive ? "white" : "transparent"}
                strokeWidth={1.5}
                strokeLinecap="round"
                className="dark:stroke-black"
            />
        </svg>
    );
}

// 3. FORUM (Forum)
// Chat Bubbles.
export function IconForum({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.path
                d="M21 15C21 15.5523 20.5523 16 20 16H13L10 19L7 16H4C3.44772 16 3 15.5523 3 15V5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V15Z"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ y: isActive ? -2 : 0 }}
            />
            {/* Dots */}
            <motion.circle cx="8" cy="10" r="1.5" fill={isActive ? "white" : "none"} className="dark:fill-black" />
            <motion.circle cx="12" cy="10" r="1.5" fill={isActive ? "white" : "none"} className="dark:fill-black" />
            <motion.circle cx="16" cy="10" r="1.5" fill={isActive ? "white" : "none"} className="dark:fill-black" />
        </svg>
    );
}

// 4. PROFILE (Profil)
// User Silhouette.
export function IconProfile({ className, isActive }: NanoIconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
            <motion.circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                animate={{ scale: isActive ? 1.05 : 1 }}
            />
            <motion.path
                d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 2}
                fill={isActive ? "currentColor" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 5. HUBGPT LOGO - ROBOT (Robot Kafası)
export function HubGPTLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={cn("w-full h-full", className)}>
            {/* Robot Head Shape */}
            <motion.rect
                x="2" y="4" width="20" height="16" rx="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-black dark:text-white"
            />

            {/* Eyes */}
            <motion.circle cx="8" cy="11" r="1.5" fill="currentColor" className="text-black dark:text-white" />
            <motion.circle cx="16" cy="11" r="1.5" fill="currentColor" className="text-black dark:text-white" />

            {/* Grid Mouth/Speaker */}
            <motion.path
                d="M8 16H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0 1"
                className="text-black dark:text-white"
            />

            {/* Antenna */}
            <motion.path
                d="M12 4V1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-black dark:text-white"
            />
            <motion.circle
                cx="12" cy="1" r="1.5"
                fill="currentColor"
                className="text-red-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
        </svg>
    );
}
