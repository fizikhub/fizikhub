"use client";

import { useState } from "react";
import { Link as LinkIcon, Home, BookOpen, Trophy, User, Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const menuItems = [
    { href: "/", label: "ANA SAYFA", icon: Home },
    { href: "/makale", label: "MAKALELER", icon: BookOpen },
    { href: "/siralamalar", label: "SIRALAMA", icon: Trophy },
    { href: "/profil", label: "PROFİL", icon: User },
    { href: "/ozel", label: "ÖZEL İÇERİK", icon: Zap },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[40px] h-[40px] border-2 border-black transition-all rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                        isOpen ? "bg-black text-white" : "bg-white text-black"
                    )}
                >
                    {isOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[260px] p-0 bg-[#FACC15] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
                {/* DECORATIVE HEADER */}
                <div className="bg-black text-[#FACC15] px-4 py-2 font-black text-xs tracking-widest border-b-[4px] border-black flex justify-between">
                    <span>NAV.SYS</span>
                    <span>v2.0</span>
                </div>

                {/* LINKS */}
                <div className="flex flex-col p-2 gap-2">
                    {menuItems.map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="group relative flex items-center gap-3 p-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                            <item.icon className="w-5 h-5 stroke-[2.5]" />
                            <span className="font-black tracking-tight">{item.label}</span>

                            {/* Hover Arrow */}
                            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                            </span>
                        </Link>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="px-4 py-2 border-t-[4px] border-black bg-white/50 text-[10px] font-mono text-center font-bold">
                    FIZIKHUB © 2026
                </div>
            </PopoverContent>
        </Popover>
    );
}
