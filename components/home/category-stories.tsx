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

            <div className="flex overflow-x-auto pb-2 gap-2.5 snap-x snap-mandatory px-3 sm:px-0 scrollbar-hide">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5",
                                    "bg-[#111] border-[2px] border-[#333]", // Base dark
                                    "text-gray-300",
                                    "rounded-lg", // Slightly rect for brutalism
                                    "hover:bg-[#FFC800] hover:text-black hover:border-black hover:shadow-[3px_3px_0px_0px_#000]", // Interaction Pop
                                    "transition-all duration-200"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">
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
