"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
}

interface UserBadge {
    awarded_at: string;
    badges: Badge;
}

interface BadgeDisplayProps {
    userBadges: UserBadge[];
    maxDisplay?: number;
    size?: "sm" | "md" | "lg";
}

// Determine badge rarity based on category or name
function getBadgeRarity(badge: Badge): "common" | "rare" | "epic" | "legendary" {
    const rarityMap: Record<string, "common" | "rare" | "epic" | "legendary"> = {
        "participation": "common",
        "contribution": "rare",
        "achievement": "epic",
        "special": "legendary"
    };
    return rarityMap[badge.category] || "common";
}

const rarityStyles = {
    common: {
        border: "border-gray-400/30",
        bg: "from-gray-400/10 to-gray-500/5",
        glow: "group-hover:shadow-gray-400/20",
        badge: "bg-gray-500/20 text-gray-300 border-gray-400/30"
    },
    rare: {
        border: "border-blue-400/30",
        bg: "from-blue-400/10 to-cyan-500/5",
        glow: "group-hover:shadow-blue-400/30",
        badge: "bg-blue-500/20 text-blue-300 border-blue-400/30"
    },
    epic: {
        border: "border-purple-400/30",
        bg: "from-purple-400/10 to-pink-500/5",
        glow: "group-hover:shadow-purple-400/30",
        badge: "bg-purple-500/20 text-purple-300 border-purple-400/30"
    },
    legendary: {
        border: "border-amber-400/30",
        bg: "from-amber-400/10 to-orange-500/5",
        glow: "group-hover:shadow-amber-400/30",
        badge: "bg-amber-500/20 text-amber-300 border-amber-400/30"
    }
};

const rarityLabels = {
    common: "Yaygın",
    rare: "Nadir",
    epic: "Epik",
    legendary: "Efsanevi"
};

export function BadgeDisplay({ userBadges, maxDisplay = 5, size = "md" }: BadgeDisplayProps) {
    const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);
    const displayBadges = userBadges.slice(0, maxDisplay);
    const remainingCount = userBadges.length - maxDisplay;

    const sizeClasses = {
        sm: "text-lg p-1.5",
        md: "text-2xl p-2.5",
        lg: "text-4xl p-4"
    };

    if (userBadges.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <AnimatePresence mode="popLayout">
                {displayBadges.map((userBadge, index) => {
                    const rarity = getBadgeRarity(userBadge.badges);
                    const styles = rarityStyles[rarity];
                    const isHovered = hoveredBadge === userBadge.badges.id;

                    return (
                        <motion.div
                            key={userBadge.badges.id}
                            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: index * 0.1
                            }}
                            className="group relative"
                            onHoverStart={() => setHoveredBadge(userBadge.badges.id)}
                            onHoverEnd={() => setHoveredBadge(null)}
                        >
                            <div className={cn(
                                "relative cursor-help transition-all duration-300",
                                "rounded-xl bg-gradient-to-br backdrop-blur-md",
                                "border shadow-lg",
                                "hover:-translate-y-1 hover:scale-110",
                                styles.bg,
                                styles.border,
                                styles.glow,
                                sizeClasses[size]
                            )}>
                                {/* Animated glow effect */}
                                <motion.div
                                    className={cn(
                                        "absolute inset-0 rounded-xl blur-xl opacity-0 transition-opacity duration-500",
                                        styles.bg
                                    )}
                                    animate={{ opacity: isHovered ? 0.6 : 0 }}
                                />

                                {/* Rarity indicator - corner sparkle */}
                                {rarity !== "common" && (
                                    <motion.div
                                        className="absolute -top-1 -right-1"
                                        animate={{
                                            rotate: [0, 360],
                                            scale: isHovered ? [1, 1.2, 1] : 1
                                        }}
                                        transition={{
                                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 0.3 }
                                        }}
                                    >
                                        <Sparkles className={cn("h-3 w-3", {
                                            "text-blue-400": rarity === "rare",
                                            "text-purple-400": rarity === "epic",
                                            "text-amber-400": rarity === "legendary"
                                        })} />
                                    </motion.div>
                                )}

                                <div className="relative z-10 drop-shadow-sm">
                                    {userBadge.badges.icon}
                                </div>
                            </div>

                            {/* Premium Tooltip */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-max max-w-[220px]"
                                    >
                                        <div className="bg-popover/95 backdrop-blur-xl text-popover-foreground p-3 rounded-xl shadow-2xl border border-white/10">
                                            {/* Rarity badge */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-bold text-sm bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                                    {userBadge.badges.name}
                                                </div>
                                                <BadgeUI className={cn("text-[9px] px-1.5 py-0.5 h-4 border", styles.badge)}>
                                                    {rarityLabels[rarity]}
                                                </BadgeUI>
                                            </div>

                                            <div className="text-[10px] text-muted-foreground leading-tight mb-2">
                                                {userBadge.badges.description}
                                            </div>

                                            <div className="text-[9px] text-muted-foreground/50 font-mono border-t border-white/5 pt-1.5">
                                                {new Date(userBadge.awarded_at).toLocaleDateString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        {/* Arrow */}
                                        <div className="w-2 h-2 bg-popover/95 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-white/10" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {remainingCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: displayBadges.length * 0.1 }}
                >
                    <BadgeUI variant="secondary" className="h-8 px-3 text-xs font-medium rounded-full bg-muted/50 hover:bg-muted transition-colors border border-white/5">
                        +{remainingCount}
                    </BadgeUI>
                </motion.div>
            )}
        </div>
    );
}
