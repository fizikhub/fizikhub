"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Zap, Star, Award, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: "trophy" | "target" | "zap" | "star" | "award" | "crown";
    color: "gold" | "silver" | "bronze" | "primary" | "purple";
    earned: boolean;
    earnedAt?: Date;
}

const iconMap = {
    trophy: Trophy,
    target: Target,
    zap: Zap,
    star: Star,
    award: Award,
    crown: Crown,
};

const colorMap = {
    gold: "from-yellow-400 to-yellow-600 text-yellow-900",
    silver: "from-gray-300 to-gray-500 text-gray-900",
    bronze: "from-orange-400 to-orange-600 text-orange-900",
    primary: "from-primary to-primary/80 text-primary-foreground",
    purple: "from-purple-400 to-purple-600 text-purple-900",
};

interface BadgeCardProps {
    badge: Badge;
    size?: "sm" | "md" | "lg";
}

export function BadgeCard({ badge, size = "md" }: BadgeCardProps) {
    const Icon = iconMap[badge.icon];
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={badge.earned ? { scale: 1.05, rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2",
                badge.earned
                    ? "bg-card border-border shadow-lg"
                    : "bg-muted/30 border-muted-foreground/20 grayscale opacity-60"
            )}
        >
            {/* Badge Icon */}
            <div
                className={cn(
                    "relative flex items-center justify-center rounded-full",
                    sizeClasses[size],
                    badge.earned
                        ? `bg-gradient-to-br ${colorMap[badge.color]} shadow-xl`
                        : "bg-muted"
                )}
            >
                {badge.earned && (
                    <>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        {/* Shine animation */}
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background:
                                    "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.3) 10%, transparent 20%)",
                            }}
                        />
                    </>
                )}
                <Icon className={cn("relative z-10", size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16")} />
            </div>

            {/* Badge Info */}
            <div className="text-center">
                <h4 className={cn("font-bold", size === "sm" ? "text-xs" : "text-sm")}>
                    {badge.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {badge.description}
                </p>
                {badge.earned && badge.earnedAt && (
                    <p className="text-[10px] text-primary mt-1">
                        {new Date(badge.earnedAt).toLocaleDateString("tr-TR")}
                    </p>
                )}
            </div>

            {/* Lock overlay for unearned badges */}
            {!badge.earned && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[2px]">
                    <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-1 border-2 border-white rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">🔒</span>
                        </div>
                        <p className="text-[10px] text-white font-medium">Kilitli</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// Badge Grid
export function BadgeGrid({ badges }: { badges: Badge[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} size="md" />
            ))}
        </div>
    );
}

// Badge notification (for when user earns a badge)
export function BadgeNotification({ badge }: { badge: Badge }) {
    const Icon = iconMap[badge.icon];

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]"
        >
            <div className="relative p-8 bg-card border-4 border-primary rounded-2xl shadow-2xl">
                {/* Confetti effect */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            x: Math.cos((i * 360) / 20) * 100,
                            y: Math.sin((i * 360) / 20) * 100,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute w-2 h-2 bg-primary rounded-full"
                    />
                ))}

                <div className="relative text-center">
                    <div className={cn("mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br shadow-xl mb-4", colorMap[badge.color])}>
                        <Icon className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">🎉 Rozet Kazandın!</h3>
                    <h4 className="text-xl font-semibold text-primary mb-1">
                        {badge.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
            </div>
        </motion.div>
    );
}
