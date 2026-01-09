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
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function CategoryStories() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';
    const isBlood = mounted && theme === 'blood';

    const categories = [
        { name: "Kuantum", icon: QuantumIcon, href: "/blog?kategori=Kuantum", accent: "#94A3B8" },
        { name: "Astrofizik", icon: AstroIcon, href: "/blog?kategori=Astrofizik", accent: "#94A3B8" },
        { name: "Teknoloji", icon: TechIcon, href: "/blog?kategori=Teknoloji", accent: "#94A3B8" },
        { name: "Doğa", icon: NatureIcon, href: "/blog?kategori=Doga", accent: "#94A3B8" },
        { name: "Biyoloji", icon: BioIcon, href: "/blog?kategori=Biyoloji", accent: "#94A3B8" },
        { name: "Kimya", icon: ChemIcon, href: "/blog?kategori=Kimya", accent: "#94A3B8" },
        { name: "Eğitim", icon: EduIcon, href: "/blog?kategori=Egitim", accent: "#94A3B8" },
        { name: "Fizik", icon: PhysicsIcon, href: "/blog?kategori=Fizik", accent: "#94A3B8" },
        { name: "Keşfet", icon: ExploreIcon, href: "/kesfet", accent: "#94A3B8" },
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
                            {/* Main Card */}
                            <div
                                className={cn(
                                    "relative w-24 sm:w-28 backdrop-blur-sm border-2 border-border hover:border-foreground/20 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md",
                                    isBlood ? "bg-[rgb(40,0,0)] border-[rgb(100,20,20)]" : "bg-card/90",
                                    isCybernetic && "cyber-card border border-cyan-500/20 bg-black/40 shadow-none !rounded-none"
                                )}
                                style={{
                                    boxShadow: isCybernetic ? 'none' : `3px 3px 0px 0px rgba(200,20,20,0.4)`
                                }}
                            >
                                {/* Top Accent Line */}
                                <div
                                    className="h-1 w-full"
                                    style={{ background: cat.accent }}
                                />

                                {/* Icon Container */}
                                <div className="p-3 sm:p-4 flex flex-col items-center gap-2">
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        {/* Icon Ring */}
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-secondary/50 border border-border"
                                        >
                                            <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/70" />
                                        </div>
                                    </motion.div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            "text-[10px] sm:text-xs font-black uppercase tracking-wider text-center leading-tight text-muted-foreground group-hover:text-foreground transition-colors",
                                            isCybernetic && "cyber-text text-[9px]"
                                        )}
                                    >
                                        {cat.name}
                                    </span>
                                </div>

                                {/* Bottom Corner Cut */}
                                <div
                                    className="absolute bottom-0 right-0 w-4 h-4"
                                    style={{
                                        background: isCybernetic
                                            ? `linear-gradient(135deg, transparent 50%, rgba(0, 240, 255, 0.4) 50%)`
                                            : `linear-gradient(135deg, transparent 50%, ${cat.accent} 50%)`
                                    }}
                                />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div >
    );
}
