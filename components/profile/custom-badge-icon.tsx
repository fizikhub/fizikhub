"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Sticker Container
    // 'Hard' look: Solid border, hard shadow effect via CSS or SVG offset
    const Sticker = ({ children, color, rotate = 0 }: { children: React.ReactNode, color: string, rotate?: number }) => (
        <div className={cn("relative w-full h-full flex items-center justify-center p-1", className)}>
            <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1, rotate: rotate + 5 }}
                initial={{ rotate: rotate }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    {/* Background Shape - Imperfect Circle */}
                    <path
                        d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5 Z"
                        fill={color}
                        stroke="black"
                        strokeWidth="3"
                    />

                    {/* Inner Graphic Area */}
                    <g transform="translate(15, 15) scale(0.7)">
                        {children}
                    </g>
                </svg>
            </motion.div>
        </div>
    );

    // Einstein / Science (Atom)
    if (normalizedName.includes("einstein") || normalizedName.includes("bilim")) {
        return (
            <Sticker color="#FCD34D" rotate={-5}>
                {/* Nucleus */}
                <circle cx="50" cy="50" r="12" fill="black" />
                {/* Electrons */}
                <motion.ellipse
                    cx="50" cy="50" rx="40" ry="12"
                    fill="none" stroke="black" strokeWidth="4"
                    transform="rotate(0 50 50)"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.ellipse
                    cx="50" cy="50" rx="40" ry="12"
                    fill="none" stroke="black" strokeWidth="4"
                    transform="rotate(60 50 50)"
                    animate={{ rotate: 420 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.ellipse
                    cx="50" cy="50" rx="40" ry="12"
                    fill="none" stroke="black" strokeWidth="4"
                    transform="rotate(120 50 50)"
                    animate={{ rotate: 480 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </Sticker>
        );
    }

    // Newton / Physics (Apple)
    if (normalizedName.includes("newton") || normalizedName.includes("elma") || normalizedName.includes("yerçekimi")) {
        return (
            <Sticker color="#4ADE80" rotate={5}>
                <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <path d="M50 20 Q60 5 70 20 L70 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M70 20 Q80 10 90 20 Q95 50 50 90 Q5 50 10 20 Q20 10 30 20 Q40 30 50 20" fill="#EF4444" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                    {/* Shine */}
                    <path d="M25 35 Q30 30 35 35" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
            </Sticker>
        );
    }

    // Tesla / Electricity (Mjölnir/Plug/Lightning)
    if (normalizedName.includes("tesla") || normalizedName.includes("elektrik")) {
        return (
            <Sticker color="#60A5FA" rotate={-2}>
                <motion.path
                    d="M55 5 L35 45 H65 L45 95 L85 35 H55 L75 5 Z"
                    fill="#FDE047" stroke="black" strokeWidth="4" strokeLinejoin="round"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
            </Sticker>
        );
    }

    // Late Night / Owl (Moon)
    if (normalizedName.includes("gece") || normalizedName.includes("uykusuz")) {
        return (
            <Sticker color="#818CF8" rotate={3}>
                <path d="M70 10 A40 40 0 1 1 40 90 A30 30 0 1 0 70 10 Z" fill="#FEF3C7" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                {/* Zzz */}
                <motion.text x="65" y="40" fontSize="24" fontFamily="sans-serif, Arial" fontWeight="900" fill="white" stroke="black" strokeWidth="1"
                    animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
                >Z</motion.text>
                <motion.text x="75" y="25" fontSize="16" fontFamily="sans-serif, Arial" fontWeight="900" fill="white" stroke="black" strokeWidth="1"
                    animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >Z</motion.text>
            </Sticker>
        );
    }

    // Writer / Pen (Fountain Pen)
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <Sticker color="#F472B6" rotate={-4}>
                <motion.g
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: 0.5, originY: 1 }}
                >
                    <path d="M50 90 L30 30 L50 10 L70 30 Z" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="2" />
                    <rect x="30" y="30" width="40" height="10" fill="#333" stroke="black" strokeWidth="3" />
                </motion.g>
            </Sticker>
        );
    }

    // Explorer / Kaşif (Binoculars/Eye)
    if (normalizedName.includes("kaşif") || normalizedName.includes("explorer")) {
        return (
            <Sticker color="#22D3EE" rotate={4}>
                <path d="M20 40 A15 15 0 1 1 50 40 A15 15 0 1 1 20 40 M50 40 A15 15 0 1 1 80 40 A15 15 0 1 1 50 40" fill="white" stroke="black" strokeWidth="4" />
                <path d="M35 40 A5 5 0 1 1 40 40" fill="black" />
                <motion.circle cx="65" cy="40" r="5" fill="black"
                    animate={{ cx: [60, 70, 60] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx="35" cy="40" r="5" fill="black"
                    animate={{ cx: [30, 40, 30] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </Sticker>
        );
    }

    // Default Fallback
    return (
        <Sticker color="#cbd5e1">
            <circle cx="50" cy="50" r="30" fill="white" stroke="black" strokeWidth="4" />
            <path d="M35 45 L50 60 L65 35" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </Sticker>
    );
}
