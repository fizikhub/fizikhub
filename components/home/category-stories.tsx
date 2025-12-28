"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    QuantumIcon,
    AstroIcon,
    TechIcon,
    NatureIcon,
    BioIcon,
    ChemIcon,
    EduIcon,
    PhysicsIcon,
    ExploreIcon
} from "@/components/icons/category-icons";

export function CategoryStories() {
    const categories = [
        { name: "Kuantum", icon: QuantumIcon, href: "/blog?kategori=Kuantum", accent: "#3B82F6", glow: "shadow-blue-500/50" },
        { name: "Astrofizik", icon: AstroIcon, href: "/blog?kategori=Astrofizik", accent: "#F97316", glow: "shadow-orange-500/50" },
        { name: "Teknoloji", icon: TechIcon, href: "/blog?kategori=Teknoloji", accent: "#A855F7", glow: "shadow-purple-500/50" },
        { name: "Doğa", icon: NatureIcon, href: "/blog?kategori=Doga", accent: "#22C55E", glow: "shadow-green-500/50" },
        { name: "Biyoloji", icon: BioIcon, href: "/blog?kategori=Biyoloji", accent: "#14B8A6", glow: "shadow-teal-500/50" },
        { name: "Kimya", icon: ChemIcon, href: "/blog?kategori=Kimya", accent: "#EAB308", glow: "shadow-yellow-500/50" },
        { name: "Eğitim", icon: EduIcon, href: "/blog?kategori=Egitim", accent: "#6366F1", glow: "shadow-indigo-500/50" },
        { name: "Fizik", icon: PhysicsIcon, href: "/blog?kategori=Fizik", accent: "#F43F5E", glow: "shadow-pink-500/50" },
        { name: "Keşfet", icon: ExploreIcon, href: "/kesfet", accent: "#F59E0B", glow: "shadow-amber-500/50" },
    ];

    return (
        <div className="w-full py-4 px-4 sm:px-0">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Kategoriler</h2>
                <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Cards Container */}
            <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.04, type: "spring", stiffness: 200 }}
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative"
                        >
                            {/* Glow Effect on Hover */}
                            <div
                                className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${cat.glow}`}
                                style={{ background: cat.accent }}
                            />

                            {/* Main Card */}
                            <div
                                className="relative w-24 sm:w-28 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-foreground/50 transition-all duration-200 overflow-hidden"
                                style={{
                                    boxShadow: `4px 4px 0px 0px ${cat.accent}`
                                }}
                            >
                                {/* Top Accent Line */}
                                <div
                                    className="h-1 w-full"
                                    style={{ background: cat.accent }}
                                />

                                {/* Icon Container */}
                                <div className="p-4 sm:p-5 flex flex-col items-center gap-3">
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        {/* Icon Ring */}
                                        <div
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${cat.accent}20, ${cat.accent}40)`,
                                                border: `2px solid ${cat.accent}`
                                            }}
                                        >
                                            <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </div>
                                    </motion.div>

                                    {/* Label */}
                                    <span
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-center leading-tight group-hover:text-foreground transition-colors"
                                        style={{ color: cat.accent }}
                                    >
                                        {cat.name}
                                    </span>
                                </div>

                                {/* Bottom Corner Cut */}
                                <div
                                    className="absolute bottom-0 right-0 w-4 h-4"
                                    style={{
                                        background: `linear-gradient(135deg, transparent 50%, ${cat.accent} 50%)`
                                    }}
                                />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
