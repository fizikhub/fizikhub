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
        { name: "Kuantum", icon: QuantumIcon, href: "/blog?kategori=Kuantum", accent: "#00F0FF" },
        { name: "Astrofizik", icon: AstroIcon, href: "/blog?kategori=Astrofizik", accent: "#FF0055" },
        { name: "Teknoloji", icon: TechIcon, href: "/blog?kategori=Teknoloji", accent: "#00F0FF" },
        { name: "Doğa", icon: NatureIcon, href: "/blog?kategori=Doga", accent: "#00FF99" },
        { name: "Biyoloji", icon: BioIcon, href: "/blog?kategori=Biyoloji", accent: "#00FF99" },
        { name: "Kimya", icon: ChemIcon, href: "/blog?kategori=Kimya", accent: "#FF0055" },
        { name: "Eğitim", icon: EduIcon, href: "/blog?kategori=Egitim", accent: "#FFD700" },
        { name: "Fizik", icon: PhysicsIcon, href: "/blog?kategori=Fizik", accent: "#00F0FF" },
        { name: "Keşfet", icon: ExploreIcon, href: "/kesfet", accent: "#FFFFFF" },
    ];

    return (
        <div className="w-full py-4 px-4 sm:px-0">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-primary animate-pulse-fast" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Veri Akışı / Kategoriler</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            {/* Cards Container - Network Nodes */}
            <div className="flex overflow-x-auto pb-6 pt-2 gap-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-8 sm:mx-0 sm:px-4">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className="flex-shrink-0 snap-center flex flex-col items-center gap-3 group relative"
                    >
                        {/* Connection Line (Visual only, to right) */}
                        {index !== categories.length - 1 && (
                            <div className="absolute top-8 left-full w-6 h-[1px] bg-border/30 -z-10" />
                        )}

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            {/* Kinetic Ring */}
                            <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/30 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute -inset-1 rounded-full border border-transparent group-hover:border-primary/50 transition-colors duration-300" />

                            {/* Node Core */}
                            <div
                                className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-md border border-border flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] transition-shadow duration-300"
                                style={{ color: cat.accent }}
                            >
                                <cat.icon
                                    className="w-7 h-7 transition-colors duration-300"
                                />
                            </div>

                            {/* Orbiting Dot */}
                            <motion.div
                                className="absolute inset-[-4px] rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="w-2 h-2 rounded-full bg-primary absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </motion.div>
                        </motion.div>

                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors bg-background/50 px-2 py-0.5 rounded-full border border-transparent group-hover:border-primary/20">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
