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

const stories = [
    { name: "Kuantum", icon: QuantumIcon, href: "/blog?kategori=Kuantum", color: "from-blue-500 to-indigo-600" },
    { name: "Astrofizik", icon: AstroIcon, href: "/blog?kategori=Astrofizik", color: "from-orange-500 to-red-600" },
    { name: "Teknoloji", icon: TechIcon, href: "/blog?kategori=Teknoloji", color: "from-purple-500 to-pink-600" },
    { name: "Doğa", icon: NatureIcon, href: "/blog?kategori=Doga", color: "from-green-500 to-emerald-600" },
    { name: "Biyoloji", icon: BioIcon, href: "/blog?kategori=Biyoloji", color: "from-teal-500 to-cyan-600" },
    { name: "Kimya", icon: ChemIcon, href: "/blog?kategori=Kimya", color: "from-yellow-400 to-orange-500" },
    { name: "Eğitim", icon: EduIcon, href: "/blog?kategori=Egitim", color: "from-indigo-400 to-blue-500" },
    { name: "Fizik", icon: PhysicsIcon, href: "/blog?kategori=Fizik", color: "from-rose-500 to-pink-600" },
    { name: "Keşfet", icon: ExploreIcon, href: "/kesfet", color: "from-amber-400 to-orange-600" },
];

export function NexusStories() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="w-full py-4 mt-[-10px] mb-4">
            <div className="flex overflow-x-auto gap-5 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory">
                {stories.map((story, index) => (
                    <motion.div
                        key={story.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                        className="flex-shrink-0 snap-start flex flex-col items-center gap-2 group"
                    >
                        <Link href={story.href} className="relative block">
                            {/* Outer Gradient Ring (Instagram-like) */}
                            <div className={cn(
                                "w-[72px] h-[72px] rounded-full p-[3px]",
                                "bg-gradient-to-tr",
                                story.color,
                                "border-2 border-black shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] active:shadow-none transition-all duration-300"
                            )}>
                                {/* Inner Content Container */}
                                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-2 border-black flex items-center justify-center overflow-hidden">
                                    <story.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                        </Link>

                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            {story.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
