"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

export function BadgeDisplay({ userBadges, maxDisplay = 5, size = "md" }: BadgeDisplayProps) {
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
            {displayBadges.map((userBadge, index) => (
                <motion.div
                    key={userBadge.badges.id}
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: index * 0.1
                    }}
                    className="group relative"
                >
                    <div className={cn(
                        "relative cursor-help transition-all duration-300",
                        "rounded-xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md",
                        "border border-white/10 shadow-lg hover:shadow-primary/20",
                        "hover:-translate-y-1 hover:scale-110",
                        "group-hover:border-primary/30",
                        sizeClasses[size]
                    )}>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 drop-shadow-sm">
                            {userBadge.badges.icon}
                        </div>
                    </div>

                    {/* Premium Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50 w-max max-w-[200px]">
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="bg-popover/95 backdrop-blur-xl text-popover-foreground p-3 rounded-xl shadow-xl border border-white/10 text-center"
                        >
                            <div className="font-bold text-sm bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                {userBadge.badges.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1 leading-tight">
                                {userBadge.badges.description}
                            </div>
                            <div className="mt-2 text-[9px] text-muted-foreground/50 font-mono border-t border-white/5 pt-1">
                                {new Date(userBadge.awarded_at).toLocaleDateString('tr-TR')}
                            </div>
                        </motion.div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-popover/95 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-white/10" />
                    </div>
                </motion.div>
            ))}

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
