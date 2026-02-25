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
        <div className="w-full bg-primary/10 border border-primary/20 rounded-xl overflow-hidden relative py-2.5 sm:py-3">
            <div className="flex select-none">
                <motion.div
                    className="flex flex-nowrap gap-8 sm:gap-12 items-center whitespace-nowrap"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 120,
                    }}
                >
                    {duplicatedNews.map((item, index) => (
                        <Link key={index} href={item.link} target={item.source !== "FizikHub" ? "_blank" : "_self"} className="group flex items-center gap-3 sm:gap-4 text-foreground/70 hover:text-primary transition-colors">
                            <span className="font-semibold text-xs sm:text-sm tracking-wide">
                                {item.source !== "FizikHub" && <span className="opacity-40 mr-2 text-[10px]">[{item.source}]</span>}
                                {item.title}
                            </span>
                            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/50 group-hover:text-primary" />
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
