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
import { motion, AnimatePresence } from "framer-motion";

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
    const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);

    // Group badges by category
    const badgesByCategory = userBadges.reduce((acc, userBadge) => {
        const cat = userBadge.badges.category || "Genel";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(userBadge);
        return acc;
    }, {} as Record<string, UserBadge[]>);

    const categories = Object.keys(badgesByCategory).sort();

    if (userBadges.length === 0) {
        return null;
    }

    const displayBadges = userBadges.slice(0, maxDisplay);

    return (
        <Dialog open={isOpen} onOpenChange={(val) => {
            setIsOpen(val);
            if (!val) setSelectedBadge(null); // Reset on close
        }}>
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

            <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-xl">

                {/* Header */}
                <DialogHeader className="p-6 pb-4 bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-white">
                    {selectedBadge ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="p-1 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">
                                Kazanım Detayı
                            </DialogTitle>
                        </div>
                    ) : (
                        <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center justify-between">
                            <span>Kazanımlar</span>
                            <span className="text-sm font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md">
                                {userBadges.length} AÇILDI
                            </span>
                        </DialogTitle>
                    )}
                </DialogHeader>

                <ScrollArea className="h-full max-h-[60vh]">
                    <AnimatePresence mode="wait">
                        {selectedBadge ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 flex flex-col items-center text-center"
                            >
                                <div className="w-40 h-40 relative mb-6">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                                    <div className="w-full h-full relative z-10 drop-shadow-2xl">
                                        <CustomBadgeIcon name={selectedBadge.badges.name} className="w-full h-full" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    {selectedBadge.badges.name}
                                </h2>

                                <div className="inline-block px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-zinc-600 dark:text-zinc-400">
                                    {selectedBadge.badges.category || "Genel"}
                                </div>

                                <div className="max-w-md space-y-4 bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-1">Açıklama</h3>
                                        <p className="font-medium text-lg leading-snug">
                                            {selectedBadge.badges.description || "Bu rozet, FizikHub topluluğundaki üstün başarıların ve katkıların bir sembolüdür."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-1">Nasıl Kazanılır?</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                            {/* We simulate 'how to earn' since it might not be in the DB yet */}
                                            {selectedBadge.badges.name.includes("Einstein") ? "Bilim kategorisinde 100+ etkileşim alarak toplulukta bir deha olduğunu kanıtla." :
                                                selectedBadge.badges.name.includes("Newton") ? "Yerçekimi kanunlarına meydan okuyan sorular sorarak fizik tartışmalarını alevlendir." :
                                                    selectedBadge.badges.name.includes("Tesla") ? "Elektrik ve enerji konularında yenilikçi fikirler paylaş." :
                                                        selectedBadge.badges.name.includes("Yazar") ? "Kapsamlı ve özgün makaleler yayınlayarak bilgi havuzuna katkıda bulun." :
                                                            selectedBadge.badges.name.includes("Kaşif") ? "FizikHub'ın derinliklerini keşfederek gizli özelliklerini kullan." :
                                                                "FizikHub topluluğuna aktif katılım göstererek, içerik üreterek veya diğer üyelerle etkileşime geçerek bu rozeti kazanabilirsin."}
                                        </p>
                                    </div>

                                    <div className="pt-2 text-xs text-muted-foreground font-mono">
                                        Kazanılma Tarihi: {new Date(selectedBadge.awarded_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 space-y-8"
                            >
                                {categories.map((category) => (
                                    <div key={category} className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-wider pl-3 py-1 border-l-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-800/50 w-full rounded-r-md">
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                            {badgesByCategory[category].map((badge) => (
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedBadge(badge)}
                                                    key={badge.badges.id}
                                                    className="flex flex-col items-center text-center gap-3 p-4 rounded-xl border border-transparent hover:border-black/5 dark:hover:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all group/badge"
                                                >
                                                    <div className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-lg group-hover/badge:drop-shadow-2xl transition-all">
                                                        <CustomBadgeIcon name={badge.badges.name} className="w-full h-full" />
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="font-bold text-xs md:text-sm leading-tight text-foreground line-clamp-2">
                                                            {badge.badges.name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground font-mono">
                                                            {new Date(badge.awarded_at).toLocaleDateString('tr-TR')}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}

                                            {/* Locked Slots Filler */}
                                            {Array.from({ length: Math.max(0, 4 - badgesByCategory[category].length) }).map((_, i) => (
                                                <div key={`locked-${category}-${i}`} className="flex flex-col items-center justify-center gap-3 p-4 opacity-40">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                                        <Lock className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScrollArea>

                {/* Footer Tip */}
                {!selectedBadge && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800 text-center text-xs text-muted-foreground font-medium">
                        Detaylarını görmek için bir rozete tıkla.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
