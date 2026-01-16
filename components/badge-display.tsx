"use client";

import { cn } from "@/lib/utils";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Lock, Trophy, Star } from "lucide-react";
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
            if (!val) setSelectedBadge(null);
        }}>
            <DialogTrigger asChild>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-3 cursor-pointer select-none bg-zinc-100 dark:bg-zinc-900/50 p-2 pr-4 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-colors"
                >
                    {/* Overlapping Stack */}
                    <div className="flex items-center -space-x-4 pl-1">
                        {displayBadges.map((userBadge, index) => (
                            <div
                                key={userBadge.badges.id}
                                className={cn(
                                    "relative rounded-full z-10 transition-transform duration-300 transform group-hover:-translate-x-1",
                                    size === "sm" ? "w-10 h-10" : "w-12 h-12",
                                    index === 0 && "z-40",
                                    index === 1 && "z-30",
                                    index === 2 && "z-20",
                                    index === 3 && "z-10",
                                )}
                            >
                                <div className="absolute inset-0 bg-black/20 rounded-full blur-[2px]" />
                                <CustomBadgeIcon name={userBadge.badges.name} className="w-full h-full drop-shadow-md relative z-10" />
                            </div>
                        ))}
                    </div>

                    {/* Count */}
                    <div className="flex flex-col items-start gap-0.5 ml-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kazanılan</span>
                        <div className="flex items-center gap-1 text-sm font-black text-foreground">
                            <span>{userBadges.length} ROZET</span>
                            <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl h-[85vh] p-0 flex flex-col gap-0 overflow-hidden bg-[#050505] border-2 border-white/10 shadow-[0_0_50px_-10px_rgba(59,130,246,0.2)] rounded-2xl !bg-[#050505]">

                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

                {/* Header */}
                <DialogHeader className="p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 z-10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {selectedBadge ? (
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors group"
                                >
                                    <ChevronRight className="w-6 h-6 rotate-180 text-white/70 group-hover:text-white" />
                                </button>
                            ) : (
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Trophy className="w-6 h-6 text-blue-400" />
                                </div>
                            )}

                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                                    {selectedBadge ? "Kazanım Detayı" : "Kazanımlar"}
                                </DialogTitle>
                                {!selectedBadge && (
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-widest mt-1">
                                        Toplam {userBadges.length} Başarı Açıldı
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative z-10">
                    <AnimatePresence mode="wait">
                        {selectedBadge ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="h-full flex flex-col md:flex-row"
                            >
                                {/* Left Side: Icon Showcase */}
                                <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-purple-500/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
                                    <motion.div
                                        className="w-48 h-48 md:w-64 md:h-64 relative z-10"
                                        initial={{ scale: 0.8, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                    >
                                        <CustomBadgeIcon name={selectedBadge.badges.name} className="w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                                    </motion.div>

                                    {/* 3D Floor Effect */}
                                    <div className="absolute bottom-10 w-40 h-10 bg-black/20 blur-xl rounded-full" />
                                </div>

                                {/* Right Side: Info */}
                                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">
                                                <Star className="w-3 h-3 fill-current" />
                                                {selectedBadge.badges.category || "Genel"}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black uppercase leading-none text-white mb-2">
                                                {selectedBadge.badges.name}
                                            </h2>
                                            <div className="text-xs text-white/40 font-mono">
                                                KAZANILDI: {new Date(selectedBadge.awarded_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                                                <h3 className="text-xs font-bold text-white/50 uppercase mb-2">AÇIKLAMA</h3>
                                                <p className="text-lg font-medium text-white/90 leading-relaxed">
                                                    {selectedBadge.badges.description || "Bu rozet, FizikHub evrenindeki üstün başarılarınızın bir kanıtıdır."}
                                                </p>
                                            </div>

                                            <div className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                                    <Trophy className="w-24 h-24 rotate-12" />
                                                </div>
                                                <h3 className="text-xs font-bold text-blue-300 uppercase mb-2 relative z-10">NASIL KAZANILIR?</h3>
                                                <p className="text-sm text-white/80 relative z-10 font-medium">
                                                    {/* Simulated criteria */}
                                                    {selectedBadge.badges.name.includes("Einstein") ? "Bilim kategorisinde paylaşımlarınla topluluğu aydınlat ve yüksek etkileşim al." :
                                                        selectedBadge.badges.name.includes("Newton") ? "Yerçekimi kanunlarına meydan okuyan sorular sorarak fizik tartışmalarını alevlendir." :
                                                            selectedBadge.badges.name.includes("Tesla") ? "Elektrik ve enerji konularında yenilikçi fikirler paylaş, tabuları yık." :
                                                                selectedBadge.badges.name.includes("Yazar") ? "Kapsamlı ve özgün makaleler yayınlayarak bilgi havuzuna katkıda bulun." :
                                                                    selectedBadge.badges.name.includes("Kaşif") ? "FizikHub'ın derinliklerini keşfederek gizli özellikleri bul." :
                                                                        "FizikHub topluluğuna aktif katılım göstererek, içerik üreterek veya diğer üyelerle etkileşime geçerek bu rozeti kazanabilirsin."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <ScrollArea className="h-full">
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 md:p-8 space-y-10"
                                >
                                    {categories.map((category, catIndex) => (
                                        <div key={category} className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                                                    {category}
                                                </h3>
                                                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                                            </div>

                                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                                {badgesByCategory[category].map((badge, idx) => (
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: (catIndex * 0.1) + (idx * 0.05) }}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedBadge(badge)}
                                                        key={badge.badges.id}
                                                        className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
                                                    >
                                                        {/* Hover Glow */}
                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                        <div className="relative w-24 h-24 drop-shadow-xl z-10 transition-transform duration-300 group-hover:scale-110">
                                                            <CustomBadgeIcon name={badge.badges.name} className="w-full h-full" />
                                                        </div>

                                                        <div className="text-center w-full z-10">
                                                            <div className="font-bold text-sm text-white truncate px-1">
                                                                {badge.badges.name}
                                                            </div>
                                                            <div className="text-[10px] text-white/40 font-mono mt-1">
                                                                {new Date(badge.awarded_at).getFullYear()}
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                ))}

                                                {/* Locked Slots */}
                                                {Array.from({ length: Math.max(0, 4 - badgesByCategory[category].length) }).map((_, i) => (
                                                    <div
                                                        key={`locked-${category}-${i}`}
                                                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] opacity-50"
                                                    >
                                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                                            <Lock className="w-6 h-6 text-white/20" />
                                                        </div>
                                                        <div className="w-16 h-2 bg-white/10 rounded-full" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </ScrollArea>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
