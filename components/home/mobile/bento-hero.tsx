"use client";

import { motion } from "framer-motion";
import { Zap, Atom, BookOpen, FlaskConical, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const bentoItems = [
    {
        title: "SİMÜLASYON",
        icon: Atom,
        href: "/simulasyonlar",
        color: "bg-[#FACC15]", // Yellow
        textColor: "text-black",
        size: "col-span-2",
        delay: 0.1
    },
    {
        title: "KEŞFET",
        icon: Zap,
        href: "/makale",
        color: "bg-[#FF90E8]", // Pink
        textColor: "text-black",
        size: "col-span-1",
        delay: 0.2
    },
    {
        title: "TESTLER",
        icon: FlaskConical,
        href: "/testler",
        color: "bg-[#00E6CC]", // Teal
        textColor: "text-black",
        size: "col-span-1",
        delay: 0.3
    },
    {
        title: "BLOG & NOTLAR",
        icon: BookOpen,
        href: "/blog",
        color: "bg-black",
        textColor: "text-white",
        borderColor: "border-white/20",
        size: "col-span-2",
        delay: 0.4
    }
];

export function BentoHero() {
    return (
        <div className="p-4 grid grid-cols-2 gap-3 mb-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 mb-2"
            >
                <h1 className="text-4xl font-black italic tracking-tighter uppercase transform -skew-x-6">
                    FIZIK<span className="text-[#FACC15]">HUB</span>
                </h1>
                <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    Evrenin Oyun Alanı
                </p>
            </motion.div>

            {bentoItems.map((item, i) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(item.size, "relative group")}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: item.delay, type: "spring" }}
                        className={cn(
                            "h-28 rounded-2xl border-[3px] border-black p-4 flex flex-col justify-between relative overflow-hidden",
                            "shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all",
                            item.color,
                            item.textColor,
                            item.borderColor && `border ${item.borderColor}`
                        )}
                    >
                        {/* Background Decoration */}
                        <item.icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-[-15deg]" />

                        <div className="flex justify-between items-start">
                            <div className={cn(
                                "p-2 rounded-lg border-2 border-black/10 bg-black/5 backdrop-blur-sm",
                                item.textColor === "text-white" && "bg-white/10 border-white/10"
                            )}>
                                <item.icon className="w-6 h-6 stroke-[2.5px]" />
                            </div>
                            <ArrowRight className={cn(
                                "w-5 h-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                                item.textColor
                            )} />
                        </div>

                        <span className="font-black text-lg tracking-tight uppercase z-10">
                            {item.title}
                        </span>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
