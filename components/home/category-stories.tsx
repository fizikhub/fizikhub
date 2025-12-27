"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Atom,
    Rocket,
    Globe2,
    Microscope,
    TestTube2,
    GraduationCap,
    BrainCircuit,
    Scale,
    Sparkles
} from "lucide-react";

export function CategoryStories() {
    const categories = [
        { name: "Kuantum", icon: Atom, color: "from-blue-500 to-cyan-500", href: "/blog?kategori=Kuantum" },
        { name: "Astrofizik", icon: Rocket, color: "from-orange-500 to-red-500", href: "/blog?kategori=Astrofizik" },
        { name: "Teknoloji", icon: BrainCircuit, color: "from-purple-500 to-pink-500", href: "/blog?kategori=Teknoloji" },
        { name: "Doğa", icon: Globe2, color: "from-green-500 to-emerald-500", href: "/blog?kategori=Doga" },
        { name: "Biyoloji", icon: Microscope, color: "from-teal-500 to-green-500", href: "/blog?kategori=Biyoloji" },
        { name: "Kimya", icon: TestTube2, color: "from-yellow-500 to-orange-500", href: "/blog?kategori=Kimya" },
        { name: "Eğitim", icon: GraduationCap, color: "from-indigo-500 to-blue-500", href: "/blog?kategori=Egitim" },
        { name: "Fizik", icon: Scale, color: "from-rose-500 to-pink-500", href: "/blog?kategori=Fizik" },
        { name: "Keşfet", icon: Sparkles, color: "from-amber-400 to-yellow-500", href: "/kesfet" },
    ];

    return (
        <div className="w-full overflow-hidden py-4 -mb-2">
            <div className="flex overflow-x-auto pb-4 gap-4 px-4 sm:px-0 scrollbar-hide snap-x">
                {categories.map((cat, index) => (
                    <Link href={cat.href} key={index} className="flex flex-col items-center gap-2 flex-shrink-0 snap-start group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${cat.color} p-[3px] shadow-lg`}
                        >
                            <div className="w-full h-full rounded-full bg-background border-2 border-transparent flex items-center justify-center relative overflow-hidden group-hover:border-white/20 transition-colors">
                                <cat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/80 group-hover:text-foreground transition-colors group-hover:scale-110 duration-300" />

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                            </div>
                        </motion.div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
