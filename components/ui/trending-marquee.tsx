"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link"; // Import Link for clickable news
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
        <div className="w-full bg-[#FACC15] border-y-[3px] border-black overflow-hidden relative z-20 py-2 sm:py-3">
            <div className="flex select-none">
                <motion.div
                    className="flex flex-nowrap gap-8 sm:gap-12 items-center whitespace-nowrap"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 60, // Slower for readability
                    }}
                >
                    {duplicatedNews.map((item, index) => (
                        <Link key={index} href={item.link} target={item.source !== "FizikHub" ? "_blank" : "_self"} className="group flex items-center gap-3 sm:gap-4 text-black hover:text-blue-700 transition-colors">
                            <span className="font-black uppercase text-xs sm:text-sm tracking-wider">
                                {item.source !== "FizikHub" && <span className="opacity-60 mr-2">[{item.source}]</span>}
                                {item.title}
                            </span>
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-black text-black group-hover:fill-blue-700 group-hover:text-blue-700" />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
