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
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function CategoryStories() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categories = [
        { name: "Kuantum", icon: QuantumIcon, href: "/blog?kategori=Kuantum" },
        { name: "Astrofizik", icon: AstroIcon, href: "/blog?kategori=Astrofizik" },
        { name: "Teknoloji", icon: TechIcon, href: "/blog?kategori=Teknoloji" },
        { name: "Doğa", icon: NatureIcon, href: "/blog?kategori=Doga" },
        { name: "Biyoloji", icon: BioIcon, href: "/blog?kategori=Biyoloji" },
        { name: "Kimya", icon: ChemIcon, href: "/blog?kategori=Kimya" },
        { name: "Eğitim", icon: EduIcon, href: "/blog?kategori=Egitim" },
        { name: "Fizik", icon: PhysicsIcon, href: "/blog?kategori=Fizik" },
        { name: "Keşfet", icon: ExploreIcon, href: "/kesfet" },
    ];

    return (
        <div className="w-full pt-0 pb-0 px-0 overflow-hidden">
            {/* 
                V16 NEO-TAGS
                - "Kötü olmuş" fix: Moving away from generic pills to "Interactive Tags".
                - Style: Black background, White Text, Yellow Hover.
                - Border: Thicker, Brutalist.
            */}

            <div className="flex overflow-x-auto pb-2 gap-3 snap-x snap-mandatory px-4 sm:px-0 scrollbar-hide items-center">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, ease: "easeOut" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2",
                                    "bg-zinc-900/50 backdrop-blur-sm border border-black/10 dark:border-white/10", // Glassy Base
                                    "text-zinc-500 dark:text-zinc-400",
                                    "rounded-full", // Pill shape for modern feel
                                    "hover:bg-[#FFC800] hover:text-black hover:border-black hover:shadow-[0px_4px_12px_rgba(255,200,0,0.3)]", // Glowy Pop
                                    "transition-all duration-300 group"
                                )}
                            >
                                <cat.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                    {cat.name}
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div >
    );
}
