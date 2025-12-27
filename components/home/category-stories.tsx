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
        <div className="w-full overflow-hidden py-3 -mb-2">
            <div className="flex overflow-x-auto pb-3 gap-2 sm:gap-3 px-1 sm:px-0 scrollbar-hide snap-x">
                {categories.map((cat, index) => (
                    <Link href={cat.href} key={index} className="flex flex-col items-center gap-1.5 flex-shrink-0 snap-start group">
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-card border-2 border-border/80 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all duration-200"
                        >
                            <cat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                        </motion.div>
                        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors truncate max-w-[50px] sm:max-w-[60px] text-center">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
