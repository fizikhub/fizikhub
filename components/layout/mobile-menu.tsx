"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: Home },
    { href: "/makale", label: "Makaleler", icon: BookOpen },
    { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    { href: "/profil", label: "Profil", icon: User },
    { href: "/ozel", label: "Özel İçerik", icon: Zap },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200",
                    isOpen
                        ? "bg-white text-black border-white rotate-90"
                        : "bg-transparent text-white border-white/20 hover:bg-white/10"
                )}
            >
                {isOpen ? <X className="w-5 h-5 stroke-[3]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>

            {/* DROPDOWN CARD */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-full right-0 mt-3 w-[280px] z-50 origin-top-right"
                    >
                        {/* CARD CONTAINER - mimic an Article Card */}
                        <div className="bg-[#0f0f11] border border-white/10 rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5">

                            {/* CARD IMAGE / HEADER AREA */}
                            <div className="h-24 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 relative overflow-hidden flex items-end p-4">
                                {/* Decorative Noise */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                                {/* Decorative Glow */}
                                <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-blue-500/30 blur-3xl rounded-full"></div>

                                {/* "Category Tag" */}
                                <span className="relative z-10 bg-[#FACC15] text-black text-[10px] font-black uppercase px-2 py-1 rounded-sm tracking-wide shadow-lg transform -rotate-2">
                                    NAVIGASYON
                                </span>
                            </div>

                            {/* CARD CONTENT (Links) */}
                            <div className="p-2 bg-[#0f0f11]">
                                <div className="flex flex-col gap-1">
                                    {menuItems.map((item, i) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Icon Box */}
                                                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-colors duration-300">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white font-sans tracking-tight">
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* Arrow */}
                                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* CARD FOOTER */}
                            <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                                <span>Fizikhub v2.0</span>
                                <div className="flex gap-2">
                                    <Link href="#" className="hover:text-white transition-colors">TR</Link>
                                    <Link href="#" className="hover:text-white transition-colors">EN</Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
