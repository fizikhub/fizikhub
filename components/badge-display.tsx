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
import { ChevronRight, Lock, Trophy, Star, X } from "lucide-react";
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
        const rawCat = userBadge.badges.category || "General";
        // Category Translation Map (Review and Expand)
        const catMap: Record<string, string> = {
            "Special": "Özel",
            "Milestone": "Kilometre Taşı",
            "Engagement": "Etkileşim",
            "Contribution": "Katkı",
            "General": "Genel"
        };
        const cat = catMap[rawCat] || rawCat;

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
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-3 cursor-pointer select-none bg-white border-2 border-black p-2 pr-4 rounded-xl shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
                >
                    {/* Overlapping Stack */}
                    <div className="flex items-center -space-x-4 pl-1">
                        {displayBadges.map((userBadge, index) => (
                            <div
                                key={userBadge.badges.id}
                                className={cn(
                                    "relative z-10 transition-transform duration-300 transform group-hover:-translate-x-1",
                                    size === "sm" ? "w-10 h-10" : "w-12 h-12",
                                    index === 0 && "z-40 rotate-[-5deg]",
                                    index === 1 && "z-30 rotate-[3deg]",
                                    index === 2 && "z-20 rotate-[-2deg]",
                                    index === 3 && "z-10 rotate-[5deg]",
                                )}
                            >
                                <CustomBadgeIcon name={userBadge.badges.name} className="w-full h-full relative z-10 rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* Count */}
                    <div className="flex flex-col items-start gap-0.5 ml-1">
                        <span className="text-[10px] font-black text-black/60 uppercase tracking-widest leading-none">Koleksiyon</span>
                        <div className="flex items-center gap-1 text-sm font-black text-black">
                            <span>{userBadges.length} Çıkartma</span>
                            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform stroke-[3px]" />
                        </div>
                    </div>
                </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl h-[90vh] md:h-[85vh] p-0 flex flex-col gap-0 overflow-hidden bg-[#FAF9F6] border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] rounded-none sm:rounded-2xl">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                {/* Header */}
                <DialogHeader className="p-4 md:p-6 bg-white border-b-[3px] border-black z-10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            {selectedBadge ? (
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="p-1.5 md:p-2 -ml-2 rounded-lg hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black group"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 rotate-180 stroke-[3px]" />
                                </button>
                            ) : (
                                <div className="p-1.5 md:p-2 bg-yellow-400 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000]">
                                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-black stroke-[3px]" />
                                </div>
                            )}

                            <div>
                                <DialogTitle className="text-xl md:text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-2 md:gap-3 italic">
                                    {selectedBadge ? "Çıkartma Detayı" : "Koleksiyon Kitabı"}
                                </DialogTitle>
                                {!selectedBadge && (
                                    <p className="text-[10px] md:text-xs font-medium text-black/40 uppercase tracking-widest mt-0.5 md:mt-1">
                                        Toplam {userBadges.length} Başarı Açıldı
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Close Button X */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors border-2 border-transparent hover:border-black"
                        >
                            <X className="w-6 h-6 md:w-8 md:h-8 stroke-[3px]" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative z-10">
                    <AnimatePresence mode="wait">
                        {selectedBadge ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="h-full flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
                            >
                                {/* Left Side: Icon Showcase (Top on Mobile) */}
                                <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center bg-[#f0f0f0] border-b-[3px] md:border-b-0 md:border-r-[3px] border-black relative shrink-0 min-h-[300px] md:min-h-auto overflow-hidden">
                                    {/* Simple Animated BG Elements */}
                                    <motion.div
                                        className="absolute w-48 h-48 md:w-64 md:h-64 bg-yellow-400 rounded-full mix-blend-multiply opacity-20"
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute w-48 h-48 md:w-64 md:h-64 bg-blue-400 rounded-full mix-blend-multiply opacity-20 left-4 md:left-10 top-4 md:top-10"
                                        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    />

                                    <motion.div
                                        className="w-48 h-48 md:w-64 md:h-64 relative z-10"
                                        initial={{ scale: 0.8, rotate: -5 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                    >
                                        <CustomBadgeIcon name={selectedBadge.badges.name} className="w-full h-full drop-shadow-[8px_8px_0px_rgba(0,0,0,0.2)] rounded-full" />
                                    </motion.div>
                                </div>

                                {/* Right Side: Info */}
                                <div className="w-full md:w-1/2 p-6 md:p-8 bg-white overflow-visible md:overflow-y-auto">
                                    <div className="space-y-6 md:space-y-8 pb-10">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white border-2 border-black rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 shadow-[3px_3px_0px_#94a3b8]">
                                                <Star className="w-3 h-3 md:w-4 md:h-4 fill-current stroke-none" />
                                                {/* Ensure category is translated here if needed */}
                                                {(function () {
                                                    const raw = selectedBadge.badges.category || "General";
                                                    const map: Record<string, string> = { "Special": "Özel", "Milestone": "Kilometre Taşı", "Engagement": "Etkileşim", "Contribution": "Katkı", "General": "Genel" };
                                                    const cat = map[raw] || raw;
                                                    return cat;
                                                })()}
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.9] text-black mb-2 tracking-tighter break-words">
                                                {selectedBadge.badges.name}
                                            </h2>
                                            <div className="text-xs md:text-sm font-bold text-black/40 font-mono mt-2 bg-black/5 inline-block px-2 py-1 rounded">
                                                KAZANILDI: {new Date(selectedBadge.awarded_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:space-y-6">
                                            <div className="p-4 md:p-6 bg-blue-50 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_#000] md:shadow-[6px_6px_0px_#000]">
                                                <h3 className="text-xs md:text-sm font-black text-blue-600 uppercase mb-2 tracking-widest">AÇIKLAMA</h3>
                                                <p className="text-lg md:text-xl font-bold text-black leading-tight">
                                                    "{selectedBadge.badges.description || "Bu rozet, FizikHub evrenindeki üstün başarılarınızın bir kanıtıdır."}"
                                                </p>
                                            </div>

                                            <div className="p-4 md:p-6 bg-yellow-50 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_#000] md:shadow-[6px_6px_0px_#000] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                                    <Trophy className="w-24 h-24 md:w-32 md:h-32 rotate-12 stroke-[1px]" />
                                                </div>
                                                <h3 className="text-xs md:text-sm font-black text-yellow-600 uppercase mb-2 tracking-widest relative z-10">NASIL KAZANILIR?</h3>
                                                <p className="text-base md:text-lg font-bold text-black relative z-10">
                                                    {selectedBadge.badges.name.toLowerCase().includes("einstein") ? "Bilim kategorisinde paylaşımlarınla topluluğu aydınlat ve yüksek etkileşim al." :
                                                        selectedBadge.badges.name.toLowerCase().includes("newton") ? "Yerçekimi kanunlarına meydan okuyan sorular sorarak fizik tartışmalarını alevlendir." :
                                                            selectedBadge.badges.name.toLowerCase().includes("tesla") ? "Elektrik ve enerji konularında yenilikçi fikirler paylaş, tabuları yık." :
                                                                selectedBadge.badges.name.toLowerCase().includes("yazar") ? "Kapsamlı ve özgün makaleler yayınlayarak bilgi havuzuna katkıda bulun." :
                                                                    selectedBadge.badges.name.toLowerCase().includes("kaşif") ? "FizikHub'ın derinliklerini keşfederek gizli özellikleri bul." :
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
                                    className="p-4 md:p-8 space-y-8 md:space-y-12 pb-20"
                                >
                                    {categories.map((category, catIndex) => (
                                        <div key={category} className="space-y-4 md:space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-black italic bg-white border-2 border-black px-3 md:px-4 py-1 shadow-[3px_3px_0px_#000] md:shadow-[4px_4px_0px_#000] -rotate-1 inline-block transform origin-left">
                                                    {category}
                                                </h3>
                                                <div className="h-[3px] flex-1 bg-black/10 border-b-[3px] border-dashed border-black/20" />
                                            </div>

                                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-6">
                                                {badgesByCategory[category].map((badge, idx) => (
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 10 - 5 }}
                                                        animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
                                                        transition={{ delay: (catIndex * 0.1) + (idx * 0.05), type: "spring" }}
                                                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedBadge(badge)}
                                                        key={badge.badges.id}
                                                        className="group relative flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl bg-white border-2 border-black hover:border-black hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer overflow-visible"
                                                    >
                                                        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-[10px] md:text-xs border-2 border-white z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100">
                                                            GO
                                                        </div>

                                                        <div className="relative w-16 h-16 md:w-24 md:h-24 drop-shadow-md z-10 filter group-hover:drop-shadow-none transition-all">
                                                            <CustomBadgeIcon name={badge.badges.name} className="w-full h-full relative z-10" />
                                                        </div>

                                                        <div className="text-center w-full z-10 pt-2 border-t-2 border-black/5 w-full">
                                                            <div className="font-black text-xs md:text-sm text-black uppercase truncate px-1">
                                                                {badge.badges.name}
                                                            </div>
                                                            <div className="hidden md:block text-[10px] text-black/40 font-mono mt-1 font-bold">
                                                                {new Date(badge.awarded_at).getFullYear()}
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                ))}

                                                {/* Locked Slots - Reduced Density */}
                                                {Array.from({ length: Math.max(0, 3 - badgesByCategory[category].length) }).map((_, i) => (
                                                    <div
                                                        key={`locked-${category}-${i}`}
                                                        className="flex flex-col items-center justify-center gap-3 p-3 md:p-4 rounded-xl border-2 border-dashed border-black/20 bg-black/[0.02] opacity-60 grayscale"
                                                    >
                                                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-black/5 flex items-center justify-center border-2 border-black/10">
                                                            <Lock className="w-4 h-4 md:w-6 md:h-6 text-black/30" />
                                                        </div>
                                                        <div className="w-10 md:w-16 h-1.5 md:h-2 bg-black/10 rounded-full" />
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
