"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";
import type { ScienceNewsItem } from "@/lib/rss";

interface TrendingMarqueeProps {
    items?: ScienceNewsItem[];
}

export function TrendingMarquee({ items }: TrendingMarqueeProps) {
    const defaultNews = [
        "FizikHub 2.0 Yayında! 🚀",
        "Bilim dünyasından son gelişmeler burada.",
        "Kuantum fiziği, uzay ve teknoloji haberleri.",
    ];

    const displayItems = items && items.length > 0 ? items : defaultNews.map(t => ({ title: t, link: "#", source: "FizikHub" }));

    // Duplicate list for seamless loop
    const duplicatedNews = [...displayItems, ...displayItems];

    return (
        <div className="w-full bg-zinc-950 border-b-2 border-zinc-800 overflow-hidden relative z-20 shadow-[0px_2px_0px_rgba(39,39,42,0.5)]">
            <div className="flex select-none py-2.5 sm:py-3.5 border-t-2 border-transparent">
                <motion.div
                    className="flex flex-nowrap gap-8 sm:gap-16 items-center whitespace-nowrap"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 120, // Slower for readability
                    }}
                >
                    {duplicatedNews.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            target={item.source !== "FizikHub" ? "_blank" : "_self"}
                            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                        >
                            <span className="font-bold uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-3">
                                {item.source !== "FizikHub" && (
                                    <span className="text-[#00F050] border-r-2 border-zinc-800 pr-3">[{item.source}]</span>
                                )}
                                {item.title}
                            </span>
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-[#FFC800] transition-colors" />
                        </Link>
                    ))}
                </motion.div>
            </div>

            {/* Soft gradient edges for smooth fading in/out */}
            <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-zinc-950 to-transparent z-30 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950 to-transparent z-30 pointer-events-none" />
        </div>
    );
}
