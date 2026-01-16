"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
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

export function BadgeDisplay({ userBadges, maxDisplay = 4, size = "md" }: BadgeDisplayProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Group badges by category
    const badgesByCategory = userBadges.reduce((acc, userBadge) => {
        const cat = userBadge.badges.category || "Genel";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(userBadge);
        return acc;
    }, {} as Record<string, UserBadge[]>);

    // Sort categories (optional logic)
    const categories = Object.keys(badgesByCategory).sort();

    if (userBadges.length === 0) {
        return null;
    }

    const displayBadges = userBadges.slice(0, maxDisplay);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="group flex items-center gap-3 cursor-pointer select-none hover:opacity-80 transition-opacity p-1 rounded-lg">
                    {/* Overlapping Stack */}
                    <div className="flex items-center -space-x-3">
                        {displayBadges.map((userBadge, index) => (
                            <div
                                key={userBadge.badges.id}
                                className={cn(
                                    "relative rounded-full ring-2 ring-background z-10 transition-transform duration-300",
                                    "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm",
                                    "flex items-center justify-center overflow-hidden",
                                    size === "sm" ? "w-8 h-8 p-1.5" : "w-10 h-10 p-2",
                                    // Add slight tilt or offset for "natural" stacked look
                                    index === 0 && "z-40",
                                    index === 1 && "z-30",
                                    index === 2 && "z-20",
                                    index === 3 && "z-10",
                                )}
                            >
                                <CustomBadgeIcon name={userBadge.badges.name} className="w-full h-full drop-shadow-md" />
                            </div>
                        ))}
                    </div>

                    {/* Count & Arrow */}
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground/90 group-hover:text-foreground group-hover:underline decoration-wavy decoration-primary/50">
                        <span>{userBadges.length} kazanım</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden bg-zinc-950 border-zinc-800">
                <DialogHeader className="p-6 pb-2 bg-zinc-900/50 backdrop-blur-xl border-b border-white/5">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">Kazanımlar</span>
                        <span className="text-muted-foreground text-sm font-normal">({userBadges.length} açıldı)</span>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[70vh] p-6">
                    <div className="space-y-8">
                        {categories.map((category) => (
                            <div key={category} className="space-y-4">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1 border-l-2 border-primary/50">{category}</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {badgesByCategory[category].map((badge) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            key={badge.badges.id}
                                            className="flex flex-col items-center text-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group/badge"
                                        >
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover/badge:ring-primary/50 group-hover/badge:scale-105 transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                                {/* Fancy Glow Background */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/20 blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />

                                                <div className="w-10 h-10 text-foreground relative z-10">
                                                    <CustomBadgeIcon name={badge.badges.name} className="w-full h-full" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-bold text-sm leading-tight text-foreground group-hover/badge:text-primary transition-colors">{badge.badges.name}</div>
                                                <div className="text-[10px] items-center text-muted-foreground font-medium flex justify-center gap-1">
                                                    <span>{new Date(badge.awarded_at).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Placeholder for locked badges (visual flair only) */}
                                    <div className="flex flex-col items-center text-center gap-3 p-3 opacity-30 grayscale filter">
                                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                                            <Lock className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold text-sm leading-tight">???</div>
                                            <div className="text-[10px] text-muted-foreground">Kilitli</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
