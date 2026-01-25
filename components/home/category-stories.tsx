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
        <div className="w-full py-6 px-0 overflow-hidden">
            {/* 
                NEO-PILL CATEGORIES (V15.5 Style)
                - Horizontal Scroll
                - Capsule Shape
                - Black Border + Hard Shadow
                - Yellow Hover
            */}

            <div className="flex overflow-x-auto pb-6 gap-3 snap-x snap-mandatory px-4 sm:px-0 scrollbar-hide">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                            whileHover={{ y: -4, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div
                                className={cn(
                                    "flex items-center gap-2 pl-2 pr-4 py-2",
                                    "bg-white dark:bg-[#1a1a1a]", // Contrast background
                                    "border-[2px] border-black dark:border-zinc-700", // Stroke
                                    "rounded-full", // Pill Shape
                                    "shadow-[3px_3px_0px_0px_#000]", // Hard Shadow
                                    "hover:shadow-[1px_1px_0px_0px_#000] hover:bg-[#FFC800] dark:hover:bg-[#FFC800] hover:text-black", // Interaction
                                    "transition-all duration-200 group"
                                )}
                            >
                                {/* Icon Circle */}
                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-black border border-black flex items-center justify-center group-hover:bg-white transition-colors">
                                    <cat.icon className="w-4 h-4 text-black dark:text-white group-hover:text-black" />
                                </div>

                                {/* Text */}
                                <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-black dark:text-white group-hover:text-black">
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
