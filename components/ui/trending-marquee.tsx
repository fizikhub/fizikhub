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
        <div className="w-full bg-[#FFC800] border-y-[3px] border-black dark:border-white overflow-hidden relative z-20 py-2 sm:py-3 shadow-[0px_4px_0px_#000] dark:shadow-[0px_4px_0px_#fff]">
            <div className="flex select-none">
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
                        <Link key={index} href={item.link} target={item.source !== "FizikHub" ? "_blank" : "_self"} className="group flex items-center gap-3 sm:gap-4 text-black hover:text-[#FF0080] transition-colors">
                            <span className="font-black uppercase text-xs sm:text-base tracking-widest drop-shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
                                {item.source !== "FizikHub" && <span className="opacity-70 mr-2 border-r-2 border-black pr-2">[{item.source}]</span>}
                                {item.title}
                            </span>
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black group-hover:fill-[#FF0080] group-hover:text-[#FF0080]" />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
