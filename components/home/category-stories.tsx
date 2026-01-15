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
        <div className="w-full py-2">
            {/* Scroll Container - No Header for smoother flow */}
            <div className="flex overflow-x-auto pb-4 gap-3 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory -mx-4 sm:mx-0">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-colors",
                                isCybernetic && "cyber-card border-cyan-500/30 rounded-none bg-black/60",
                                isBlood && "border-red-900/30 bg-red-950/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center bg-muted",
                                isCybernetic && "bg-cyan-950 rounded-none",
                                isBlood && "bg-red-950 text-red-200"
                            )}>
                                <cat.icon className="w-3.5 h-3.5 text-foreground/70" />
                            </div>
                            <span className={cn(
                                "text-xs font-bold text-foreground/80 whitespace-nowrap",
                                isCybernetic && "font-mono text-cyan-400"
                            )}>
                                {cat.name}
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
