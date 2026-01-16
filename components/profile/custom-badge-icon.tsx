"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Helper for base glow
    const GlowDefs = ({ id, color }: { id: string, color: string }) => (
        <defs>
            <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id={`sphere-${id}`} cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </radialGradient>
        </defs>
    );

    // Common Container - A rotating ring with a glass core
    const Container = ({ children, color, id }: { children: React.ReactNode, color: string, id: string }) => (
        <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
                <GlowDefs id={id} color={color} />

                {/* Rotating Outer Ring */}
                <motion.circle
                    cx="50" cy="50" r="46"
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10 5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="opacity-50"
                />

                {/* Inner Static Ring */}
                <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="4" fill={`url(#sphere-${id})`} className="opacity-80" />

                {/* 3D Glass Highlight */}
                <path d="M20 50 A30 30 0 0 1 80 50" fill="none" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            </svg>

            {/* The Icon Itself */}
            <div className="absolute inset-0 flex items-center justify-center p-[20%] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {children}
            </div>
        </div>
    );

    // Einstein / Science
    if (normalizedName.includes("einstein") || normalizedName.includes("bilim")) {
        return (
            <Container color="#F59E0B" id="einstein">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <motion.path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"
                        animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" className="text-amber-200" />
                </svg>
            </Container>
        );
    }

    // Newton / Physics
    if (normalizedName.includes("newton") || normalizedName.includes("elma") || normalizedName.includes("yerçekimi")) {
        return (
            <Container color="#10B981" id="newton">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                    <motion.circle
                        cx="12" cy="6" r="4" fill="#a3e635"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <path d="M12 21L7 16M12 21L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </Container>
        );
    }

    // Tesla / Electricity
    if (normalizedName.includes("tesla") || normalizedName.includes("elektrik")) {
        return (
            <Container color="#3B82F6" id="tesla">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <motion.path
                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                        fill="#60A5FA"
                        animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </svg>
            </Container>
        );
    }

    // Late Night / Owl
    if (normalizedName.includes("gece") || normalizedName.includes("uykusuz") || normalizedName.includes("gece kuşu")) {
        return (
            <Container color="#6366f1" id="night">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#818cf8" stroke="white" strokeWidth="1" />
                    <motion.circle cx="15" cy="9" r="1" fill="white" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="10" cy="15" r="1" fill="white" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                </svg>
            </Container>
        );
    }

    // Writer / Pen
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <Container color="#ec4899" id="writer">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 19L19 12L22 15L15 22L12 19Z" fill="#f472b6" />
                    <path d="M18 13L8 3L3 8L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M3 21H21" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
            </Container>
        );
    }

    // Explorer / Kaşif
    if (normalizedName.includes("kaşif") || normalizedName.includes("explorer")) {
        return (
            <Container color="#06b6d4" id="explorer">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                    <motion.path
                        d="M12 8V4M12 20V16M8 12H4M20 12H16"
                        stroke="white" strokeWidth="2" strokeLinecap="round"
                    />
                    <motion.path
                        d="M14.828 9.172L9.172 14.828"
                        stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ originX: 0.5, originY: 0.5, transformOrigin: "12px 12px" }}
                    />
                </svg>
            </Container>
        );
    }

    // Default Fallback
    return (
        <Container color="#94a3b8" id="default">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" />
                <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </Container>
    );
}
